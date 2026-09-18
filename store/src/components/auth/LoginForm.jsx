import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import {
  loginThunk,
  selectAuthLoading,
  selectAuthError,
  clearAuthError,
} from '@/store/slices/authSlice'

/**
 * LoginForm Component
 * Handles customer sign-in with clean Redux async thunk integration,
 * field validation, password visibility toggle, and design tokens.
 */
export default function LoginForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'
  const isLoading = useSelector(selectAuthLoading)
  const serverError = useSelector(selectAuthError)

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [localError, setLocalError] = useState('')

  // Clear server errors when navigating to this form or unmounting
  useEffect(() => {
    dispatch(clearAuthError())
    return () => {
      dispatch(clearAuthError())
    }
  }, [dispatch])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (localError) setLocalError('')
    if (serverError) dispatch(clearAuthError())
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')

    const cleanEmail = form.email.trim()
    const cleanPassword = form.password.trim()

    if (!cleanEmail || !cleanPassword) {
      setLocalError('Please enter both your email and password.')
      return
    }

    const resultAction = await dispatch(
      loginThunk({
        email: cleanEmail,
        password: cleanPassword,
      })
    )

    if (loginThunk.fulfilled.match(resultAction)) {
      navigate(from, { replace: true })
    }
  }

  const activeError = localError || serverError

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input
        label="Email Address"
        name="email"
        type="email"
        required
        icon={Mail}
        value={form.email}
        onChange={handleChange}
        placeholder="e.g. user@example.com"
      />

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="block text-xs font-bold text-primary-dark dark:text-text-light uppercase tracking-wider font-heading"
          >
            Password <span className="text-rose-500">*</span>
          </label>
          <Link
            to="/forgot-password"
            className="text-xs font-medium text-accent-gold hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <Input
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          required
          icon={Lock}
          rightIcon={showPassword ? EyeOff : Eye}
          onRightIconClick={() => setShowPassword(!showPassword)}
          value={form.password}
          onChange={handleChange}
          placeholder="Enter your password"
        />
      </div>

      {/* Remember session checkbox */}
      <div className="flex items-center justify-between text-xs text-text-secondary dark:text-slate-400 pt-0.5">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-border-medium dark:border-primary-medium/50 text-accent-gold focus:ring-accent-gold/40 cursor-pointer accent-accent-gold"
          />
          <span>Keep me signed in</span>
        </label>
      </div>

      {activeError && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 flex items-start gap-2.5 text-xs text-rose-600 dark:text-rose-400">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{activeError}</span>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        className="w-full flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
      >
        <span>Sign In to Account</span>
        {!isLoading && <ArrowRight className="w-4 h-4" />}
      </Button>
    </form>
  )
}
