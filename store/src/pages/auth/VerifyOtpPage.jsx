import { Link } from 'react-router-dom'
import AuthCard from '@/components/auth/AuthCard'
import VerifyOtpForm from '@/components/auth/VerifyOtpForm'

/**
 * VerifyOtpPage Component
 * Route: /verify-otp (Guest only via GuestRoute & AuthLayout)
 * Displays customer account verification card with 6-digit OTP entry.
 */
export default function VerifyOtpPage() {
  return (
    <AuthCard
      title="Verify Account"
      subtitle="Enter the 6-digit security code sent to your email to activate your account."
      badgeText="Security Verification"
      showcaseTitle="Hardware Authentication & Account Safety."
      showcaseSubtitle="Protecting your orders, hardware warranty records, and shipping addresses with encrypted two-step verification."
      footer={
        <p>
          Entered the wrong email or need help?{' '}
          <Link
            to="/register"
            className="font-semibold text-accent-gold hover:underline"
          >
            Restart registration
          </Link>{' '}
          or{' '}
          <Link
            to="/login"
            className="font-semibold text-accent-gold hover:underline"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <VerifyOtpForm />
    </AuthCard>
  )
}
