/**
 * Shared Formatting Utilities for Storefront
 */

export const formatDate = (value, includeTime = false) => {
  if (!value) return '—'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)

  const options = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }

  if (includeTime) {
    options.hour = '2-digit'
    options.minute = '2-digit'
  }

  return date.toLocaleDateString('en-GB', options)
}

export const formatPrice = (amount) => {
  const num = Number(amount) || 0
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export const formatCurrency = (amount, currency = 'EGP') => {
  return `${formatPrice(amount)} ${currency}`
}

export const calculateDiscountPercentage = (price, originalPrice) => {
  const p = Number(price) || 0
  const orig = Number(originalPrice) || 0
  if (orig <= 0 || p >= orig) return 0
  return Math.round(((orig - p) / orig) * 100)
}
