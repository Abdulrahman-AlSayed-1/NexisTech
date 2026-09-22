import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { User, MapPin, Lock, Package, ArrowUpRight, LogOut, Camera } from 'lucide-react'

import { selectCurrentUser, logoutThunk } from '@/store/slices/authSlice'
import PersonalInfoTab from '@/components/profile/PersonalInfoTab'
import AddressesTab from '@/components/profile/AddressesTab'
import SecurityTab from '@/components/profile/SecurityTab'
import AvatarModal from '@/components/profile/AvatarModal'

/**
 * ProfilePage Component
 * Account management dashboard with personal info, addresses, security tabs, and logout.
 */
export default function ProfilePage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const currentUser = useSelector(selectCurrentUser)
  const [activeTab, setActiveTab] = useState('info')
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)

  const handleLogout = async () => {
    await dispatch(logoutThunk())
    toast.info('You have been signed out.')
    navigate('/login')
  }

  const displayName =
    currentUser?.name ||
    (currentUser?.firstName
      ? `${currentUser.firstName} ${currentUser?.lastName || ''}`.trim()
      : currentUser?.username) ||
    'Valued Customer'

  const displayEmail = currentUser?.email || 'customer@nexis.com'
  const userRole = (currentUser?.role || 'Customer').toUpperCase()
  const defaultInitialsUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
    displayName
  )}&backgroundColor=dda136&textColor=1d2826`
  const avatarUrl = currentUser?.avatar || defaultInitialsUrl

  const tabs = [
    { id: 'info', label: 'Personal Info', icon: User },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'security', label: 'Security', icon: Lock },
  ]

  return (
    <main className="min-h-screen bg-bg-main px-4 py-6 text-text-primary sm:px-6 sm:py-8 lg:px-10 lg:py-10 dark:bg-dark-bg-main">
      <div className="mx-auto w-full max-w-6xl">
        {/* Header Banner */}
        <header className="mb-6 sm:mb-8">
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-accent-gold font-heading">
            Account Management
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading tracking-tight text-primary-dark dark:text-text-light">
            My Profile
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-text-secondary">
            Manage your personal profile, delivery address book, and security settings.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Navigation Sidebar */}
          <aside className="lg:col-span-1 space-y-5">
            {/* User Profile Summary Card */}
            <div className="p-5 rounded-2xl flex flex-col items-center text-center shadow-xs bg-bg-card dark:bg-dark-bg-card border border-border-light dark:border-primary-medium/25">
              <div className="relative mb-3.5 group">
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-20 h-20 rounded-full object-cover border-2 border-accent-gold/80 shadow-xs"
                  onError={(e) => {
                    e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}`
                  }}
                />
                <button
                  type="button"
                  onClick={() => setIsAvatarModalOpen(true)}
                  aria-label="Edit avatar"
                  title="Change avatar"
                  className="absolute bottom-0 right-0 p-1.5 rounded-full bg-accent-gold hover:bg-accent-gold-hover text-primary-dark shadow-xs hover:scale-110 transition-all cursor-pointer border-2 border-bg-card dark:border-dark-bg-card"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <h2 className="font-bold text-base font-heading text-primary-dark dark:text-text-light line-clamp-1">
                {displayName}
              </h2>
              <p className="text-xs text-text-secondary line-clamp-1 mt-0.5">
                {displayEmail}
              </p>

              <span className="mt-2.5 inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-accent-gold/15 text-accent-gold dark:text-text-gold rounded-full font-heading border border-accent-gold/30">
                {userRole}
              </span>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex lg:flex-col gap-1.5 p-1.5 sm:p-2 rounded-2xl shadow-xs bg-bg-card dark:bg-dark-bg-card border border-border-light dark:border-primary-medium/25 overflow-x-auto no-scrollbar">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer font-heading shrink-0 lg:shrink whitespace-nowrap ${
                      isActive
                        ? 'bg-accent-gold text-primary-dark shadow-xs font-bold'
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-main dark:hover:bg-primary-medium/20 dark:text-text-light/70 dark:hover:text-text-light'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>

            {/* Quick Orders Link Card */}
            <Link
              to="/profile/orders"
              className="group flex items-center justify-between p-4 rounded-2xl border border-border-light dark:border-primary-medium/25 bg-bg-card dark:bg-dark-bg-card hover:border-accent-gold/60 transition-all shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-accent-gold/15 text-accent-gold flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold font-heading text-primary-dark dark:text-text-light group-hover:text-accent-gold transition-colors">
                    Order History
                  </p>
                  <p className="text-[11px] text-text-secondary">
                    Track & review orders
                  </p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-text-secondary group-hover:text-accent-gold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </Link>

            {/* Sign Out Action Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="group flex items-center justify-between w-full p-4 rounded-2xl border border-rose-200/70 dark:border-rose-900/30 bg-rose-50/40 dark:bg-rose-950/15 hover:bg-rose-100/60 dark:hover:bg-rose-950/30 hover:border-rose-300 dark:hover:border-rose-800/60 transition-all shadow-xs cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-100/80 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <LogOut className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold font-heading text-rose-600 dark:text-rose-400">
                    Sign Out
                  </p>
                  <p className="text-[11px] text-rose-500/80 dark:text-rose-400/60">
                    Log out of your account
                  </p>
                </div>
              </div>
            </button>
          </aside>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <section className="rounded-3xl p-6 sm:p-8 shadow-xs bg-bg-card dark:bg-dark-bg-card border border-border-light dark:border-primary-medium/25 min-h-[420px]">
              {activeTab === 'info' && <PersonalInfoTab />}
              {activeTab === 'addresses' && <AddressesTab />}
              {activeTab === 'security' && <SecurityTab />}
            </section>
          </div>
        </div>
      </div>

      {/* Avatar Edit Modal */}
      <AvatarModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
      />
    </main>
  )
}
