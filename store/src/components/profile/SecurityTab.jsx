import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { Lock, Eye, EyeOff, ShieldCheck, Mail, ArrowLeft, KeyRound, RefreshCw } from 'lucide-react'

import Button from '@/components/common/Button'
import { selectCurrentUser } from '@/store/slices/authSlice'
import { loginUser, sendForgotPasswordOtp, verifyForgotPasswordOtp } from '@/api/auth'

/**
 * SecurityTab Component
 * Live password updating using the backend's verified OTP authentication flow.
 * Validates current password, sends a 6-digit verification code, and updates the database.
 */
export default function SecurityTab() {
  const currentUser = useSelector(selectCurrentUser)

  const [step, setStep] = useState('form') // 'form' | 'otp'
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [otp, setOtp] = useState('')

  // Resend cooldown timer
  useEffect(() => {
    if (countdown <= 0) return
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [countdown])

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  // Step 1: Validate current password & send email OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault()

    const email = currentUser?.email
    if (!email) {
      toast.error('Unable to retrieve your email address. Please re-login.')
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long.')
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match.')
      return
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      toast.warning('New password cannot be identical to your current password.')
      return
    }

    try {
      setIsLoading(true)

      // 1. Verify current credentials against the backend
      try {
        await loginUser({
          email,
          password: passwordData.currentPassword,
        })
      } catch {
        toast.error('Current password is incorrect. Please try again.')
        return
      }

      // 2. Request real backend password update OTP
      await sendForgotPasswordOtp({ email })

      toast.success(`Verification code sent to ${email}`)
      setStep('otp')
      setCountdown(60)
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to initiate password update.'
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  // Step 2: Verify OTP and save new password on backend
  const handleVerifyAndUpdate = async (e) => {
    e.preventDefault()

    const email = currentUser?.email
    const cleanOtp = otp.trim()

    if (!cleanOtp || cleanOtp.length !== 6) {
      toast.error('Please enter the 6-digit verification code.')
      return
    }

    try {
      setIsLoading(true)

      await verifyForgotPasswordOtp({
        email,
        otp: cleanOtp,
        newPassword: passwordData.newPassword,
      })

      toast.success('Password updated successfully!')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setOtp('')
      setStep('form')
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid or expired verification code.'
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (countdown > 0 || isResending) return

    try {
      setIsResending(true)
      await sendForgotPasswordOtp({ email: currentUser?.email })
      toast.info('A fresh verification code has been sent.')
      setCountdown(60)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend code.')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold font-heading text-primary-dark dark:text-text-light">
          Account Security & Password
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-text-secondary dark:text-slate-400">
          Ensure your account stays protected by updating your credentials via verified email authorization.
        </p>
      </div>

      {/* Step 1: Enter Current & New Passwords */}
      {step === 'form' && (
        <form onSubmit={handleRequestOtp} className="space-y-5 max-w-lg">
          <div>
            <label
              htmlFor="sec-current-password"
              className="block text-xs font-bold uppercase tracking-wider text-text-secondary dark:text-slate-400 mb-2 font-heading"
            >
              Current Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary/60 dark:text-text-light/40" />
              <input
                id="sec-current-password"
                type={showCurrent ? 'text' : 'password'}
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
                placeholder="Enter your current password"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border-medium/60 dark:border-primary-medium/30 bg-bg-card dark:bg-dark-bg-main text-text-primary dark:text-text-light text-sm focus:outline-none focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold transition-all"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                aria-label={showCurrent ? 'Hide password' : 'Show password'}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="sec-new-password"
              className="block text-xs font-bold uppercase tracking-wider text-text-secondary dark:text-slate-400 mb-2 font-heading"
            >
              New Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary/60 dark:text-text-light/40" />
              <input
                id="sec-new-password"
                type={showNew ? 'text' : 'password'}
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border-medium/60 dark:border-primary-medium/30 bg-bg-card dark:bg-dark-bg-main text-text-primary dark:text-text-light text-sm focus:outline-none focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold transition-all"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                aria-label={showNew ? 'Hide password' : 'Show password'}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="sec-confirm-password"
              className="block text-xs font-bold uppercase tracking-wider text-text-secondary dark:text-slate-400 mb-2 font-heading"
            >
              Confirm New Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary/60 dark:text-text-light/40" />
              <input
                id="sec-confirm-password"
                type={showConfirm ? 'text' : 'password'}
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
                placeholder="Repeat new password"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border-medium/60 dark:border-primary-medium/30 bg-bg-card dark:bg-dark-bg-main text-text-primary dark:text-text-light text-sm focus:outline-none focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-accent-gold/5 dark:bg-accent-gold/10 border border-accent-gold/25 flex items-start gap-3">
            <Mail className="w-4 h-4 text-accent-gold shrink-0 mt-0.5" />
            <p className="text-xs text-text-secondary dark:text-slate-300 leading-relaxed">
              To verify this change, a 6-digit authorization code will be dispatched to your registered email address (
              <span className="font-semibold text-text-primary dark:text-text-light">{currentUser?.email}</span>).
            </p>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="gold"
              size="md"
              isLoading={isLoading}
            >
              <ShieldCheck className="w-4 h-4 mr-2" />
              Continue to Verification
            </Button>
          </div>
        </form>
      )}

      {/* Step 2: Enter 6-digit OTP to finalize backend update */}
      {step === 'otp' && (
        <form onSubmit={handleVerifyAndUpdate} className="space-y-5 max-w-lg animate-in fade-in duration-200">
          <div className="p-5 rounded-2xl bg-bg-card dark:bg-dark-bg-card border border-border-light dark:border-primary-medium/30 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent-gold/15 text-accent-gold flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-heading text-primary-dark dark:text-text-light">
                  Enter Verification Code
                </h3>
                <p className="text-xs text-text-secondary dark:text-slate-400 mt-0.5">
                  Code sent to <span className="font-medium text-accent-gold">{currentUser?.email}</span>
                </p>
              </div>
            </div>

            <div>
              <label
                htmlFor="sec-otp-code"
                className="block text-xs font-bold uppercase tracking-wider text-text-secondary dark:text-slate-400 mb-2 font-heading"
              >
                6-Digit Security Code
              </label>
              <input
                id="sec-otp-code"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                required
                autoFocus
                placeholder="123456"
                className="w-full text-center tracking-[0.4em] font-mono text-xl py-3 rounded-xl border border-border-medium dark:border-primary-medium/40 bg-bg-main dark:bg-dark-bg-main text-text-primary dark:text-text-light focus:outline-none focus:ring-2 focus:ring-accent-gold focus:border-accent-gold"
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => setStep('form')}
                className="inline-flex items-center gap-1 text-text-secondary hover:text-text-primary dark:hover:text-text-light font-medium transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Change passwords
              </button>

              <button
                type="button"
                disabled={countdown > 0 || isResending}
                onClick={handleResendOtp}
                className={`inline-flex items-center gap-1 font-bold font-heading transition-colors ${
                  countdown > 0
                    ? 'text-text-secondary/60 cursor-not-allowed'
                    : 'text-accent-gold hover:underline cursor-pointer'
                }`}
              >
                <RefreshCw className={`w-3 h-3 ${isResending ? 'animate-spin' : ''}`} />
                {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend code'}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="gold"
              size="md"
              className="w-full"
              isLoading={isLoading}
            >
              <ShieldCheck className="w-4 h-4 mr-2" />
              Verify & Save New Password
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
