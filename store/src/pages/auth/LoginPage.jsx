// /**
//  * Login Page Placeholder
//  * Route: /login
//  * To be implemented by feature team.
//  */
// export default function LoginPage() {
//   return (
//     <div className="py-16 text-center text-text-secondary dark:text-slate-400">
//       <h1 className="text-xl font-heading font-bold text-primary-dark dark:text-text-light mb-2">
//         Sign In Page
//       </h1>
//       <p className="text-xs">Route: /login — To be implemented by team</p>
//     </div>
//   )
// }

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "@/api/auth";

import { authStart, authSuccess, authFailure } from "@/store/slices/authSlice";

/**
 * Login page for the Koda Store storefront.
 * Uses the project's shared design tokens (bg-primary-dark, text-text-gold...)
 * so it matches the same palette used across the app.
 * Drop into src/pages/auth/LoginPage.jsx.
 */

const inputClass =
  "w-full rounded-lg border border-border-medium bg-bg-input px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/70 focus:outline-none focus:border-primary-medium";

const labelClass = "mb-1.5 block text-sm font-semibold text-text-primary";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(authStart());
    try {
      const data = await loginUser({
        email: form.email,
        password: form.password,
      });
      if (!data.success) {
        throw new Error(data.message || "Login failed.");
      }
      dispatch(authSuccess({ user: data.user, token: data.token }));
      navigate("/");
    } catch (err) {
      const message =
        err.response?.data?.message || "Invalid email or password.";
      dispatch(authFailure(message));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-main px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-border-light bg-bg-card p-8">
        <p className="mb-2 text-[13px] font-semibold tracking-[0.16em] text-text-gold">
          KODA STORE
        </p>
        <h1 className="text-2xl font-bold text-text-primary">Welcome back</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Sign in to continue to your account.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className={labelClass} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className={inputClass}
              placeholder="john@example.com"
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label
                className="text-sm font-semibold text-text-primary"
                htmlFor="password"
              >
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-medium text-text-gold hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              className={inputClass}
              placeholder="Your password"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-primary-dark px-6 py-3 text-sm font-bold text-text-light transition-colors hover:bg-primary-medium disabled:opacity-60"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-text-gold hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
