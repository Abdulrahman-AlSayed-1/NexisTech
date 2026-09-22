import api from './axios'

export const getCart = async () => {
  const response = await api.get('/carts')
  return response.data
}

export const addToCartApi = async ({ productId, quantity }) => {
  const response = await api.post('/carts/items', { productId, quantity })
  return response.data
}

export const updateCartItemApi = async ({ productId, quantity }) => {
  const response = await api.patch('/carts/items', { productId, quantity })
  return response.data
}

export const removeCartItemApi = async (productId) => {
  const response = await api.delete(`/carts/items/${productId}`)
  return response.data
}

export const applyCouponApi = async (couponCode) => {
  const response = await api.post('/carts/coupon', { code: couponCode })
  return response.data
}

export const removeCouponApi = async () => {
  const response = await api.delete('/carts/coupon')
  return response.data
}

export const clearCartApi = async () => {
  const response = await api.delete('/carts/clear')
  return response.data
}
