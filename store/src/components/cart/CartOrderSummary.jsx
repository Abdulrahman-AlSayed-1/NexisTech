import { ShieldCheck, Truck, RotateCcw, ArrowRight } from 'lucide-react'
import Button from '@/components/common/Button'
import { formatCurrency, formatPrice } from '@/utils/formatters'

/**
 * CartOrderSummary Component
 * Displays breakdown of subtotal, discount, shipping, tax, and the primary checkout CTA.
 */
export default function CartOrderSummary({
  subtotal = 0,
  discount = 0,
  couponCode = null,
  appliedCoupon = null,
  shipping = 0,
  total = 0,
  itemCount = 0,
  onProceedToCheckout,
  isLoading = false,
}) {
  const isFreeShipping = shipping === 0
  const activeCoupon = couponCode || appliedCoupon
  const finalAmount = total > 0 ? total : Math.max(0, subtotal - discount + (isFreeShipping ? 0 : shipping))

  return (
    <div className="bg-bg-card dark:bg-dark-bg-card rounded-2xl border border-border-light dark:border-primary-medium/30 p-5 sm:p-6 space-y-5 shadow-xs sticky top-28">
      <div>
        <h2 className="text-lg font-bold font-heading text-primary-dark dark:text-text-light">
          Order Summary
        </h2>
        <p className="text-xs text-text-secondary dark:text-slate-400 mt-0.5">
          {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>

      <div className="space-y-3 text-sm border-t border-border-light dark:border-primary-medium/30 pt-4">
        <div className="flex justify-between text-text-secondary dark:text-slate-300">
          <span>Subtotal</span>
          <span className="font-semibold text-text-primary dark:text-text-light font-heading whitespace-nowrap">
            {formatCurrency(subtotal)}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
            <span className="flex items-center gap-1">
              Coupon Discount
              {activeCoupon && (
                <span className="text-[11px] font-bold font-heading bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  {activeCoupon}
                </span>
              )}
            </span>
            <span className="font-heading whitespace-nowrap">-{formatCurrency(discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-text-secondary dark:text-slate-300">
          <span className="flex items-center gap-1.5">
            Shipping
            <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
              Standard
            </span>
          </span>
          <span className="font-semibold font-heading text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
            {isFreeShipping ? 'Free Delivery' : formatCurrency(shipping)}
          </span>
        </div>
      </div>

      <div className="border-t border-border-light dark:border-primary-medium/30 pt-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 pr-1">
            <span className="block font-heading text-sm sm:text-base font-bold text-primary-dark dark:text-text-light">
              Total Amount
            </span>
            <span className="block text-[11px] text-text-secondary dark:text-slate-400">
              Including VAT & official warranty
            </span>
          </div>

          <div className="text-right shrink-0 whitespace-nowrap">
            <span className="font-heading text-lg sm:text-xl font-black text-accent-gold tracking-tight">
              {formatPrice(finalAmount)}
            </span>
            <span className="ml-1 text-xs sm:text-sm font-bold font-heading text-accent-gold">
              EGP
            </span>
          </div>
        </div>
      </div>

      {/* Checkout CTA */}
      <Button
        type="button"
        variant="gold"
        size="lg"
        onClick={onProceedToCheckout}
        disabled={itemCount === 0 || isLoading}
        isLoading={isLoading}
        className="w-full justify-center shadow-md font-bold text-sm sm:text-base py-3 cursor-pointer"
      >
        <span>Proceed to Checkout</span>
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>

      {/* Trust Badges */}
      <div className="pt-2 border-t border-border-light dark:border-primary-medium/20 grid grid-cols-3 gap-2 text-center text-[10px] text-text-secondary dark:text-slate-400">
        <div className="flex flex-col items-center gap-1">
          <ShieldCheck className="w-4 h-4 text-accent-gold" />
          <span>Official Warranty</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Truck className="w-4 h-4 text-accent-gold" />
          <span>Express Delivery</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <RotateCcw className="w-4 h-4 text-accent-gold" />
          <span>14-Day Returns</span>
        </div>
      </div>
    </div>
  )
}
