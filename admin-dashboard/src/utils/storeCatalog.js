/**
 * Builds fast lookup sets for all Nexis Tech products.
 * Derived directly from live backend products in Redux state (state.products.items).
 *
 * @param {Array} reduxProducts - Live products from state.products.items
 * @returns {{ ids: Set<string>, names: Set<string> }}
 */
export function buildStoreCatalogLookup(reduxProducts = []) {
  const ids = new Set()
  const names = new Set()

  if (Array.isArray(reduxProducts)) {
    reduxProducts.forEach((p) => {
      const id = String(p._id || p.id || '')
      if (id) ids.add(id)
      const name = p.name?.trim().toLowerCase()
      if (name) names.add(name)
    })
  }

  return { ids, names }
}

/**
 * Validates whether a line item belongs to Nexis Tech's catalog.
 *
 * @param {object} item - Item object { product, name, price, quantity, ... }
 * @param {{ ids: Set<string>, names: Set<string> }} lookup
 * @returns {boolean}
 */
export function isStoreItem(item, lookup) {
  if (!item) return false
  if (item.isStoreItem) return true
  const cat = (item.product?.category || item.category || '').toLowerCase()
  if (cat === 'electronics' || cat === 'hardware') return true
  if (!lookup) return false
  const productId = String(item.product?._id || item.product || '')
  const name = (item.name || item.title || '').trim().toLowerCase()
  return lookup.ids?.has(productId) || lookup.names?.has(name)
}

/**
 * Determines whether an order belongs to Nexis Tech.
 *
 * @param {object} order
 * @param {{ ids: Set<string>, names: Set<string> }} lookup
 * @returns {boolean}
 */
export function isStoreOrder(order, lookup) {
  if (!order) return false
  if (order.isStoreOrder) return true
  if (!Array.isArray(order.items) || order.items.length === 0) return false
  return order.items.some((item) => isStoreItem(item, lookup))
}

/**
 * Filters an order's items to only include Nexis Tech products,
 * recalculating subtotal and total to reflect store revenue accurately.
 *
 * @param {object} order
 * @param {{ ids: Set<string>, names: Set<string> }} lookup
 * @returns {object}
 */
export function filterStoreOrder(order, lookup) {
  if (!order) return order
  const storeItems = (order.items || []).filter((item) => isStoreItem(item, lookup))
  const subtotal = storeItems.reduce(
    (sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 1),
    0
  )
  const shippingFee = Number(order.shippingFee) || 0
  const tax = Number(order.tax) || 0
  const discount = Number(order.discount) || 0
  const totalPrice = Math.max(0, subtotal + shippingFee + tax - discount)

  const roundedSubtotal = Number(subtotal.toFixed(2))
  const roundedTotal = Number(totalPrice.toFixed(2))

  return {
    ...order,
    items: storeItems,
    subtotal: roundedSubtotal,
    totalPrice: roundedTotal,
    total: roundedTotal,
  }
}

/**
 * Determines whether a cart belongs to Nexis Tech.
 *
 * @param {object} cart
 * @param {{ ids: Set<string>, names: Set<string> }} lookup
 * @returns {boolean}
 */
export function isStoreCart(cart, lookup) {
  if (!cart) return false
  if (cart.isStoreCart) return true
  if (!Array.isArray(cart.items) || cart.items.length === 0) return false
  return cart.items.some((item) => isStoreItem(item, lookup))
}

/**
 * Filters a cart's items to only include Nexis Tech products,
 * recalculating subtotal and item count.
 *
 * @param {object} cart
 * @param {{ ids: Set<string>, names: Set<string> }} lookup
 * @returns {object}
 */
export function filterStoreCart(cart, lookup) {
  if (!cart) return cart
  const storeItems = (cart.items || []).filter((item) => isStoreItem(item, lookup))
  const subtotal = storeItems.reduce(
    (sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 1),
    0
  )
  const itemCount = storeItems.reduce(
    (sum, it) => sum + (Number(it.quantity) || 1),
    0
  )

  return {
    ...cart,
    items: storeItems,
    subtotal: Number(subtotal.toFixed(2)),
    itemCount,
  }
}

/**
 * Validates whether a user is an authorized Nexis Tech Administrator.
 * Only accounts with emails ending with @nexis.com are recognized as Nexis admins.
 *
 * @param {object} user
 * @returns {boolean}
 */
export function isNexisStaffUser(user) {
  if (!user) return false
  const email = (user.email || '').trim().toLowerCase()
  const role = (user.role || '').toLowerCase()
  return email.endsWith('@nexis.com') && (role === 'admin' || email === 'admin@nexis.com')
}

/**
 * Builds lookup sets of customer IDs and emails that have ordered or carted Nexis Tech products.
 *
 * @param {Array} storeOrders - Nexis-scoped orders
 * @param {Array} storeCarts - Nexis-scoped active carts
 * @returns {{ ids: Set<string>, emails: Set<string> }}
 */
export function buildNexisCustomerLookup(storeOrders = [], storeCarts = []) {
  const ids = new Set()
  const emails = new Set()

  const registerCustomer = (customerObj, directEmail, directUserId) => {
    if (directUserId) {
      ids.add(String(directUserId))
    }
    if (directEmail && typeof directEmail === 'string' && directEmail.includes('@')) {
      emails.add(directEmail.trim().toLowerCase())
    }

    if (customerObj) {
      if (typeof customerObj === 'string' && customerObj.length > 5) {
        ids.add(String(customerObj))
      } else if (typeof customerObj === 'object') {
        const id = customerObj._id || customerObj.id
        if (id) ids.add(String(id))
        const email = customerObj.email
        if (email && typeof email === 'string' && email.includes('@')) {
          emails.add(email.trim().toLowerCase())
        }
      }
    }
  }

  if (Array.isArray(storeOrders)) {
    storeOrders.forEach((order) => {
      const directUserId =
        order.user?._id ||
        (typeof order.user === 'string' ? order.user : null) ||
        order.userId
      registerCustomer(order.customer, order.email, directUserId)
      if (order.user && typeof order.user === 'object') {
        registerCustomer(order.user)
      }
      if (order.createdBy) {
        registerCustomer(order.createdBy)
      }
    })
  }

  if (Array.isArray(storeCarts)) {
    storeCarts.forEach((cart) => {
      const directUserId =
        cart.user?._id ||
        (typeof cart.user === 'string' ? cart.user : null) ||
        cart.userId
      registerCustomer(cart.customer, cart.email, directUserId)
      if (cart.user && typeof cart.user === 'object') {
        registerCustomer(cart.user)
      }
    })
  }

  return { ids, emails }
}

/**
 * Validates whether a user is an active Nexis Tech customer (has ordered or carted store products).
 *
 * @param {object} user
 * @param {{ ids: Set<string>, emails: Set<string> }} customerLookup
 * @returns {boolean}
 */
export function isNexisCustomer(user, customerLookup) {
  if (!user || !customerLookup) return false
  const id = String(user._id || user.id || '')
  const email = (user.email || '').trim().toLowerCase()

  if (id && customerLookup.ids?.has(id)) return true
  if (email && customerLookup.emails?.has(email)) return true
  return false
}

/**
 * Filters and maps a list of users to strictly Nexis Tech personnel and store customers.
 * - Only @nexis.com accounts are displayed as ADMIN.
 * - Only customers who have placed a Nexis order or hold a Nexis cart are displayed as CUSTOMER.
 * - Strangers/admins from other stores who never interacted with Nexis are excluded.
 *
 * @param {Array} rawUsers
 * @param {{ ids: Set<string>, emails: Set<string> }} customerLookup
 * @returns {Array}
 */
export function filterNexisUsers(rawUsers = [], customerLookup) {
  if (!Array.isArray(rawUsers)) return []

  return rawUsers
    .filter((u) => {
      if (isNexisStaffUser(u)) return true
      if (isNexisCustomer(u, customerLookup)) return true
      return false
    })
    .map((u) => {
      const isStaff = isNexisStaffUser(u)
      return {
        ...u,
        role: isStaff ? 'ADMIN' : 'CUSTOMER',
        isNexisStaff: isStaff,
      }
    })
}
