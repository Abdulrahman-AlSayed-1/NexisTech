import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import {
  getCart,
  addToCartApi,
  updateCartItemApi,
  removeCartItemApi,
  applyCouponApi,
  removeCouponApi,
  clearCartApi,
} from '@/api/cart'
import { getCartItemId } from '@/utils/productUtils'

const getStoredCart = () => {
  try {
    const saved = localStorage.getItem('nexis_cart')
    if (saved) return JSON.parse(saved)
  } catch {
    // fallback
  }
  return { items: [], itemCount: 0, subtotal: 0, discount: 0, total: 0, couponCode: null }
}

const saveCart = (state) => {
  try {
    localStorage.setItem(
      'nexis_cart',
      JSON.stringify({
        items: state.items,
        itemCount: state.itemCount,
        subtotal: state.subtotal,
        discount: state.discount,
        total: state.total,
        couponCode: state.couponCode,
      })
    )
  } catch {
    // fallback
  }
}

const calculateTotals = (items = [], discount = 0) => {
  const subtotal = items.reduce((acc, item) => {
    const price = Number(item.price ?? item.product?.price ?? 0)
    const qty = Number(item.quantity) || 1
    return acc + price * qty
  }, 0)
  const count = items.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0)
  const discountVal = Number(discount) || 0
  const total = Math.max(0, subtotal - discountVal)
  return { subtotal, itemCount: count, discount: discountVal, total }
}


export const isMatchingItem = (item, target) => {
  if (!item || !target) return false
  const targetId = typeof target === 'object' ? getCartItemId(target) : target
  return getCartItemId(item) === targetId || item?._id === targetId
}

export const fetchCartThunk = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return null
      const data = await getCart()
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message)
    }
  }
)

export const addToCartThunk = createAsyncThunk(
  'cart/addToCart',
  async (itemData, { rejectWithValue, dispatch }) => {
    try {
      // Optimistically update local state with rich product metadata
      dispatch(cartSlice.actions.addToCart(itemData))
      const token = localStorage.getItem('token')
      if (token) {
        const prodId = getCartItemId(itemData)
        const data = await addToCartApi({
          productId: prodId,
          quantity: Math.max(1, Number(itemData.quantity) || 1),
        })
        return data
      }
      return { success: true, localOnly: true }
    } catch (err) {
      const errorMsg =
        err.response?.data?.errors?.join(', ') ||
        err.response?.data?.message ||
        err.message ||
        'Failed to add item to cart'
      return rejectWithValue(errorMsg)
    }
  }
)

export const updateCartItemThunk = createAsyncThunk(
  'cart/updateCartItem',
  async (itemData, { rejectWithValue, dispatch }) => {
    try {
      dispatch(cartSlice.actions.updateQuantity(itemData))
      const token = localStorage.getItem('token')
      if (token) {
        const prodId = getCartItemId(itemData)
        const data = await updateCartItemApi({
          productId: prodId,
          quantity: Math.max(1, Number(itemData.quantity) || 1),
        })
        return data
      }
      return { success: true, localOnly: true }
    } catch (err) {
      dispatch(fetchCartThunk())
      const errorMsg =
        err.response?.data?.errors?.join(', ') ||
        err.response?.data?.message ||
        err.message ||
        'Failed to update cart item'
      return rejectWithValue(errorMsg)
    }
  }
)

export const removeCartItemThunk = createAsyncThunk(
  'cart/removeCartItem',
  async (target, { rejectWithValue, dispatch }) => {
    try {
      const prodId = getCartItemId(target)

      // Optimistically remove from state immediately
      dispatch(cartSlice.actions.removeFromCart(target))

      const token = localStorage.getItem('token')
      if (token && prodId) {
        const data = await removeCartItemApi(prodId)
        return data
      }
      return { success: true, localOnly: true }
    } catch (err) {
      // Re-fetch to restore state if backend rejected
      dispatch(fetchCartThunk())
      const errorMsg =
        err.response?.data?.errors?.join(', ') ||
        err.response?.data?.message ||
        err.message ||
        'Failed to remove cart item'
      return rejectWithValue(errorMsg)
    }
  }
)

export const applyCouponThunk = createAsyncThunk(
  'cart/applyCoupon',
  async (couponCode, { rejectWithValue }) => {
    try {
      const cleanCode = String(couponCode).trim().toUpperCase()
      const data = await applyCouponApi(cleanCode)
      return {
        code: cleanCode,
        ...data,
      }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Invalid or expired coupon code'
      )
    }
  }
)

export const removeCouponThunk = createAsyncThunk(
  'cart/removeCoupon',
  async (_, { rejectWithValue }) => {
    try {
      const data = await removeCouponApi()
      return data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to remove coupon'
      )
    }
  }
)

export const clearCartThunk = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      dispatch(cartSlice.actions.clearCart())
      const token = localStorage.getItem('token')
      if (token) {
        const data = await clearCartApi()
        return data
      }
      return { success: true, localOnly: true }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message)
    }
  }
)

const initialData = getStoredCart()

const initialState = {
  items: initialData.items || [],
  itemCount: initialData.itemCount || 0,
  subtotal: initialData.subtotal || 0,
  discount: initialData.discount || 0,
  total: initialData.total || 0,
  couponCode: initialData.couponCode || null,
  isLoading: false,
  error: null,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action) => {
      const p = action.payload || {}
      state.items = p.items || []
      state.itemCount = p.itemCount || 0
      state.subtotal = p.subtotal || 0
      state.discount = p.discount || 0
      state.total = p.total || state.subtotal
      state.couponCode = p.couponCode || null
      saveCart(state)
    },
    addToCart: (state, action) => {
      const item = action.payload
      const prodId = getCartItemId(item)
      const existing = state.items.find((i) => isMatchingItem(i, prodId))
      if (existing) {
        existing.quantity += Number(item.quantity) || 1
      } else {
        state.items.push({
          ...item,
          productId: prodId,
          quantity: Number(item.quantity) || 1,
        })
      }
      const { subtotal, itemCount, total } = calculateTotals(state.items, state.discount)
      state.subtotal = subtotal
      state.itemCount = itemCount
      state.total = total
      saveCart(state)
    },
    removeFromCart: (state, action) => {
      const target = action.payload
      state.items = state.items.filter((i) => !isMatchingItem(i, target))
      const { subtotal, itemCount, total } = calculateTotals(state.items, state.discount)
      state.subtotal = subtotal
      state.itemCount = itemCount
      state.total = total
      saveCart(state)
    },
    updateQuantity: (state, action) => {
      const target = action.payload
      const item = state.items.find((i) => isMatchingItem(i, target))
      if (item) {
        item.quantity = Math.max(1, Number(target.quantity) || 1)
      }
      const { subtotal, itemCount, total } = calculateTotals(state.items, state.discount)
      state.subtotal = subtotal
      state.itemCount = itemCount
      state.total = total
      saveCart(state)
    },
    applyCoupon: (state, action) => {
      state.couponCode = action.payload.code
      state.discount = action.payload.discountAmount || 0
      state.total = Math.max(0, state.subtotal - state.discount)
      saveCart(state)
    },
    removeCoupon: (state) => {
      state.couponCode = null
      state.discount = 0
      state.total = state.subtotal
      saveCart(state)
    },
    clearCart: (state) => {
      state.items = []
      state.itemCount = 0
      state.subtotal = 0
      state.discount = 0
      state.total = 0
      state.couponCode = null
      saveCart(state)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartThunk.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchCartThunk.fulfilled, (state, action) => {
        state.isLoading = false
        const payload = action.payload?.cart || action.payload?.data || action.payload || {}
        if (payload.items) {
          state.items = payload.items
          if (payload.coupon) {
            state.couponCode = typeof payload.coupon === 'object' ? payload.coupon.code : payload.coupon
          }
          if (payload.discountAmount !== undefined) {
            state.discount = Number(payload.discountAmount)
          } else if (payload.discount !== undefined) {
            state.discount = Number(payload.discount)
          }
          const { subtotal, itemCount, total } = calculateTotals(state.items, state.discount)
          state.subtotal = payload.subtotal || subtotal
          state.itemCount = payload.itemCount || itemCount
          state.total = payload.total || total
          saveCart(state)
        }
      })
      .addCase(fetchCartThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(applyCouponThunk.fulfilled, (state, action) => {
        const payload = action.payload || {}
        state.couponCode = payload.code || payload.coupon?.code || state.couponCode
        state.discount = Number(payload.discountAmount ?? (payload.subtotal && payload.total ? payload.subtotal - payload.total : state.discount))
        if (payload.total !== undefined) {
          state.total = Number(payload.total)
        } else {
          state.total = Math.max(0, state.subtotal - state.discount)
        }
        if (payload.subtotal !== undefined) {
          state.subtotal = Number(payload.subtotal)
        }
        saveCart(state)
      })
      .addCase(removeCouponThunk.fulfilled, (state, action) => {
        state.couponCode = null
        state.discount = 0
        const payload = action.payload || {}
        if (payload.total !== undefined) {
          state.total = Number(payload.total)
        } else {
          state.total = state.subtotal
        }
        if (payload.subtotal !== undefined) {
          state.subtotal = Number(payload.subtotal)
        }
        saveCart(state)
      })
  },
})

export const {
  setCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  applyCoupon,
  removeCoupon,
  clearCart,
} = cartSlice.actions

export const selectCartItems = (state) => state.cart.items
export const selectCartCount = (state) => state.cart.itemCount
export const selectCartSubtotal = (state) => state.cart.subtotal
export const selectCartDiscount = (state) => state.cart.discount
export const selectCartTotal = (state) => state.cart.total
export const selectCartCoupon = (state) => state.cart.couponCode
export const selectCartLoading = (state) => state.cart.isLoading

// Memoized derived totals selector
export const selectCartTotals = createSelector(
  [selectCartSubtotal, selectCartCount, selectCartDiscount, selectCartTotal],
  (subtotal, itemCount, discount, total) => ({ subtotal, itemCount, discount, total })
)

export default cartSlice.reducer
