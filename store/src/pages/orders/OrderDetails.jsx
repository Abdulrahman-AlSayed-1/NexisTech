import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Box,
  Check,
  CreditCard,
  MapPin,
  Package,
  XCircle,
} from 'lucide-react'
import { cancelOrder, getMyOrderById } from '@/api/orders'

const ORDER_STAGES = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered']

const normalizeStatus = (status = 'Pending') => {
  const value = String(status).toLowerCase()
  if (value === 'cancelled' || value === 'canceled') return 'Cancelled'
  return value.charAt(0).toUpperCase() + value.slice(1)
}

const getActiveStage = (status) => {
  const index = ORDER_STAGES.findIndex(
    (stage) => stage.toLowerCase() === String(status).toLowerCase(),
  )
  return index === -1 ? 0 : index
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

const getId = (order) => order?._id || order?.id || order?.orderId

const getItems = (order) => order?.items || order?.orderItems || []

const getItemName = (item) =>
  item.product?.name || item.productName || item.name || 'Item'

const getItemPrice = (item) =>
  item.price ?? item.product?.price ?? item.unitPrice ?? 0

const getItemQuantity = (item) => item.quantity ?? item.qty ?? 1

const getAddress = (order) =>
  order?.shippingAddress || order?.address || order?.deliveryAddress || {}

const getTotal = (order) =>
  order?.total ?? order?.totalPrice ?? order?.totalAmount ?? order?.amount ?? 0

export default function OrderDetails() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCancelling, setIsCancelling] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadOrder = async () => {
      try {
        setIsLoading(true)
        setError('')
        const response = await getMyOrderById(orderId)
        const result = response.order || response.data || response
        if (isMounted) setOrder(result)
      } catch (requestError) {
        if (isMounted) {
          setError(
            requestError.response?.data?.message ||
              'Unable to load this order right now.',
          )
        }
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    if (orderId) loadOrder()

    return () => {
      isMounted = false
    }
  }, [orderId])

  const status = normalizeStatus(order?.status)
  const activeStage = getActiveStage(status)
  const items = useMemo(() => getItems(order), [order])
  const address = getAddress(order)
  const orderNumber = getId(order) || orderId
  const total = getTotal(order)
  const canCancel = ['Pending', 'Confirmed'].includes(status)

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return

    try {
      setIsCancelling(true)
      const response = await cancelOrder(orderId)
      const updatedOrder = response.order || response.data || response
      setOrder(updatedOrder)
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          'The order could not be cancelled.',
      )
    } finally {
      setIsCancelling(false)
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-bg-main px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-5xl animate-pulse space-y-5">
          <div className="h-8 w-56 rounded-lg bg-bg-input" />
          <div className="h-36 rounded-2xl bg-bg-card" />
          <div className="h-80 rounded-2xl bg-bg-card" />
          <div className="h-32 rounded-2xl bg-bg-card" />
        </div>
      </main>
    )
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-bg-main px-4 py-10 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <Link
            to="/my-orders"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-medium hover:text-text-gold"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Orders
          </Link>
          <div className="rounded-2xl border border-border-light bg-bg-card p-8 text-center text-sm text-text-secondary">
            {error || 'Order not found.'}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-bg-main px-4 py-6 text-text-primary sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-6 flex items-start justify-between gap-4 sm:mb-8">
          <div>
            <Link
              to="/my-orders"
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-medium transition hover:text-text-gold"
            >
              <ArrowLeft className="h-4 w-4" />
              My Orders
            </Link>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Order Details
            </h1>
            <p className="mt-1 font-mono text-xs text-text-secondary sm:text-sm">
              Order #{String(orderNumber).slice(-8).toUpperCase()}
            </p>
          </div>

          <span className="shrink-0 rounded-full bg-primary-medium px-3 py-1.5 text-xs font-semibold text-text-light">
            {status}
          </span>
        </div>

        <section className="rounded-2xl border border-border-light bg-bg-card p-5 shadow-sm sm:p-7">
          <div className="mb-7 flex items-center gap-2 text-sm font-bold text-primary-dark">
            <Package className="h-4 w-4 text-text-gold" />
            Order Progress
          </div>

          {status === 'Cancelled' ? (
            <div className="flex items-center gap-3 rounded-xl bg-primary-dark/10 px-4 py-3 text-sm font-semibold text-primary-dark">
              <XCircle className="h-5 w-5" />
              This order has been cancelled.
            </div>
          ) : (
            <div className="relative grid grid-cols-5 gap-1">
              <div className="absolute left-[10%] right-[10%] top-3.5 h-0.5 bg-bg-input" />
              <div
                className="absolute left-[10%] top-3.5 h-0.5 bg-primary-medium transition-all duration-500"
                style={{ width: `${(activeStage / (ORDER_STAGES.length - 1)) * 80}%` }}
              />

              {ORDER_STAGES.map((stage, index) => {
                const isComplete = index <= activeStage
                return (
                  <div key={stage} className="relative z-10 flex flex-col items-center gap-2 text-center">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full border-2 transition ${
                        isComplete
                          ? 'border-primary-medium bg-primary-medium text-text-light'
                          : 'border-bg-input bg-bg-card text-text-secondary'
                      }`}
                    >
                      {isComplete ? <Check className="h-3.5 w-3.5" /> : <span className="h-2 w-2 rounded-full bg-current" />}
                    </div>
                    <span className={`text-[10px] font-medium sm:text-xs ${isComplete ? 'text-primary-dark' : 'text-text-secondary'}`}>
                      {stage}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        <section className="mt-5 rounded-2xl border border-border-light bg-bg-card p-5 shadow-sm sm:p-7">
          <div className="mb-5 flex items-center gap-2 text-sm font-bold text-primary-dark">
            <Box className="h-4 w-4 text-text-gold" />
            Items
          </div>

          <div className="space-y-3">
            {items.length === 0 ? (
              <p className="text-sm text-text-secondary">No item information available.</p>
            ) : (
              items.map((item, index) => (
                <div
                  key={item._id || item.id || `${getItemName(item)}-${index}`}
                  className="flex items-center justify-between gap-4 rounded-xl bg-bg-input/50 px-3 py-3 sm:px-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-bg-input text-xs font-semibold text-primary-medium">
                      {getItemName(item).slice(0, 1).toUpperCase()}
                    </div>
                    <p className="min-w-0 truncate text-sm text-text-secondary">
                      {getItemName(item)}{' '}
                      <span className="text-xs text-text-secondary">
                        · Qty: {getItemQuantity(item)}
                      </span>
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-bold text-primary-dark">
                    EGP {(Number(getItemPrice(item)) * Number(getItemQuantity(item))).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <section className="rounded-2xl border border-border-light bg-bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-primary-dark">
              <MapPin className="h-4 w-4 text-text-gold" />
              Shipping Address
            </div>
            <div className="space-y-1 text-sm leading-5 text-text-secondary">
              <p>{address.firstName || address.name || address.fullName || '—'}</p>
              <p>{address.address || address.street || address.details || '—'}</p>
              <p>{address.city || address.governorate || '—'}</p>
              <p>{address.phone || order.phone || '—'}</p>
            </div>
          </section>

          <section className="rounded-2xl border border-border-light bg-bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-primary-dark">
              <CreditCard className="h-4 w-4 text-text-gold" />
              Payment
            </div>
            <p className="text-sm text-text-secondary">
              {order.paymentMethod || order.paymentType || 'Cash'}
            </p>
            <div className="my-4 h-px bg-border-light" />
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-semibold text-text-secondary">Total</span>
              <span className="text-lg font-bold text-primary-medium">
                EGP {Number(total || 0).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <p className="mt-2 text-xs text-text-secondary">
              Placed on {formatDate(order.createdAt || order.orderDate || order.date)}
            </p>
          </section>
        </div>

        {canCancel && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isCancelling}
              className="inline-flex items-center gap-2 rounded-xl bg-primary-dark px-5 py-3 text-sm font-semibold text-text-light transition hover:bg-primary-medium focus:outline-none focus:ring-2 focus:ring-text-gold focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <XCircle className="h-4 w-4" />
              {isCancelling ? 'Cancelling...' : 'Cancel Order'}
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
