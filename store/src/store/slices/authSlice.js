import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  loginUser,
  sendRegisterOtp,
  logoutUser,
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp,
} from '@/api/auth'
import { updateUserProfile } from '@/api/user'

export const logoutThunk = createAsyncThunk(
  'auth/logoutUser',
  async (_, { dispatch }) => {
    try {
      await logoutUser()
    } catch {
      // Ignore network failure on logout
    } finally {
      dispatch(authSlice.actions.logout())
    }
  }
)

/**
 * Normalizes user data received from the backend API or localStorage.
 *
 * @param {object|null} user - Raw user record from backend or localStorage
 * @returns {object|null} Sanitized user record with clean avatar property
 */
const normalizeUser = (user) => {
  if (!user || typeof user !== 'object') return null

  const rawAvatar = typeof user.avatar === 'string' ? user.avatar.trim() : null
  const isDefaultAvatar = !rawAvatar || rawAvatar === 'default' || rawAvatar === 'none'

  return {
    ...user,
    avatar: isDefaultAvatar ? null : rawAvatar,
  }
}

export const updateAvatarThunk = createAsyncThunk(
  'auth/updateAvatar',
  async (avatarUrl, { getState, dispatch, rejectWithValue }) => {
    try {
      const { auth } = getState()
      const userId = auth.user?._id || auth.user?.id
      const finalAvatar = avatarUrl && avatarUrl.trim() ? avatarUrl.trim() : null
      // The backend Express PATCH handler uses `if (req.body.avatar) user.avatar = req.body.avatar`.
      // It completely ignores empty strings or null. To ensure MongoDB truly overwrites and clears
      // any previous avatar in database, we send 'default'.
      const payloadAvatar = finalAvatar || 'default'

      if (userId) {
        try {
          await updateUserProfile(userId, { avatar: payloadAvatar })
        } catch (err) {
          console.warn('Backend avatar update warning:', err)
        }
      }

      dispatch(authSlice.actions.updateUser({ avatar: finalAvatar }))
      return finalAvatar
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || 'Failed to update avatar'
      return rejectWithValue(message)
    }
  }
)

export const updateUserProfileThunk = createAsyncThunk(
  'auth/updateUserProfile',
  async (payload, { getState, dispatch, rejectWithValue }) => {
    try {
      const { auth } = getState()
      const userId = auth.user?._id || auth.user?.id
      if (userId) {
        try {
          await updateUserProfile(userId, payload)
        } catch (err) {
          console.warn('Backend user profile update warning:', err)
        }
      }
      dispatch(authSlice.actions.updateUser(payload))
      return payload
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to update profile'
      )
    }
  }
)

export const requestPasswordChangeOtpThunk = createAsyncThunk(
  'auth/requestPasswordChangeOtp',
  async ({ email, currentPassword }, { rejectWithValue }) => {
    try {
      await loginUser({ email, password: currentPassword })
      const data = await sendForgotPasswordOtp({ email })
      return data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Current password incorrect or failed to send OTP.'
      )
    }
  }
)

export const resendPasswordOtpThunk = createAsyncThunk(
  'auth/resendPasswordOtp',
  async ({ email }, { rejectWithValue }) => {
    try {
      const data = await sendForgotPasswordOtp({ email })
      return data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to resend verification code.'
      )
    }
  }
)

export const verifyPasswordChangeOtpThunk = createAsyncThunk(
  'auth/verifyPasswordChangeOtp',
  async ({ email, otp, newPassword }, { rejectWithValue }) => {
    try {
      const data = await verifyForgotPasswordOtp({ email, otp, newPassword })
      return data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Invalid or expired OTP code.'
      )
    }
  }
)

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
      const email = (userData?.email || '').trim().toLowerCase()
      if (email.endsWith('@nexis.com')) {
        return rejectWithValue(
          '@nexis.com email addresses are reserved for internal staff. Please use a personal email address.'
        )
      }
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
    return user ? normalizeUser(JSON.parse(user)) : null
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
      const normalized = normalizeUser(action.payload.user)
      state.user = normalized
      state.token = action.payload.token
      state.error = null
      state.registrationPendingEmail = null
      if (action.payload.token) {
        localStorage.setItem('token', action.payload.token)
      }
      if (normalized) {
        localStorage.setItem('user', JSON.stringify(normalized))
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
      const merged = normalizeUser({ ...state.user, ...action.payload })
      state.user = merged
      if (merged) {
        localStorage.setItem('user', JSON.stringify(merged))
      }
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
        const normalized = normalizeUser(action.payload.user)
        state.user = normalized
        state.token = action.payload.token
        state.error = null
        state.registrationPendingEmail = null
        if (action.payload.token) {
          localStorage.setItem('token', action.payload.token)
        }
        if (normalized) {
          localStorage.setItem('user', JSON.stringify(normalized))
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
