import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import {
  createOrder,
  getMyOrders,
  getMyOrderById,
  cancelOrder,
} from '@/api/orders'
import { extractAddressesFromOrders } from '@/utils/addressManager'

export const placeOrderThunk = createAsyncThunk(
  'orders/placeOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const data = await createOrder(orderData)
      return data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to place order'
      )
    }
  }
)

export const fetchMyOrdersThunk = createAsyncThunk(
  'orders/fetchMyOrders',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await getMyOrders(params)
      return data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to fetch orders'
      )
    }
  }
)

export const fetchMyOrderByIdThunk = createAsyncThunk(
  'orders/fetchMyOrderById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await getMyOrderById(id)
      return data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to fetch order details'
      )
    }
  }
)

export const cancelOrderThunk = createAsyncThunk(
  'orders/cancelOrder',
  async (id, { rejectWithValue }) => {
    try {
      const data = await cancelOrder(id)
      return { id, data }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to cancel order'
      )
    }
  }
)

const initialState = {
  orders: [],
  currentOrder: null,
  totalOrders: 0,
  totalPages: 1,
  currentPage: 1,
  isLoading: false,
  isPlacingOrder: false,
  error: null,
}

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null
    },
    clearOrderError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // placeOrderThunk
      .addCase(placeOrderThunk.pending, (state) => {
        state.isPlacingOrder = true
        state.error = null
      })
      .addCase(placeOrderThunk.fulfilled, (state, action) => {
        state.isPlacingOrder = false
        const order = action.payload?.order || action.payload?.data || action.payload
        state.currentOrder = order
        if (order?._id) {
          state.orders.unshift(order)
        }
      })
      .addCase(placeOrderThunk.rejected, (state, action) => {
        state.isPlacingOrder = false
        state.error = action.payload
      })

      // fetchMyOrdersThunk
      .addCase(fetchMyOrdersThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchMyOrdersThunk.fulfilled, (state, action) => {
        state.isLoading = false
        const payload = action.payload || {}
        state.orders = payload.orders || payload.data || (Array.isArray(payload) ? payload : [])
        state.totalOrders = payload.total ?? state.orders.length
        state.totalPages = payload.totalPages ?? payload.pages ?? 1
        state.currentPage = payload.currentPage ?? payload.page ?? 1
      })
      .addCase(fetchMyOrdersThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // fetchMyOrderByIdThunk
      .addCase(fetchMyOrderByIdThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchMyOrderByIdThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentOrder = action.payload?.order || action.payload?.data || action.payload
      })
      .addCase(fetchMyOrderByIdThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // cancelOrderThunk
      .addCase(cancelOrderThunk.fulfilled, (state, action) => {
        const { id } = action.payload
        const idx = state.orders.findIndex((o) => o._id === id)
        if (idx !== -1) {
          state.orders[idx].status = 'cancelled'
        }
        if (state.currentOrder?._id === id) {
          state.currentOrder.status = 'cancelled'
        }
      })
  },
})

export const { clearCurrentOrder, clearOrderError } = ordersSlice.actions

export const selectOrders = (state) => state.orders.orders
export const selectCurrentOrder = (state) => state.orders.currentOrder
export const selectOrdersLoading = (state) => state.orders.isLoading
export const selectIsPlacingOrder = (state) => state.orders.isPlacingOrder
export const selectOrdersCurrentPage = (state) => state.orders.currentPage
export const selectOrdersTotalPages = (state) => state.orders.totalPages
export const selectOrdersTotalCount = (state) => state.orders.totalOrders
export const selectOrdersError = (state) => state.orders.error

// Memoized order statistics selector
export const selectOrderStats = createSelector(
  [selectOrders],
  (orders) => {
    const stats = {
      total: orders.length,
      pending: 0,
      processing: 0,
      delivered: 0,
      cancelled: 0,
      totalSpent: 0,
    }

    for (const order of orders) {
      const status = (order.status || '').toLowerCase()
      if (stats[status] !== undefined) {
        stats[status] += 1
      }
      stats.totalSpent += Number(order.totalAmount || order.totalPrice || 0)
    }

    return stats
  }
)

// Memoized current order payment & cost summary selector
export const selectCurrentOrderSummary = createSelector(
  [selectCurrentOrder],
  (order) => {
    if (!order) {
      return {
        subtotal: 0,
        shippingFee: 0,
        tax: 0,
        discount: 0,
        total: 0,
      }
    }

    const subtotal = Number(order.subtotal) || 0
    const shippingFee = Number(order.shippingFee) || 0
    const tax = Number(order.tax) || 0
    const discount = Number(order.discount) || 0
    const total = Number(order.totalPrice) || (subtotal + shippingFee + tax - discount)

    return {
      subtotal,
      shippingFee,
      tax,
      discount,
      total,
    }
  }
)

/**
 * Memoized selector that extracts unique customer addresses from order history
 */
export const selectCustomerAddresses = createSelector(
  [selectOrders],
  (orders) => extractAddressesFromOrders(orders)
)

export default ordersSlice.reducer
