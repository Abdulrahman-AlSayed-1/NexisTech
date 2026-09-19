import { useEffect } from 'react'
import { Outlet, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ArrowLeft, Sun, Moon } from 'lucide-react'
import { selectTheme, toggleTheme } from '@/store/slices/uiSlice'

/**
 * AuthLayout Component
 * Dedicated ambient layout for customer authentication flows (Login, Register, OTP, Forgot Password).
 * Features atmospheric brand glows, back-to-store navigation, and a live light/dark theme switch.
 */
export default function AuthLayout() {
  const dispatch = useDispatch()
  const theme = useSelector(selectTheme)

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-bg-main dark:bg-dark-bg-main text-text-primary dark:text-text-light p-4 sm:p-6 lg:p-8 transition-colors duration-300 overflow-hidden">
      {/* 1. Atmospheric Ambient Glows & Tech Grid */}
      <div className="absolute -top-32 -left-32 w-96 h-96 sm:w-[500px] sm:h-[500px] bg-primary-medium/20 dark:bg-primary-medium/25 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 sm:w-[500px] sm:h-[500px] bg-accent-gold/15 dark:bg-accent-gold/20 rounded-full blur-[140px] pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.15] dark:opacity-[0.07]"
        style={{
          backgroundImage: `radial-gradient(var(--color-primary-medium) 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />

      {/* 2. Top Header Utility Bar */}
      <header className="relative z-20 w-full max-w-5xl mx-auto flex items-center justify-between py-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-card/70 dark:bg-dark-bg-card/70 border border-border-light/80 dark:border-primary-medium/40 text-xs font-medium text-text-secondary hover:text-primary-dark dark:text-slate-300 dark:hover:text-accent-gold backdrop-blur-md shadow-2xs transition-all hover:scale-[1.02]"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-accent-gold" />
          <span>Back to Store</span>
        </Link>

        {/* Live Theme Toggle */}
        <button
          type="button"
          onClick={() => dispatch(toggleTheme())}
          title={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
          aria-label="Toggle theme mode"
          className="p-2 rounded-full bg-bg-card/70 dark:bg-dark-bg-card/70 border border-border-light/80 dark:border-primary-medium/40 text-text-secondary hover:text-accent-gold dark:text-slate-300 dark:hover:text-accent-gold backdrop-blur-md shadow-2xs transition-all hover:scale-105 cursor-pointer"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-accent-gold" />
          ) : (
            <Moon className="w-4 h-4 text-primary-dark" />
          )}
        </button>
      </header>

      {/* 3. Main Center Content Surface */}
      <main className="relative z-10 w-full max-w-5xl mx-auto my-auto py-6 animate-in fade-in zoom-in-95 duration-400">
        <Outlet />
      </main>

      {/* 4. Subtle Minimal Footer Disclaimer */}
      <footer className="relative z-20 w-full max-w-md mx-auto text-center py-2 text-[11px] text-text-secondary/70 dark:text-slate-500">
        Nexis Tech &copy; {new Date().getFullYear()} • Genuine Electronics & Hardware Storefront
      </footer>
    </div>
  )
}
