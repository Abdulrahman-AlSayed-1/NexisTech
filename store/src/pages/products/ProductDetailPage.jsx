import React, { useEffect, useState, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
  Heart,
  ShoppingCart,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Minus,
  Plus,
  Share2,
  MessageSquare,
  Sparkles,
  Cpu,
  Layers,
  ArrowLeft,
} from 'lucide-react'

import Button from '@/components/common/Button'
import Rating from '@/components/common/Rating'
import ProductCard, {
  getProductId,
  extractProductImages,
} from '@/components/products/ProductCard'
import ProductReviewModal from '@/components/products/ProductReviewModal'

import { formatCurrency, calculateDiscountPercentage, formatDate } from '@/utils/formatters'
import {
  fetchProductById,
  fetchStoreProducts,
  clearSelectedProduct,
  selectSelectedProduct,
  selectProductDetailLoading,
  selectProductsError,
  selectProducts,
} from '@/store/slices/productsSlice'
import { addToCartThunk } from '@/store/slices/cartSlice'
import {
  addToWishlistThunk,
  removeFromWishlistThunk,
  selectWishlistIds,
} from '@/store/slices/wishlistSlice'
import { addProductReview } from '@/api/products'

/**
 * ProductDetailPage Component
 * Cohesive, production-grade product showcase page adhering to Nexis Tech standards.
 */
export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const product = useSelector(selectSelectedProduct)
  const isLoading = useSelector(selectProductDetailLoading)
  const error = useSelector(selectProductsError)
  const catalogProducts = useSelector(selectProducts)
  const wishlistIds = useSelector(selectWishlistIds)
  const currentUser = useSelector((state) => state.auth?.user)

  // Local UI states
  const [activeImageIdx, setActiveImageIdx] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isBuyingNow, setIsBuyingNow] = useState(false)
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  // Review modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)

  // Fetch product detail on mount or id change
  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id))
      setActiveImageIdx(0)
      setQuantity(1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    return () => {
      dispatch(clearSelectedProduct())
    }
  }, [dispatch, id])

  // Ensure catalog has items for related products recommendation
  useEffect(() => {
    if (catalogProducts.length === 0) {
      dispatch(fetchStoreProducts({ limit: 50 }))
    }
  }, [dispatch, catalogProducts.length])

  // Normalized product fields
  const productId = getProductId(product)
  const isFavorite = wishlistIds.has(productId)
  const name = product?.name || product?.title || 'Nexis Tech Device'
  const brand = product?.brand || 'Nexis Tech'
  const category = product?.category || 'Electronics'
  const subcategory = product?.subcategory || 'Hardware'
  const sku = product?.sku || `NX-${productId ? productId.slice(-6).toUpperCase() : '001'}`
  const description =
    product?.description ||
    'Engineered for maximum reliability and peak performance with cutting-edge tech architecture.'
  const shortDescription = product?.shortDescription || description.slice(0, 180) + '...'

  const price = Number(product?.price) || 0
  const discountPrice = Number(product?.discountPrice) || 0
  const hasDiscount = discountPrice > 0 && discountPrice < price
  const activePrice = hasDiscount ? discountPrice : price
  const discountPercent = hasDiscount
    ? calculateDiscountPercentage(discountPrice, price)
    : 0
  const savings = hasDiscount ? price - discountPrice : 0

  const stock = Number(product?.stock ?? 10)
  const isOutOfStock = stock <= 0
  const isLowStock = stock > 0 && stock <= 5
  const maxAllowedQuantity = Math.max(1, Math.min(stock, 10))

  const images = useMemo(() => extractProductImages(product), [product])
  const currentImage = images[activeImageIdx] || images[0]

  const rating = Number(product?.averageRating || product?.rating || 4.5)
  const reviews = Array.isArray(product?.reviews) ? product.reviews : []
  const reviewsCount = Number(product?.numReviews ?? reviews.length)

  // Related products from catalog
  const relatedProducts = useMemo(() => {
    if (!catalogProducts || catalogProducts.length === 0) return []
    return catalogProducts
      .filter((item) => {
        const itemPid = getProductId(item)
        if (itemPid === productId) return false
        return (
          item.subcategory === product?.subcategory ||
          item.category === product?.category
        )
      })
      .slice(0, 4)
  }, [catalogProducts, productId, product?.subcategory, product?.category])

  // Handlers
  const handleToggleWishlist = async () => {
    if (isTogglingWishlist || !product) return
    try {
      setIsTogglingWishlist(true)
      if (isFavorite) {
        await dispatch(removeFromWishlistThunk(productId)).unwrap()
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

  const handleAddToCart = async () => {
    if (isOutOfStock || isAddingToCart || !product) return
    try {
      setIsAddingToCart(true)
      await dispatch(
        addToCartThunk({
          ...product,
          productId,
          quantity,
        })
      ).unwrap()
      toast.success(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to your cart!`)
    } catch (err) {
      toast.error(err || 'Failed to add item to cart')
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleBuyNow = async () => {
    if (isOutOfStock || isBuyingNow || !product) return
    try {
      setIsBuyingNow(true)
      await dispatch(
        addToCartThunk({
          ...product,
          productId,
          quantity,
        })
      ).unwrap()
      navigate('/checkout')
    } catch (err) {
      toast.error(err || 'Failed to proceed to checkout')
      setIsBuyingNow(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: name,
          text: `Check out ${name} on Nexis Tech`,
          url: window.location.href,
        })
      } catch {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Product link copied to clipboard!')
    }
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!currentUser) {
      toast.warn('Please log in to submit a review.')
      navigate('/login')
      return
    }
    if (!reviewComment.trim()) {
      toast.error('Please write a brief review comment.')
      return
    }

    try {
      setIsSubmittingReview(true)
      await addProductReview(productId, {
        rating: reviewRating,
        comment: reviewComment.trim(),
      })
      toast.success('Review submitted successfully! Thank you for your feedback.')
      setIsReviewModalOpen(false)
      setReviewComment('')
      setReviewRating(5)
      dispatch(fetchProductById(productId))
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || 'Failed to submit review'
      )
    } finally {
      setIsSubmittingReview(false)
    }
  }

  // 1. Loading Skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-main dark:bg-dark-bg-main py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse space-y-8">
          <div className="h-4 w-64 bg-border-medium/40 dark:bg-primary-medium/20 rounded-md" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-6 space-y-4">
              <div className="w-full aspect-square bg-border-medium/30 dark:bg-primary-medium/20 rounded-3xl" />
              <div className="flex gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-20 h-20 bg-border-medium/30 dark:bg-primary-medium/20 rounded-xl" />
                ))}
              </div>
            </div>
            <div className="lg:col-span-6 space-y-6">
              <div className="h-4 w-28 bg-accent-gold/30 rounded-full" />
              <div className="h-8 w-3/4 bg-border-medium/40 dark:bg-primary-medium/20 rounded-lg" />
              <div className="h-5 w-40 bg-border-medium/30 dark:bg-primary-medium/20 rounded-md" />
              <div className="h-10 w-48 bg-border-medium/40 dark:bg-primary-medium/20 rounded-xl" />
              <div className="h-24 w-full bg-border-medium/20 dark:bg-primary-medium/10 rounded-xl" />
              <div className="h-12 w-full bg-border-medium/30 dark:bg-primary-medium/20 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 2. Error / 404 State
  if (error || (!isLoading && !product)) {
    return (
      <div className="min-h-[70vh] bg-bg-main dark:bg-dark-bg-main flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center p-8 rounded-3xl bg-bg-card dark:bg-dark-bg-card border border-border-light dark:border-primary-medium/20 shadow-xl">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-primary-dark dark:text-text-light mb-2">
            Product Not Found
          </h2>
          <p className="text-sm text-text-secondary dark:text-slate-400 mb-6">
            {error || 'The tech product you are searching for does not exist or has been discontinued.'}
          </p>
          <Link to="/products">
            <Button variant="gold" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Catalog
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-main dark:bg-dark-bg-main text-text-primary dark:text-text-light pb-16 transition-colors">
      {/* Top Breadcrumbs */}
      <div className="border-b border-border-light/80 dark:border-primary-medium/20 bg-bg-card/50 dark:bg-dark-bg-card/50 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <nav className="flex items-center flex-wrap gap-1.5 text-xs text-text-secondary dark:text-slate-400 font-medium">
            <Link to="/" className="hover:text-accent-gold transition-colors flex items-center gap-1">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-border-medium" />
            <Link to="/products" className="hover:text-accent-gold transition-colors">
              Catalog
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-border-medium" />
            <Link
              to={`/products?subcategory=${encodeURIComponent(subcategory.toLowerCase())}`}
              className="hover:text-accent-gold transition-colors capitalize"
            >
              {subcategory}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-border-medium" />
            <span className="text-primary-dark dark:text-text-light font-bold truncate max-w-[200px] sm:max-w-xs">
              {name}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        {/* Main Product Showcase (2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative w-full aspect-square rounded-3xl bg-bg-card dark:bg-dark-bg-card border border-border-light dark:border-primary-medium/20 p-6 sm:p-10 flex items-center justify-center overflow-hidden group shadow-xs hover:border-accent-gold/40 transition-all">
              {/* Badges Overlay */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 items-start">
                {hasDiscount && (
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-rose-500 text-white font-heading shadow-md animate-pulse">
                    -{discountPercent}% OFF
                  </span>
                )}
                {product?.featured && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-accent-gold text-primary-dark font-heading shadow-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Featured Flagship
                  </span>
                )}
              </div>

              {/* Floating Wishlist & Share */}
              <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  disabled={isTogglingWishlist}
                  aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110 cursor-pointer ${
                    isFavorite
                      ? 'bg-rose-50 dark:bg-rose-950/80 text-rose-500 ring-2 ring-rose-400'
                      : 'bg-bg-card/90 dark:bg-dark-bg-card/90 text-text-secondary hover:text-rose-500 border border-border-light dark:border-primary-medium/40'
                  }`}
                >
                  <Heart className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="Share product"
                  className="w-10 h-10 rounded-2xl bg-bg-card/90 dark:bg-dark-bg-card/90 text-text-secondary hover:text-accent-gold border border-border-light dark:border-primary-medium/40 flex items-center justify-center shadow-md hover:scale-110 transition-all cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              <img
                src={currentImage}
                alt={name}
                className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105 select-none"
              />
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-20 h-20 sm:w-22 sm:h-22 rounded-2xl p-2 bg-bg-card dark:bg-dark-bg-card border-2 shrink-0 transition-all cursor-pointer overflow-hidden flex items-center justify-center ${
                      activeImageIdx === idx
                        ? 'border-accent-gold ring-2 ring-accent-gold/20 shadow-md scale-105'
                        : 'border-border-light dark:border-primary-medium/30 hover:border-accent-gold/50 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`${name} ${idx + 1}`} className="max-w-full max-h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details & Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center justify-between gap-3 mb-2.5">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest bg-accent-gold/15 text-accent-gold border border-accent-gold/30 font-heading">
                  {brand}
                </span>
                <span className="text-xs font-mono text-text-secondary dark:text-slate-400">
                  SKU: {sku}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-primary-dark dark:text-text-light leading-tight">
                {name}
              </h1>

              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <Rating value={rating} size="md" showValue />
                <span className="text-border-medium">•</span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('reviews')
                    document.getElementById('details-tabs')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="text-xs font-semibold text-text-secondary dark:text-slate-400 hover:text-accent-gold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-accent-gold" />
                  {reviewsCount} {reviewsCount === 1 ? 'Customer Review' : 'Customer Reviews'}
                </button>
              </div>
            </div>

            {/* Apple-style Architecture: Clean, Structured Pricing & Availability Panel */}
            <div className="rounded-3xl bg-bg-card/70 dark:bg-dark-bg-card/70 border border-border-light dark:border-primary-medium/25 shadow-xs overflow-hidden backdrop-blur-xs">
              {/* Top Section: Price & Value Proposition */}
              <div className="p-5 sm:p-6 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3">
                  <div>
                    <div className="flex items-baseline gap-3 flex-wrap">
                      <span className="text-3xl sm:text-4xl font-extrabold font-heading text-primary-dark dark:text-text-light tracking-tight">
                        {formatCurrency(activePrice)}
                      </span>
                      {hasDiscount && (
                        <span className="text-base sm:text-lg text-text-secondary/70 dark:text-slate-400 line-through font-medium">
                          {formatCurrency(price)}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-text-secondary dark:text-slate-400 mt-1">
                      All taxes included • Official 2-year Egyptian authorized warranty
                    </p>
                  </div>

                  {hasDiscount && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold font-heading bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-2xs shrink-0 self-start sm:self-center">
                      <span>Save {formatCurrency(savings)}</span>
                      <span className="opacity-40">|</span>
                      <span className="font-extrabold">-{discountPercent}%</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Section: Availability & Fulfillment Strip */}
              <div className="px-5 sm:px-6 py-3.5 bg-bg-main/60 dark:bg-dark-bg-main/60 border-t border-border-light dark:border-primary-medium/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                {/* Stock State */}
                <div className="flex items-center gap-2.5">
                  {isOutOfStock ? (
                    <>
                      <div className="relative flex items-center justify-center shrink-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                        <span className="absolute w-4 h-4 rounded-full bg-rose-500/30 animate-ping" />
                      </div>
                      <p className="text-xs">
                        <span className="font-bold font-heading text-rose-600 dark:text-rose-400">
                          Out of Stock
                        </span>
                        <span className="text-text-secondary dark:text-slate-400 ml-1.5">
                          — Next official shipment arriving soon
                        </span>
                      </p>
                    </>
                  ) : isLowStock ? (
                    <>
                      <p className="text-xs">
                        <span className="font-bold font-heading text-amber-600 dark:text-amber-400">
                          Only {stock} units remaining
                        </span>
                        <span className="text-text-secondary dark:text-slate-400 ml-1.5">
                          — High demand in Cairo & Giza
                        </span>
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-center shrink-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      </div>
                      <p className="text-xs">
                        <span className="font-bold font-heading text-emerald-600 dark:text-emerald-400">
                          In Stock & Ready to Ship
                        </span>
                        <span className="text-text-secondary dark:text-slate-400 ml-1.5">
                          ({stock} units verified in warehouse)
                        </span>
                      </p>
                    </>
                  )}
                </div>

                {/* Fulfillment note */}
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-text-secondary dark:text-slate-400 shrink-0">
                  <Truck className="w-3.5 h-3.5 text-accent-gold" />
                  <span>Dispatches within 24h</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-text-secondary dark:text-slate-300 leading-relaxed">
              {shortDescription}
            </p>

            {/* Stepper and CTAs */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold font-heading uppercase text-text-secondary dark:text-slate-400">
                  Quantity
                </span>
                <div className="inline-flex items-center rounded-2xl bg-bg-card dark:bg-dark-bg-card border border-border-medium dark:border-primary-medium/40 p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-text-secondary hover:text-primary-dark dark:hover:text-white hover:bg-bg-main dark:hover:bg-primary-medium/20 disabled:opacity-30 cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-bold font-heading text-primary-dark dark:text-text-light">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(maxAllowedQuantity, q + 1))}
                    disabled={quantity >= maxAllowedQuantity || isOutOfStock}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-text-secondary hover:text-primary-dark dark:hover:text-white hover:bg-bg-main dark:hover:bg-primary-medium/20 disabled:opacity-30 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <Button
                  type="button"
                  variant="gold"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || isAddingToCart}
                  isLoading={isAddingToCart}
                  className="w-full justify-center shadow-md cursor-pointer font-bold text-sm"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>

                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  onClick={handleBuyNow}
                  disabled={isOutOfStock || isBuyingNow}
                  isLoading={isBuyingNow}
                  className="w-full justify-center shadow-md cursor-pointer font-bold text-sm bg-primary-dark hover:bg-primary-medium text-white"
                >
                  <Zap className="w-4 h-4 mr-2 text-accent-gold" />
                  Buy Now
                </Button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border-light/70 dark:border-primary-medium/20">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-bg-card/40 dark:bg-dark-bg-card/40 border border-border-light dark:border-primary-medium/15">
                <ShieldCheck className="w-5 h-5 text-accent-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold font-heading text-primary-dark dark:text-text-light">2-Year Warranty</h4>
                  <p className="text-[11px] text-text-secondary dark:text-slate-400">Official agency protection</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-bg-card/40 dark:bg-dark-bg-card/40 border border-border-light dark:border-primary-medium/15">
                <Truck className="w-5 h-5 text-accent-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold font-heading text-primary-dark dark:text-text-light">Express Delivery</h4>
                  <p className="text-[11px] text-text-secondary dark:text-slate-400">Fast domestic courier</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-bg-card/40 dark:bg-dark-bg-card/40 border border-border-light dark:border-primary-medium/15">
                <RotateCcw className="w-5 h-5 text-accent-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold font-heading text-primary-dark dark:text-text-light">14-Day Returns</h4>
                  <p className="text-[11px] text-text-secondary dark:text-slate-400">Free replacement policy</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-bg-card/40 dark:bg-dark-bg-card/40 border border-border-light dark:border-primary-medium/15">
                <CheckCircle2 className="w-5 h-5 text-accent-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold font-heading text-primary-dark dark:text-text-light">100% Genuine</h4>
                  <p className="text-[11px] text-text-secondary dark:text-slate-400">Direct factory sealed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Overview, Specs, Reviews */}
        <div id="details-tabs" className="mt-16 sm:mt-20">
          <div className="flex border-b border-border-light dark:border-primary-medium/30 gap-2 sm:gap-6 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`pb-4 text-sm sm:text-base font-bold font-heading transition-colors cursor-pointer border-b-2 -mb-px flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'border-accent-gold text-accent-gold'
                  : 'border-transparent text-text-secondary hover:text-text-primary dark:text-slate-400 dark:hover:text-text-light'
              }`}
            >
              <Cpu className="w-4 h-4" /> Overview & Features
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('specs')}
              className={`pb-4 text-sm sm:text-base font-bold font-heading transition-colors cursor-pointer border-b-2 -mb-px flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'specs'
                  ? 'border-accent-gold text-accent-gold'
                  : 'border-transparent text-text-secondary hover:text-text-primary dark:text-slate-400 dark:hover:text-text-light'
              }`}
            >
              <Layers className="w-4 h-4" /> Technical Specifications
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 text-sm sm:text-base font-bold font-heading transition-colors cursor-pointer border-b-2 -mb-px flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'reviews'
                  ? 'border-accent-gold text-accent-gold'
                  : 'border-transparent text-text-secondary hover:text-text-primary dark:text-slate-400 dark:hover:text-text-light'
              }`}
            >
              <MessageSquare className="w-4 h-4" /> Verified Reviews ({reviewsCount})
            </button>
          </div>

          {activeTab === 'overview' && (
            <div className="py-8 space-y-4 rounded-3xl bg-bg-card dark:bg-dark-bg-card border border-border-light dark:border-primary-medium/20 p-6 sm:p-8 mt-4">
              <h3 className="text-lg font-bold font-heading text-primary-dark dark:text-text-light">Product Overview</h3>
              <p className="text-sm text-text-secondary dark:text-slate-300 leading-relaxed whitespace-pre-line">{description}</p>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="py-8 mt-4 rounded-3xl bg-bg-card dark:bg-dark-bg-card border border-border-light dark:border-primary-medium/20 overflow-hidden">
              <table className="w-full text-left text-sm divide-y divide-border-light/70 dark:divide-primary-medium/20">
                <tbody>
                  <tr className="hover:bg-bg-main/30 dark:hover:bg-dark-bg-main/30"><td className="px-6 py-4 font-bold font-heading text-text-secondary dark:text-slate-400 w-1/3">Brand</td><td className="px-6 py-4 font-semibold text-primary-dark dark:text-text-light">{brand}</td></tr>
                  <tr className="hover:bg-bg-main/30 dark:hover:bg-dark-bg-main/30"><td className="px-6 py-4 font-bold font-heading text-text-secondary dark:text-slate-400">Category</td><td className="px-6 py-4 capitalize text-primary-dark dark:text-text-light">{category}</td></tr>
                  <tr className="hover:bg-bg-main/30 dark:hover:bg-dark-bg-main/30"><td className="px-6 py-4 font-bold font-heading text-text-secondary dark:text-slate-400">Subcategory</td><td className="px-6 py-4 capitalize text-primary-dark dark:text-text-light">{subcategory}</td></tr>
                  <tr className="hover:bg-bg-main/30 dark:hover:bg-dark-bg-main/30"><td className="px-6 py-4 font-bold font-heading text-text-secondary dark:text-slate-400">SKU Identifier</td><td className="px-6 py-4 font-mono text-primary-dark dark:text-text-light">{sku}</td></tr>
                  <tr className="hover:bg-bg-main/30 dark:hover:bg-dark-bg-main/30"><td className="px-6 py-4 font-bold font-heading text-text-secondary dark:text-slate-400">Available Stock</td><td className="px-6 py-4 text-primary-dark dark:text-text-light">{stock} Units</td></tr>
                  <tr className="hover:bg-bg-main/30 dark:hover:bg-dark-bg-main/30"><td className="px-6 py-4 font-bold font-heading text-text-secondary dark:text-slate-400">Warranty</td><td className="px-6 py-4 font-semibold text-emerald-600 dark:text-emerald-400">24 Months Authorized Agency</td></tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="py-8 space-y-6 mt-4">
              <div className="rounded-3xl bg-bg-card dark:bg-dark-bg-card border border-border-light dark:border-primary-medium/20 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="text-center sm:text-left">
                  <div className="text-4xl font-extrabold font-heading text-primary-dark dark:text-text-light">{rating.toFixed(1)}</div>
                  <Rating value={rating} size="md" className="mt-1" />
                  <p className="text-xs text-text-secondary dark:text-slate-400 mt-1">Based on {reviewsCount} customer reviews</p>
                </div>
                <Button type="button" variant="gold" onClick={() => setIsReviewModalOpen(true)} className="cursor-pointer">
                  <MessageSquare className="w-4 h-4 mr-2" /> Write a Customer Review
                </Button>
              </div>

              {reviews.length === 0 ? (
                <div className="text-center py-12 rounded-3xl bg-bg-card dark:bg-dark-bg-card border border-border-light dark:border-primary-medium/20 p-8">
                  <MessageSquare className="w-12 h-12 mx-auto text-accent-gold/50 mb-3" />
                  <h4 className="text-base font-bold font-heading text-primary-dark dark:text-text-light mb-1">No Reviews Yet</h4>
                  <p className="text-xs text-text-secondary dark:text-slate-400 max-w-sm mx-auto mb-4">Be the first customer to share your thoughts on this device!</p>
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsReviewModalOpen(true)}>Leave the First Review</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((rev, idx) => (
                    <div key={rev._id || idx} className="p-5 rounded-2xl bg-bg-card dark:bg-dark-bg-card border border-border-light dark:border-primary-medium/20 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-accent-gold/20 text-accent-gold font-heading font-bold text-xs flex items-center justify-center">
                            {(rev.username || rev.user?.username || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-primary-dark dark:text-text-light font-heading block">{rev.username || rev.user?.username || 'Verified Customer'}</span>
                            <span className="text-[10px] text-text-secondary dark:text-slate-400">{rev.createdAt ? formatDate(rev.createdAt) : 'Recent Purchase'}</span>
                          </div>
                        </div>
                        <Rating value={Number(rev.rating) || 5} size="sm" />
                      </div>
                      <p className="text-xs sm:text-sm text-text-secondary dark:text-slate-300 pt-1 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 sm:mt-24 pt-12 border-t border-border-light/80 dark:border-primary-medium/20">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-accent-gold font-heading block mb-1">Discover Similar Gear</span>
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-primary-dark dark:text-text-light">Related Hardware & Electronics</h2>
              </div>
              <Link to={`/products?subcategory=${encodeURIComponent(subcategory.toLowerCase())}`} className="text-xs font-bold text-accent-gold hover:underline flex items-center gap-1">
                View All {subcategory} <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((item) => (
                <ProductCard key={getProductId(item)} product={item} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Review Modal */}
      <ProductReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        rating={reviewRating}
        setRating={setReviewRating}
        comment={reviewComment}
        setComment={setReviewComment}
        isSubmitting={isSubmittingReview}
        onSubmit={handleSubmitReview}
      />
    </div>
  )
}
