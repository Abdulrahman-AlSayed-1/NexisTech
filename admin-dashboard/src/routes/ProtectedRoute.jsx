import { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { logout } from '@/store/slices/authSlice'

import { isNexisStaffUser } from '@/utils/storeCatalog'

export default function ProtectedRoute() {
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const location = useLocation()

  const isAdmin = isNexisStaffUser(user)
  const isNonAdmin = Boolean(isAuthenticated && !isAdmin)

  useEffect(() => {
    if (isNonAdmin) {
      toast.error('Access denied. Only authorized @nexis.com administrators can access this portal.', {
        toastId: 'admin-required-toast',
      })
      // Clear non-admin auth so user isn't stuck in an infinite redirect ping-pong loop with /login
      dispatch(logout())
    }
  }, [isNonAdmin, dispatch])

  // Verify token exists and role is admin
  if (!isAuthenticated || isNonAdmin) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
