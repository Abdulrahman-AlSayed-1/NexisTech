import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { getMyOrders } from '@/api/orders'

const statusStyles = {
  confirmed: 'bg-primary-medium text-text-light',
  pending: 'bg-bg-input text-primary-dark',
  shipped: 'bg-primary-dark text-text-light',
  delivered: 'bg-text-gold text-text-primary',
  cancelled: 'bg-primary-dark/10 text-primary-dark',
  canceled: 'bg-primary-dark/10 text-primary-dark',
}

const formatStatus = (status = 'Pending') => {
  const value = String(status).toLowerCase()
  return value.charAt(0).toUpperCase() + value.slice(1)
}

const formatDate = (value) => {
  if (!value) return '—'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const getOrderId = (order) => order._id || order.id || order.orderId

const getOrderItemsCount = (order) => {
  if (typeof order.itemsCount === 'number') return order.itemsCount
  if (Array.isArray(order.items)) {
    return order.items.reduce(
      (total, item) => total + Number(item.quantity || item.qty || 1),
      0,
    )
  }
  return 0
}

const getOrderTotal = (order) =>
  order.total ?? order.totalPrice ?? order.totalAmount ?? order.amount ?? 0

export default function MyOrders() {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadOrders = async () => {
      try {
        setIsLoading(true)
        setError('')

        const response = await getMyOrders()
        const result = Array.isArray(response)
          ? response
          : response.orders || response.items || []

        if (isMounted) setOrders(result)
      } catch (requestError) {
        if (isMounted) {
          setError(
            requestError.response?.data?.message ||
              'Unable to load your orders right now.',
          )
        }
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadOrders()

    return () => {
      isMounted = false
    }
  }, [])

  const orderCards = useMemo(
    () =>
      orders.map((order) => {
        const orderId = getOrderId(order)
        const status = formatStatus(order.status)
        const statusKey = String(order.status || 'pending').toLowerCase()

        return {
          order,
          orderId,
          status,
          statusClass: statusStyles[statusKey] || 'bg-bg-input text-primary-dark',
          date: formatDate(order.createdAt || order.orderDate || order.date),
          itemCount: getOrderItemsCount(order),
          total: getOrderTotal(order),
        }
      }),
    [orders],
  )

  return (
    <main className="min-h-screen bg-bg-main px-4 py-6 text-text-primary sm:px-6 sm:py-8 lg:px-10 lg:py-12">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-8 sm:mb-10">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-text-gold">
            Account
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            My Orders
          </h1>
          <p className="mt-2 text-sm text-text-secondary sm:text-base">
            View your recent orders and track their status.
          </p>
        </header>

        {isLoading && (
          <div className="space-y-4" aria-live="polite">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-36 animate-pulse rounded-2xl border border-border-light bg-bg-card"
              />
            ))}
          </div>
        )}

        {!isLoading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error}
          </div>
        )}

        {!isLoading && !error && orderCards.length === 0 && (
          <div className="rounded-2xl border border-border-light bg-bg-card px-6 py-14 text-center">
            <h2 className="text-lg font-bold">No orders yet</h2>
            <p className="mt-2 text-sm text-text-secondary">
              Your orders will appear here after your first purchase.
            </p>
          </div>
        )}

        {!isLoading && !error && orderCards.length > 0 && (
          <section className="space-y-4" aria-label="My orders">
            {orderCards.map(
              ({ order, orderId, status, statusClass, date, itemCount, total }) => (
                <Link
                  key={orderId}
                  to={`/my-orders/${orderId}`}
                  className="group block rounded-2xl border border-border-light bg-bg-card p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-text-gold hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-text-gold focus:ring-offset-2 sm:p-7"
                >
                  <article className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="font-mono text-base font-bold text-text-primary sm:text-lg">
                          #{String(orderId).slice(-8).toUpperCase()}
                        </h2>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}
                        >
                          {status}
                        </span>
                      </div>

                      <p className="mt-3 text-base text-text-secondary sm:text-lg">
                        {date}
                      </p>

                      <p className="mt-2 text-sm text-text-secondary sm:text-base">
                        {itemCount} item{itemCount === 1 ? '' : 's'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <p className="text-2xl font-bold text-primary-medium sm:text-3xl">
                        EGP {Number(total || 0).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>

                      <ChevronRight className="h-6 w-6 shrink-0 text-text-secondary transition group-hover:translate-x-1 group-hover:text-text-gold" />
                    </div>
                  </article>
                </Link>
              ),
            )}
          </section>
        )}
      </div>
    </main>
  )
}
