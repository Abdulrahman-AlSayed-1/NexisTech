import { useState , useEffect  } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Search, Moon, Sun, Heart, ShoppingCart, User, X, Bell, Menu } from 'lucide-react'
import { toggleTheme, toggleSearch, closeSearch, toggleMobileMenu, closeMobileMenu, selectTheme, selectIsSearchOpen, selectIsMobileMenuOpen} from '@/store/slices/uiSlice'
import { selectAuth } from '@/store/slices/authSlice'
import { selectCartTotals } from '@/store/slices/cartSlice'
import { selectWishlistCount  } from '@/store/slices/wishlistSlice'
import { searchProductsThunk } from '@/store/slices/productsSlice'
import Logo from '@/components/common/Logo'

export default function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useSelector(selectAuth)
  const { itemCount: cartCount } = useSelector(selectCartTotals)
  const favCount = useSelector(selectWishlistCount)
  const theme = useSelector(selectTheme)
  const mobileDisplay = useSelector(selectIsMobileMenuOpen)

  const searchActive = useSelector(selectIsSearchOpen)
  const [searchValue, setSearchValue] = useState('')
  const [scrollMode, setScrollMode] = useState(false)

  useEffect(() => {
    const scrolled = () => {
      if (window.scrollY > 20) {
        setScrollMode(true)
      } else {
        setScrollMode(false)
      }
    }
    window.addEventListener('scroll', scrolled)
    return () => window.removeEventListener('scroll', scrolled)
  }, [])

let userRole = 'USER';
let displayName = 'USER';
  if (user) {
    if (user.role) {
      userRole = user.role.toUpperCase();
    }
    if (user.username && user.username !== '') {
      displayName = user.username;
    } else {
      displayName = userRole;
    }
  }
  let linkGap = 'gap-6' 
  if (searchActive) {
    linkGap = 'gap-1 -translate-x-10 lg:-translate-x-16 scale-95' 
  } else if (scrollMode) {
    linkGap = 'gap-2' 
  }

  let headerStyle = 'bg-bg-card dark:bg-dark-bg-card border-border-light dark:border-primary-medium/20 h-16'
  if (scrollMode) {
    headerStyle = 'bg-bg-card/85 dark:bg-dark-bg-card/85 border-border-light/80 dark:border-primary-medium/10 shadow-xs h-14'
  }

  const toggleThemeMode = () => dispatch(toggleTheme())
  const handleToggleSearch = () => dispatch(toggleSearch())
  const searchClose = () => {
    dispatch(closeSearch())
    setSearchValue('')
  }
  const navbarMobileDisplay = () => dispatch(toggleMobileMenu())
  
  const directtoProfile = () => {
    navigate('/profile')
    dispatch(closeMobileMenu())
  }
  const directtoLogin = () => {
    navigate('/login')
    dispatch(closeMobileMenu())
  }
const searchSubmit = (e) => {
    if (e) e.preventDefault();
    const valueTrimed = searchValue.trim()
    if (valueTrimed !== '') {
      dispatch(searchProductsThunk(valueTrimed))
      navigate(`/products?search=${valueTrimed}`)
      dispatch(closeSearch())
      dispatch(closeMobileMenu())
      setSearchValue('')
    }
  }

  const navLinkStyle = ({ isActive }) =>
    `px-4.5 py-1.5 text-xs font-heading font-bold uppercase tracking-wider transition-all duration-300 rounded-full shrink-0 ${
      isActive
        ? 'bg-accent-gold text-primary-dark shadow-sm border border-accent-gold' 
        : 'text-text-secondary hover:bg-bg-main hover:text-accent-gold dark:text-text-light/70 dark:hover:bg-primary-medium/20 dark:hover:text-accent-gold' 
    }`

  return (
    <header className={`w-full sticky top-0 z-50 border-b transition-all duration-500 backdrop-blur-md ${headerStyle}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4">
        
        <div className="flex items-center gap-2">
          <button 
            onClick={navbarMobileDisplay} 
            className="md:hidden p-1.5 rounded-full border border-border-medium/40 text-text-secondary dark:text-text-light/70 bg-bg-card dark:bg-dark-bg-card shadow-xs cursor-pointer"
            aria-label="Menu"
          >
            <Menu className="w-4 h-4" />
          </button>
          
          <Link to="/" className="shrink-0 scale-90 origin-left transition-transform">
            <Logo variant={theme === 'dark' ? 'light' : 'dark'} size="sm" />
          </Link>
        </div>

        <nav className={`hidden md:flex items-center bg-bg-main dark:bg-primary-medium/10 p-1.5 rounded-full border border-border-medium/30 dark:border-primary-medium/10 transition-all duration-500 ease-in-out ${linkGap}`}>
          <NavLink to="/" end className={navLinkStyle}>Home</NavLink>
          <NavLink to="/products" className={navLinkStyle}>Shop</NavLink>
          <NavLink to="/profile/orders" className={navLinkStyle}>My Orders</NavLink>
          <NavLink to="/wishlist" className={navLinkStyle}>Wishlist</NavLink>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <form 
            onSubmit={searchSubmit} 
            className={`hidden md:flex items-center rounded-full transition-all duration-500 ease-in-out ${
              searchActive 
                ? 'bg-bg-card dark:bg-dark-bg-card px-3.5 py-1 border border-border-medium/60 dark:border-primary-medium/40 shadow-sm w-36 sm:w-48 h-8' 
                : 'w-0 border-transparent bg-transparent overflow-hidden'
            }`}
          >           
           <input
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full bg-transparent text-xs font-body outline-none text-text-primary dark:text-text-light placeholder-text-secondary/50"
              disabled={!searchActive}
            />
            {searchActive && (
              <button onClick={searchClose} type="button" className="text-text-secondary dark:text-text-light/60 hover:text-accent-gold cursor-pointer">
                <X className="w-4 h-4 shrink-0" />
              </button>
            )}
          </form>

          {!searchActive && (
            <button 
              onClick={handleToggleSearch} 
              className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-bg-card/10 dark:bg-dark-bg-card border border-border-medium/50 dark:border-primary-medium/30 shadow-sm text-accent-gold dark:text-text-light/70 hover:bg-bg-card dark:hover:bg-accent-gold-hover transition-all duration-200"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          )}

          <button 
            type="button" 
            className="flex items-center justify-center w-8 h-8 rounded-full bg-bg-card/10 dark:bg-dark-bg-card border border-border-medium/50 dark:border-primary-medium/30 shadow-sm text-accent-gold dark:text-text-light/70 hover:bg-bg-card dark:hover:bg-accent-gold-hover transition-all duration-200"
          >
            <div className="relative">
              <Bell className="w-3.5 h-3.5" />
              <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-accent-gold-hover ring-1 ring-bg-card dark:ring-dark-bg-card" />
            </div>
          </button>

          <button 
            onClick={toggleThemeMode} 
            className="flex items-center justify-center w-8 h-8 rounded-full bg-bg-card/10 dark:bg-dark-bg-card border border-border-medium/50 dark:border-primary-medium/30 shadow-sm text-accent-gold dark:text-text-light/70 hover:bg-bg-card dark:hover:bg-accent-gold-hover transition-all duration-200"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          <Link 
            to="/wishlist" 
            className="flex items-center justify-center w-8 h-8 rounded-full bg-bg-card/10 dark:bg-dark-bg-card border border-border-medium/50 dark:border-primary-medium/30 shadow-sm text-accent-gold dark:text-text-light/70 hover:bg-bg-card dark:hover:bg-accent-gold-hover transition-all duration-200 relative"
          >
            <Heart className="w-3.5 h-3.5" />
            {favCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary-dark dark:bg-accent-gold text-white dark:text-primary-dark text-[8px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full shadow-sm animate-scale-in">
                {favCount}
              </span>
            )}
          </Link>

          <Link 
            to="/cart" 
            className="flex items-center justify-center w-8 h-8 rounded-full bg-bg-card/10 dark:bg-dark-bg-card border border-border-medium/50 dark:border-primary-medium/30 shadow-sm text-accent-gold dark:text-text-light/70 hover:bg-bg-card dark:hover:bg-accent-gold-hover transition-all duration-200 relative"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary-dark dark:bg-accent-gold text-white dark:text-primary-dark text-[8px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full shadow-sm animate-scale-in">
                {cartCount}
              </span>
            )}
          </Link>

            {isAuthenticated ? (
              <button
                onClick={directtoProfile}
                className="flex items-center gap-1.5 h-8 px-3.5 border border-border-medium/50 dark:border-primary-medium/30 rounded-full bg-accent-gold dark:bg-accent-gold text-left shadow-sm text-white dark:text-text-light/70 hover:bg-accent-gold-hover dark:hover:bg-accent-gold-hover transition-all cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>{displayName}</span>
              </button>
            ) : (
              <button
                onClick={directtoLogin}
                className="flex items-center gap-1.5 h-8 px-3.5 border border-border-medium/50 dark:border-primary-medium/30 rounded-full bg-accent-gold dark:bg-accent-gold text-left shadow-sm text-white dark:text-text-light/70 hover:bg-accent-gold-hover dark:hover:bg-accent-gold-hover transition-all cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
            )}
        </div>
      </div>

      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-bg-card dark:bg-dark-bg-card border-r border-border-medium/40 dark:border-primary-medium/20 shadow-xl p-6 flex flex-col space-y-5 transform transition-transform duration-300 ease-in-out md:hidden ${mobileDisplay ? 'translate-x-0' : '-translate-x-full'}`}>
        <Logo variant={theme === 'dark' ? 'light' : 'dark'} size="sm" />
        <nav className="flex flex-col space-y-3">
          <NavLink to="/" end className={navLinkStyle} onClick={() => dispatch(closeMobileMenu())}>Home</NavLink>
          <NavLink to="/products" className={navLinkStyle} onClick={() => dispatch(closeMobileMenu())}>Shop</NavLink>
          <NavLink to="/profile/orders" className={navLinkStyle} onClick={() => dispatch(closeMobileMenu())}>My Orders</NavLink>
          <NavLink to="/wishlist" className={navLinkStyle} onClick={() => dispatch(closeMobileMenu())}>Wishlist</NavLink>
        </nav>
        {isAuthenticated ? (
          <button onClick={directtoProfile} className="text-left text-text-primary dark:text-text-light">
            {displayName}
          </button>
        ) : (
          <button onClick={directtoLogin} className="text-left text-text-primary dark:text-text-light">
            Login
          </button>
        )}
        <form 
          onSubmit={searchSubmit} 
          className="flex items-center rounded-full bg-bg-input/40 dark:bg-primary-medium/10 px-3.5 py-1.5 border border-border-medium/60 dark:border-primary-medium/30 shadow-inner w-full h-9"
        >
          <input
            type="text"
            placeholder="Search products..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full bg-transparent text-xs font-body outline-none text-text-primary dark:text-text-light placeholder-text-secondary/50"
          />
          {/* Changing this button to type="submit" fires the form search safely when tapped */}
          <button 
            type="submit" 
            className="cursor-pointer text-text-secondary dark:text-text-light/50 hover:text-accent-gold"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </header>
  )
}