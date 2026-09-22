import React, { useState } from 'react'
import { Tag, Check, X } from 'lucide-react'
import Button from '@/components/common/Button'
import { formatCurrency } from '@/utils/formatters'

/**
 * CartCouponBox Component
 * Provides a clean coupon input with instant validation feedback and active coupon removal.
 */
export default function CartCouponBox({
  appliedCoupon,
  discountAmount = 0,
  onApplyCoupon,
  onRemoveCoupon,
  isLoading = false,
}) {
  const [code, setCode] = useState('')
  const [localError, setLocalError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')
    const trimmed = code.trim().toUpperCase()
    if (!trimmed) {
      setLocalError('Please enter a coupon code')
      return
    }
    const result = await onApplyCoupon(trimmed)
    if (result?.error) {
      setLocalError(result.error)
    } else {
      setCode('')
    }
  }

  return (
    <div className="rounded-2xl border border-border-light dark:border-primary-medium/30 bg-bg-card dark:bg-dark-bg-card p-5 shadow-2xs">
      <div className="flex items-center gap-2 mb-3">
        <Tag className="w-4 h-4 text-accent-gold" />
        <h3 className="font-heading text-sm font-bold text-primary-dark dark:text-text-light">
          Have a Promo Code?
        </h3>
      </div>

      {appliedCoupon ? (
        <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <div>
              <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300 font-heading">
                Coupon Applied: <span className="tracking-wider uppercase">{appliedCoupon}</span>
              </p>
              {discountAmount > 0 && (
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  You save {formatCurrency(discountAmount)}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onRemoveCoupon}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            Remove
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value)
                if (localError) setLocalError('')
              }}
              placeholder="e.g. SAVE10, SAVE20, OFF50"
              disabled={isLoading}
              className="min-w-0 flex-1 px-3.5 py-2 text-sm rounded-xl border border-border-medium dark:border-primary-medium/40 bg-bg-main dark:bg-dark-bg-main text-text-primary dark:text-text-light placeholder:text-text-secondary/60 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-gold uppercase font-heading"
            />

            <Button
              type="submit"
              variant="gold"
              size="sm"
              isLoading={isLoading}
              disabled={!code.trim() || isLoading}
              className="px-5 shrink-0"
            >
              Apply
            </Button>
          </div>

          {localError && (
            <p className="text-[11px] text-rose-500 font-medium">{localError}</p>
          )}
        </form>
      )}
    </div>
  )
}
