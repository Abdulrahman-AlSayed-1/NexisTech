import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ArrowUpRight, Package } from 'lucide-react'
import Badge from '@/components/common/Badge'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { getCartItemId } from '@/utils/productUtils'

const normalizeStatus = (status = 'Pending') => {
  const value = String(status).toLowerCase()
  if (value === 'cancelled' || value === 'canceled') return 'Cancelled'
  return value.charAt(0).toUpperCase() + value.slice(1)
}

const getOrderId = (order) => order?._id

const getItems = (order) => order?.items || []

const getItemName = (item) =>
  item?.name || item?.product?.name || 'Item'

const getItemImage = (item) =>
  item?.image || item?.product?.images?.[0] || item?.product?.image || ''

const getOrderItemsCount = (order) => {
  const items = getItems(order)
  return items.reduce((sum, it) => sum + (Number(it?.quantity) || 1), 0)
}

const getOrderTotal = (order) => Number(order?.totalPrice) || 0

/**
 * OrderCard Component
 * Compact card with interactive slide-down products drawer (showing up to 3 items before scrolling).
 *
 * @param {{ order: object }} props
 */
export default function OrderCard({ order }) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!order) return null

  const orderId = getOrderId(order)
  const status = normalizeStatus(order.status)
  const items = getItems(order)
  const itemCount = getOrderItemsCount(order)
  const rawDate = order?.orderDate || order?.date || order?.createdAt || order?.created_at
  const placedDate = formatDate(rawDate, true)
  const total = getOrderTotal(order)

  return (
    <article className="rounded-2xl border border-border-light dark:border-primary-medium/25 bg-bg-card dark:bg-dark-bg-card p-4 sm:p-5 shadow-xs transition-all duration-200 hover:border-accent-gold/60 dark:hover:border-accent-gold/60 hover:shadow-md">
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2.5 sm:gap-4 border-b border-border-light/70 dark:border-primary-medium/20 pb-3">
        <div className="flex items-center gap-2 min-w-0 flex-wrap sm:flex-nowrap">
          <Link
            to={`/profile/orders/${orderId}`}
            className="font-mono text-xs sm:text-sm font-bold text-text-primary dark:text-text-light hover:text-accent-gold dark:hover:text-accent-gold transition-colors focus:outline-none focus:underline shrink-0"
          >
            #{String(orderId).slice(-8).toUpperCase()}
          </Link>
          <Badge status={status} size="sm" dot className="shrink-0">
            {status}
          </Badge>
          {placedDate && (
            <span className="hidden sm:inline-block text-xs text-text-secondary shrink-0">
              · {placedDate}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <span className="font-heading font-bold text-sm sm:text-base md:text-lg text-primary-dark dark:text-text-gold whitespace-nowrap">
            {formatCurrency(total)}
          </span>
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Collapse order products' : 'Expand order products'}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-text-secondary hover:text-accent-gold hover:bg-bg-input/70 dark:hover:bg-primary-medium/25 transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-accent-gold shrink-0"
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-300 ${
                isExpanded ? 'rotate-180 text-accent-gold' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Summary Row (Items Count + Quick Toggle + View Details) */}
      <div className="pt-3 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-text-secondary">
          <Package className="w-4 h-4 text-accent-gold shrink-0" />
          <span className="font-medium text-text-primary dark:text-text-light">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </span>
          <span>·</span>
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="font-semibold text-primary-medium dark:text-text-gold hover:text-accent-gold hover:underline inline-flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>{isExpanded ? 'Hide products' : 'Show products'}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>

        <Link
          to={`/profile/orders/${orderId}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary-medium dark:text-text-gold hover:text-accent-gold hover:underline shrink-0"
        >
          <span>View Details</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Interactive Slide-Down Product Drawer (Max 3 visible before scrolling) */}
      {isExpanded && (
        <div className="mt-4 pt-3.5 border-t border-border-light/70 dark:border-primary-medium/20 animate-fadeIn">
          <div className="mb-2.5 flex items-center justify-between text-xs font-semibold text-text-secondary">
            <span>Ordered Products ({items.length})</span>
            {items.length > 3 && (
              <span className="text-[11px] text-text-secondary/80 font-normal">
                Scroll to view all
              </span>
            )}
          </div>

          <div className="max-h-[195px] overflow-y-auto space-y-2 pr-1">
            {items.map((item, idx) => {
              const img = getItemImage(item)
              const name = getItemName(item)
              const qty = Number(item?.quantity) || 1
              const price = Number(item?.price) || 0
              const lineTotal = qty * price

              return (
                <div
                  key={getCartItemId(item) || `${name}-${idx}`}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-bg-input/30 dark:bg-dark-bg-main/60 border border-border-light/60 dark:border-primary-medium/20 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {img ? (
                      <img
                        src={img}
                        alt={name}
                        className="w-10 h-10 rounded-lg object-cover bg-bg-card dark:bg-dark-bg-card shrink-0 border border-border-light/60 dark:border-primary-medium/25"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-bg-input/80 flex items-center justify-center text-primary-medium shrink-0">
                        <Package className="w-4 h-4" />
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-text-primary dark:text-text-light truncate">
                        {name}
                      </p>
                      <p className="text-[11px] text-text-secondary">
                        Qty: {qty} × {formatCurrency(price)}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold font-mono text-primary-dark dark:text-text-gold shrink-0">
                    {formatCurrency(lineTotal)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </article>
  )
}
