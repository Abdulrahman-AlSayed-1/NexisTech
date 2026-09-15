import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import {
  getMyWishlist,
  addToWishlistApi,
  removeFromWishlistApi,
  clearWishlistApi,
} from '@/api/wishlist'

const getStoredWishlist = () => {
  try {
    const saved = localStorage.getItem('nexis_wishlist')
    if (saved) return JSON.parse(saved)
  } catch {
    // fallback
  }
  return []
}

const saveWishlist = (items) => {
  try {
    localStorage.setItem('nexis_wishlist', JSON.stringify(items))
  } catch {
    // fallback
  }
}

export const fetchWishlistThunk = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getMyWishlist()
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message)
    }
  }
)

export const addToWishlistThunk = createAsyncThunk(
  'wishlist/addToWishlist',
  async (product, { rejectWithValue, dispatch }) => {
    try {
      dispatch(wishlistSlice.actions.addToWishlist(product))
      const prodId = product._id || product.productId || product.id
      const data = await addToWishlistApi(prodId)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message)
    }
  }
)

export const removeFromWishlistThunk = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId, { rejectWithValue, dispatch }) => {
    try {
      dispatch(wishlistSlice.actions.removeFromWishlist(productId))
      const data = await removeFromWishlistApi(productId)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message)
    }
  }
)

export const clearWishlistThunk = createAsyncThunk(
  'wishlist/clearWishlist',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      dispatch(wishlistSlice.actions.clearWishlist())
      const data = await clearWishlistApi()
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message)
    }
  }
)

const stored = getStoredWishlist()

const initialState = {
  items: stored,
  totalProducts: stored.length,
  isLoading: false,
  error: null,
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setWishlist: (state, action) => {
      state.items = action.payload.products || action.payload || []
      state.totalProducts = state.items.length
      saveWishlist(state.items)
    },
    addToWishlist: (state, action) => {
      const product = action.payload
      const targetId = product._id || product.productId || product.id
      const exists = state.items.some(
        (i) => (i._id || i.productId || i.id) === targetId
      )
      if (!exists) {
        state.items.push(product)
        state.totalProducts = state.items.length
        saveWishlist(state.items)
      }
    },
    removeFromWishlist: (state, action) => {
      const productId = action.payload
      state.items = state.items.filter(
        (i) => (i._id || i.productId || i.id) !== productId
      )
      state.totalProducts = state.items.length
      saveWishlist(state.items)
    },
    clearWishlist: (state) => {
      state.items = []
      state.totalProducts = 0
      saveWishlist([])
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlistThunk.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchWishlistThunk.fulfilled, (state, action) => {
        state.isLoading = false
        const payload = action.payload || {}
        const items = payload.products || payload.data || (Array.isArray(payload) ? payload : [])
        state.items = items
        state.totalProducts = items.length
        saveWishlist(state.items)
      })
      .addCase(fetchWishlistThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const {
  setWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = wishlistSlice.actions

export const selectWishlistItems = (state) => state.wishlist.items
export const selectWishlistCount = (state) => state.wishlist.totalProducts

// Memoized IDs set for fast O(1) membership checks
export const selectWishlistIds = createSelector(
  [selectWishlistItems],
  (items) => new Set(items.map((i) => i._id || i.productId || i.id))
)

export const selectIsInWishlist = (productId) => (state) =>
  selectWishlistIds(state).has(productId)

export default wishlistSlice.reducer
