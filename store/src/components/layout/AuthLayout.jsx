import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectTheme } from '@/store/slices/uiSlice'

/**
 * AuthLayout Component
 * Dedicated layout for customer authentication flows (Login, Register, OTP, Forgot Password).
 * Distinct from MainLayout with no store navbar or store footer.
 *
 * @returns {JSX.Element}
 */
export default function AuthLayout() {
  const theme = useSelector(selectTheme)

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-bg-main dark:bg-dark-bg-main text-text-primary dark:text-text-light p-4 sm:p-6 transition-colors duration-200">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  )
}
