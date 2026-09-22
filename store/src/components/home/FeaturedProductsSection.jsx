import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { ArrowRight, Loader2 } from 'lucide-react'

import ProductCard from '@/components/products/ProductCard'
import Pagination from '@/components/common/Pagination'
import {
  fetchFeaturedProducts,
  selectFeaturedProducts,
  selectFeaturedLoading,
} from '@/store/slices/productsSlice'

const PAGE_SIZE = 8

export default function FeaturedProductsSection() {
  const dispatch = useDispatch()
  const featuredProducts = useSelector(selectFeaturedProducts)
  const isLoading = useSelector(selectFeaturedLoading)
  const sliderRef = useRef(null)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    dispatch(fetchFeaturedProducts())
  }, [dispatch])


  // Auto-scroll on mobile only — cleanup on unmount
  useEffect(() => {
    const container = sliderRef.current
    if (!container || isLoading || featuredProducts.length === 0) return

    const tick = () => {
      if (window.innerWidth >= 768) return
      const cardWidth = (container.firstElementChild?.clientWidth ?? 260) + 24
      const maxScroll = container.scrollWidth - container.clientWidth
      if (container.scrollLeft >= maxScroll - 10) {
        container.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        container.scrollBy({ left: cardWidth, behavior: 'smooth' })
      }
    }

    const timer = setInterval(tick, 3000)
    return () => clearInterval(timer)
  }, [featuredProducts, isLoading])

  const totalPages = Math.max(1, Math.ceil(featuredProducts.length / PAGE_SIZE))
  const safePage = Math.min(currentPage, totalPages)
  const paginatedProducts = featuredProducts.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  )

  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-24 space-y-4 animate-in fade-in duration-500">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-10 h-10 rounded-full bg-accent-gold/10 dark:bg-primary-medium/20 blur-md animate-pulse" />
          <Loader2 className="w-8 h-8 text-text-gold dark:text-accent-gold animate-spin [animation-duration:1s] relative z-10" />
        </div>
        <h4 className="text-xs font-heading font-bold uppercase tracking-wider text-text-primary dark:text-text-light">
          Loading Featured Products
        </h4>
      </div>
    )
  }

  if (featuredProducts.length === 0) return null

  return (
    <section className="w-full py-12 bg-bg-main/5 dark:bg-transparent transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary dark:text-text-light">
              Featured Products
            </h2>
            <p className="text-xs text-text-secondary dark:text-slate-400 mt-1 font-body">
              Handpicked just for you
            </p>
          </div>
          <Link
            to="/products"
            className="flex items-center gap-1 text-xs font-heading font-bold text-primary-dark dark:text-accent-gold hover:underline transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Product Grid — scrollable on mobile, grid on desktop */}
        <div
          ref={sliderRef}
          className="flex overflow-x-auto md:grid md:grid-cols-3 lg:grid-cols-4 gap-6 pb-4 md:pb-0 scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {paginatedProducts.map((product) => (
            <div
              key={product._id || product.id}
              className="w-full max-sm:w-65 shrink-0 snap-center"
            >
              <ProductCard product={product} className="h-full" />
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={featuredProducts.length}
              pageSize={PAGE_SIZE}
              itemLabel="featured products"
              onPageChange={(page) => {
                setCurrentPage(page)
                sliderRef.current?.scrollTo({ left: 0 })
              }}
            />
          </div>
        )}
      </div>
    </section>
  )
}