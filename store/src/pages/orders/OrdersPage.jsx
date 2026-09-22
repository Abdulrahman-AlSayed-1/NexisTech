import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Calendar, ShoppingBag, Package, RefreshCw } from 'lucide-react'

import Button from '@/components/common/Button'
import Pagination from '@/components/common/Pagination'
import OrderCard from '@/components/orders/OrderCard'
import { formatDate } from '@/utils/formatters'
import {
  fetchMyOrdersThunk,
  selectOrders,
  selectOrdersLoading,
  selectOrdersError,
  selectOrdersCurrentPage,
  selectOrdersTotalPages,
  selectOrdersTotalCount,
} from '@/store/slices/ordersSlice'

/**
 * OrdersPage Component
 * Displays customer orders chronologically grouped by placement date with compact card layouts.
 */
export default function OrdersPage() {
  const dispatch = useDispatch()

  const orders = useSelector(selectOrders)
  const isLoading = useSelector(selectOrdersLoading)
  const error = useSelector(selectOrdersError)
  const currentPage = useSelector(selectOrdersCurrentPage)
  const totalPages = useSelector(selectOrdersTotalPages)
  const totalOrders = useSelector(selectOrdersTotalCount)

  useEffect(() => {
    dispatch(fetchMyOrdersThunk({ page: 1 }))
  }, [dispatch])

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return
    dispatch(fetchMyOrdersThunk({ page: newPage }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Group orders chronologically by date (newest first)
  const dateGroups = useMemo(() => {
    if (!Array.isArray(orders) || orders.length === 0) return []

    const sorted = [...orders].sort(
      (a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0)
    )

    const groupsMap = new Map()

    sorted.forEach((order) => {
      const dateLabel = formatDate(order?.createdAt) || 'Recent Orders'
      if (!groupsMap.has(dateLabel)) {
        groupsMap.set(dateLabel, [])
      }
      groupsMap.get(dateLabel).push(order)
    })

    return Array.from(groupsMap.entries()).map(([dateLabel, groupOrders]) => ({
      dateLabel,
      orders: groupOrders,
    }))
  }, [orders])

  return (
    <main className="min-h-screen bg-bg-main px-4 py-6 text-text-primary sm:px-6 sm:py-8 lg:px-10 lg:py-10 dark:bg-dark-bg-main">
      <div className="mx-auto w-full max-w-4xl">
        {/* Page Header */}
        <header className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-accent-gold font-heading">
              Account Overview
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading tracking-tight text-primary-dark dark:text-text-light">
              My Orders
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-text-secondary">
              Track active shipments, view receipts, and review purchase history.
            </p>
          </div>

          {!isLoading && totalOrders > 0 && (
            <span className="text-xs font-medium text-text-secondary">
              {totalOrders} total {totalOrders === 1 ? 'order' : 'orders'}
            </span>
          )}
        </header>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="space-y-4" aria-live="polite">
            {[1, 2, 3].map((idx) => (
              <div
                key={idx}
                className="h-28 animate-pulse rounded-2xl border border-border-light dark:border-primary-medium/20 bg-bg-card dark:bg-dark-bg-card p-5"
              >
                <div className="flex justify-between items-center pb-3 border-b border-border-light/50 dark:border-primary-medium/20">
                  <div className="h-4 w-32 bg-bg-input rounded-md" />
                  <div className="h-5 w-20 bg-bg-input rounded-md" />
                </div>
                <div className="pt-3 flex gap-3 items-center">
                  <div className="h-10 w-10 bg-bg-input rounded-xl" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-3.5 w-48 bg-bg-input rounded-md" />
                    <div className="h-2.5 w-24 bg-bg-input rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div
            className="rounded-2xl border border-rose-200 bg-rose-50 dark:bg-rose-950/20 dark:border-rose-900/30 p-5 text-sm text-rose-700 dark:text-rose-400 flex items-center justify-between gap-4"
            role="alert"
          >
            <span>{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => dispatch(fetchMyOrdersThunk())}
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              Retry
            </Button>
          </div>
        )}

        {/* Empty State with Call-to-Action */}
        {!isLoading && !error && orders.length === 0 && (
          <div className="rounded-3xl border border-border-light dark:border-primary-medium/25 bg-bg-card dark:bg-dark-bg-card px-6 py-12 sm:py-16 text-center shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-accent-gold/15 text-accent-gold-hover dark:text-accent-gold flex items-center justify-center mx-auto mb-4 shadow-2xs">
              <ShoppingBag className="w-7 h-7" />
            </div>

            <h2 className="text-lg font-bold font-heading text-primary-dark dark:text-text-light">
              No orders yet
            </h2>

            <p className="mt-1.5 text-sm text-text-secondary max-w-sm mx-auto">
              Your orders will appear here after your first purchase. Explore our collection of premium hardware & electronics.
            </p>

            <div className="mt-6">
              <Link to="/products">
                <Button variant="gold" size="md">
                  <Package className="w-4 h-4 mr-2" />
                  Start Shopping
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Chronologically Grouped Orders List */}
        {!isLoading && !error && dateGroups.length > 0 && (
          <div className="space-y-6">
            {dateGroups.map((group) => (
              <section key={group.dateLabel} className="space-y-3">
                {/* Date Group Subheader */}
                <div className="flex items-center gap-2 px-1">
                  <Calendar className="w-3.5 h-3.5 text-accent-gold" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary font-heading">
                    {group.dateLabel}
                  </h3>
                  <span className="text-[10px] font-bold text-text-secondary/70 bg-bg-input/60 dark:bg-primary-medium/25 px-2 py-0.5 rounded-full font-mono">
                    {group.orders.length}
                  </span>
                </div>

                {/* Orders under this date */}
                <div className="space-y-3">
                  {group.orders.map((order) => (
                    <OrderCard
                      key={order?._id || order?.id || order?.orderId}
                      order={order}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {!isLoading && !error && totalOrders > 0 && totalPages > 1 && (
          <div className="mt-8 pt-4 border-t border-border-light/70 dark:border-primary-medium/20">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalOrders}
              pageSize={10}
              itemLabel="orders"
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </main>
  )
}
