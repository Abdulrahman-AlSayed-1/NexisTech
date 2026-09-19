import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { Heart, Package, Trash2, RefreshCw, AlertCircle } from 'lucide-react'

import Button from '@/components/common/Button'
import Modal from '@/components/common/Modal'
import Pagination from '@/components/common/Pagination'
import WishlistCard from '@/components/wishlist/WishlistCard'
import {
  fetchWishlistThunk,
  clearWishlistThunk,
  selectWishlistItems,
  selectWishlistCount,
  selectWishlistLoading,
  selectWishlistError,
} from '@/store/slices/wishlistSlice'

const getProductId = (product) =>
  product?._id || product?.productId || product?.id

/**
 * WishlistPage Component
 * Displays customer's saved products with add-to-cart, remove, and clear actions.
 */
export default function WishlistPage() {
  const dispatch = useDispatch()

  const items = useSelector(selectWishlistItems)
  const count = useSelector(selectWishlistCount)
  const isLoading = useSelector(selectWishlistLoading)
  const error = useSelector(selectWishlistError)

  const [isClearModalOpen, setIsClearModalOpen] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const PAGE_SIZE = 8
  const totalPages = Math.ceil(items.length / PAGE_SIZE) || 1
  const safePage = Math.min(currentPage, totalPages)
  const paginatedItems = items.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  // Synchronize wishlist from server on mount
  useEffect(() => {
    dispatch(fetchWishlistThunk())
  }, [dispatch])

  const handleClearConfirm = async () => {
    try {
      setIsClearing(true)
      await dispatch(clearWishlistThunk()).unwrap()
      setIsClearModalOpen(false)
      toast.info('Wishlist cleared')
    } catch (err) {
      toast.error(err || 'Failed to clear wishlist')
    } finally {
      setIsClearing(false)
    }
  }

  return (
    <>
      <main className="min-h-screen bg-bg-main px-4 py-6 text-text-primary sm:px-6 sm:py-8 lg:px-10 lg:py-10 dark:bg-dark-bg-main">
        <div className="mx-auto w-full max-w-7xl">
          {/* Header */}
          <header className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-accent-gold font-heading">
                Saved Items
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold font-heading tracking-tight text-primary-dark dark:text-text-light">
                My Wishlist
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-text-secondary">
                {count} {count === 1 ? 'product' : 'products'} saved for later
              </p>
            </div>

            {!isLoading && items.length > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsClearModalOpen(true)}
              >
                <Trash2 className="mr-1.5 h-3.5 w-3.5 text-rose-500" />
                Clear Wishlist
              </Button>
            )}
          </header>

          {/* Loading Skeletons */}
          {isLoading && items.length === 0 && (
            <div
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              aria-live="polite"
            >
              {[1, 2, 3, 4].map((idx) => (
                <div
                  key={idx}
                  className="animate-pulse rounded-2xl border border-border-light dark:border-primary-medium/20 bg-bg-card dark:bg-dark-bg-card p-4 space-y-4"
                >
                  <div className="aspect-square w-full rounded-xl bg-bg-input" />
                  <div className="h-4 w-3/4 rounded bg-bg-input" />
                  <div className="h-5 w-1/3 rounded bg-bg-input" />
                  <div className="h-9 w-full rounded-xl bg-bg-input" />
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {!isLoading && error && items.length === 0 && (
            <div
              className="rounded-2xl border border-rose-200 bg-rose-50 dark:bg-rose-950/20 dark:border-rose-900/30 p-5 text-sm text-rose-700 dark:text-rose-400 flex items-center justify-between gap-4"
              role="alert"
            >
              <span>{error}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => dispatch(fetchWishlistThunk())}
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1" />
                Retry
              </Button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && items.length === 0 && !error && (
            <div className="rounded-3xl border border-border-light dark:border-primary-medium/25 bg-bg-card dark:bg-dark-bg-card px-6 py-12 sm:py-16 text-center shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-accent-gold/15 text-accent-gold flex items-center justify-center mx-auto mb-4 shadow-2xs">
                <Heart className="w-7 h-7 fill-accent-gold/30 text-accent-gold" />
              </div>

              <h2 className="text-lg sm:text-xl font-bold font-heading text-primary-dark dark:text-text-light">
                Your wishlist is empty
              </h2>

              <p className="mt-1.5 text-xs sm:text-sm text-text-secondary max-w-sm mx-auto">
                Explore our collection of premium hardware & electronics and save products you love.
              </p>

              <div className="mt-6 flex items-center justify-center">
                <Link to="/products">
                  <Button variant="gold" size="md">
                    <Package className="w-4 h-4 mr-2" />
                    Start Shopping
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Products Grid */}
          {items.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {paginatedItems.map((product, index) => (
                  <WishlistCard
                    key={getProductId(product) || `wishlist-item-${index}`}
                    product={product}
                  />
                ))}
              </div>

              {/* Pagination Controls (shown when > 10 items) */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={safePage}
                  totalPages={totalPages}
                  totalItems={items.length}
                  pageSize={PAGE_SIZE}
                  itemLabel="products"
                  onPageChange={(page) => {
                    setCurrentPage(page)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="mt-8 pt-6 border-t border-border-light/60 dark:border-primary-medium/20"
                />
              )}
            </>
          )}
        </div>
      </main>

      {/* Clear Wishlist Confirmation Modal */}
      <Modal
        isOpen={isClearModalOpen}
        onClose={() => {
          if (!isClearing) setIsClearModalOpen(false)
        }}
        title="Clear Wishlist"
        closeOnBackdrop={!isClearing}
        footer={
          <div className="flex items-center justify-end gap-2.5 w-full">
            <Button
              type="button"
              variant="secondary"
              size="md"
              disabled={isClearing}
              onClick={() => setIsClearModalOpen(false)}
            >
              Keep Wishlist
            </Button>

            <Button
              type="button"
              variant="danger"
              size="md"
              isLoading={isClearing}
              onClick={handleClearConfirm}
            >
              Yes, Clear All
            </Button>
          </div>
        }
      >
        <div className="flex items-start gap-3.5 py-1">
          <div className="w-9 h-9 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-text-primary dark:text-text-light font-heading">
              Remove all saved products?
            </p>
            <p className="text-xs text-text-secondary leading-relaxed">
              Are you sure you want to remove all items from your wishlist? This action cannot be undone.
            </p>
          </div>
        </div>
      </Modal>
    </>
  )
}
