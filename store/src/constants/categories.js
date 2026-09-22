/**
 * Official category definitions for Nexis Tech:
 * Electronics & Hardware Store Only.
 */

export const ALLOWED_CATEGORIES = ['electronics', 'hardware']

export const ALLOWED_SUBCATEGORIES = [
  'laptops',
  'smartphones',
  'tablets',
  'audio',
  'gaming',
  'wearables',
  'cameras',
  'accessories',
]

export const ELECTRONICS_CATEGORIES = [
  { id: 'all', name: 'All Products', subcategory: '', path: '/products' },
  { id: 'laptops', name: 'Laptops & Computers', subcategory: 'laptops', path: '/products?subcategory=laptops' },
  { id: 'smartphones', name: 'Smartphones', subcategory: 'smartphones', path: '/products?subcategory=smartphones' },
  { id: 'tablets', name: 'Tablets & iPads', subcategory: 'tablets', path: '/products?subcategory=tablets' },
  { id: 'audio', name: 'Audio & Headphones', subcategory: 'audio', path: '/products?subcategory=audio' },
  { id: 'gaming', name: 'Gaming Gear', subcategory: 'gaming', path: '/products?subcategory=gaming' },
  { id: 'wearables', name: 'Smartwatches & Wearables', subcategory: 'wearables', path: '/products?subcategory=wearables' },
  { id: 'cameras', name: 'Cameras & Drones', subcategory: 'cameras', path: '/products?subcategory=cameras' },
  { id: 'accessories', name: 'Accessories & Peripherals', subcategory: 'accessories', path: '/products?subcategory=accessories' },
]

export const ELECTRONICS_BRANDS = [
  'Apple',
  'Samsung',
  'Sony',
  'Dell',
  'ASUS',
  'Bose',
  'Logitech',
  'Nintendo',
  'Microsoft',
  'Garmin',
  'Keychron',
  'DJI',
]

/**
 * Validates whether a product belongs to Nexis Tech's categories.
 *
 * @param {object} product
 * @returns {boolean}
 */
export function isElectronicsOrHardwareProduct(product) {
  if (!product || typeof product !== 'object') return false

  const category = (product.category || '').trim().toLowerCase()
  const subcategory = (product.subcategory || '').trim().toLowerCase()

  // Match official categories or subcategories
  if (
    ALLOWED_CATEGORIES.includes(category) ||
    ALLOWED_CATEGORIES.includes(subcategory) ||
    ALLOWED_SUBCATEGORIES.includes(subcategory) ||
    ALLOWED_SUBCATEGORIES.includes(category)
  ) {
    return true
  }

  // Match tags if specified
  if (Array.isArray(product.tags)) {
    return product.tags.some((tag) => {
      const t = String(tag).trim().toLowerCase()
      return ALLOWED_CATEGORIES.includes(t) || ALLOWED_SUBCATEGORIES.includes(t)
    })
  }

  return false
}

/**
 * Resolves the effective electronics subcategory for a product,
 * seamlessly mapping generic test subcategories (e.g. 'team-1-product', 'macbook')
 * to standard catalog taxonomies based on product name and keywords.
 *
 * @param {object} product
 * @returns {string}
 */
export function getEffectiveSubcategory(product) {
  if (!product) return ''
  const sub = (product.subcategory || '').trim().toLowerCase()
  if (ALLOWED_SUBCATEGORIES.includes(sub)) return sub

  const name = (product.name || product.title || '').toLowerCase()
  const cat = (product.category || '').toLowerCase()

  if (name.includes('headphone') || name.includes('airpods') || name.includes('quietcomfort') || name.includes('audio') || name.includes('earbud')) {
    return 'audio'
  }
  if (name.includes('macbook') || name.includes('laptop') || name.includes('xps') || name.includes('zephyrus')) {
    return 'laptops'
  }
  if (name.includes('iphone') || name.includes('galaxy s') || name.includes('smartphone') || (name.includes('phone') && !name.includes('headphone')) || cat.includes('phone')) {
    return 'smartphones'
  }
  if (name.includes('ipad') || name.includes('galaxy tab') || name.includes('tablet')) {
    return 'tablets'
  }
  if (name.includes('mouse') || name.includes('keyboard') || name.includes('charger') || name.includes('cable') || name.includes('case')) {
    return 'accessories'
  }
  if (name.includes('watch') || name.includes('band') || name.includes('wearable')) {
    return 'wearables'
  }
  if (name.includes('camera') || name.includes('drone')) {
    return 'cameras'
  }

  return sub
}

