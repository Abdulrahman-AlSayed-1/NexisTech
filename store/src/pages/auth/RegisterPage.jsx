import { Link } from 'react-router-dom'
import AuthCard from '@/components/auth/AuthCard'
import RegisterForm from '@/components/auth/RegisterForm'

/**
 * RegisterPage Component
 * Route: /register (Guest only via GuestRoute & AuthLayout)
 */
export default function RegisterPage() {
  return (
    <AuthCard
      title="Create Your Account"
      subtitle="Join Nexis Tech for genuine electronics and flagship hardware gear."
      badgeText="Account Registration"
      showcaseTitle="Egypt's Flagship Hardware Destination."
      showcaseSubtitle="Create your account to unlock member discounts, save domestic delivery addresses, and track shipments in real-time."
      footer={
        <p>
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-accent-gold hover:underline"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <RegisterForm />
    </AuthCard>
  )
}
