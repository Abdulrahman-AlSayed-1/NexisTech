import axios from 'axios'

const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL !== 'https://e-commerce-api-3wara.vercel.app') {
    return import.meta.env.VITE_API_URL
  }
  // In production (Vercel), route through /api-proxy to bypass backend CORS whitelist restrictions
  if (import.meta.env.PROD) {
    return '/api-proxy'
  }
  return 'https://e-commerce-api-3wara.vercel.app'
}

const API_BASE_URL = getApiBaseUrl()

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

// Request Interceptor: Attach token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor: Pass response through or reject error to caller
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
)

export default api