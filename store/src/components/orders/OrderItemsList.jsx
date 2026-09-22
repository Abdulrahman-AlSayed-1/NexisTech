import React from 'react'
import { Box, Package } from 'lucide-react'
import { formatCurrency } from '@/utils/formatters'
import { getCartItemId } from '@/utils/productUtils'

const getItemName = (item) =>
  item?.name || item?.product?.name || 'Item'

const getItemImage = (item) =>
  item?.image || item?.product?.images?.[0] || item?.product?.image || ''

const getItemPrice = (item) => Number(item?.price) || 0

const getItemQuantity = (item) => Number(item?.quantity) || 1

/**
 * OrderItemsList Component
 * Displays the list of purchased products in an order with thumbnails, names, quantities, and line prices.
 *
 * @param {{ items: Array }} props
 */
export default function OrderItemsList({ items = [] }) {
  return (
    <section className="mt-5 rounded-2xl border border-border-light dark:border-primary-medium/25 bg-bg-card dark:bg-dark-bg-card p-5 sm:p-7 shadow-xs">
      <div className="mb-5 flex items-center gap-2 text-sm font-bold text-primary-dark dark:text-text-gold font-heading">
        <Box className="h-4 w-4 text-accent-gold" />
        <span>Items in Order ({items.length})</span>
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-text-secondary py-4 text-center">
            No item information available for this order.
          </p>
        ) : (
          items.map((item, index) => {
            const itemImage = getItemImage(item)
            const itemName = getItemName(item)
            const itemPrice = getItemPrice(item)
            const itemQuantity = getItemQuantity(item)
            const lineTotal = Number(itemPrice) * Number(itemQuantity)

            return (
              <div
                key={getCartItemId(item) || `${itemName}-${index}`}
                className="flex items-center justify-between gap-4 rounded-xl bg-bg-input/30 dark:bg-dark-bg-main/60 border border-border-light/60 dark:border-primary-medium/20 p-3 sm:px-4"
              >
                <div className="flex min-w-0 items-center gap-3.5">
                  {itemImage ? (
                    <img
                      src={itemImage}
                      alt={itemName}
                      className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-xl object-cover border border-border-light dark:border-primary-medium/30 bg-bg-card dark:bg-dark-bg-card"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  ) : (
                    <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl bg-bg-input/60 dark:bg-primary-medium/20 text-primary-medium dark:text-text-gold">
                      <Package className="h-5 w-5" />
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-text-primary dark:text-text-light font-heading">
                      {itemName}
                    </p>
                    <p className="mt-0.5 text-xs text-text-secondary">
                      Qty: {itemQuantity} &times; {formatCurrency(itemPrice)}
                    </p>
                  </div>
                </div>

                <p className="shrink-0 text-sm sm:text-base font-bold text-primary-dark dark:text-text-gold font-heading">
                  {formatCurrency(lineTotal)}
                </p>
              </div>
            )
          })
        )}
      </div>
    </section>
  )
}
