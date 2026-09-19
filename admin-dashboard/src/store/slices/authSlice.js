import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { loginAdmin, logoutAdmin } from '@/api/auth'

const getStoredToken = () => {
  try {
    const token = localStorage.getItem('token')
    if (!token || token === 'undefined' || token === 'null' || token.trim() === '') {
      return null
    }
    return token
  } catch {
    return null
  }
}

const getStoredUser = () => {
  try {
    const user = localStorage.getItem('user')
    if (!user || user === 'undefined' || user === 'null') {
      return null
    }
    const parsed = JSON.parse(user)
    const email = (parsed.email || '').trim().toLowerCase()
    const role = (parsed.role || '').toLowerCase()
    if (!email.endsWith('@nexis.com') || (role !== 'admin' && email !== 'admin@nexis.com')) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      return null
    }
    return parsed
  } catch {
    return null
  }
}

const initialToken = getStoredToken()
const initialUser = getStoredUser()

const initialState = {
  user: initialUser,
  token: initialUser ? initialToken : null,
  isAuthenticated: Boolean(initialUser && initialToken),
  isLoading: false,
  error: null,
}

// Async Thunk: Handles admin authentication via Redux
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await loginAdmin(credentials)
      const user = data?.user || {}
      const email = (user.email || '').trim().toLowerCase()
      const role = (user.role || '').toLowerCase()

      // Enforce Nexis Tech Admin boundary: Only @nexis.com admin accounts are permitted
      if (!email.endsWith('@nexis.com') || (role !== 'admin' && email !== 'admin@nexis.com')) {
        return rejectWithValue(
          'Access denied: Only authorized @nexis.com administrator accounts can access this portal.'
        )
      }

      return data
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Failed to sign in. Please verify your credentials.'
      return rejectWithValue(errorMessage)
    }
  }
)

// Async Thunk: Notifies backend POST /auth/logout and purges client session
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { dispatch }) => {
    try {
      await logoutAdmin()
    } catch (err) {
      console.warn('Backend logout call failed or unreachable:', err)
    } finally {
      dispatch(authSlice.actions.logout())
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    loginSuccess: (state, action) => {
      const user = action.payload?.user || {}
      const email = (user.email || '').trim().toLowerCase()
      const role = (user.role || '').toLowerCase()

      if (!email.endsWith('@nexis.com') || (role !== 'admin' && email !== 'admin@nexis.com')) {
        state.isLoading = false
        state.error =
          'Access denied: Only authorized @nexis.com administrator accounts can access this portal.'
        return
      }

      state.isLoading = false
      state.isAuthenticated = true
      state.user = action.payload.user
      state.token = action.payload.token
      state.error = null
      localStorage.setItem('token', action.payload.token)
      localStorage.setItem('user', JSON.stringify(action.payload.user))
    },
    loginFailure: (state, action) => {
      state.isLoading = false
      state.error = action.payload
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
    setUser: (state, action) => {
      state.user = action.payload
      localStorage.setItem('user', JSON.stringify(action.payload))
    },
  },
  extraReducers: (builder) => {
    builder
      // loginUser
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
        state.error = null
        if (action.payload.token) {
          localStorage.setItem('token', action.payload.token)
        }
        if (action.payload.user) {
          localStorage.setItem('user', JSON.stringify(action.payload.user))
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // logoutUser
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.isLoading = false
        state.error = null
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.isLoading = false
      })
  },
})

export const { loginStart, loginSuccess, loginFailure, logout, setUser } = authSlice.actions
export default authSlice.reducer
