import React, { useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, Layers, RotateCcw } from 'lucide-react'

import Button from '@/components/common/Button'
import Badge from '@/components/common/Badge'
import Dropdown from '@/components/common/Dropdown'
import Pagination from '@/components/common/Pagination'
import ProductCard from '@/components/products/ProductCard'
import ProductFilters from '@/components/products/ProductFilters'

import {
  fetchStoreProducts,
  selectProducts,
  selectProductsLoading,
  selectProductsError,
  selectCategoryCounts,
} from '@/store/slices/productsSlice'
import { ELECTRONICS_CATEGORIES, getEffectiveSubcategory } from '@/constants/categories'

const ITEMS_PER_PAGE = 12

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured Gear' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Customer Rating' },
  { value: 'newest', label: 'Newest Arrivals' },
]

/**
 * ProductsPage Component
 * Cohesive catalog page coordinating search, filtering, sorting, and pagination.
 */
export default function ProductsPage() {
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()

  const allProducts = useSelector(selectProducts)
  const isLoading = useSelector(selectProductsLoading)
  const error = useSelector(selectProductsError)
  const categoryCounts = useSelector(selectCategoryCounts)

  // Filter States initialized from URL params if present
  const initialSubcategory = searchParams.get('subcategory') || ''
  const initialSearch = searchParams.get('search') || searchParams.get('q') || ''
  const initialBrand = searchParams.get('brand') || ''

  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [selectedSubcategory, setSelectedSubcategory] = useState(initialSubcategory)
  const [selectedBrand, setSelectedBrand] = useState(initialBrand)
  const [sortBy, setSortBy] = useState('featured')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Sync URL search params when external navigation occurs
  useEffect(() => {
    const urlQuery = searchParams.get('search') || searchParams.get('q') || ''
    const urlSub = searchParams.get('subcategory') || ''
    const urlBrand = searchParams.get('brand') || ''

    if (urlQuery !== searchQuery) setSearchQuery(urlQuery)
    if (urlSub !== selectedSubcategory) setSelectedSubcategory(urlSub)
    if (urlBrand !== selectedBrand) setSelectedBrand(urlBrand)
  }, [searchParams])

  // Fetch catalog on initial load
  useEffect(() => {
    dispatch(fetchStoreProducts({ limit: 100 }))
  }, [dispatch])

  // Reset pagination whenever any filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedSubcategory, selectedBrand, sortBy, inStockOnly, minPrice, maxPrice])

  // Multi-Criteria Filtering & Sorting Logic
  const filteredProducts = useMemo(() => {
    let list = [...allProducts]

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      list = list.filter((p) => {
        const name = (p.name || p.title || '').toLowerCase()
        const brand = (p.brand || '').toLowerCase()
        const desc = (p.shortDescription || p.description || '').toLowerCase()
        const tags = Array.isArray(p.tags) ? p.tags.join(' ').toLowerCase() : ''
        return name.includes(q) || brand.includes(q) || desc.includes(q) || tags.includes(q)
      })
    }

    if (selectedSubcategory) {
      list = list.filter(
        (p) => getEffectiveSubcategory(p) === selectedSubcategory.toLowerCase()
      )
    }

    if (selectedBrand) {
      list = list.filter(
        (p) => (p.brand || '').toLowerCase() === selectedBrand.toLowerCase()
      )
    }

    if (inStockOnly) {
      list = list.filter((p) => Number(p.stock ?? 10) > 0)
    }

    const min = parseFloat(minPrice)
    const max = parseFloat(maxPrice)
    if (!Number.isNaN(min)) {
      list = list.filter((p) => Number(p.discountPrice || p.price || 0) >= min)
    }
    if (!Number.isNaN(max)) {
      list = list.filter((p) => Number(p.discountPrice || p.price || 0) <= max)
    }

    list.sort((a, b) => {
      const priceA = Number(a.discountPrice || a.price || 0)
      const priceB = Number(b.discountPrice || b.price || 0)
      const ratingA = Number(a.rating || a.averageRating || 0)
      const ratingB = Number(b.rating || b.averageRating || 0)

      switch (sortBy) {
        case 'price-asc':
          return priceA - priceB
        case 'price-desc':
          return priceB - priceA
        case 'rating':
          return ratingB - ratingA
        case 'newest': {
          const timeA = new Date(a.createdAt || 0).getTime()
          const timeB = new Date(b.createdAt || 0).getTime()
          return timeB - timeA
        }
        case 'featured':
        default:
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return 0
      }
    })

    return list
  }, [allProducts, searchQuery, selectedSubcategory, selectedBrand, inStockOnly, minPrice, maxPrice, sortBy])

  // Pagination Slicing
  const totalItems = filteredProducts.length
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE))
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredProducts, currentPage])

  // Handlers
  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedSubcategory('')
    setSelectedBrand('')
    setInStockOnly(false)
    setMinPrice('')
    setMaxPrice('')
    setSortBy('featured')
    setCurrentPage(1)
    setSearchParams({})
    if (allProducts.length === 0) {
      dispatch(fetchStoreProducts({ limit: 100 }))
    }
  }

  const handleSubcategoryClick = (sub) => {
    const nextSub = selectedSubcategory === sub ? '' : sub
    setSelectedSubcategory(nextSub)
    const newParams = new URLSearchParams(searchParams)
    if (nextSub) {
      newParams.set('subcategory', nextSub)
    } else {
      newParams.delete('subcategory')
    }
    setSearchParams(newParams)
  }

  const activeFilterCount = [
    Boolean(searchQuery),
    Boolean(selectedSubcategory),
    Boolean(selectedBrand),
    Boolean(inStockOnly),
    Boolean(minPrice !== ''),
    Boolean(maxPrice !== ''),
  ].filter(Boolean).length

  return (
    <main className="min-h-screen bg-bg-main pb-16 text-text-primary dark:bg-dark-bg-main">
      {/* 1. Header Hero Banner */}
      <section className="bg-bg-card/70 dark:bg-dark-bg-card/70 border-b border-border-light dark:border-primary-medium/25 py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent-gold font-heading">
                Nexis Tech Catalog
              </span>
              <span className="text-text-secondary">•</span>
              <span className="text-xs text-text-secondary">Official Hardware & Electronics</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-primary-dark dark:text-text-light tracking-tight">
              Explore Premium Electronics
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-text-secondary dark:text-slate-400 max-w-2xl">
              Authentic laptops, smartphones, gaming rigs, audio gear, and peripherals with official 2-year Egyptian warranty.
            </p>
          </div>

          <div className="flex items-center gap-2.5 bg-bg-main/60 dark:bg-dark-bg-main/60 border border-border-light dark:border-primary-medium/30 p-4 text-center rounded-2xl shrink-0 self-start md:self-auto">
           
            <div>
              <p className="text-xs font-bold font-heading text-primary-dark dark:text-text-light">
                {allProducts.length} Electronics
              </p>
              <p className="text-[10px] text-text-secondary">Live Verified Catalog</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Sticky Subcategory Pills */}
      <section className="border-b border-border-light/80 dark:border-primary-medium/20 bg-bg-card/40 dark:bg-dark-bg-card/40 sticky top-14 sm:top-16 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {ELECTRONICS_CATEGORIES.map((cat) => {
              const isSelected =
                (cat.id === 'all' && !selectedSubcategory) ||
                selectedSubcategory === cat.subcategory

              const count = cat.subcategory
                ? categoryCounts[cat.subcategory] || 0
                : categoryCounts.all || allProducts.length

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleSubcategoryClick(cat.subcategory)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold font-heading shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-accent-gold text-primary-dark shadow-xs'
                      : 'bg-bg-card dark:bg-dark-bg-card border border-border-light dark:border-primary-medium/25 text-text-secondary hover:text-text-primary dark:text-slate-300 dark:hover:text-white hover:border-accent-gold/50'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected
                        ? 'bg-primary-dark/20 text-primary-dark font-extrabold'
                        : 'bg-bg-main dark:bg-dark-bg-main text-text-secondary'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* 3. Catalog Layout (Sidebar + Grid) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Filters (Desktop Sidebar + Mobile Drawer) */}
          <ProductFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            inStockOnly={inStockOnly}
            setInStockOnly={setInStockOnly}
            activeFilterCount={activeFilterCount}
            onResetFilters={handleResetFilters}
            isMobileOpen={showMobileFilters}
            onCloseMobile={() => setShowMobileFilters(false)}
          />

          {/* Main Content Area */}
          <section className="lg:col-span-3 space-y-6">
            {/* Toolbar */}
            <div className="p-4 rounded-2xl bg-bg-card dark:bg-dark-bg-card border border-border-light dark:border-primary-medium/25 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-xs sm:text-sm font-semibold text-text-secondary dark:text-slate-400">
                  Showing{' '}
                  <span className="font-bold text-primary-dark dark:text-text-light font-heading">
                    {totalItems > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}
                  </span>
                  -
                  <span className="font-bold text-primary-dark dark:text-text-light font-heading">
                    {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}
                  </span>{' '}
                  of{' '}
                  <span className="font-bold text-accent-gold font-heading">
                    {totalItems}
                  </span>{' '}
                  products
                </p>
                {selectedSubcategory && (
                  <Badge variant="gold" size="sm" className="capitalize">
                    {selectedSubcategory}
                  </Badge>
                )}
                {selectedBrand && (
                  <Badge variant="info" size="sm">
                    {selectedBrand}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden flex items-center gap-1.5 cursor-pointer text-xs"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-accent-gold" />
                  <span>Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-accent-gold text-primary-dark text-[9px] font-bold flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>

                <div className="w-44 shrink-0">
                  <Dropdown
                    value={sortBy}
                    onChange={setSortBy}
                    options={SORT_OPTIONS}
                    ariaLabel="Sort Catalog"
                  />
                </div>
              </div>
            </div>

            {/* Skeletons while loading */}
            {isLoading && allProducts.length === 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="h-80 rounded-2xl bg-bg-card/50 dark:bg-dark-bg-card/50 border border-border-light dark:border-primary-medium/20 animate-pulse p-4 flex flex-col justify-between"
                  >
                    <div className="w-full aspect-square bg-border-light/60 dark:bg-primary-medium/20 rounded-xl" />
                    <div className="space-y-2 mt-3">
                      <div className="h-4 bg-border-light/80 dark:bg-primary-medium/30 rounded w-3/4" />
                      <div className="h-3 bg-border-light/60 dark:bg-primary-medium/20 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && totalItems === 0 && (
              <div className="p-12 sm:p-16 rounded-3xl border border-dashed border-border-medium/70 dark:border-primary-medium/30 bg-bg-card/50 dark:bg-dark-bg-card/50 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-accent-gold/15 text-accent-gold flex items-center justify-center mx-auto shadow-2xs">
                  <Layers className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-heading text-primary-dark dark:text-text-light">
                    {error ? 'Unable to load catalog' : 'No matching electronics found'}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-text-secondary dark:text-slate-400 max-w-md mx-auto">
                    {error
                      ? (typeof error === 'string' ? error : 'Failed to retrieve products from server. Please check your connection.')
                      : allProducts.length === 0
                      ? 'No electronics products are currently available in the live catalog.'
                      : 'Try adjusting your keyword search, clearing active brand/category filters, or expanding your price range.'}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="gold"
                  size="sm"
                  onClick={handleResetFilters}
                  className="cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                  {allProducts.length === 0 ? 'Reload Catalog' : 'Reset All Filters'}
                </Button>
              </div>
            )}

            {/* Product Cards Grid */}
            {totalItems > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product._id || product.id}
                    product={product}
                  />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalCount={totalItems}
                  pageSize={ITEMS_PER_PAGE}
                />
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
