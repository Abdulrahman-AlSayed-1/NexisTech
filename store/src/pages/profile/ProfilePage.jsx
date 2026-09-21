import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Lock, 
  Camera, 
  CheckCircle, 
  Plus, 
  Trash2, 
  Edit2, 
  Save 
} from 'lucide-react'

export default function ProfilePage() {
  const dispatch = useDispatch()
  
  const user = useSelector((state) => state.auth?.user) || {
    firstName: 'Ahmed',
    lastName: 'Hassan',
    email: 'customer@koda.com',
    phone: '01234567891',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'
  }

  const [activeTab, setActiveTab] = useState('info')
  const [isSaved, setIsSaved] = useState(false)

  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    phone: user.phone || '',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: 'Home',
      street: '15 El-Tahrir Street, Building 4B',
      city: 'Cairo',
      country: 'Egypt',
      isDefault: true,
    },
    {
      id: 2,
      type: 'Work',
      street: 'Smart Village, Building B12',
      city: 'Giza',
      country: 'Egypt',
      isDefault: false,
    },
  ])

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
  
  const handleProfileSubmit = (e) => {
    e.preventDefault()
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!')
      return
    }
    alert('Password changed successfully!')
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
  }

  const setDefaultAddress = (id) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    )
  }

  const deleteAddress = (id) => {
    setAddresses(addresses.filter((addr) => addr.id !== id))
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      {/* Header Banner */}
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-[#DDA136] block mb-1">
          ACCOUNT MANAGEMENT
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">
          My Profile
        </h1>
        <p className="text-sm mt-1 text-slate-500 dark:text-slate-400">
          Manage your account information, address book, and security settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1">
          {/* User Profile Card */}
          <div className="p-5 rounded-2xl mb-6 flex flex-col items-center text-center shadow-sm bg-white dark:bg-[#253531] border border-slate-200/50 dark:border-[#2F4842]">
            <div className="relative group mb-3">
              <img
                src={user.avatar}
                alt={`${formData.firstName} ${formData.lastName}`}
                className="w-20 h-20 rounded-full object-cover border-2 border-[#DDA136] shadow-sm"
              />
              <button 
                type="button"
                className="absolute bottom-0 right-0 p-1.5 bg-[#DDA136] hover:bg-[#C58C2B] text-white rounded-full transition-colors shadow"
                title="Change Avatar"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <h2 className="font-bold text-base text-slate-800 dark:text-slate-100">
              {formData.firstName} {formData.lastName}
            </h2>
            <p className="text-xs mt-0.5 text-slate-500 dark:text-slate-400">{formData.email}</p>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex lg:flex-col gap-2 p-2 rounded-2xl shadow-sm bg-white dark:bg-[#253531] border border-slate-200/50 dark:border-[#2F4842]">
            <button
              onClick={() => setActiveTab('info')}
              className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                activeTab === 'info'
                  ? 'bg-[#DDA136] text-white shadow'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#2F4842]/50'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Personal Info</span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                activeTab === 'addresses'
                  ? 'bg-[#DDA136] text-white shadow'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#2F4842]/50'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Addresses</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                activeTab === 'security'
                  ? 'bg-[#DDA136] text-white shadow'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#2F4842]/50'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Security</span>
            </button>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl p-6 md:p-8 shadow-sm bg-white dark:bg-[#253531] border border-slate-200/50 dark:border-[#2F4842]">
            {isSaved && (
              <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-3 text-emerald-600 dark:text-emerald-400 text-sm">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span>Profile updated successfully!</span>
              </div>
            )}

            {/* Tab 1: Personal Info */}
            {activeTab === 'info' && (
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">
                  Personal Information
                </h2>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#2F4842] bg-slate-50 dark:bg-[#1D2826] text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#DDA136]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#2F4842] bg-slate-50 dark:bg-[#1D2826] text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#DDA136]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#2F4842] bg-slate-50 dark:bg-[#1D2826] text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#DDA136]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#2F4842] bg-slate-50 dark:bg-[#1D2826] text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#DDA136]"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200/60 dark:border-[#2F4842] flex justify-end">
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-2.5 bg-[#DDA136] hover:bg-[#C58C2B] text-white rounded-xl text-sm font-semibold transition-colors shadow"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Tab 2: Addresses */}
            {activeTab === 'addresses' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                    Saved Addresses
                  </h2>
                  <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-[#44635B] hover:bg-[#2F4842] text-white rounded-xl transition-colors">
                    <Plus className="w-4 h-4" />
                    <span>Add New Address</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`p-5 rounded-xl border transition-all ${
                        addr.isDefault
                          ? 'border-[#DDA136] bg-[#DDA136]/5'
                          : 'border-slate-200 dark:border-[#2F4842] bg-slate-50/50 dark:bg-[#1D2826]/50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-800 dark:text-slate-100">
                            {addr.type}
                          </span>
                          {addr.isDefault && (
                            <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold bg-[#DDA136] text-white rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 text-slate-400 hover:text-slate-200 transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteAddress(addr.id)}
                            className="p-1.5 text-red-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <p className="text-sm text-slate-700 dark:text-slate-200">
                        {addr.street}
                      </p>
                      <p className="text-sm mt-0.5 text-slate-500 dark:text-slate-400">
                        {addr.city}, {addr.country}
                      </p>

                      {!addr.isDefault && (
                        <button
                          onClick={() => setDefaultAddress(addr.id)}
                          className="mt-3 text-xs font-bold text-[#DDA136] hover:underline"
                        >
                          Set as default
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Security */}
            {activeTab === 'security' && (
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">
                  Change Password
                </h2>
                <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, currentPassword: e.target.value })
                      }
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#2F4842] bg-slate-50 dark:bg-[#1D2826] text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#DDA136]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, newPassword: e.target.value })
                      }
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#2F4842] bg-slate-50 dark:bg-[#1D2826] text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#DDA136]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                      }
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#2F4842] bg-slate-50 dark:bg-[#1D2826] text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#DDA136]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#DDA136] hover:bg-[#C58C2B] text-white rounded-xl text-sm font-semibold transition-colors shadow"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
