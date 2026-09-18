import { useRef } from 'react'
import { useCountUp } from 'react-countup'

/**
 * Reusable Animated Counter Primitive.
 */
export default function Counter({
  value = 0,
  duration = 2,
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

  useCountUp({
    ref: countUpRef,
    start: 0,
    end: isInvalid ? 0 : numericValue,
    duration,
    decimals: resolvedDecimals,
    separator,
    prefix,
    suffix: resolvedSuffix,
    enableReinitialize: true,
  })

  if (isInvalid) {
    return <span className={className}>{value}</span>
  }

  return <span ref={countUpRef} className={className} />
}
