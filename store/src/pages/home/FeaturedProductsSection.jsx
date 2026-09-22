import { useEffect, useRef  } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { ShoppingCart, Star, Heart, ArrowRight, Loader2  } from 'lucide-react'
import { toast } from 'react-toastify'
import { fetchFeaturedProducts, selectFeaturedProducts, selectProductsLoading } from '@/store/slices/productsSlice'
import { formatCurrency, calculateDiscountPercentage } from '@/utils/formatters'
import { addToCartThunk } from '@/store/slices/cartSlice'
import { addToWishlistThunk, selectWishlistIds, removeFromWishlistThunk } from '@/store/slices/wishlistSlice'

export default function FeaturedProductsSection() {
  const dispatch = useDispatch()
  const featuredProducts = useSelector(selectFeaturedProducts)
  const isLoading = useSelector(selectProductsLoading)
  const wishlistIds = useSelector(selectWishlistIds)
  const sliderFeature = useRef(null)
  
  useEffect(() => {
    dispatch(fetchFeaturedProducts())
  }, [dispatch])

 useEffect(() => {
    const container = sliderFeature.current
    if (!container || isLoading || featuredProducts.length === 0) return

    const handleAutoScroll = () => {
      if (window.innerWidth >= 768) return
      const cardWidth = container.firstElementChild?.clientWidth + 24 || 284
      const totalRemainingScroll = container.scrollWidth - container.clientWidth
      if (container.scrollLeft >= totalRemainingScroll - 10) {
        container.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        container.scrollBy({ left: cardWidth, behavior: 'smooth' })
      }
    }
    const autoSliderEffect = setInterval(handleAutoScroll, 3000)
    return () => clearInterval(autoSliderEffect)
  }, [featuredProducts, isLoading])

 const handleCartAction = (product) => {
  dispatch(addToCartThunk({ ...product, quantity: 1 }));
  toast((t) => (
      <div className="flex items-center justify-between w-full gap-3 font-heading">
        {/* الطرف الأيسر: أيقونة النجاح الخضراء متبوعة بالرسالة */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          <span className="text-xs font-bold text-white tracking-wide shrink-0">Added to cart</span>
        </div>
        </div>
    ),
   {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true, 
      closeButton: false,
      pauseOnHover: false,
      className: "!bg-[#1d2826] !min-h-0 !py-2 !px-4.5 !rounded-full !shadow-md !border !border-white/5 !w-fit !mx-auto",
    }
  );
};

const handleWishlistAction = (product) => {
  const prodId = product._id || product.id;
  const isCurrentlyFavorite = wishlistIds.has(prodId);
  if (isCurrentlyFavorite) {
    dispatch(removeFromWishlistThunk(prodId));
  } else {
    dispatch(addToWishlistThunk(product));
  }
  const textMessage = isCurrentlyFavorite ? 'Removed from wishlist' : 'Added to wishlist';
  toast((t) => (
      <div className="flex items-center justify-between w-full gap-3 font-heading">
        <div className="flex items-center gap-2 min-w-0">
          <div className={`w-2 h-2 rounded-full shrink-0 shadow-sm ${isCurrentlyFavorite ? 'bg-rose-500 shadow-rose-500/50' : 'bg-emerald-500 shadow-emerald-500/50'}`} />
          <span className="text-xs font-bold text-white tracking-wide shrink-0">{textMessage}</span>
        </div>
        </div>
    ),
    {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true, 
      closeButton: false,
      pauseOnHover: false,
      className: "!bg-[#1d2826] !min-h-0 !py-2 !px-4.5 !rounded-full !shadow-md !border !border-white/5 !w-fit !mx-auto",
    }
  );
};
if (isLoading) {
    return (
    <div className="w-full flex flex-col items-center justify-center py-24 space-y-4 animate-in fade-in duration-500">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-10 h-10 rounded-full bg-accent-gold/10 dark:bg-primary-medium/20 blur-md animate-pulse" />   
        <Loader2 className="w-8 h-8 text-text-gold dark:text-accent-gold animate-spin [animation-duration:1s] relative z-10" />
      </div>
      <div className="text-center space-y-1">
        <h4 className="text-xs font-heading font-bold uppercase tracking-wider text-text-primary dark:text-text-light">
          Loading Features Products
        </h4>
      </div>
    </div>
  )
}
const ratingStar = (averageRating, starIndex) => {
  const numericRating = Number(averageRating) || 0
  if (numericRating === 0) {
    return 'text-gray-200 fill-transparent dark:text-zinc-700'
  }
  const totalRating = Math.round(numericRating)
  if (starIndex < totalRating) {
    return 'fill-amber-400 text-amber-400'
  }
  return 'text-gray-200 fill-transparent dark:text-zinc-700'
}


return (
  <section className="w-full py-12 bg-bg-main/5 dark:bg-transparent transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary dark:text-text-light">
              Featured Products
            </h2>
            <p className="text-xs text-text-secondary dark:text-slate-400 mt-1">
              Handpicked just for you
            </p>
          </div>
          <Link to="/products" className="flex items-center gap-1 text-xs font-heading font-bold text-primary-dark dark:text-accent-gold hover:underline transition-colors">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div 
          ref={sliderFeature} 
          className="flex overflow-x-auto md:grid md:grid-cols-3 lg:grid-cols-4 gap-6 pb-4 md:pb-0 scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {featuredProducts.slice(0, 8).map((product) => {
            const prodId = product._id
            const isFavorite = wishlistIds.has(prodId)
            const discountPercent = calculateDiscountPercentage(product.discountPrice, product.price)
            const productImage = product.images?.[0]?.url || '/placeholder-product.png'
            return (
              <div 
                key={prodId}
                className="group w-full max-sm:w-65 shrink-0 snap-center bg-bg-card dark:bg-dark-bg-card rounded-2xl border border-border-light dark:border-primary-medium/10 p-3 shadow-xs hover:shadow-md hover:border-accent-gold dark:hover:border-accent-gold transition-all duration-300 flex flex-col relative"
              >
                <div className="w-full aspect-square rounded-xl bg-bg-main dark:bg-zinc-900/40 p-4 relative overflow-hidden shadow-2xs">
                  <div className="w-full h-full flex items-center justify-center overflow-hidden rounded-lg relative z-0">
                    <img 
                      src={productImage} 
                      alt={product.name}
                      className="max-w-full max-h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-110 transition-transform duration-500 pointer-events-none"
                    />
                  </div>

                  <span className="absolute top-2 left-2 z-10 px-2 py-0.5 text-[10px] font-heading font-bold uppercase tracking-wider rounded-md bg-blue-50 text-blue-600 dark:bg-primary-medium/20 dark:text-accent-gold pointer-events-none">
                    {product.subcategory || 'Electronics'}
                  </span>

                  {discountPercent && (
                    <span className="absolute top-2 right-9 z-10 px-2 py-0.5 text-[10px] font-heading font-bold rounded-md bg-red-50 text-red-500 border border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-transparent pointer-events-none">
                      -{discountPercent}%
                    </span>
                  )}

                  <button 
                    onClick={() => handleWishlistAction(product)}
                    className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-bg-card dark:bg-zinc-800 shadow-2xs border border-border-light dark:border-zinc-700 text-text-secondary hover:text-red-500 dark:hover:text-red-400 transition-all duration-300 cursor-pointer"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-red-500 text-red-500 border-transparent dark:fill-red-400 dark:text-red-400' : ''}`} />
                  </button>
                </div>

                <div className="mt-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h3 className="text-xs font-body font-bold text-text-primary dark:text-text-light line-clamp-1 group-hover:text-accent-gold transition-colors">
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-1 mt-1">
                    <div className="flex">
                      {[...Array(5)].map((star, i) => {
                        return (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${ratingStar(product.averageRating, i)}`} 
                          />
                        )
                      })}
                    </div>
                    <span className="text-[10px] text-text-secondary dark:text-slate-500 font-medium">
                      ({product.numReviews || 0})
                    </span>
                  </div>
                </div>

                  <div className="pt-1 flex items-baseline gap-2">
                    <span className="text-xs font-heading font-bold text-primary-dark dark:text-accent-gold">
                      {formatCurrency(product.discountPrice || product.price)}
                    </span>
                    
                    {discountPercent > 0 && (
                      <span className="text-[10px] font-heading font-medium text-text-secondary line-through">
                        {formatCurrency(product.price)}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleCartAction(product)} 
                  className="w-full mt-4 flex items-center justify-center gap-2 h-9 bg-primary-dark hover:bg-primary-medium dark:bg-accent-gold dark:text-primary-dark dark:hover:bg-accent-gold-hover text-white text-xs font-heading font-bold uppercase tracking-wider rounded-xl shadow-xs active:scale-98 transition-all duration-300 cursor-pointer"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
    )
  }