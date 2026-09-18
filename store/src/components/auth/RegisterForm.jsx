import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Phone, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import {
  registerThunk,
  selectAuthLoading,
  selectAuthError,
  clearAuthError,
} from '@/store/slices/authSlice'

const validateEgyptianPhone = (phone) =>
  /^(\+?20|0)?1[0125][0-9]{8}$/.test(String(phone || '').replace(/[\s-]/g, ''))

/**
 * RegisterForm Component
 * Captures user registration details, validates inputs, and requests an OTP code
 * via clean Redux async thunk integration.
 */
export default function RegisterForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isLoading = useSelector(selectAuthLoading)
  const serverError = useSelector(selectAuthError)

  const [form, setForm] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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

    if (form.password !== form.confirmPassword) {
      setLocalError('Passwords do not match.')
      return
    }
    if (form.password.length < 6) {
      setLocalError('Password must be at least 6 characters.')
      return
    }
    if (!validateEgyptianPhone(form.phone)) {
      setLocalError('Please enter a valid Egyptian mobile number (e.g. 01012345678 or +2010...).')
      return
    }

    const resultAction = await dispatch(
      registerThunk({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim(),
      })
    )

    if (registerThunk.fulfilled.match(resultAction)) {
      navigate('/verify-otp')
    }
  }

  const activeError = localError || serverError

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input
        label="Username"
        name="username"
        type="text"
        required
        icon={User}
        value={form.username}
        onChange={handleChange}
        placeholder="e.g. john_doe"
      />

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

      <Input
        label="Phone Number"
        name="phone"
        type="tel"
        required
        icon={Phone}
        value={form.phone}
        onChange={handleChange}
        placeholder="e.g. +201012345678"
        helperText="Egyptian mobile format: 010, 011, 012, or 015"
      />

      <Input
        label="Password"
        name="password"
        type={showPassword ? 'text' : 'password'}
        required
        icon={Lock}
        rightIcon={showPassword ? EyeOff : Eye}
        onRightIconClick={() => setShowPassword(!showPassword)}
        value={form.password}
        onChange={handleChange}
        placeholder="At least 6 characters"
      />

      <Input
        label="Confirm Password"
        name="confirmPassword"
        type={showConfirmPassword ? 'text' : 'password'}
        required
        icon={Lock}
        rightIcon={showConfirmPassword ? EyeOff : Eye}
        onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
        value={form.confirmPassword}
        onChange={handleChange}
        placeholder="Re-enter your password"
      />

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
        <span>Create Account</span>
        {!isLoading && <ArrowRight className="w-4 h-4" />}
      </Button>

      <p className="text-[11px] text-text-secondary dark:text-slate-400 text-center leading-relaxed">
        By registering, you agree to the{' '}
        <span className="text-primary-dark dark:text-text-light font-medium underline">
          Terms of Service
        </span>{' '}
        and Privacy Policy.
      </p>
    </form>
  )
}
