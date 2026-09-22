import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import {
  getStoreProducts,
  getFeaturedProducts,
  getProductById,
  searchProducts,
} from '@/api/products'
import { isElectronicsOrHardwareProduct, getEffectiveSubcategory } from '@/constants/categories'

export const fetchStoreProducts = createAsyncThunk(
  'products/fetchStoreProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = { limit: 100, ...params }
      const data = await getStoreProducts(queryParams)
      return data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to fetch products'
      )
    }
  }
)

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeaturedProducts',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getFeaturedProducts()
      return data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to fetch featured products'
      )
    }
  }
)

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await getProductById(id)
      return data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to fetch product details'
      )
    }
  }
)

export const searchProductsThunk = createAsyncThunk(
  'products/searchProducts',
  async (query, { rejectWithValue }) => {
    try {
      const data = await searchProducts(query)
      return data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to search products'
      )
    }
  }
)

const initialState = {
  items: [],
  featuredItems: [],
  selectedProduct: null,
  searchResults: [],
  totalItems: 0,
  totalPages: 1,
  currentPage: 1,
  isLoading: false,
  isFeaturedLoading: false,
  isDetailLoading: false,
  isSearchLoading: false,
  error: null,
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null
    },
    clearSearchResults: (state) => {
      state.searchResults = []
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchStoreProducts
      .addCase(fetchStoreProducts.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchStoreProducts.fulfilled, (state, action) => {
        state.isLoading = false
        const payload = action.payload || {}
        const rawProducts = payload.products || payload.data || (Array.isArray(payload) ? payload : [])
        // Strictly filter to ensure store isolation: Nexis Tech is electronics & hardware only
        const filtered = rawProducts.filter(isElectronicsOrHardwareProduct)
        state.items = filtered
        state.totalItems = filtered.length
        state.totalPages = Math.max(1, Math.ceil(filtered.length / 12))
        state.currentPage = payload.currentPage || payload.page || 1
      })
      .addCase(fetchStoreProducts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // fetchFeaturedProducts
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.isFeaturedLoading = true
        state.error = null
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.isFeaturedLoading = false
        const payload = action.payload || {}
        const raw = payload.products || payload.data || (Array.isArray(payload) ? payload : [])
        state.featuredItems = raw.filter(isElectronicsOrHardwareProduct)
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.isFeaturedLoading = false
        state.error = action.payload
      })

      // fetchProductById
      .addCase(fetchProductById.pending, (state) => {
        state.isDetailLoading = true
        state.error = null
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isDetailLoading = false
        const product = action.payload?.product || action.payload?.data || action.payload
        state.selectedProduct = product
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isDetailLoading = false
        state.error = action.payload
      })

      // searchProductsThunk
      .addCase(searchProductsThunk.pending, (state) => {
        state.isSearchLoading = true
      })
      .addCase(searchProductsThunk.fulfilled, (state, action) => {
        state.isSearchLoading = false
        const payload = action.payload || {}
        const raw = payload.products || payload.data || (Array.isArray(payload) ? payload : [])
        state.searchResults = raw.filter(isElectronicsOrHardwareProduct)
      })
      .addCase(searchProductsThunk.rejected, (state) => {
        state.isSearchLoading = false
      })
  },
})

export const { clearSelectedProduct, clearSearchResults } = productsSlice.actions

// Selectors
export const selectProducts = (state) => state.products.items
export const selectFeaturedProducts = (state) => state.products.featuredItems
export const selectSelectedProduct = (state) => state.products.selectedProduct
export const selectProductsLoading = (state) => state.products.isLoading
export const selectFeaturedLoading = (state) => state.products.isFeaturedLoading
export const selectProductDetailLoading = (state) => state.products.isDetailLoading
export const selectProductsError = (state) => state.products.error
export const selectSearchResults = (state) => state.products.searchResults

// Memoized category counts selector
export const selectCategoryCounts = createSelector(
  [selectProducts],
  (products) => {
    const counts = { all: products.length }
    for (const p of products) {
      const sub = getEffectiveSubcategory(p)
      if (sub) {
        counts[sub] = (counts[sub] || 0) + 1
      }
    }
    return counts
  }
)

export default productsSlice.reducer
