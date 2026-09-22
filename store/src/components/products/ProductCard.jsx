import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Heart, ShoppingCart, Eye, ChevronLeft, ChevronRight, Check } from 'lucide-react'

import Button from '@/components/common/Button'
import Rating from '@/components/common/Rating'
import { toast } from 'react-toastify'
import { formatCurrency, calculateDiscountPercentage } from '@/utils/formatters'
import { getEffectiveSubcategory } from '@/constants/categories'
import { addToCartThunk } from '@/store/slices/cartSlice'
import {
  addToWishlistThunk,
  removeFromWishlistThunk,
  selectWishlistIds,
} from '@/store/slices/wishlistSlice'

/**
 * Extracts normalized product ID
 */
export const getProductId = (product) =>
  product?._id || product?.productId || product?.id

/**
 * Extracts and sanitizes product image URLs into an array
 */
export const extractProductImages = (product) => {
  const getImageUrl = (img) => {
    if (!img) return null
    if (typeof img === 'string') return img
    if (typeof img === 'object' && img !== null) {
      return img.url || img.secure_url || null
    }
    return null
  }

  const raw =
    Array.isArray(product?.images) && product.images.length > 0
      ? product.images
      : typeof product?.images === 'string' && product.images
        ? [product.images]
        : product?.image
          ? [product.image]
          : product?.thumbnail
            ? [product.thumbnail]
            : []

  const list = raw.map(getImageUrl).filter(Boolean)
  return list.length > 0
    ? list
    : ['https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80']
}

/**
 * ProductCard Component
 * Reusable product card compliant with Nexis Tech design tokens.
 * Features multi-image carousel, discount badge, star rating, stock indicator,
 * live Redux wishlist toggle, and one-click Add to Cart.
 *
 * @param {{
 *   product: object,
 *   className?: string
 * }} props
 */
export default function ProductCard({ product, className = '' }) {
  const dispatch = useDispatch()
  const wishlistIds = useSelector(selectWishlistIds)

  const [activeImageIdx, setActiveImageIdx] = useState(0)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false)
  const [imageError, setImageError] = useState(false)

  if (!product) return null

  const id = getProductId(product)
  const isFavorite = wishlistIds.has(id)

  const name = product.name || product.title || 'Electronics Product'
  const brand = product.brand || 'Nexis Tech'
  const subcategory = getEffectiveSubcategory(product) || product.subcategory || product.category || 'Hardware'
  const price = Number(product.price) || 0
  const discountPrice = Number(product.discountPrice) || 0
  const hasDiscount = discountPrice > 0 && discountPrice < price
  const activePrice = hasDiscount ? discountPrice : price
  const discountPercent = hasDiscount ? calculateDiscountPercentage(discountPrice, price) : 0

  const stock = Number(product.stock ?? 10)
  const isOutOfStock = stock <= 0
  const isLowStock = stock > 0 && stock <= 5

  const images = extractProductImages(product)
  const currentImage = images[activeImageIdx] || images[0]

  const rating = Number(product.rating || product.averageRating || 4.5)
  const reviewsCount = Number(product.numReviews || product.reviewsCount || (Array.isArray(product.reviews) ? product.reviews.length : 12))

  const handlePrevImage = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setActiveImageIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNextImage = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setActiveImageIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleToggleWishlist = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (isTogglingWishlist) return

    try {
      setIsTogglingWishlist(true)
      if (isFavorite) {
        await dispatch(removeFromWishlistThunk(id)).unwrap()
        toast.info(`${name} removed from wishlist`)
      } else {
        await dispatch(addToWishlistThunk(product)).unwrap()
        toast.success(`${name} saved to wishlist!`)
      }
    } catch (err) {
      toast.error(err || 'Failed to update wishlist')
    } finally {
      setIsTogglingWishlist(false)
    }
  }

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (isOutOfStock || isAddingToCart) return

    try {
      setIsAddingToCart(true)
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
      setIsAddingToCart(false)
    }
  }

  return (
    <div
      className={`group relative flex flex-col rounded-2xl bg-bg-card dark:bg-dark-bg-card border border-border-light dark:border-primary-medium/20 hover:border-accent-gold/60 transition-all duration-300 hover:shadow-lg overflow-hidden ${className}`}
    >
      {/* Top Image Container */}
      <div className="relative w-full aspect-square bg-bg-main/40 dark:bg-dark-bg-main/60 overflow-hidden flex items-center justify-center p-4">
        {/* Wishlist Floating Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          disabled={isTogglingWishlist}
          aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-xs transition-transform duration-200 hover:scale-110 cursor-pointer ${
            isFavorite
              ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-500 ring-1 ring-rose-300 dark:ring-rose-800'
              : 'bg-bg-card/90 dark:bg-dark-bg-card/90 text-text-secondary hover:text-rose-500 border border-border-light dark:border-primary-medium/30'
          }`}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite ? 'fill-rose-500 text-rose-500' : ''
            }`}
          />
        </button>

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
          {hasDiscount && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-500 text-white font-heading shadow-xs">
              -{discountPercent}% OFF
            </span>
          )}
          {product.featured && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-accent-gold text-primary-dark font-heading shadow-xs">
              Featured
            </span>
          )}
        </div>

        {/* Product Image Link */}
        <Link to={`/products/${id}`} className="w-full h-full flex items-center justify-center">
          <img
            src={imageError ? 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80' : currentImage}
            alt={name}
            onError={() => setImageError(true)}
            className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Multi-Image Hover Carousel Controls */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevImage}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-bg-card/80 dark:bg-dark-bg-card/80 text-text-primary dark:text-text-light flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-xs hover:bg-bg-card"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextImage}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-bg-card/80 dark:bg-dark-bg-card/80 text-text-primary dark:text-text-light flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-xs hover:bg-bg-card"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            {/* Dots */}
            <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1">
              {images.slice(0, 5).map((_, i) => (
                <span
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    activeImageIdx === i ? 'bg-accent-gold w-3' : 'bg-border-medium/60'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Brand & Subcategory Taxonomy */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-accent-gold font-heading truncate">
              {brand}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-text-secondary dark:text-slate-400 truncate">
              {subcategory}
            </span>
          </div>

          {/* Product Title */}
          <Link to={`/products/${id}`} className="block">
            <h3 className="text-sm sm:text-base font-bold font-heading text-primary-dark dark:text-text-light line-clamp-2 group-hover:text-accent-gold transition-colors leading-snug">
              {name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-2">
            <Rating value={rating} size="sm" />
            <span className="text-xs font-semibold text-text-secondary dark:text-slate-400">
              ({reviewsCount})
            </span>
          </div>
        </div>

        {/* Pricing and Cart Actions */}
        <div className="pt-3 border-t border-border-light/70 dark:border-primary-medium/20 space-y-3">
          {/* Price Tag & Stock Status */}
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-base sm:text-lg font-extrabold font-heading text-primary-dark dark:text-text-light">
                  {formatCurrency(activePrice)}
                </span>
                {hasDiscount && (
                  <span className="text-xs text-text-secondary line-through">
                    {formatCurrency(price)}
                  </span>
                )}
              </div>
            </div>

            {/* Stock indicator */}
            {isOutOfStock ? (
              <span className="text-[10px] font-bold text-rose-500 font-heading uppercase">
                Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="text-[10px] font-bold text-amber-500 font-heading uppercase">
                Only {stock} left
              </span>
            ) : (
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 font-heading uppercase flex items-center gap-0.5">
                <Check className="w-2.5 h-2.5" /> In Stock
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Link to={`/products/${id}`} className="w-full">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full cursor-pointer text-xs"
              >
                <Eye className="w-3.5 h-3.5 mr-1" />
                Details
              </Button>
            </Link>

            <Button
              type="button"
              variant="gold"
              size="sm"
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAddingToCart}
              isLoading={isAddingToCart}
              className="w-full cursor-pointer text-xs"
            >
              <ShoppingCart className="w-3.5 h-3.5 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
