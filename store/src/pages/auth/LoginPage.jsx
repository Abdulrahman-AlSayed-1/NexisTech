import { Link } from 'react-router-dom'
import AuthCard from '@/components/auth/AuthCard'
import LoginForm from '@/components/auth/LoginForm'

/**
 * LoginPage Component
 * Route: /login (Guest only via GuestRoute & AuthLayout)
 */
export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome Back"
      subtitle="Sign in to manage your orders, wishlist, and hardware warranty."
      badgeText="Customer Portal"
      showcaseTitle="Power Your Setup with Authentic Gear."
      showcaseSubtitle="Access your account to track live Egyptian deliveries, review past hardware purchases, and unlock member discounts."
      footer={
        <p>
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-accent-gold hover:underline"
          >
            Create one
          </Link>
        </p>
      }
    >
      <LoginForm />
    </AuthCard>
  )
}
