import { useRef, useEffect } from 'react'
import { useCountUp } from 'react-countup'

/**
 * @typedef {Object} CounterProps
 * @property {number | string} [value=0] - Numeric value to animate towards
 * @property {number} [duration=2] - Animation duration in seconds
 * @property {number} [decimals] - Number of decimal places; defaults to 2 if currency specified, else 0
 * @property {string} [prefix=''] - Text prepended to the animated number
 * @property {string} [suffix=''] - Text appended to the animated number
 * @property {string} [currency] - Optional currency code automatically configuring suffix and 2 decimals (e.g. 'EGP')
 * @property {string} [separator=','] - Thousands grouping separator
 * @property {string} [className=''] - Additional CSS classes applied to the output span
 */

/**
 * Common Reusable Animated Counter Primitive
 * Smoothly interpolates numeric transitions with configurable currency formatting.
 *
 * @param {CounterProps} props
 * @returns {JSX.Element}
 */
export default function Counter({
  value = 0,
  duration = 1.5,
  decimals,
  prefix = '',
  suffix = '',
  currency,
  separator = ',',
  className = '',
}) {
  const countUpRef = useRef(null)

  const numericValue = typeof value === 'number' ? value : Number(value)
  const isInvalid = Number.isNaN(numericValue)

  const resolvedDecimals =
    decimals !== undefined ? decimals : currency ? 2 : 0

  const resolvedSuffix = currency ? ` ${currency}` : suffix

  const { update } = useCountUp({
    ref: countUpRef,
    start: 0,
    end: isInvalid ? 0 : numericValue,
    duration,
    decimals: resolvedDecimals,
    separator,
    prefix,
    suffix: resolvedSuffix,
  })

  // Explicitly trigger countup animation update when Redux async value arrives
  useEffect(() => {
    if (!isInvalid && update) {
      update(numericValue)
    }
  }, [numericValue, isInvalid, update])

  if (isInvalid) {
    return <span className={className}>{value}</span>
  }

  return (
    <span ref={countUpRef} className={className}>
      {prefix}
      {numericValue.toLocaleString('en-US', {
        minimumFractionDigits: resolvedDecimals,
        maximumFractionDigits: resolvedDecimals,
      })}
      {resolvedSuffix}
    </span>
  )
}
