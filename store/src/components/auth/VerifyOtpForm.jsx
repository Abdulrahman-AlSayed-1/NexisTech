import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Mail, RefreshCw, AlertCircle, ArrowRight, CheckCircle2, Edit2 } from 'lucide-react'
import { toast } from 'react-toastify'

import OtpInput from '@/components/common/OtpInput'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import {
  verifyRegistrationOtpThunk,
  resendRegistrationOtpThunk,
  selectRegistrationPendingEmail,
  selectAuthLoading,
  selectAuthError,
  clearAuthError,
  setRegistrationEmail,
} from '@/store/slices/authSlice'

/**
 * VerifyOtpForm Component
 * Customer account email verification surface.
 * Features 6-digit OTP input with keyboard auto-advance, clipboard paste,
 * a 60-second cooldown resend countdown, and instant session transition.
 */
export default function VerifyOtpForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const reduxPendingEmail = useSelector(selectRegistrationPendingEmail)
  const passedEmail = location.state?.email || ''
  const initialEmail = reduxPendingEmail || passedEmail

  const isLoading = useSelector(selectAuthLoading)
  const serverError = useSelector(selectAuthError)

  const [email, setEmail] = useState(initialEmail)
  const [isEditingEmail, setIsEditingEmail] = useState(!initialEmail)
  const [otp, setOtp] = useState('')
  const [countdown, setCountdown] = useState(60)
  const [isResending, setIsResending] = useState(false)
  const [localError, setLocalError] = useState('')
  const [isVerifiedSuccess, setIsVerifiedSuccess] = useState(false)

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

  const handleOtpChange = (newVal) => {
    setOtp(newVal)
    if (localError) setLocalError('')
    if (serverError) dispatch(clearAuthError())
  }

  const handleResend = async () => {
    const cleanEmail = email.trim()
    if (!cleanEmail) {
      setLocalError('Please enter your registered email address first.')
      return
    }
    if (countdown > 0 || isResending) return

    try {
      setIsResending(true)
      setLocalError('')
      await dispatch(resendRegistrationOtpThunk({ email: cleanEmail })).unwrap()
      toast.info(`A fresh 6-digit code has been sent to ${cleanEmail}`)
      setCountdown(60)
      setOtp('')
    } catch (err) {
      const msg = typeof err === 'string' ? err : err?.message || 'Failed to resend code.'
      setLocalError(msg)
    } finally {
      setIsResending(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')

    const cleanEmail = email.trim()
    if (!cleanEmail) {
      setLocalError('Please enter your email address.')
      return
    }

    const cleanOtp = otp.trim()
    if (cleanOtp.length !== 6) {
      setLocalError('Please enter all 6 digits of the verification code.')
      return
    }

    try {
      const result = await dispatch(
        verifyRegistrationOtpThunk({
          email: cleanEmail,
          otp: cleanOtp,
        })
      ).unwrap()

      setIsVerifiedSuccess(true)
      toast.success('Account successfully verified! Welcome to Nexis Tech.')

      // Brief delay to display success animation, then redirect
      setTimeout(() => {
        if (result?.token) {
          navigate('/', { replace: true })
        } else {
          navigate('/login', {
            replace: true,
            state: { verifiedEmail: cleanEmail, justVerified: true },
          })
        }
      }, 1200)
    } catch (err) {
      const msg = typeof err === 'string' ? err : err?.message || 'Invalid or expired verification code.'
      setLocalError(msg)
    }
  }

  const activeError = localError || serverError

  if (isVerifiedSuccess) {
    return (
      <div className="py-8 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-heading font-extrabold text-primary-dark dark:text-text-light">
            Verification Successful
          </h3>
          <p className="text-xs text-text-secondary dark:text-slate-400">
            Your Nexis Tech account has been activated. Redirecting you...
          </p>
        </div>
      </div>
    )
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {/* 1. Target Email Badge / Editor */}
      <div className="p-3.5 rounded-2xl bg-bg-card/70 dark:bg-dark-bg-card/70 border border-border-light/90 dark:border-primary-medium/30 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-xl bg-accent-gold/10 dark:bg-accent-gold/20 text-accent-gold shrink-0">
            <Mail className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-text-secondary dark:text-slate-400">
              Code sent to
            </p>
            {isEditingEmail ? (
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  dispatch(setRegistrationEmail(e.target.value))
                }}
                placeholder="Enter your email"
                className="w-full text-xs font-bold text-primary-dark dark:text-text-light bg-transparent outline-none border-b border-accent-gold py-0.5"
                autoFocus
              />
            ) : (
              <p className="text-xs sm:text-sm font-bold font-mono text-primary-dark dark:text-text-light truncate">
                {email || 'No email specified'}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsEditingEmail(!isEditingEmail)}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-accent-gold hover:bg-accent-gold/10 transition-colors shrink-0 cursor-pointer"
        >
          <Edit2 className="w-3 h-3" />
          <span>{isEditingEmail ? 'Done' : 'Change'}</span>
        </button>
      </div>

      {/* 2. 6-Digit OTP Slots */}
      <div className="space-y-2 py-2">
        <label className="block text-center text-xs font-bold text-primary-dark dark:text-text-light uppercase tracking-wider font-heading">
          Enter 6-Digit Verification Code
        </label>
        <OtpInput
          length={6}
          value={otp}
          onChange={handleOtpChange}
          disabled={isLoading}
          hasError={Boolean(activeError)}
          autoFocus={!isEditingEmail}
        />
        <p className="text-center text-[11px] text-text-secondary dark:text-slate-400">
          Check your email inbox or spam folder for the one-time code.
        </p>
      </div>

      {/* 3. Error Banner */}
      {activeError && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 flex items-start gap-2.5 text-xs text-rose-600 dark:text-rose-400">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{activeError}</span>
        </div>
      )}

      {/* 4. Action CTA */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        disabled={otp.length !== 6}
        className="w-full flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
      >
        <span>Verify & Activate Account</span>
        {!isLoading && <ArrowRight className="w-4 h-4" />}
      </Button>

      {/* 5. Resend Cooldown Strip */}
      <div className="flex items-center justify-center gap-2 text-xs text-text-secondary dark:text-slate-400 pt-1">
        <span>Didn't receive the email?</span>
        <button
          type="button"
          onClick={handleResend}
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
