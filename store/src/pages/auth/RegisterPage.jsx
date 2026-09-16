import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

import { sendRegisterOtp } from "@/api/auth";
import {
  authStart,
  authFailure,
  setRegistrationEmail,
} from "@/store/slices/authSlice";

/**
 * Register page for the Koda Store storefront.
 * Uses the project's shared design tokens (bg-primary-dark, text-text-gold...)
 * so it matches the same palette used across the app.
 * Flow: submit details -> backend sends OTP -> redirect to /verify-otp.
 * Drop into src/pages/auth/RegisterPage.jsx.
 */

const inputClass =
  "w-full rounded-lg border border-border-medium bg-bg-input px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/70 focus:outline-none focus:border-primary-medium";

const labelClass = "mb-1.5 block text-sm font-semibold text-text-primary";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (form.password !== form.confirmPassword) {
      setFormError("Passwords don't match.");
      return;
    }
    if (form.password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }

    dispatch(authStart());
    try {
      await sendRegisterOtp({
        username: form.username,
        email: form.email,
        password: form.password,
        phone: form.phone,
      });
      dispatch(setRegistrationEmail(form.email));
      navigate("/verify-otp");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      dispatch(authFailure(message));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-main px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-border-light bg-bg-card p-8">
        <p className="mb-2 text-[13px] font-semibold tracking-[0.16em] text-text-gold">
          KODA STORE
        </p>
        <h1 className="text-2xl font-bold text-text-primary">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          We'll send a verification code to your email.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className={labelClass} htmlFor="username">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={form.username}
              onChange={handleChange}
              className={inputClass}
              placeholder="john_doe"
            />
          </div>

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
            <label className={labelClass} htmlFor="phone">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={form.phone}
              onChange={handleChange}
              className={inputClass}
              placeholder="+201234567890"
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              className={inputClass}
              placeholder="At least 6 characters"
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="confirmPassword">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={form.confirmPassword}
              onChange={handleChange}
              className={inputClass}
              placeholder="Repeat your password"
            />
          </div>

          {(formError || error) && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {formError || error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-primary-dark px-6 py-3 text-sm font-bold text-text-light transition-colors hover:bg-primary-medium disabled:opacity-60"
          >
            {isLoading ? "Sending code..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-text-gold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
