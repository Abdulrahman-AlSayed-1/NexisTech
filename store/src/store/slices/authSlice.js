import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { loginUser, sendRegisterOtp } from '@/api/auth'

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await loginUser(credentials)
      if (!data.success && data.success !== undefined) {
        return rejectWithValue(data.message || 'Login failed')
      }
      return data
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || 'Invalid email or password.'
      return rejectWithValue(message)
    }
  }
)

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await sendRegisterOtp(userData)
      return { data, email: userData.email }
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || 'Something went wrong. Please try again.'
      return rejectWithValue(message)
    }
  }
)

const getStoredUser = () => {
  try {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  } catch {
    return null
  }
}

const initialState = {
  user: getStoredUser(),
  token: localStorage.getItem('token') || null,
  isAuthenticated: Boolean(localStorage.getItem('token')),
  isLoading: false,
  error: null,
  registrationPendingEmail: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    authSuccess: (state, action) => {
      state.isLoading = false
      state.isAuthenticated = true
      state.user = action.payload.user
      state.token = action.payload.token
      state.error = null
      state.registrationPendingEmail = null
      if (action.payload.token) {
        localStorage.setItem('token', action.payload.token)
      }
      if (action.payload.user) {
        localStorage.setItem('user', JSON.stringify(action.payload.user))
      }
    },
    authFailure: (state, action) => {
      state.isLoading = false
      state.error = action.payload
    },
    clearAuthError: (state) => {
      state.error = null
    },
    setRegistrationEmail: (state, action) => {
      state.registrationPendingEmail = action.payload
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.isLoading = false
      state.error = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload }
      localStorage.setItem('user', JSON.stringify(state.user))
    },
  },
  extraReducers: (builder) => {
    builder
      // Login Thunk
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
        state.error = null
        state.registrationPendingEmail = null
        if (action.payload.token) {
          localStorage.setItem('token', action.payload.token)
        }
        if (action.payload.user) {
          localStorage.setItem('user', JSON.stringify(action.payload.user))
        }
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Register Thunk
      .addCase(registerThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.error = null
        state.registrationPendingEmail = action.payload.email
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const {
  authStart,
  authSuccess,
  authFailure,
  clearAuthError,
  setRegistrationEmail,
  logout,
  updateUser,
} = authSlice.actions

// Selectors
export const selectCurrentUser = (state) => state.auth.user
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectAuthLoading = (state) => state.auth.isLoading
export const selectAuthError = (state) => state.auth.error
export const selectRegistrationPendingEmail = (state) => state.auth.registrationPendingEmail

export default authSlice.reducer
