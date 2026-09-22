import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  ShieldCheck,
} from 'lucide-react'
import { toast } from 'react-toastify'

import OtpInput from '@/components/common/OtpInput'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import {
  forgotPasswordSendOtpThunk,
  forgotPasswordVerifyOtpThunk,
  selectAuthLoading,
  selectAuthError,
  clearAuthError,
} from '@/store/slices/authSlice'

/**
 * ForgotPasswordForm Component
 * Two-phase credential recovery flow:
 * 1. Request Reset OTP: Enter registered email to generate verification code.
 * 2. Reset Password: Enter 6-digit code with live cooldown and choose new password.
 */
export default function ForgotPasswordForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isLoading = useSelector(selectAuthLoading)
  const serverError = useSelector(selectAuthError)

  const [step, setStep] = useState('email') // 'email' | 'reset'
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [countdown, setCountdown] = useState(0)
  const [isResending, setIsResending] = useState(false)
  const [localError, setLocalError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  // Clear server errors on mount & unmount
  useEffect(() => {
    dispatch(clearAuthError())
    return () => {
      dispatch(clearAuthError())
    }
  }, [dispatch])

  // Cooldown countdown timer
  useEffect(() => {
    if (countdown <= 0) return
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [countdown])

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')

    const cleanEmail = email.trim().toLowerCase()
    if (!cleanEmail) {
      setLocalError('Please enter your email address.')
      return
    }

    try {
      await dispatch(forgotPasswordSendOtpThunk({ email: cleanEmail })).unwrap()
      toast.success(`Verification code sent to ${cleanEmail}`)
      setStep('reset')
      setCountdown(60)
      setOtp('')
    } catch (err) {
      const msg = typeof err === 'string' ? err : err?.message || 'Failed to send reset code.'
      setLocalError(msg)
    }
  }

  const handleResendOtp = async () => {
    if (countdown > 0 || isResending) return
    const cleanEmail = email.trim().toLowerCase()
    if (!cleanEmail) return

    try {
      setIsResending(true)
      setLocalError('')
      await dispatch(forgotPasswordSendOtpThunk({ email: cleanEmail })).unwrap()
      toast.info(`A fresh code has been sent to ${cleanEmail}`)
      setCountdown(60)
      setOtp('')
    } catch (err) {
      const msg = typeof err === 'string' ? err : err?.message || 'Failed to resend code.'
      setLocalError(msg)
    } finally {
      setIsResending(false)
    }
  }

  const handleResetSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')

    const cleanEmail = email.trim().toLowerCase()
    const cleanOtp = otp.trim()

    if (cleanOtp.length !== 6) {
      setLocalError('Please enter the 6-digit verification code.')
      return
    }
    if (newPassword.length < 6) {
      setLocalError('New password must be at least 6 characters long.')
      return
    }
    if (newPassword !== confirmPassword) {
      setLocalError('Passwords do not match.')
      return
    }

    try {
      await dispatch(
        forgotPasswordVerifyOtpThunk({
          email: cleanEmail,
          otp: cleanOtp,
          newPassword,
        })
      ).unwrap()

      setIsSuccess(true)
      toast.success('Password reset successfully! Please sign in with your new credentials.')

      setTimeout(() => {
        navigate('/login', {
          replace: true,
          state: { prefilledEmail: cleanEmail, passwordResetSuccess: true },
        })
      }, 1500)
    } catch (err) {
      const msg = typeof err === 'string' ? err : err?.message || 'Invalid or expired reset code.'
      setLocalError(msg)
    }
  }

  const activeError = localError || serverError

  // Success view
  if (isSuccess) {
    return (
      <div className="py-8 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-heading font-extrabold text-primary-dark dark:text-text-light">
            Password Reset Complete
          </h3>
          <p className="text-xs text-text-secondary dark:text-slate-400">
            Your credentials have been securely updated. Redirecting to login...
          </p>
        </div>
      </div>
    )
  }

  // Phase 1: Request Code (Email only)
  if (step === 'email') {
    return (
      <form className="space-y-4" onSubmit={handleEmailSubmit}>
        <Input
          label="Registered Email Address"
          name="email"
          type="email"
          required
          icon={Mail}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (localError) setLocalError('')
            if (serverError) dispatch(clearAuthError())
          }}
          placeholder="e.g. user@example.com"
          helperText="Enter the email associated with your Nexis Tech account"
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
          <span>Send Verification Code</span>
          {!isLoading && <ArrowRight className="w-4 h-4" />}
        </Button>
      </form>
    )
  }

  // Phase 2: Enter OTP & Choose New Password
  return (
    <form className="space-y-4" onSubmit={handleResetSubmit}>
      {/* Target Email Banner with "Change" option */}
      <div className="p-3 rounded-2xl bg-bg-card/70 dark:bg-dark-bg-card/70 border border-border-light/90 dark:border-primary-medium/30 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1.5 rounded-lg bg-accent-gold/10 dark:bg-accent-gold/20 text-accent-gold shrink-0">
            <Mail className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-text-secondary dark:text-slate-400">
              Reset code sent to
            </p>
            <p className="text-xs font-bold font-mono text-primary-dark dark:text-text-light truncate">
              {email}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setStep('email')
            setLocalError('')
            dispatch(clearAuthError())
          }}
          className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium text-accent-gold hover:bg-accent-gold/10 transition-colors shrink-0 cursor-pointer"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>Change</span>
        </button>
      </div>

      {/* 6-Digit OTP Input */}
      <div className="space-y-1.5 py-1">
        <label className="block text-center text-xs font-bold text-primary-dark dark:text-text-light uppercase tracking-wider font-heading">
          Enter 6-Digit Reset Code
        </label>
        <OtpInput
          length={6}
          value={otp}
          onChange={(newVal) => {
            setOtp(newVal)
            if (localError) setLocalError('')
            if (serverError) dispatch(clearAuthError())
          }}
          disabled={isLoading}
          hasError={Boolean(activeError)}
          autoFocus
        />
      </div>

      {/* New Password Inputs */}
      <Input
        label="New Password"
        name="newPassword"
        type={showPassword ? 'text' : 'password'}
        required
        icon={Lock}
        rightIcon={showPassword ? EyeOff : Eye}
        onRightIconClick={() => setShowPassword(!showPassword)}
        value={newPassword}
        onChange={(e) => {
          setNewPassword(e.target.value)
          if (localError) setLocalError('')
          if (serverError) dispatch(clearAuthError())
        }}
        placeholder="At least 6 characters"
      />

      <Input
        label="Confirm New Password"
        name="confirmPassword"
        type={showConfirmPassword ? 'text' : 'password'}
        required
        icon={Lock}
        rightIcon={showConfirmPassword ? EyeOff : Eye}
        onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value)
          if (localError) setLocalError('')
          if (serverError) dispatch(clearAuthError())
        }}
        placeholder="Re-enter your new password"
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
        disabled={otp.length !== 6 || !newPassword || !confirmPassword}
        className="w-full flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
      >
        <span>Reset Password</span>
        {!isLoading && <KeyRound className="w-4 h-4" />}
      </Button>

      {/* Resend Cooldown Strip */}
      <div className="flex items-center justify-center gap-2 text-xs text-text-secondary dark:text-slate-400 pt-1">
        <span>Didn't get the code?</span>
        <button
          type="button"
          onClick={handleResendOtp}
          disabled={countdown > 0 || isResending}
          className={`inline-flex items-center gap-1 font-semibold transition-colors ${
            countdown > 0 || isResending
              ? 'text-text-secondary/50 dark:text-slate-600 cursor-not-allowed'
              : 'text-accent-gold hover:underline cursor-pointer'
          }`}
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`}
          />
          <span>
            {countdown > 0
              ? `Resend in ${countdown}s`
              : isResending
              ? 'Sending...'
              : 'Resend Code'}
          </span>
        </button>
      </div>
    </form>
  )
}
