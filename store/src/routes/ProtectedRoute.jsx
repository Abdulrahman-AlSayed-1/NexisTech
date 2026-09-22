import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

/**
 * ProtectedRoute Guard
 * Restricts access to authenticated customer routes.
 * If unauthenticated, redirects to /login while preserving the intended destination in route state.
 *
 * @returns {JSX.Element}
 */
export default function ProtectedRoute() {
  const { isAuthenticated } = useSelector((state) => state.auth)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />

}
