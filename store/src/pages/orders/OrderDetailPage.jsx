import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
  ArrowLeft,
  Box,
  Check,
  CreditCard,
  MapPin,
  Package,
  XCircle,
} from 'lucide-react'

import Badge from '@/components/common/Badge'
import Button from '@/components/common/Button'
import Modal from '@/components/common/Modal'
import { formatCurrency, formatDate } from '@/utils/formatters'
import {
  cancelOrderThunk,
  clearCurrentOrder,
  fetchMyOrderByIdThunk,
  selectCurrentOrder,
  selectOrdersLoading,
} from '@/store/slices/ordersSlice'

const ORDER_STAGES = [
  'Pending',
  'Confirmed',
  'Processing',
  'Shipped',
  'Delivered',
]

const normalizeStatus = (status = 'Pending') => {
  const value = String(status).toLowerCase()

  if (value === 'cancelled' || value === 'canceled') {
    return 'Cancelled'
  }

  return value.charAt(0).toUpperCase() + value.slice(1)
}

const getActiveStage = (status) => {
  const index = ORDER_STAGES.findIndex(
    (stage) => stage.toLowerCase() === String(status).toLowerCase(),
  )

  return index === -1 ? 0 : index
}

const getId = (order) =>
  order?._id || order?.id || order?.orderId

const getItems = (order) =>
  order?.items || order?.orderItems || []

const getItemName = (item) =>
  item?.product?.name ||
  item?.productName ||
  item?.name ||
  'Item'

const getItemImage = (item) => {
  const productImages = item?.product?.images
  const itemImages = item?.images

  if (Array.isArray(productImages) && productImages.length > 0) {
    return productImages[0]
  }

  if (Array.isArray(itemImages) && itemImages.length > 0) {
    return itemImages[0]
  }

  return (
    item?.product?.image ||
    item?.productImage ||
    item?.image ||
    item?.thumbnail ||
    ''
  )
}

const getItemPrice = (item) =>
  item?.price ??
  item?.product?.price ??
  item?.unitPrice ??
  0

const getItemQuantity = (item) =>
  item?.quantity ?? item?.qty ?? 1

const getAddress = (order) =>
  order?.shippingAddress ||
  order?.address ||
  order?.deliveryAddress ||
  {}

const getTotal = (order) =>
  order?.total ??
  order?.totalPrice ??
  order?.totalAmount ??
  order?.amount ??
  0

export default function OrderDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch()

  const order = useSelector(selectCurrentOrder)
  const isLoading = useSelector(selectOrdersLoading)
  const error = useSelector((state) => state.orders.error)

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)

  useEffect(() => {
    if (!id) return

    dispatch(clearCurrentOrder())
    dispatch(fetchMyOrderByIdThunk(id))

    return () => {
      dispatch(clearCurrentOrder())
    }
  }, [dispatch, id])

  const status = normalizeStatus(order?.status)
  const activeStage = getActiveStage(status)
  const items = useMemo(() => getItems(order), [order])
  const address = getAddress(order)
  const orderNumber = getId(order) || id
  const total = getTotal(order)
  const canCancel = ['Pending', 'Confirmed'].includes(status)

  const handleCancel = async () => {
    try {
      setIsCancelling(true)

      await dispatch(cancelOrderThunk(id)).unwrap()

      setIsCancelModalOpen(false)

      toast.success('Order cancelled successfully.')

      // إعادة جلب التفاصيل حتى نعرض أحدث حالة من الخادم
      dispatch(fetchMyOrderByIdThunk(id))
    } catch (requestError) {
      toast.error(
        requestError ||
          'The order could not be cancelled.',
      )
    } finally {
      setIsCancelling(false)
    }
  }

  if (isLoading && !order) {
    return (
      <main className="min-h-screen bg-bg-main px-4 py-6 sm:px-6 lg:px-10 lg:py-10 dark:bg-dark-bg-main">
        <div className="mx-auto max-w-5xl animate-pulse space-y-5">
          <div className="h-8 w-56 rounded-lg bg-bg-input" />
          <div className="h-36 rounded-2xl bg-bg-card dark:bg-dark-bg-card" />
          <div className="h-80 rounded-2xl bg-bg-card dark:bg-dark-bg-card" />
          <div className="h-32 rounded-2xl bg-bg-card dark:bg-dark-bg-card" />
        </div>
      </main>
    )
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-bg-main px-4 py-10 sm:px-6 lg:px-10 dark:bg-dark-bg-main">
        <div className="mx-auto max-w-5xl">
          <Link
            to="/profile/orders"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-medium transition hover:text-text-gold"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Orders
          </Link>

          <div
            className="rounded-2xl border border-border-light bg-bg-card p-8 text-center text-sm text-text-secondary dark:bg-dark-bg-card"
            role="alert"
          >
            {error || 'Order not found.'}
          </div>
        </div>
      </main>
    )
  }

  return (
    <>
      <main className="min-h-screen bg-bg-main px-4 py-6 text-text-primary sm:px-6 sm:py-8 lg:px-10 lg:py-10 dark:bg-dark-bg-main">
        <div className="mx-auto w-full max-w-5xl">
          <div className="mb-6 flex items-start justify-between gap-4 sm:mb-8">
            <div>
              <Link
                to="/profile/orders"
                className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-medium transition hover:text-text-gold"
              >
                <ArrowLeft className="h-4 w-4" />
                My Orders
              </Link>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl dark:text-border-light">
                Order Details
              </h1>

              <p className="mt-1 font-mono text-xs text-text-secondary sm:text-sm">
                Order #{String(orderNumber).slice(-8).toUpperCase()}
              </p>
            </div>

            <Badge status={status} size="md" dot>
              {status}
            </Badge>
          </div>

          <section className="rounded-2xl border border-border-light bg-bg-card p-5 shadow-sm sm:p-7 dark:border-border-light dark:bg-dark-bg-card">
            <div className="mb-7 flex items-center gap-2 text-sm font-bold text-primary-dark dark:text-accent-gold-hover">
              <Package className="h-4 w-4 text-text-gold" />
              Order Progress
            </div>

            {status === 'Cancelled' ? (
              <div className="flex items-center gap-3 rounded-xl bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-600 dark:text-rose-400">
                <XCircle className="h-5 w-5" />
                This order has been cancelled.
              </div>
            ) : (
              <div className="relative grid grid-cols-5 gap-1">
                <div className="absolute left-[10%] right-[10%] top-3.5 h-0.5 bg-bg-input" />

                <div
                  className="absolute left-[10%] top-3.5 h-0.5 bg-primary-medium transition-all duration-500"
                  style={{
                    width: `${(activeStage / (ORDER_STAGES.length - 1)) * 80}%`,
                  }}
                />

                {ORDER_STAGES.map((stage, index) => {
                  const isComplete = index <= activeStage

                  return (
                    <div
                      key={stage}
                      className="relative z-10 flex flex-col items-center gap-2 text-center"
                    >
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-full border-2 transition ${
                          isComplete
                            ? 'border-primary-medium bg-primary-medium text-text-light'
                            : 'border-bg-input bg-bg-card text-text-secondary dark:bg-dark-bg-card'
                        }`}
                      >
                        {isComplete ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <span className="h-2 w-2 rounded-full bg-current" />
                        )}
                      </div>

                      <span
                        className={`text-[10px] font-medium sm:text-xs ${
                          isComplete
                            ? 'text-primary-dark dark:text-text-gold'
                            : 'text-text-secondary'
                        }`}
                      >
                        {stage}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          <section className="mt-5 rounded-2xl border border-border-light bg-bg-card p-5 shadow-sm sm:p-7 dark:bg-dark-bg-card">
            <div className="mb-5 flex items-center gap-2 text-sm font-bold text-primary-dark dark:text-accent-gold-hover">
              <Box className="h-4 w-4 text-text-gold" />
              Items
            </div>

            <div className="space-y-3">
              {items.length === 0 ? (
                <p className="text-sm text-text-secondary">
                  No item information available.
                </p>
              ) : (
                items.map((item, index) => {
                  const itemImage = getItemImage(item)
                  const itemName = getItemName(item)
                  const itemPrice = getItemPrice(item)
                  const itemQuantity = getItemQuantity(item)

                  return (
                    <div
                      key={
                        item?._id ||
                        item?.id ||
                        `${itemName}-${index}`
                      }
                      className="flex items-center justify-between gap-4 rounded-xl bg-bg-input/50 px-3 py-3 sm:px-4"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        {itemImage ? (
                          <img
                            src={itemImage}
                            alt={itemName}
                            className="h-14 w-14 shrink-0 rounded-xl object-cover"
                            onError={(event) => {
                              event.currentTarget.style.display = 'none'
                            }}
                          />
                        ) : (
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-bg-input text-primary-medium">
                            <Package className="h-5 w-5" />
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-text-primary dark:text-border-light">
                            {itemName}
                          </p>

                          <p className="mt-1 text-xs text-text-secondary">
                            Qty: {itemQuantity}
                          </p>
                        </div>
                      </div>

                      <p className="shrink-0 text-sm font-bold text-primary-dark dark:text-border-light">
                        {formatCurrency(
                          Number(itemPrice) * Number(itemQuantity),
                        )}
                      </p>
                    </div>
                  )
                })
              )}
            </div>
          </section>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <section className="rounded-2xl border border-border-light bg-bg-card p-5 shadow-sm sm:p-6 dark:bg-dark-bg-card">
              <div className="mb-4 flex items-center gap-2 text-sm font-bold text-primary-dark dark:text-accent-gold-hover">
                <MapPin className="h-4 w-4 text-text-gold" />
                Shipping Address
              </div>

              <div className="space-y-1 text-sm leading-5 text-text-secondary dark:text-border-light">
                <p>
                  {address.firstName ||
                    address.name ||
                    address.fullName ||
                    '—'}
                </p>

                <p>
                  {address.address ||
                    address.street ||
                    address.details ||
                    '—'}
                </p>

                <p>
                  {address.city ||
                    address.governorate ||
                    '—'}
                </p>

                <p>
                  {address.phone || order.phone || '—'}
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-border-light bg-bg-card p-5 shadow-sm sm:p-6 dark:bg-dark-bg-card">
              <div className="mb-4 flex items-center gap-2 text-sm font-bold text-primary-dark dark:text-accent-gold-hover">
                <CreditCard className="h-4 w-4 text-text-gold" />
                Payment
              </div>

              <p className="text-sm text-text-secondary dark:text-border-light">
                {order.paymentMethod ||
                  order.paymentType ||
                  'Cash'}
              </p>

              <div className="my-4 h-px bg-border-light" />

              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-text-secondary dark:text-border-light">
                  Total
                </span>

                <span className="text-lg font-bold text-primary-medium dark:text-accent-gold-hover">
                  {formatCurrency(total)}
                </span>
              </div>

              <p className="mt-2 text-xs text-text-secondary dark:text-border-light">
                Placed on{' '}
                {formatDate(
                  order.createdAt ||
                    order.orderDate ||
                    order.date,
                )}
              </p>
            </section>
          </div>

          {canCancel && (
            <div className="mt-6 flex justify-center">
              <Button
                type="button"
                variant="danger"
                size="lg"
                isLoading={isCancelling}
                onClick={() => setIsCancelModalOpen(true)}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Cancel Order
              </Button>
            </div>
          )}
        </div>
      </main>

      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => {
          if (!isCancelling) {
            setIsCancelModalOpen(false)
          }
        }}
        title="Cancel Order"
        closeOnBackdrop={!isCancelling}
        footer={
          <>
            <Button
              type="button"
              variant="secondary"
              size="md"
              disabled={isCancelling}
              onClick={() => setIsCancelModalOpen(false)}
            >
              Keep Order
            </Button>

            <Button
              type="button"
              variant="danger"
              size="md"
              isLoading={isCancelling}
              onClick={handleCancel}
            >
              Confirm Cancellation
            </Button>
          </>
        }
      >
        <p className="leading-6 text-text-secondary">
          Are you sure you want to cancel this order? This action
          cannot be undone.
        </p>
      </Modal>
    </>
  )
}
