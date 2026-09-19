import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ChevronRight } from 'lucide-react'

import Badge from '@/components/common/Badge'
import { formatDate, formatCurrency } from '@/utils/formatters'
import {
  fetchMyOrdersThunk,
  selectOrders,
  selectOrdersLoading,
} from '@/store/slices/ordersSlice'

const formatStatus = (status = 'Pending') => {
  const value = String(status).toLowerCase()

  return value.charAt(0).toUpperCase() + value.slice(1)
}

const getOrderId = (order) =>
  order?._id || order?.id || order?.orderId

const getOrderItemsCount = (order) => {
  if (typeof order?.itemsCount === 'number') {
    return order.itemsCount
  }

  if (Array.isArray(order?.items)) {
    return order.items.reduce(
      (total, item) =>
        total + Number(item.quantity || item.qty || 1),
      0,
    )
  }

  if (Array.isArray(order?.orderItems)) {
    return order.orderItems.reduce(
      (total, item) =>
        total + Number(item.quantity || item.qty || 1),
      0,
    )
  }

  return 0
}

const getOrderTotal = (order) =>
  order?.total ??
  order?.totalAmount ??
  order?.totalPrice ??
  order?.amount ??
  0

export default function OrdersPage() {
  const dispatch = useDispatch()

  const orders = useSelector(selectOrders)
  const isLoading = useSelector(selectOrdersLoading)
  const error = useSelector((state) => state.orders.error)

  useEffect(() => {
    dispatch(fetchMyOrdersThunk())
  }, [dispatch])

  const orderCards = useMemo(
    () =>
      orders.map((order) => {
        const orderId = getOrderId(order)
        const status = formatStatus(order.status)

        return {
          orderId,
          status,
          date: formatDate(
            order.createdAt ||
              order.orderDate ||
              order.date,
          ),
          itemCount: getOrderItemsCount(order),
          total: getOrderTotal(order),
        }
      }),
    [orders],
  )

  return (
    <main className="min-h-screen bg-bg-main px-4 py-6 text-text-primary sm:px-6 sm:py-8 lg:px-10 lg:py-12 dark:bg-[var(--color-dark-bg-main)]">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-8 sm:mb-10">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-text-gold dark:text-[var(--color-accent-gold-hover)]">
            Account
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl dark:text-[var(--color-border-light)]">
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
                className="h-36 animate-pulse rounded-2xl border border-border-light bg-bg-card dark:bg-[var(--color-dark-bg-card)]"
              />
            ))}
          </div>
        )}

        {!isLoading && error && (
          <div
            className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"
            role="alert"
          >
            {error}
          </div>
        )}

        {!isLoading && !error && orderCards.length === 0 && (
          <div className="rounded-2xl border border-border-light bg-bg-card px-6 py-14 text-center dark:bg-[var(--color-dark-bg-card)]">
            <h2 className="text-lg font-bold">
              No orders yet
            </h2>

            <p className="mt-2 text-sm text-text-secondary">
              Your orders will appear here after your first purchase.
            </p>
          </div>
        )}

        {!isLoading && !error && orderCards.length > 0 && (
          <section
            className="space-y-4"
            aria-label="My orders"
          >
            {orderCards.map(
              ({
                orderId,
                status,
                date,
                itemCount,
                total,
              }) => (
                <Link
                  key={orderId}
                  to={`/profile/orders/${orderId}`}
                  className="group block rounded-2xl border border-border-light bg-bg-card p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-text-gold hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-text-gold focus:ring-offset-2 sm:p-7 dark:bg-[var(--color-dark-bg-card)]"
                >
                  <article className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="font-mono text-base font-bold text-text-primary sm:text-lg dark:text-[var(--color-border-light)]">
                          #
                          {String(orderId)
                            .slice(-8)
                            .toUpperCase()}
                        </h2>

                        <Badge
                          status={status}
                          size="md"
                          dot
                        >
                          {status}
                        </Badge>
                      </div>

                      <p className="mt-3 text-base text-text-secondary sm:text-lg">
                        {date}
                      </p>

                      <p className="mt-2 text-sm text-text-secondary sm:text-base">
                        {itemCount} item
                        {itemCount === 1 ? '' : 's'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <p className="text-2xl font-bold text-primary-medium sm:text-3xl dark:text-[var(--color-border-light)]">
                        {formatCurrency(total)}
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
