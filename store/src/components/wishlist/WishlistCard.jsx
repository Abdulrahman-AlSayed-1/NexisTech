import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { ShoppingCart, Trash2, Package, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'

import Button from '@/components/common/Button'
import { formatCurrency } from '@/utils/formatters'
import { removeFromWishlistThunk } from '@/store/slices/wishlistSlice'
import { addToCartThunk } from '@/store/slices/cartSlice'
import { getProductId, extractProductImages } from '@/utils/productUtils'

/**
 * WishlistCard Component
 * Displays a single saved product with image carousel (up to multiple images),
 * title, price, add-to-cart, and remove actions.
 *
 * @param {{ product: object }} props
 */
export default function WishlistCard({ product }) {
  const dispatch = useDispatch()
  const [isAdding, setIsAdding] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (!product) return null

  const id = getProductId(product)
  const name = product?.name || product?.title || 'Product'
  const images = extractProductImages(product)
  const currentImage = images[currentImageIndex] || ''
  const price = Number(product?.price || 0)
  const category = product?.category || product?.categoryName || ''

  const handlePrevImage = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNextImage = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleAddToCart = async () => {
    try {
      setIsAdding(true)
      await dispatch(
        addToCartThunk({
          ...product,
          productId: id,
          quantity: 1,
        })
      ).unwrap()
      toast.success(`${name} added to cart!`)
    } catch (err) {
      toast.error(err || 'Failed to add item to cart')
    } finally {
      setIsAdding(false)
    }
  }

  const handleRemove = async () => {
    try {
      setIsRemoving(true)
      await dispatch(removeFromWishlistThunk(id)).unwrap()
      toast.info(`${name} removed from wishlist`)
    } catch (err) {
      toast.error(err || 'Failed to remove from wishlist')
    } finally {
      setIsRemoving(false)
    }
  }

  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border-light dark:border-primary-medium/25 bg-bg-card dark:bg-dark-bg-card p-4 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-accent-gold/60 dark:hover:border-accent-gold/60 hover:shadow-md">
      <div>
        {/* Product Image & Quick Remove */}
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-bg-input/40 dark:bg-dark-bg-main/60 border border-border-light/60 dark:border-primary-medium/20 select-none">
          <Link
            to={`/products/${id}`}
            className="flex h-full w-full items-center justify-center focus:outline-none"
            aria-label={`View details for ${name}`}
          >
            {currentImage ? (
              <img
                key={currentImageIndex}
                src={currentImage}
                alt={`${name} - view ${currentImageIndex + 1}`}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-primary-medium/60 dark:text-text-gold/60">
                <Package className="h-10 w-10" />
              </div>
            )}
          </Link>

          {/* Carousel Arrows (when product has multiple images) */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrevImage}
                aria-label="Previous product image"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-xs transition-all opacity-0 group-hover:opacity-100 hover:bg-black/85 hover:scale-110 cursor-pointer shadow-md"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleNextImage}
                aria-label="Next product image"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-xs transition-all opacity-0 group-hover:opacity-100 hover:bg-black/85 hover:scale-110 cursor-pointer shadow-md"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-2 inset-x-0 z-10 flex items-center justify-center pointer-events-none">
                <div className="flex items-center gap-1 rounded-full bg-black/45 px-2 py-0.5 backdrop-blur-xs pointer-events-auto">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setCurrentImageIndex(idx)
                      }}
                      aria-label={`View image ${idx + 1}`}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        currentImageIndex === idx
                          ? 'w-3.5 bg-accent-gold'
                          : 'w-1.5 bg-white/60 hover:bg-white'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Quick Remove Button */}
          <button
            type="button"
            onClick={handleRemove}
            disabled={isRemoving}
            aria-label={`Remove ${name} from wishlist`}
            title="Remove from wishlist"
            className="absolute right-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-lg bg-bg-card/90 dark:bg-dark-bg-card/90 text-text-secondary dark:text-text-light/70 shadow-xs backdrop-blur-xs transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 cursor-pointer disabled:opacity-50"
          >
            {isRemoving ? (
              <Loader2 className="h-4 w-4 animate-spin text-rose-500" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Product Details */}
        <div className="pt-3.5 space-y-1">
          {category && (
            <p className="text-[11px] font-bold uppercase tracking-wider text-accent-gold font-heading">
              {category}
            </p>
          )}

          <h2 className="line-clamp-2 text-sm font-semibold text-text-primary dark:text-text-light font-heading group-hover:text-accent-gold transition-colors">
            <Link to={`/products/${id}`} className="focus:outline-none hover:underline">
              {name}
            </Link>
          </h2>

          <p className="pt-1 text-base sm:text-lg font-bold font-heading text-primary-dark dark:text-text-gold">
            {formatCurrency(price)}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 mt-2 border-t border-border-light/70 dark:border-primary-medium/20">
        <Button
          type="button"
          variant="gold"
          size="sm"
          className="w-full"
          isLoading={isAdding}
          onClick={handleAddToCart}
        >
          <ShoppingCart className="mr-1.5 h-4 w-4" />
          Add to Cart
        </Button>
      </div>
    </article>
  )
}
