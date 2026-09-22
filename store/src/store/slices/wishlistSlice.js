import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import {
  getMyWishlist,
  addToWishlistApi,
  removeFromWishlistApi,
  clearWishlistApi,
} from '@/api/wishlist'
import { getProductId } from '@/utils/productUtils'

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
  async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return { wishlist: { products: getStoredWishlist() } }
      const data = await getMyWishlist()
      return data
    } catch {
      // Fallback to local stored wishlist if unauthenticated or network failure
      return { wishlist: { products: getStoredWishlist() } }
    }
  }
)

export const addToWishlistThunk = createAsyncThunk(
  'wishlist/addToWishlist',
  async (product, { rejectWithValue, dispatch }) => {
    try {
      dispatch(wishlistSlice.actions.addToWishlist(product))
      const token = localStorage.getItem('token')
      if (token) {
        const prodId = getProductId(product)
        const data = await addToWishlistApi(prodId)
        return data
      }
      return { success: true, localOnly: true }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to update wishlist')
    }
  }
)

export const removeFromWishlistThunk = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId, { rejectWithValue, dispatch }) => {
    try {
      const prodId = getProductId(productId)
      dispatch(wishlistSlice.actions.removeFromWishlist(prodId))
      const token = localStorage.getItem('token')
      if (token && prodId) {
        const data = await removeFromWishlistApi(prodId)
        return data
      }
      return { success: true, localOnly: true }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to remove from wishlist')
    }
  }
)

export const clearWishlistThunk = createAsyncThunk(
  'wishlist/clearWishlist',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      dispatch(wishlistSlice.actions.clearWishlist())
      const token = localStorage.getItem('token')
      if (token) {
        const data = await clearWishlistApi()
        return data
      }
      return { success: true, localOnly: true }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to clear wishlist')
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
      const p = action.payload || {}
      state.items = p.wishlist?.products || p.products || p || []
      state.totalProducts = state.items.length
      saveWishlist(state.items)
    },
    addToWishlist: (state, action) => {
      const product = action.payload
      const targetId = getProductId(product)
      const exists = state.items.some((i) => getProductId(i) === targetId)
      if (!exists) {
        state.items.push(product)
        state.totalProducts = state.items.length
        saveWishlist(state.items)
      }
    },
    removeFromWishlist: (state, action) => {
      const targetId = getProductId(action.payload)
      state.items = state.items.filter((i) => getProductId(i) !== targetId)
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
        const serverItems =
          payload.wishlist?.products ||
          payload.products ||
          payload.data ||
          (Array.isArray(payload) ? payload : [])
        state.items = serverItems
        state.totalProducts = serverItems.length
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
export const selectWishlistLoading = (state) => state.wishlist.isLoading
export const selectWishlistError = (state) => state.wishlist.error

// Memoized IDs set for fast membership checks
export const selectWishlistIds = createSelector(
  [selectWishlistItems],
  (items) => new Set(items.map(getProductId).filter(Boolean))
)

export const selectIsInWishlist = (productId) => (state) =>
  selectWishlistIds(state).has(productId)

export default wishlistSlice.reducer
