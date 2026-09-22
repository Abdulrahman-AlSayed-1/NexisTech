import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ArrowLeft, Trash2, ShoppingCart } from 'lucide-react'
import { toast } from 'react-toastify'

import CartItemRow from '@/components/cart/CartItemRow'
import CartOrderSummary from '@/components/cart/CartOrderSummary'
import CartCouponBox from '@/components/cart/CartCouponBox'
import CartEmptyState from '@/components/cart/CartEmptyState'

import {
  fetchCartThunk,
  updateCartItemThunk,
  removeCartItemThunk,
  applyCouponThunk,
  removeCouponThunk,
  removeCoupon,
  clearCartThunk,
  selectCartItems,
  selectCartTotals,
  selectCartDiscount,
  selectCartCoupon,
  selectCartLoading,
} from '@/store/slices/cartSlice'

/**
 * CartPage Component
 * Main shopping cart screen implementing clean Redux Toolkit state flow,
 * optimistic updates, and modular decomposition.
 */
export default function CartPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const items = useSelector(selectCartItems) || []
  const { subtotal, itemCount, discount, total } = useSelector(selectCartTotals)
  const directDiscount = useSelector(selectCartDiscount) || 0
  const effectiveDiscount = Number(discount || directDiscount || 0)
  const appliedCoupon = useSelector(selectCartCoupon)
  const isLoading = useSelector(selectCartLoading)

  useEffect(() => {
    dispatch(fetchCartThunk())
  }, [dispatch])

  const handleUpdateQuantity = (payload) => {
    dispatch(updateCartItemThunk(payload))
  }

  const handleRemoveItem = (target) => {
    dispatch(removeCartItemThunk(target))
  }

  const handleApplyCoupon = async (code) => {
    const actionResult = await dispatch(applyCouponThunk(code))
    if (applyCouponThunk.rejected.match(actionResult)) {
      const message = actionResult.payload || 'Invalid promo code'
      toast.error(message)
      return { error: message }
    } else {
      toast.success(`Coupon "${code}" applied successfully!`)
      return { success: true }
    }
  }

  const handleRemoveCoupon = async () => {
    try {
      await dispatch(removeCouponThunk()).unwrap()
      toast.info('Coupon removed')
    } catch {
      dispatch(removeCoupon())
      toast.info('Coupon removed')
    }
  }

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to remove all items from your cart?')) {
      dispatch(clearCartThunk())
    }
  }

  const handleProceedToCheckout = () => {
    navigate('/checkout')
  }

  const isEmpty = items.length === 0

  return (
    <main className="min-h-screen bg-bg-main dark:bg-dark-bg-main py-8 sm:py-12 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header & Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider mb-1 font-heading">
              <Link to="/products" className="hover:text-primary-dark dark:hover:text-white flex items-center gap-1 transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" />
                Continue Shopping
              </Link>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-primary-dark dark:text-text-light flex items-center gap-3">
              <ShoppingCart className="w-7 h-7 text-accent-gold shrink-0" />
              Shopping Cart
              {!isEmpty && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-accent-gold/15 text-accent-gold">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </span>
              )}
            </h1>
          </div>

          {!isEmpty && (
            <button
              type="button"
              onClick={handleClearCart}
              className="text-xs font-semibold text-text-secondary dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1.5 self-start sm:self-auto px-3 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Cart
            </button>
          )}
        </div>

        {/* Content Area */}
        {isEmpty ? (
          <div className="bg-bg-card dark:bg-dark-bg-card rounded-3xl border border-border-light dark:border-primary-medium/30 p-8 shadow-2xs">
            <CartEmptyState />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column: Cart Items List & Coupon Box */}
            <div className="lg:col-span-2 space-y-6">
              <div className="overflow-hidden rounded-2xl border border-border-light dark:border-primary-medium/30 bg-bg-card dark:bg-dark-bg-card shadow-2xs">
                <div className="p-4 sm:p-5 border-b border-border-light dark:border-primary-medium/20 flex items-center justify-between">
                  <h2 className="font-heading text-sm font-bold text-primary-dark dark:text-text-light uppercase tracking-wider">
                    Cart Items ({itemCount})
                  </h2>
                  <span className="text-xs text-text-secondary dark:text-slate-400">
                    Prices include standard taxes
                  </span>
                </div>

                <div>
                  {items.map((item, index) => {
                    const key = item.productId || item.product?._id || item._id || item.id || `cart-item-${index}`
                    return (
                      <CartItemRow
                        key={key}
                        item={item}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemove={handleRemoveItem}
                        isUpdating={isLoading}
                      />
                    )
                  })}
                </div>
              </div>

              {/* Coupon Box */}
              <CartCouponBox
                appliedCoupon={appliedCoupon}
                discountAmount={effectiveDiscount}
                onApplyCoupon={handleApplyCoupon}
                onRemoveCoupon={handleRemoveCoupon}
                isLoading={isLoading}
              />

              {/* Bottom Back to Products Link */}
              <div className="pt-2">
                <Link
                  to="/products"
                  className="inline-flex items-center text-sm font-bold text-primary-dark dark:text-text-light hover:text-accent-gold transition-colors font-heading"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Electronics Catalog
                </Link>
              </div>
            </div>

            {/* Right Column: Order Summary & Checkout */}
            <div className="lg:col-span-1 sticky top-24">
              <CartOrderSummary
                subtotal={subtotal}
                discount={effectiveDiscount}
                couponCode={appliedCoupon}
                shipping={0}
                total={total}
                itemCount={itemCount}
                onProceedToCheckout={handleProceedToCheckout}
                isLoading={isLoading}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
