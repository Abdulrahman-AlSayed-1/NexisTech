import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { ArrowLeft, XCircle } from 'lucide-react'

import Badge from '@/components/common/Badge'
import Button from '@/components/common/Button'
import OrderProgressStepper from '@/components/orders/OrderProgressStepper'
import OrderItemsList from '@/components/orders/OrderItemsList'
import OrderSummaryCard from '@/components/orders/OrderSummaryCard'
import CancelOrderModal from '@/components/orders/CancelOrderModal'
import {
  cancelOrderThunk,
  clearCurrentOrder,
  fetchMyOrderByIdThunk,
  selectCurrentOrder,
  selectCurrentOrderSummary,
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
  if (value === 'cancelled' || value === 'canceled') return 'Cancelled'
  return value.charAt(0).toUpperCase() + value.slice(1)
}

const getActiveStage = (status) => {
  const index = ORDER_STAGES.findIndex(
    (stage) => stage.toLowerCase() === String(status).toLowerCase(),
  )
  return index === -1 ? 0 : index
}

const getId = (order) => order?._id
const getItems = (order) => order?.items || []
const getAddress = (order) => order?.shippingAddress || {}

/**
 * OrderDetailPage Component
 * Lean page coordinator assembling OrderProgressStepper, OrderItemsList, OrderSummaryCard, and CancelOrderModal.
 */
export default function OrderDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch()

  const order = useSelector(selectCurrentOrder)
  const orderSummary = useSelector(selectCurrentOrderSummary)
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
  const canCancel = ['Pending', 'Confirmed'].includes(status)

  const handleCancel = async () => {
    try {
      setIsCancelling(true)
      await dispatch(cancelOrderThunk(id)).unwrap()
      setIsCancelModalOpen(false)
      toast.success('Order cancelled successfully.')
      dispatch(fetchMyOrderByIdThunk(id))
    } catch (requestError) {
      toast.error(requestError || 'The order could not be cancelled.')
    } finally {
      setIsCancelling(false)
    }
  }

  // Skeleton Loading State
  if (isLoading && !order) {
    return (
      <main className="min-h-screen bg-bg-main px-4 py-6 sm:px-6 lg:px-10 lg:py-10 dark:bg-dark-bg-main">
        <div className="mx-auto max-w-4xl animate-pulse space-y-5">
          <div className="h-6 w-32 rounded-lg bg-bg-input" />
          <div className="h-32 rounded-2xl bg-bg-card dark:bg-dark-bg-card" />
          <div className="h-64 rounded-2xl bg-bg-card dark:bg-dark-bg-card" />
          <div className="h-32 rounded-2xl bg-bg-card dark:bg-dark-bg-card" />
        </div>
      </main>
    )
  }

  // Error / Not Found State
  if (error || !order) {
    return (
      <main className="min-h-screen bg-bg-main px-4 py-10 sm:px-6 lg:px-10 dark:bg-dark-bg-main">
        <div className="mx-auto max-w-4xl">
          <Link
            to="/profile/orders"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-medium hover:text-accent-gold transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Orders
          </Link>

          <div
            className="rounded-2xl border border-border-light dark:border-primary-medium/25 bg-bg-card dark:bg-dark-bg-card p-10 text-center text-sm text-text-secondary"
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
        <div className="mx-auto w-full max-w-4xl">
          {/* Header & Status */}
          <div className="mb-6 sm:mb-8 flex items-start justify-between gap-4">
            <div>
              <Link
                to="/profile/orders"
                className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary-medium dark:text-text-gold hover:text-accent-gold transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to My Orders
              </Link>

              <h1 className="text-2xl sm:text-3xl font-bold font-heading tracking-tight text-primary-dark dark:text-text-light">
                Order Details
              </h1>

              <p className="mt-1 font-mono text-xs text-text-secondary">
                Reference #{String(orderNumber).slice(-8).toUpperCase()}
              </p>
            </div>

            <Badge status={status} size="md" dot>
              {status}
            </Badge>
          </div>

          {/* 1. Progress Timeline Stepper */}
          <OrderProgressStepper status={status} activeStage={activeStage} />

          {/* 2. Order Items Table Breakdown */}
          <OrderItemsList items={items} />

          {/* 3. Shipping & Payment Summary */}
          <OrderSummaryCard address={address} order={order} summary={orderSummary} />

          {/* 4. Cancellation Action Trigger */}
          {canCancel && (
            <div className="mt-8 flex justify-center">
              <Button
                type="button"
                variant="danger"
                size="md"
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

      {/* 5. Accessible Cancellation Confirmation Modal */}
      <CancelOrderModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancel}
        isCancelling={isCancelling}
      />
    </>
  )
}
