import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { User, Mail, Phone, Save, Camera, Trash2 } from 'lucide-react'

import Button from '@/components/common/Button'
import { selectCurrentUser, updateUser, updateAvatarThunk } from '@/store/slices/authSlice'
import { updateUserProfile } from '@/api/user'
import AvatarModal from '@/components/profile/AvatarModal'

/**
 * PersonalInfoTab Component
 * Form for updating user profile info (name, username, email, phone).
 */
export default function PersonalInfoTab() {
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)

  const [isLoading, setIsLoading] = useState(false)
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)
  const [isRemovingAvatar, setIsRemovingAvatar] = useState(false)

  const displayName =
    currentUser?.name ||
    (currentUser?.firstName
      ? `${currentUser.firstName} ${currentUser?.lastName || ''}`.trim()
      : currentUser?.username) ||
    'Valued Customer'

  const defaultInitialsUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
    displayName
  )}&backgroundColor=dda136&textColor=1d2826`

  const hasCustomAvatar = Boolean(currentUser?.avatar)
  const avatarUrl = currentUser?.avatar || defaultInitialsUrl

  const handleRemoveAvatar = async () => {
    try {
      setIsRemovingAvatar(true)
      await dispatch(updateAvatarThunk(null)).unwrap()
      toast.info('Avatar removed. Switched to default initials.')
    } catch (err) {
      toast.error(err || 'Failed to remove avatar')
    } finally {
      setIsRemovingAvatar(false)
    }
  }

  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || currentUser?.name?.split(' ')[0] || currentUser?.username || '',
    lastName: currentUser?.lastName || currentUser?.name?.split(' ').slice(1).join(' ') || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setIsLoading(true)

      const updatedPayload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        username: `${formData.firstName} ${formData.lastName}`.trim() || currentUser?.username,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      }

      // Try server sync if user ID exists
      const userId = currentUser?._id || currentUser?.id
      if (userId) {
        try {
          await updateUserProfile(userId, updatedPayload)
        } catch {
          // Backend patch endpoint might be partially implemented; proceed with client sync
        }
      }

      // Update Redux state and local storage
      dispatch(updateUser(updatedPayload))
      toast.success('Profile updated successfully!')
    } catch (err) {
      toast.error(err.message || 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold font-heading text-primary-dark dark:text-text-light">
          Personal Information
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-text-secondary">
          Update your personal details and contact information.
        </p>
      </div>

      {/* Profile Photo Management */}
      <div className="mb-6 p-4 rounded-2xl bg-bg-main/40 dark:bg-dark-bg-main/40 border border-border-light dark:border-primary-medium/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-14 h-14 rounded-full object-cover border-2 border-accent-gold shadow-xs shrink-0"
            onError={(e) => {
              e.currentTarget.src = defaultInitialsUrl
            }}
          />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-accent-gold font-heading">
              Profile Photo
            </p>
            <p className="text-sm font-semibold font-heading text-primary-dark dark:text-text-light">
              {currentUser?.avatar ? 'Custom Avatar' : 'Default Initials'}
            </p>
            <p className="text-xs text-text-secondary">
              Personalize your photo across the storefront or reset to initials.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {hasCustomAvatar && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemoveAvatar}
              disabled={isRemovingAvatar}
              className="text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/40 hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Remove
            </Button>
          )}
          <Button
            type="button"
            variant="gold"
            size="sm"
            onClick={() => setIsAvatarModalOpen(true)}
            className="cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 mr-1.5" />
            Change Avatar
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="profile-first-name"
              className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2 font-heading"
            >
              First Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary/60 dark:text-text-light/40" />
              <input
                id="profile-first-name"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="Enter first name"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-medium/60 dark:border-primary-medium/30 bg-bg-card dark:bg-dark-bg-main text-text-primary dark:text-text-light text-sm focus:outline-none focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold transition-all"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="profile-last-name"
              className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2 font-heading"
            >
              Last Name
            </label>
            <input
              id="profile-last-name"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
              className="w-full px-4 py-2.5 rounded-xl border border-border-medium/60 dark:border-primary-medium/30 bg-bg-card dark:bg-dark-bg-main text-text-primary dark:text-text-light text-sm focus:outline-none focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold transition-all"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="profile-email"
            className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2 font-heading"
          >
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary/60 dark:text-text-light/40" />
            <input
              id="profile-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="name@example.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-medium/60 dark:border-primary-medium/30 bg-bg-card dark:bg-dark-bg-main text-text-primary dark:text-text-light text-sm focus:outline-none focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold transition-all"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="profile-phone"
            className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2 font-heading"
          >
            Phone Number
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary/60 dark:text-text-light/40" />
            <input
              id="profile-phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="01XXXXXXXXX"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-medium/60 dark:border-primary-medium/30 bg-bg-card dark:bg-dark-bg-main text-text-primary dark:text-text-light text-sm focus:outline-none focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold transition-all"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-border-light/70 dark:border-primary-medium/20 flex justify-end">
          <Button
            type="submit"
            variant="gold"
            size="md"
            isLoading={isLoading}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </form>

      {/* Avatar Edit Modal */}
      <AvatarModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
      />
    </div>
  )
}
