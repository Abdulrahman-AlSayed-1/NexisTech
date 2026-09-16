import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * GuestRoute Guard
 * Restricts access to guest-only routes (e.g., /login, /register, /verify-otp, /forgot-password).
 * If the user is already authenticated, redirects them to home (/); otherwise renders child routes.
 *
 * @returns {JSX.Element}
 */
export default function GuestRoute() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
