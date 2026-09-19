/**
 * Wishlist Page Placeholder
 * Route: /wishlist
 * To be implemented by feature team.
 */
// export default function WishlistPage() {
//   return (
//     <div className="py-16 text-center text-text-secondary dark:text-slate-400">
//       <h1 className="text-xl font-heading font-bold text-primary-dark dark:text-text-light mb-2">
//         Wishlist Page
//       </h1>
//       <p className="text-xs">Route: /wishlist — To be implemented by team</p>
//     </div>
//   )
// }


import { useDispatch, useSelector } from 'react-redux'
import {
  selectWishlistItems,
  selectWishlistCount,
  removeFromWishlistThunk,
  clearWishlistThunk,
} from '@/store/slices/wishlistSlice'
import { addToCartThunk } from '@/store/slices/cartSlice'

export default function WishlistPage() {
  const dispatch = useDispatch()
  const items = useSelector(selectWishlistItems)
  const count = useSelector(selectWishlistCount)

  const getId = (product) =>
    product._id || product.productId || product.id

  const handleAddToCart = (product) => {
    dispatch(
      addToCartThunk({
        ...product,
        productId: getId(product),
        quantity: 1,
      })
    )
  }

  const handleRemove = (product) => {
    dispatch(removeFromWishlistThunk(getId(product)))
  }


  const handleClear = () => {
    dispatch(clearWishlistThunk())
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
  

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              My Wishlist
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {count} {count === 1 ? 'product' : 'products'} saved
            </p>
          </div>

          {items.length > 0 && (
            <button
              onClick={handleClear}
              className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              Clear Wishlist
            </button>
          )}
        </div>

        {/* Empty Wishlist */}
        {items.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm">
            <div className="mb-4 text-5xl">♡</div>

            <h2 className="text-xl font-semibold text-slate-900">
              Your wishlist is empty
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Save products you like and find them here later.
            </p>
          </div>
        ) : (
          /* Products */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((product) => {
              const id = getId(product)

              return (
                <div
                  key={id}
                  className="overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md"
                >
                  {/* Product Image */}
                  <div className="aspect-square bg-gray-100">
                    {product.image || product.thumbnail ? (
                      <img
                        src={product.image || product.thumbnail}
                        alt={product.name || product.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Product Information */}
                  <div className="p-5">
                    <h2 className="truncate text-lg font-semibold text-slate-900">
                      {product.name || product.title || 'Product'}
                    </h2>

                    <p className="mt-2 text-lg font-bold text-[#C28723]">
                      ${Number(product.price || 0).toFixed(2)}
                    </p>

                    <div className="mt-5 flex gap-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 rounded-lg bg-[#1D3532] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#7A928D]"
                      >
                        Add to Cart
                      </button>

                      <button
                        onClick={() => handleRemove(product)}
                        className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
