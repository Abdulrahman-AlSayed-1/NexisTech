import { Link } from 'react-router-dom'
import AuthCard from '@/components/auth/AuthCard'
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm'

/**
 * ForgotPasswordPage Component
 * Route: /forgot-password (Guest only via GuestRoute & AuthLayout)
 * Secure credential recovery surface for customers.
 */
export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Reset Password"
      subtitle="Enter your email to receive a 6-digit verification code and restore account access."
      badgeText="Account Recovery"
      showcaseTitle="Fast & Protected Account Recovery."
      showcaseSubtitle="We generate a single-use verification code sent directly to your registered inbox to safeguard your account."
      footer={
        <p>
          Remember your password?{' '}
          <Link
            to="/login"
            className="font-semibold text-accent-gold hover:underline"
          >
            Back to Sign In
          </Link>
        </p>
      }
    >
      <ForgotPasswordForm />
    </AuthCard>
  )
}
