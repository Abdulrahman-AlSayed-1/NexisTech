import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { Sparkles, Link as LinkIcon, Upload, Trash2, Check } from 'lucide-react'

import Modal from '@/components/common/Modal'
import Button from '@/components/common/Button'
import { selectCurrentUser, updateAvatarThunk } from '@/store/slices/authSlice'

const PRESET_AVATARS = [
  { id: 'bottts-1', label: 'Nexis Bot', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=NexisBot&backgroundColor=2f4842' },
  { id: 'bottts-2', label: 'Cyber Pulse', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=CyberPulse&backgroundColor=1d2826' },
  { id: 'bottts-3', label: 'Quantum', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Quantum&backgroundColor=44635b' },
  { id: 'avataaars-1', label: 'Alex', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=dda136' },
  { id: 'avataaars-2', label: 'Sam', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam&backgroundColor=e1e8e6' },
  { id: 'avataaars-3', label: 'Jordan', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan&backgroundColor=2b3332' },
  { id: 'lorelei-1', label: 'Nova', url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=TechNova&backgroundColor=2f4842' },
  { id: 'lorelei-2', label: 'Vanguard', url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Vanguard&backgroundColor=dda136' },
]

/**
 * AvatarModal Component
 * Allows editing avatar via curated presets, custom image URL, or local file upload,
 * as well as deleting/clearing avatar back to initial initials.
 */
export default function AvatarModal({ isOpen, onClose }) {
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)

  const [activeTab, setActiveTab] = useState('presets') // 'presets' | 'url' | 'upload'
  const [selectedUrl, setSelectedUrl] = useState('')
  const [customUrlInput, setCustomUrlInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageError, setImageError] = useState(false)

  const displayName =
    currentUser?.name ||
    (currentUser?.firstName
      ? `${currentUser.firstName} ${currentUser?.lastName || ''}`.trim()
      : currentUser?.username) ||
    'Valued Customer'

  const defaultInitialsUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
    displayName
  )}&backgroundColor=dda136&textColor=1d2826`

  const currentAvatar = currentUser?.avatar || null

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen)
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen)
    if (isOpen) {
      setSelectedUrl(currentAvatar || '')
      setCustomUrlInput(currentAvatar || '')
      setImageError(false)
      setActiveTab('presets')
    }
  }

  const handleSelectPreset = (url) => {
    setSelectedUrl(url)
    setImageError(false)
  }

  const handleApplyCustomUrl = (e) => {
    e.preventDefault()
    if (!customUrlInput.trim()) return
    setSelectedUrl(customUrlInput.trim())
    setImageError(false)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file (PNG, JPG, SVG, WebP).')
      return
    }

    // Limit to 2MB for browser base64 storage
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image file must be under 2MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result
      if (typeof dataUrl === 'string') {
        setSelectedUrl(dataUrl)
        setImageError(false)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    if (!selectedUrl) {
      toast.info('Please select or provide an avatar image.')
      return
    }

    try {
      setIsSubmitting(true)
      await dispatch(updateAvatarThunk(selectedUrl)).unwrap()
      toast.success('Avatar updated successfully!')
      onClose()
    } catch (err) {
      toast.error(err || 'Failed to update avatar')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    try {
      setIsSubmitting(true)
      await dispatch(updateAvatarThunk(null)).unwrap()
      toast.info('Avatar removed. Switched to default initials.')
      onClose()
    } catch (err) {
      toast.error(err || 'Failed to remove avatar')
    } finally {
      setIsSubmitting(false)
    }
  }

  const previewDisplayUrl = selectedUrl && !imageError ? selectedUrl : defaultInitialsUrl

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Customize Profile Avatar"
      maxWidth="max-w-lg"
      footer={
        <div className="w-full flex items-center justify-between gap-3">
          {/* Delete / Clear button if custom avatar exists */}
          {currentAvatar ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={isSubmitting}
              className="text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/40 hover:bg-rose-50 dark:hover:bg-rose-950/20"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Remove Avatar
            </Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="gold"
              size="sm"
              onClick={handleSave}
              isLoading={isSubmitting}
              disabled={!selectedUrl || selectedUrl === currentAvatar}
            >
              <Check className="w-4 h-4 mr-1.5" />
              Save Avatar
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Active Preview */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-bg-main/50 dark:bg-dark-bg-main/50 border border-border-light dark:border-primary-medium/20">
          <div className="relative shrink-0">
            <img
              src={previewDisplayUrl}
              alt="Avatar Preview"
              className="w-16 h-16 rounded-full object-cover border-2 border-accent-gold shadow-xs"
              onError={() => setImageError(true)}
            />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-accent-gold font-heading">
              Live Preview
            </p>
            <p className="text-sm font-semibold font-heading text-primary-dark dark:text-text-light">
              {displayName}
            </p>
            <p className="text-xs text-text-secondary">
              {selectedUrl ? 'Selected custom avatar' : 'Default initials avatar'}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border-medium/50 dark:border-primary-medium/30 gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`pb-2 text-xs font-bold uppercase tracking-wider font-heading transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'presets'
                ? 'border-accent-gold text-primary-dark dark:text-text-gold'
                : 'border-transparent text-text-secondary hover:text-text-primary dark:hover:text-text-light'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Curated Presets
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`pb-2 text-xs font-bold uppercase tracking-wider font-heading transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'url'
                ? 'border-accent-gold text-primary-dark dark:text-text-gold'
                : 'border-transparent text-text-secondary hover:text-text-primary dark:hover:text-text-light'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            Image URL
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`pb-2 text-xs font-bold uppercase tracking-wider font-heading transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'upload'
                ? 'border-accent-gold text-primary-dark dark:text-text-gold'
                : 'border-transparent text-text-secondary hover:text-text-primary dark:hover:text-text-light'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Upload File
          </button>
        </div>

        {/* Tab 1: Presets Grid */}
        {activeTab === 'presets' && (
          <div className="space-y-3">
            <p className="text-xs text-text-secondary">
              Select one of our high-resolution tech avatars:
            </p>
            <div className="grid grid-cols-4 gap-3">
              {PRESET_AVATARS.map((preset) => {
                const isSelected = selectedUrl === preset.url
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset.url)}
                    className={`group relative flex flex-col items-center p-2 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-accent-gold bg-accent-gold/10 ring-2 ring-accent-gold/40'
                        : 'border-border-light dark:border-primary-medium/20 hover:border-accent-gold/50 bg-bg-card dark:bg-dark-bg-card'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-12 h-12 rounded-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="mt-1.5 text-[10px] font-semibold text-text-secondary group-hover:text-primary-dark dark:group-hover:text-text-light truncate max-w-full font-heading">
                      {preset.label}
                    </span>
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-4 h-4 bg-accent-gold text-primary-dark rounded-full flex items-center justify-center shadow-xs">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Custom URL */}
        {activeTab === 'url' && (
          <form onSubmit={handleApplyCustomUrl} className="space-y-3">
            <div>
              <label
                htmlFor="custom-avatar-url"
                className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1.5 font-heading"
              >
                Direct Image Link (HTTPS)
              </label>
              <div className="flex gap-2">
                <input
                  id="custom-avatar-url"
                  type="url"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 px-3.5 py-2 rounded-xl border border-border-medium/60 dark:border-primary-medium/30 bg-bg-card dark:bg-dark-bg-main text-text-primary dark:text-text-light text-xs focus:outline-none focus:ring-2 focus:ring-accent-gold/50"
                />
                <Button type="submit" variant="outline" size="sm">
                  Preview
                </Button>
              </div>
            </div>
            <p className="text-[11px] text-text-secondary">
              Paste any valid HTTPS image URL from Unsplash, Gravatar, Imgur, or your preferred hosting.
            </p>
          </form>
        )}

        {/* Tab 3: Local Upload */}
        {activeTab === 'upload' && (
          <div className="space-y-3">
            <label
              htmlFor="avatar-file-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border-medium/80 dark:border-primary-medium/40 hover:border-accent-gold rounded-2xl cursor-pointer bg-bg-main/30 dark:bg-dark-bg-main/30 hover:bg-bg-main/60 transition-all text-center p-4"
            >
              <Upload className="w-6 h-6 text-accent-gold mb-2" />
              <p className="text-xs font-bold font-heading text-primary-dark dark:text-text-light">
                Click to browse or drag and drop
              </p>
              <p className="text-[11px] text-text-secondary mt-0.5">
                PNG, JPG, SVG, or WebP (max 2MB)
              </p>
              <input
                id="avatar-file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>
    </Modal>
  )
}
