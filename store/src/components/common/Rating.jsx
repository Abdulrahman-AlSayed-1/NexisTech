import React from 'react'
import { Star } from 'lucide-react'

/**
 * @typedef {'sm' | 'md' | 'lg'} RatingSize
 *
 * @typedef {Object} RatingProps
 * @property {number} [value=0] - Current rating value (e.g. 4.5 out of 5)
 * @property {number} [max=5] - Maximum number of stars
 * @property {number} [reviewCount] - Optional review count badge (e.g. 128 reviews)
 * @property {boolean} [showValue=false] - Whether to render numeric score text alongside stars
 * @property {RatingSize} [size='md'] - Star icon dimension scale
 * @property {(value: number) => void} [onChange] - If provided, renders an interactive rating input
 * @property {string} [className=''] - Additional CSS classes
 */

/**
 * Common Rating Primitive
 * Displays fractional and integer star ratings, supports interactive feedback selection and review tallies.
 *
 * @param {RatingProps} props
 * @returns {JSX.Element}
 */
export default function Rating({
  value = 0,
  max = 5,
  reviewCount,
  showValue = false,
  size = 'md',
  onChange,
  className = '',
}) {
  const isInteractive = Boolean(onChange)
  const numericValue = Number(value) || 0

  const sizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  const starSize = sizes[size] || sizes.md

  const renderStar = (index) => {
    const starValue = index + 1
    const isFull = numericValue >= starValue
    const isHalf = numericValue >= starValue - 0.5 && !isFull

    if (isInteractive) {
      return (
        <button
          key={index}
          type="button"
          onClick={() => onChange?.(starValue)}
          className="focus:outline-none transition-transform hover:scale-115 cursor-pointer text-amber-400"
          aria-label={`Rate ${starValue} of ${max}`}
        >
          <Star
            className={`${starSize} ${
              isFull
                ? 'fill-amber-400 text-amber-400'
                : 'text-border-medium dark:text-slate-600'
            }`}
          />
        </button>
      )
    }

    if (isFull) {
      return (
        <Star
          key={index}
          className={`${starSize} fill-amber-400 text-amber-400 shrink-0`}
        />
      )
    }

    if (isHalf) {
      return (
        <div key={index} className="relative inline-block shrink-0">
          <Star className={`${starSize} text-border-medium dark:text-slate-600`} />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className={`${starSize} fill-amber-400 text-amber-400`} />
          </div>
        </div>
      )
    }

    return (
      <Star
        key={index}
        className={`${starSize} text-border-medium dark:text-slate-600 shrink-0`}
      />
    )
  }

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }, (_, i) => renderStar(i))}
      </div>

      {showValue && (
        <span className="text-xs font-semibold text-text-primary dark:text-text-light ml-0.5">
          {numericValue.toFixed(1)}
        </span>
      )}

      {reviewCount !== undefined && (
        <span className="text-xs text-text-secondary dark:text-slate-400">
          ({reviewCount})
        </span>
      )}
    </div>
  )
}
