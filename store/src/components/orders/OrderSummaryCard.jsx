import { MapPin, CreditCard } from 'lucide-react'
import { formatCurrency, formatDate } from '@/utils/formatters'

/**
 * OrderSummaryCard Component
 * Displays shipping logistics, payment details, and complete itemized cost breakdown (subtotal, shipping, VAT, discount, total).
 *
 * @param {{ address: object, order: object, summary?: { subtotal: number, shippingFee: number, tax: number, discount: number, total: number } }} props
 */
export default function OrderSummaryCard({ address = {}, order = {}, summary }) {
  const rawDate = order?.orderDate || order?.date || order?.createdAt || order?.created_at
  const placedDate = formatDate(rawDate, true)
  const paymentMethod = order?.paymentMethod ? order.paymentMethod.toUpperCase() : 'CASH ON DELIVERY'

  const subtotal = summary?.subtotal ?? (Number(order?.subtotal) || 0)
  const shippingFee = summary?.shippingFee ?? (Number(order?.shippingFee) || 0)
  const tax = summary?.tax ?? (Number(order?.tax) || 0)
  const discount = summary?.discount ?? (Number(order?.discount) || 0)
  const finalTotal = summary?.total ?? (Number(order?.totalPrice) || 0)

  return (
    <div className="mt-5 grid gap-5 md:grid-cols-2">
      {/* Shipping Address */}
      <section className="rounded-2xl border border-border-light dark:border-primary-medium/25 bg-bg-card dark:bg-dark-bg-card p-5 sm:p-6 shadow-xs flex flex-col justify-between">
        <div>
          <div className="mb-4 flex items-center gap-2 text-sm font-bold text-primary-dark dark:text-text-gold font-heading">
            <MapPin className="h-4 w-4 text-accent-gold" />
            <span>Shipping Address</span>
          </div>

          <div className="space-y-1.5 text-sm leading-relaxed text-text-secondary dark:text-border-light">
            <p className="font-semibold text-text-primary dark:text-text-light font-heading">
              {address.fullName || 'Valued Customer'}
            </p>
            <p>{address.address || 'Address not specified'}</p>
            <p>{address.city || ''}{address.postalCode ? ` · ${address.postalCode}` : ''}</p>
            <p className="font-mono text-xs pt-1 text-text-secondary">
              Phone: {address.phone || '—'}
            </p>
          </div>
        </div>

        <div className="pt-4 mt-4 border-t border-border-light/70 dark:border-primary-medium/20 text-xs text-text-secondary flex items-center justify-between">
          <span>Country / Region</span>
          <span className="font-medium text-text-primary dark:text-text-light">
            {address.country || 'Egypt'}
          </span>
        </div>
      </section>

      {/* Payment & Itemized Cost Breakdown */}
      <section className="rounded-2xl border border-border-light dark:border-primary-medium/25 bg-bg-card dark:bg-dark-bg-card p-5 sm:p-6 shadow-xs flex flex-col justify-between">
        <div>
          <div className="mb-4 flex items-center gap-2 text-sm font-bold text-primary-dark dark:text-text-gold font-heading">
            <CreditCard className="h-4 w-4 text-accent-gold" />
            <span>Payment & Cost Breakdown</span>
          </div>

          {/* Payment Method & Date */}
          <div className="flex items-center justify-between text-xs sm:text-sm pb-3 text-text-secondary">
            <span>Payment Method</span>
            <span className="font-semibold uppercase tracking-wider text-text-primary dark:text-text-light font-heading text-xs">
              {paymentMethod}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs pb-3 text-text-secondary">
            <span>Order Date</span>
            <span>{placedDate}</span>
          </div>

          {/* Itemized Price Breakdown */}
          <div className="space-y-2 py-3 border-t border-border-light/70 dark:border-primary-medium/20 text-xs sm:text-sm">
            <div className="flex items-center justify-between text-text-secondary">
              <span>Items Subtotal</span>
              <span className="font-medium text-text-primary dark:text-text-light">
                {formatCurrency(subtotal)}
              </span>
            </div>

            <div className="flex items-center justify-between text-text-secondary">
              <span>Shipping & Delivery</span>
              <span className="font-medium text-text-primary dark:text-text-light">
                {shippingFee > 0 ? formatCurrency(shippingFee) : 'Free Shipping'}
              </span>
            </div>

            {tax > 0 && (
              <div className="flex items-center justify-between text-text-secondary">
                <span>Estimated VAT / Tax</span>
                <span className="font-medium text-text-primary dark:text-text-light">
                  {formatCurrency(tax)}
                </span>
              </div>
            )}

            {discount > 0 && (
              <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                <span>Discount Applied</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Final Total */}
        <div className="pt-3 border-t border-border-light dark:border-primary-medium/20 flex items-center justify-between gap-4">
          <div>
            <span className="text-sm font-bold font-heading text-text-primary dark:text-text-light">
              Total Amount
            </span>
            <p className="text-[11px] text-text-secondary">Including all taxes and shipping</p>
          </div>
          <span className="text-lg sm:text-xl font-bold font-heading text-primary-dark dark:text-text-gold">
            {formatCurrency(finalTotal)}
          </span>
        </div>
      </section>
    </div>
  )
}
