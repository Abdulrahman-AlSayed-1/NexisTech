import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import {
  getCart,
  addToCartApi,
  updateCartItemApi,
  removeCartItemApi,
  applyCouponApi,
  clearCartApi,
} from '@/api/cart'

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

const calculateTotals = (items, discount = 0) => {
  const subtotal = items.reduce((acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0)
  const count = items.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0)
  const total = Math.max(0, subtotal - discount)
  return { subtotal, itemCount: count, total }
}

export const fetchCartThunk = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
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
      // Optimistically update
      dispatch(cartSlice.actions.addToCart(itemData))
      const data = await addToCartApi(itemData)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message)
    }
  }
)

export const updateCartItemThunk = createAsyncThunk(
  'cart/updateCartItem',
  async (itemData, { rejectWithValue, dispatch }) => {
    try {
      dispatch(cartSlice.actions.updateQuantity(itemData))
      const data = await updateCartItemApi(itemData)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message)
    }
  }
)

export const removeCartItemThunk = createAsyncThunk(
  'cart/removeCartItem',
  async (productId, { rejectWithValue, dispatch }) => {
    try {
      dispatch(cartSlice.actions.removeFromCart(productId))
      const data = await removeCartItemApi(productId)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message)
    }
  }
)

export const applyCouponThunk = createAsyncThunk(
  'cart/applyCoupon',
  async (couponCode, { rejectWithValue }) => {
    try {
      const data = await applyCouponApi(couponCode)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Invalid coupon code')
    }
  }
)

export const clearCartThunk = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      dispatch(cartSlice.actions.clearCart())
      const data = await clearCartApi()
      return data
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
      const prodId = item.productId || item._id || item.id
      const existing = state.items.find(
        (i) => (i.productId || i._id || i.id) === prodId
      )
      if (existing) {
        existing.quantity += item.quantity || 1
      } else {
        state.items.push({
          ...item,
          productId: prodId,
          quantity: item.quantity || 1,
        })
      }
      const { subtotal, itemCount, total } = calculateTotals(state.items, state.discount)
      state.subtotal = subtotal
      state.itemCount = itemCount
      state.total = total
      saveCart(state)
    },
    removeFromCart: (state, action) => {
      const productId = action.payload
      state.items = state.items.filter(
        (i) => (i.productId || i._id || i.id) !== productId
      )
      const { subtotal, itemCount, total } = calculateTotals(state.items, state.discount)
      state.subtotal = subtotal
      state.itemCount = itemCount
      state.total = total
      saveCart(state)
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload
      const item = state.items.find(
        (i) => (i.productId || i._id || i.id) === productId
      )
      if (item) {
        item.quantity = Math.max(1, quantity)
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
        state.couponCode = payload.code || state.couponCode
        state.discount = payload.discountAmount || state.discount
        state.total = Math.max(0, state.subtotal - state.discount)
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
  [selectCartItems, selectCartDiscount],
  (items, discount) => calculateTotals(items, discount)
)

export default cartSlice.reducer
