import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Trash2, Minus, Plus } from 'lucide-react'
import { formatCurrency } from '@/utils/formatters'
import { extractProductImages, getCartItemId, getProductId } from '@/utils/productUtils'
import { selectProducts, fetchProductById } from '@/store/slices/productsSlice'

/**
 * CartItemRow Component
 * Renders a single cart item with responsive image, quantity stepper, price, and delete action.
 */
export default function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
  isUpdating = false,
}) {
  const dispatch = useDispatch()
  const catalogProducts = useSelector(selectProducts) || []
  const product = item?.product || item || {}
  const productId = item ? getCartItemId(item) : ''
  const catalogProduct = catalogProducts.find((p) => getProductId(p) === productId)
  const [fetchedStock, setFetchedStock] = useState(null)

  useEffect(() => {
    // If stock is not present in cart item or catalog, fetch live product stock
    if (
      item &&
      product.stock === undefined &&
      item.stock === undefined &&
      (!catalogProduct || catalogProduct.stock === undefined) &&
      productId
    ) {
      dispatch(fetchProductById(productId))
        .unwrap()
        .then((res) => {
          const p = res?.product || res?.data || res
          if (p && p.stock !== undefined) {
            setFetchedStock(Number(p.stock))
          }
        })
        .catch(() => {})
    }
  }, [dispatch, item, productId, product.stock, catalogProduct])

  if (!item) return null

  const itemId = item._id || item.id || ''
  const name = item.name || product.name || product.title || 'Product'
  const brand = product.brand || ''
  const category = product.category || product.categoryName || ''
  const price = Number(item.price ?? product.price ?? 0)
  const quantity = Number(item.quantity) || 1

  const rawStock =
    product.stock !== undefined && product.stock !== null
      ? product.stock
      : item.stock !== undefined && item.stock !== null
      ? item.stock
      : catalogProduct?.stock !== undefined && catalogProduct?.stock !== null
      ? catalogProduct.stock
      : fetchedStock

  // If rawStock is known (e.g. 5 or 0), use it; only fallback to 99 if completely undefined
  const stock =
    rawStock !== null && rawStock !== undefined && !isNaN(Number(rawStock))
      ? Number(rawStock)
      : 99

  const isMaxReached = quantity >= stock
  const itemTotal = price * quantity

  const images = extractProductImages(product)
  const currentImage = item.image || images[0] || ''

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 border-b border-border-light dark:border-primary-medium/30 last:border-b-0 hover:bg-bg-main/50 dark:hover:bg-primary-medium/10 transition-colors">
      {/* Product Image & Info */}
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <Link
          to={`/products/${productId}`}
          className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 overflow-hidden rounded-xl bg-bg-main dark:bg-dark-bg-main border border-border-light dark:border-primary-medium/40 p-2 flex items-center justify-center group"
        >
          <img
            src={currentImage}
            alt={name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
            loading="lazy"
          />
        </Link>

        <div className="min-w-0 flex-1">
          {category && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary dark:text-slate-400 font-heading">
              {brand ? `${brand} • ` : ''}{category}
            </span>
          )}

          <Link
            to={`/products/${productId}`}
            className="block text-sm sm:text-base font-heading font-bold text-primary-dark dark:text-text-light hover:text-accent-gold transition-colors line-clamp-1"
          >
            {name}
          </Link>

          <p className="mt-1 text-xs sm:text-sm font-semibold text-primary-dark dark:text-text-light">
            {formatCurrency(price)}
            <span className="text-[11px] font-normal text-text-secondary dark:text-slate-400 ml-1">
              each
            </span>
          </p>
        </div>
      </div>

      {/* Stepper, Subtotal, & Delete */}
      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border-light dark:border-primary-medium/20">
        {/* Quantity Stepper & Stock Limit Warning */}
        <div className="flex flex-col items-end sm:items-center">
          <div className="inline-flex items-center rounded-xl bg-bg-main dark:bg-dark-bg-main border border-border-medium dark:border-primary-medium/50 p-0.5">
            <button
              type="button"
              onClick={() =>
                onUpdateQuantity({
                  productId,
                  itemId,
                  quantity: Math.max(1, quantity - 1),
                  stock,
                })
              }
              disabled={quantity <= 1 || isUpdating}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:text-primary-dark dark:hover:text-white hover:bg-bg-card dark:hover:bg-primary-medium/30 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            <span className="w-9 text-center text-xs sm:text-sm font-bold font-heading text-primary-dark dark:text-text-light">
              {quantity}
            </span>

            <button
              type="button"
              onClick={() => {
                if (isMaxReached || isUpdating) return
                onUpdateQuantity({
                  productId,
                  itemId,
                  quantity: quantity + 1,
                  stock,
                })
              }}
              disabled={isMaxReached || isUpdating}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:text-primary-dark dark:hover:text-white hover:bg-bg-card dark:hover:bg-primary-medium/30 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              title={isMaxReached ? `Only ${stock} units available in stock` : 'Increase quantity'}
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {isMaxReached && stock < 99 && (
            <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 mt-1 font-heading">
              Max available ({stock})
            </span>
          )}
        </div>

        {/* Item Total Price */}
        <div className="text-right min-w-[90px]">
          <span className="block text-sm sm:text-base font-bold font-heading text-primary-dark dark:text-text-light">
            {formatCurrency(itemTotal)}
          </span>
        </div>

        {/* Remove Button */}
        <button
          type="button"
          onClick={() => onRemove({ productId, itemId })}
          disabled={isUpdating}
          className="p-2 rounded-lg text-text-secondary hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
          title="Remove from cart"
          aria-label="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
