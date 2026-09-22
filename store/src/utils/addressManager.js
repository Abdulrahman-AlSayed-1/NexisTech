/**
 * Safely extracts unique, valid delivery addresses from customer order history.
 * Automatically sorts most recent orders first, marking the most recent as default.
 *
 * @param {Array<object>} orders
 * @returns {Array<object>}
 */
export const extractAddressesFromOrders = (orders = []) => {
  if (!Array.isArray(orders) || orders.length === 0) return []

  const extracted = []
  const seenKeys = new Set()

  // Sort by order creation date descending so recent addresses appear first
  const sortedOrders = [...orders].sort((a, b) => {
    const timeA = new Date(a.createdAt || 0).getTime()
    const timeB = new Date(b.createdAt || 0).getTime()
    return timeB - timeA
  })

  sortedOrders.forEach((order, index) => {
    const shipping = order?.shippingAddress
    if (!shipping) return

    const street = (shipping.address || shipping.street || '').trim()
    const city = (shipping.city || '').trim()
    const country = (shipping.country || 'Egypt').trim()
    const postalCode = (shipping.postalCode || '').trim()
    const phone = (shipping.phone || order?.phone || '').trim()
    const fullName = (shipping.fullName || order?.customerName || '').trim()

    if (!street || !city) return

    const dedupeKey = `${street.toLowerCase()}|${city.toLowerCase()}`
    if (seenKeys.has(dedupeKey)) return

    seenKeys.add(dedupeKey)
    const id = order?._id ? `order-addr-${order._id}` : `order-addr-${index}`

    extracted.push({
      id,
      orderId: order?._id,
      orderDate: order?.createdAt,
      type: 'Order Delivery',
      street,
      city,
      country,
      postalCode,
      phone,
      fullName,
      isDefault: extracted.length === 0, // Most recent order address is the default
    })
  })

  return extracted
}
