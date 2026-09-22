import { SlidersHorizontal, Search, X, RotateCcw } from 'lucide-react'
import Button from '@/components/common/Button'
import { ELECTRONICS_BRANDS } from '@/constants/categories'

/**
 * ProductFilters Component
 * Consolidates desktop filter sidebar and mobile drawer into a single cohesive unit.
 */
export default function ProductFilters({
  searchQuery,
  setSearchQuery,
  selectedBrand,
  setSelectedBrand,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  inStockOnly,
  setInStockOnly,
  activeFilterCount,
  onResetFilters,
  isMobileOpen,
  onCloseMobile,
}) {
  const filterBody = (
    <div className="space-y-5 text-xs">
      {/* Live Keyword Search */}
      <div className="space-y-1.5">
        <label
          htmlFor="filter-search-input"
          className="block font-bold uppercase tracking-wider text-text-secondary dark:text-slate-400 font-heading"
        >
          Keyword Search
        </label>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary/60" />
          <input
            id="filter-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="e.g. RTX 4080, OLED, Pro..."
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-border-medium/60 dark:border-primary-medium/30 bg-bg-card dark:bg-dark-bg-main text-text-primary dark:text-text-light focus:outline-none focus:ring-2 focus:ring-accent-gold/40"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Brand Selection */}
      <div className="space-y-2">
        <label className="block font-bold uppercase tracking-wider text-text-secondary dark:text-slate-400 font-heading">
          Manufacturer / Brand
        </label>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
          <label className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-bg-main/50 dark:hover:bg-dark-bg-main/50 cursor-pointer">
            <input
              type="radio"
              name="filter-brand"
              checked={selectedBrand === ''}
              onChange={() => setSelectedBrand('')}
              className="accent-accent-gold"
            />
            <span className="text-text-primary dark:text-text-light font-medium">
              All Brands
            </span>
          </label>
          {ELECTRONICS_BRANDS.map((b) => (
            <label
              key={b}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-bg-main/50 dark:hover:bg-dark-bg-main/50 cursor-pointer"
            >
              <input
                type="radio"
                name="filter-brand"
                checked={selectedBrand.toLowerCase() === b.toLowerCase()}
                onChange={() => setSelectedBrand(b)}
                className="accent-accent-gold"
              />
              <span className="text-text-primary dark:text-text-light font-medium">
                {b}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-2 pt-2 border-t border-border-light/70 dark:border-primary-medium/20">
        <label className="block font-bold uppercase tracking-wider text-text-secondary dark:text-slate-400 font-heading">
          Price Range (EGP)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl border border-border-medium/60 dark:border-primary-medium/30 bg-bg-card dark:bg-dark-bg-main text-text-primary dark:text-text-light focus:outline-none focus:ring-2 focus:ring-accent-gold/40"
          />
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl border border-border-medium/60 dark:border-primary-medium/30 bg-bg-card dark:bg-dark-bg-main text-text-primary dark:text-text-light focus:outline-none focus:ring-2 focus:ring-accent-gold/40"
          />
        </div>
      </div>

      {/* Stock Status */}
      <div className="pt-2 border-t border-border-light/70 dark:border-primary-medium/20">
        <label className="flex items-center gap-2.5 font-semibold text-primary-dark dark:text-text-light cursor-pointer select-none">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="w-4 h-4 rounded accent-accent-gold"
          />
          <span>In Stock Only</span>
        </label>
      </div>
    </div>
  )

  return (
    <>
      {/* 1. Desktop Sidebar */}
      <aside className="hidden lg:block lg:col-span-1 space-y-6">
        <div className="p-5 rounded-2xl bg-bg-card dark:bg-dark-bg-card border border-border-light dark:border-primary-medium/25 shadow-xs space-y-5 sticky top-36">
          <div className="flex items-center justify-between pb-3 border-b border-border-light dark:border-primary-medium/20">
            <div className="flex items-center gap-2 font-bold font-heading text-sm text-primary-dark dark:text-text-light">
              <SlidersHorizontal className="w-4 h-4 text-accent-gold" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-accent-gold text-primary-dark text-[10px] flex items-center justify-center font-bold font-heading">
                  {activeFilterCount}
                </span>
              )}
            </div>

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={onResetFilters}
                className="text-xs text-text-secondary hover:text-accent-gold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>

          {filterBody}
        </div>
      </aside>

      {/* 2. Mobile Modal Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs lg:hidden">
          <div className="w-full max-w-md bg-bg-card dark:bg-dark-bg-card rounded-2xl border border-border-medium dark:border-primary-medium/30 p-5 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border-light dark:border-primary-medium/20">
              <h3 className="text-sm font-bold font-heading text-primary-dark dark:text-text-light flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-accent-gold" />
                Filter Catalog
              </h3>
              <button
                type="button"
                onClick={onCloseMobile}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:text-text-primary cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {filterBody}

            <div className="flex gap-2 pt-3 border-t border-border-light dark:border-primary-medium/20">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onResetFilters}
                className="w-1/2 cursor-pointer"
              >
                Reset
              </Button>
              <Button
                type="button"
                variant="gold"
                size="sm"
                onClick={onCloseMobile}
                className="w-1/2 cursor-pointer"
              >
                Show Results
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
