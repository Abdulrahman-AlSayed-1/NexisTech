/**
 * Standardized Product Utilities
 * Centralizes ID resolution and image extraction across cards, detail pages, and lists.
 */

export const FALLBACK_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80'

/**
 * Extracts normalized product ID from raw or populated product objects
 * @param {object|string} product
 * @returns {string}
 */
export const getProductId = (product) => {
  if (!product) return ''
  if (typeof product === 'string') return product
  return product._id || product.productId || product.id || ''
}

/**
 * Extracts and sanitizes product image URLs into an array
 * Handles arrays of URLs, Cloudinary image objects ({ url, secure_url }), and single image strings.
 * @param {object} product
 * @returns {string[]}
 */
export const extractProductImages = (product) => {
  if (!product) return [FALLBACK_PRODUCT_IMAGE]

  // Flatten images array and single image property
  const raw = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.image].filter(Boolean)

  const urls = raw
    .map((img) => {
      if (!img) return null
      if (typeof img === 'string') return img
      if (typeof img === 'object') return img.url || img.secure_url || null
      return null
    })
    .filter(Boolean)

  return urls.length > 0 ? urls : [FALLBACK_PRODUCT_IMAGE]
}
