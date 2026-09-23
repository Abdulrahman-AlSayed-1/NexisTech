import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Home, Compass, AlertCircle, Sun, Moon } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import Button from '@/components/common/Button'
import Logo from '@/components/common/Logo'
import { selectTheme, toggleTheme } from '@/store/slices/uiSlice'

/**
 * 404 Not Found Page
 */
export default function NotFoundPage() {
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
    <div className="h-screen w-screen overflow-hidden flex flex-col justify-between bg-bg-main dark:bg-dark-bg-main text-text-primary dark:text-text-light p-4 sm:p-6 lg:p-8 transition-colors duration-300 relative select-none">
      {/* 1. Subtle Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[500px] h-96 sm:h-[500px] bg-accent-gold/10 dark:bg-accent-gold/5 rounded-full blur-[120px] pointer-events-none" />

      {/* 2. Top Header Bar with Logo and Theme Toggle */}
      <header className="relative z-20 w-full max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="shrink-0 transition-transform hover:scale-105">
          <Logo variant={theme === 'dark' ? 'light' : 'dark'} size="sm" />
        </Link>

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

      {/* 3. Centered Content Body (Dead Center of Screen) */}
      <main className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center justify-center text-center my-auto py-4">
        {/* Status Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-gold/10 border border-accent-gold/30 text-accent-gold font-heading font-bold text-[11px] sm:text-xs uppercase tracking-widest mb-3">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Error 404</span>
        </div>

        {/* Big Bold 404 */}
        <h1 className="text-8xl sm:text-9xl md:text-[10rem] font-black font-heading tracking-tight text-primary-dark dark:text-accent-gold select-none leading-none drop-shadow-sm">
          404
        </h1>

        {/* Clear Title */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-text-primary dark:text-text-light mt-3 tracking-tight">
          Page Not Found
        </h2>

        {/* Explanation */}
        <p className="text-xs sm:text-sm md:text-base text-text-secondary dark:text-slate-400 max-w-md mx-auto mt-2.5 leading-relaxed">
          The page you are looking for doesn't exist, has been removed, or is temporarily unavailable in the Nexis Tech catalog.
        </p>

        {/* Action Buttons */}
        <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          <Link to="/" className="w-full sm:w-auto">
            <Button
              variant="gold"
              size="lg"
              className="w-full sm:w-auto flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Button>
          </Link>

          <Link to="/products" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto flex items-center justify-center gap-2 hover:border-accent-gold transition-all"
            >
              <Compass className="w-4 h-4 text-accent-gold" />
              <span>Explore Catalog</span>
            </Button>
          </Link>
        </div>
      </main>

      {/* 4. Subtle Minimal Footer */}
      <footer className="relative z-20 w-full text-center text-[11px] text-text-secondary/70 dark:text-slate-500 py-1">
        Nexis Tech &copy; {new Date().getFullYear()} • Genuine Electronics & Hardware Storefront
      </footer>
    </div>
  )
}

