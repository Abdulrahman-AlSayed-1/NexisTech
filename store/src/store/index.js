import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import productsReducer from './slices/productsSlice'
import cartReducer from './slices/cartSlice'
import wishlistReducer from './slices/wishlistSlice'
import ordersReducer from './slices/ordersSlice'
import uiReducer from './slices/uiSlice'
import checkoutReducer from './slices/checkoutSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    orders: ordersReducer,
    ui: uiReducer,
    checkout: checkoutReducer,
  },
})

export default store
