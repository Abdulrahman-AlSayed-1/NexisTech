import { useState, useEffect, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Search, Moon, Sun, Heart, ShoppingCart, User, X, Menu } from 'lucide-react'
import {
  toggleTheme,
  toggleSearch,
  closeSearch,
  toggleMobileMenu,
  closeMobileMenu,
  selectTheme,
  selectIsSearchOpen,
  selectIsMobileMenuOpen,
} from '@/store/slices/uiSlice'
import { selectIsAuthenticated, selectCurrentUser } from '@/store/slices/authSlice'
import { selectCartCount } from '@/store/slices/cartSlice'
import { selectWishlistCount } from '@/store/slices/wishlistSlice'
import { searchProductsThunk } from '@/store/slices/productsSlice'
import Logo from '@/components/common/Logo'

export default function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const user = useSelector(selectCurrentUser)
  const cartCount = useSelector(selectCartCount)
  const favCount = useSelector(selectWishlistCount)
  const theme = useSelector(selectTheme)
  const searchActive = useSelector(selectIsSearchOpen)
  const mobileDisplay = useSelector(selectIsMobileMenuOpen)

  const [searchValue, setSearchValue] = useState('')
  const [scrollMode, setScrollMode] = useState(false)
  const searchInputRef = useRef(null)

  const searchClose = useCallback(() => {
    dispatch(closeSearch())
    setSearchValue('')
  }, [dispatch])

  useEffect(() => {
    if (searchValue.trim().length > 1) {
      dispatch(searchProductsThunk(searchValue.trim()))
    }
  }, [searchValue, dispatch])

  useEffect(() => {
    const onScroll = () => {
      setScrollMode(window.scrollY > 20)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (searchActive) {
      searchInputRef.current?.focus()
    }
  }, [searchActive])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && searchActive) {
        searchClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [searchActive, searchClose])

  const displayName = user?.username || (user?.role ? user.role.toUpperCase() : 'USER')
  const userAvatar =
    user?.avatar && user.avatar !== 'default' && user.avatar !== 'none'
      ? user.avatar
      : user?.profileImage && user.profileImage !== 'default' && user.profileImage !== 'none'
      ? user.profileImage
      : null

  const toggleThemeMode = () => dispatch(toggleTheme())
  const handleToggleSearch = () => dispatch(toggleSearch())
  const navbarMobileDisplay = () => dispatch(toggleMobileMenu())

  const handleProfileNavigation = () => {
    navigate('/profile')
    dispatch(closeMobileMenu())
  }
  const handleLoginNavigation = () => {
    navigate('/login')
    dispatch(closeMobileMenu())
  }

  const searchSubmit = (e) => {
    if (e) e.preventDefault()
    const trimmed = searchValue.trim()
    if (trimmed !== '') {
      dispatch(searchProductsThunk(trimmed))
      navigate(`/products?search=${encodeURIComponent(trimmed)}`)
      dispatch(closeSearch())
      dispatch(closeMobileMenu())
      setSearchValue('')
    }
  }

  // Common styles
  const iconBtnClass =
    'flex items-center justify-center w-8 h-8 rounded-full bg-bg-card/70 dark:bg-dark-bg-card border border-border-medium/50 dark:border-primary-medium/30 shadow-2xs text-text-secondary hover:text-accent-gold dark:text-text-light/70 dark:hover:text-accent-gold hover:bg-bg-card dark:hover:bg-primary-medium/30 transition-all duration-200 cursor-pointer'

  const badgeCountClass =
    'absolute -top-1 -right-1 bg-accent-gold text-primary-dark text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full shadow-xs'

  const navLinkStyle = ({ isActive }) =>
    `px-4 py-1.5 text-xs font-heading font-bold uppercase tracking-wider transition-all duration-200 rounded-full shrink-0 ${
      isActive
        ? 'bg-accent-gold text-primary-dark shadow-xs border border-accent-gold'
        : 'text-text-secondary hover:bg-bg-main hover:text-accent-gold dark:text-text-light/70 dark:hover:bg-primary-medium/20 dark:hover:text-accent-gold'
    }`

  const headerStyle = scrollMode
    ? 'bg-bg-card/90 dark:bg-dark-bg-card/90 border-border-light/80 dark:border-primary-medium/10 shadow-xs h-14'
    : 'bg-bg-card dark:bg-dark-bg-card border-border-light dark:border-primary-medium/20 h-16'

  return (
    <>
      <header className={`w-full sticky top-0 z-40 border-b transition-all duration-300 backdrop-blur-md ${headerStyle}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-3">
          {/* Left: Mobile Menu Toggle & Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={navbarMobileDisplay}
              className="md:hidden p-1.5 rounded-full border border-border-medium/40 text-text-secondary dark:text-text-light/70 bg-bg-card dark:bg-dark-bg-card shadow-2xs cursor-pointer hover:text-accent-gold transition-colors"
              aria-label={mobileDisplay ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            >
              {mobileDisplay ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            <Link to="/" className="shrink-0 transition-transform">
              <Logo variant={theme === 'dark' ? 'light' : 'dark'} size="sm" />
            </Link>
          </div>

          {/* Center: Main Navigation Menu (Desktop) */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-3 bg-bg-main dark:bg-primary-medium/10 p-1.5 rounded-full border border-border-medium/30 dark:border-primary-medium/10 transition-colors">
            <NavLink to="/" end className={navLinkStyle}>Home</NavLink>
            <NavLink to="/products" className={navLinkStyle}>Shop</NavLink>
            <NavLink to="/profile/orders" className={navLinkStyle}>My Orders</NavLink>
            <NavLink to="/wishlist" className={navLinkStyle}>Wishlist</NavLink>
          </nav>

          {/* Right: Actions, Search, Theme, Cart, User */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Expandable Desktop Search Bar (Unified single container with zero bouncing) */}
            <form
              onSubmit={searchSubmit}
              className={`hidden md:flex items-center relative rounded-full border transition-all duration-300 ease-out overflow-hidden ${
                searchActive
                  ? 'w-48 lg:w-56 h-8 px-2.5 bg-bg-card dark:bg-dark-bg-card border-border-medium/60 dark:border-primary-medium/40 shadow-xs'
                  : 'w-8 h-8 px-0 justify-center bg-bg-card/70 dark:bg-dark-bg-card border-border-medium/50 dark:border-primary-medium/30 shadow-2xs hover:text-accent-gold dark:hover:text-accent-gold hover:bg-bg-card cursor-pointer'
              }`}
            >
              <button
                type={searchActive ? 'submit' : 'button'}
                onClick={!searchActive ? handleToggleSearch : undefined}
                className="flex items-center justify-center text-text-secondary hover:text-accent-gold dark:text-text-light/70 dark:hover:text-accent-gold shrink-0 cursor-pointer"
                aria-label="Search"
                title="Search"
              >
                <Search className="w-3.5 h-3.5" />
              </button>

              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search products..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className={`bg-transparent text-xs font-body outline-none text-text-primary dark:text-text-light placeholder-text-secondary/50 transition-opacity duration-200 ${
                  searchActive ? 'w-full ml-2 opacity-100' : 'w-0 opacity-0 pointer-events-none'
                }`}
                disabled={!searchActive}
              />

              {searchActive && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    searchClose()
                  }}
                  type="button"
                  className="text-text-secondary hover:text-accent-gold dark:text-text-light/60 dark:hover:text-accent-gold cursor-pointer shrink-0 ml-1"
                  aria-label="Close search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Theme Mode Toggle */}
            <button
              onClick={toggleThemeMode}
              className={iconBtnClass}
              aria-label="Toggle theme mode"
              title={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className={`${iconBtnClass} relative`}
              aria-label="Wishlist"
              title="Wishlist"
            >
              <Heart className="w-3.5 h-3.5" />
              {favCount > 0 && (
                <span className={badgeCountClass}>
                  {favCount}
                </span>
              )}
            </Link>

            {/* Cart Link */}
            <Link
              to="/cart"
              className={`${iconBtnClass} relative`}
              aria-label="Cart"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              {cartCount > 0 && (
                <span className={badgeCountClass}>
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Button (Navigates to Profile or Login) */}
            <button
              onClick={isAuthenticated ? handleProfileNavigation : handleLoginNavigation}
              className="flex items-center gap-1.5 h-8 px-3.5 border border-accent-gold/40 rounded-full bg-accent-gold hover:bg-accent-gold-hover text-primary-dark font-heading font-semibold text-xs shadow-2xs transition-all cursor-pointer select-none"
              aria-label={isAuthenticated ? 'My Profile' : 'Sign In'}
            >
              {isAuthenticated && userAvatar ? (
                <img
                  src={userAvatar}
                  alt={displayName}
                  className="w-4 h-4 rounded-full object-cover shrink-0"
                />
              ) : (
                <User className="w-3.5 h-3.5 shrink-0" />
              )}
              <span className="truncate max-w-[100px]">{isAuthenticated ? displayName : 'Login'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Backdrop Overlay (Dims content below header) */}
      {mobileDisplay && (
        <div
          className={`fixed inset-0 ${scrollMode ? 'top-14' : 'top-16'} bg-black/60 z-40 backdrop-blur-xs md:hidden transition-opacity duration-300`}
          onClick={() => dispatch(closeMobileMenu())}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Dropdown (Content-sized top sheet with smooth slide-down and zero wasted space) */}
      <div
        className={`fixed inset-x-0 ${scrollMode ? 'top-14' : 'top-16'} z-50 bg-white dark:bg-dark-bg-card border-b border-border-medium/30 dark:border-primary-medium/30 shadow-2xl rounded-b-3xl px-5 py-5 flex flex-col space-y-4 transform transition-all duration-300 ease-out md:hidden ${
          mobileDisplay
            ? 'translate-y-0 opacity-100 visible pointer-events-auto'
            : '-translate-y-3 opacity-0 invisible pointer-events-none'
        }`}
      >
        {/* Mobile Navigation Links */}
        <nav className="flex flex-col space-y-1.5">
          <NavLink to="/" end className={navLinkStyle} onClick={() => dispatch(closeMobileMenu())}>
            Home
          </NavLink>
          <NavLink to="/products" className={navLinkStyle} onClick={() => dispatch(closeMobileMenu())}>
            Shop
          </NavLink>
          <NavLink to="/profile/orders" className={navLinkStyle} onClick={() => dispatch(closeMobileMenu())}>
            My Orders
          </NavLink>
          <NavLink to="/wishlist" className={navLinkStyle} onClick={() => dispatch(closeMobileMenu())}>
            Wishlist
          </NavLink>
        </nav>

        {/* Mobile Search Form with High Contrast */}
        <form
          onSubmit={searchSubmit}
          className="flex items-center rounded-xl bg-bg-main dark:bg-dark-bg-main px-3.5 py-2 border border-border-light dark:border-primary-medium/40 shadow-2xs w-full"
        >
          <input
            type="text"
            placeholder="Search products..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full bg-transparent text-xs font-body outline-none text-text-primary dark:text-text-light placeholder-text-secondary/60"
          />
          <button
            type="submit"
            className="cursor-pointer text-text-secondary dark:text-slate-400 hover:text-accent-gold shrink-0 ml-1"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Mobile User Profile / Sign In Link */}
        <div className="pt-2 border-t border-border-light/80 dark:border-primary-medium/30">
          <button
            onClick={isAuthenticated ? handleProfileNavigation : handleLoginNavigation}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-accent-gold hover:bg-accent-gold-hover text-primary-dark font-heading font-bold text-xs shadow-2xs transition-all cursor-pointer"
          >
            <User className="w-4 h-4" />
            <span>{isAuthenticated ? displayName : 'Sign In to Account'}</span>
          </button>
        </div>
      </div>
    </>
  )
}