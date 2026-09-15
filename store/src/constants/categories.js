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
