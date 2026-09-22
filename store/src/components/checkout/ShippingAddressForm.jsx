import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { User, Phone, MapPin, Building, FileText, CheckCircle2, Edit2 } from 'lucide-react'
import Input from '@/components/common/Input'
import Dropdown from '@/components/common/Dropdown'
import Badge from '@/components/common/Badge'
import SavedAddressSelector from '@/components/checkout/SavedAddressSelector'
import {
  selectShippingAddress,
  updateShippingField,
  setShippingAddress,
  validateEgyptianPhone,
} from '@/store/slices/checkoutSlice'

const EGYPT_CITIES = [
  'Cairo',
  'Giza',
  'Alexandria',
  'Qalyubia',
  'Sharqia',
  'Dakahlia',
  'Gharbia',
  'Menofia',
  'Beheira',
  'Kafr El Sheikh',
  'Damietta',
  'Port Said',
  'Ismailia',
  'Suez',
  'Fayoum',
  'Beni Suef',
  'Minya',
  'Asyut',
  'Sohag',
  'Qena',
  'Luxor',
  'Aswan',
  'Red Sea (Hurghada)',
  'South Sinai (Sharm El Sheikh)',
  'Matrouh',
]

/**
 * ShippingAddressForm Component
 * Renders the customer delivery address and contact details form.
 * Supports choosing from saved/past order addresses or manual entry with auto-save to profile.
 * Directly wired to the Redux checkoutSlice for clean state management.
 *
 * @param {Object} props
 * @param {boolean} [props.showErrors=false] - Whether to highlight validation errors on submit attempt
 */
export default function ShippingAddressForm({ showErrors = false }) {
  const dispatch = useDispatch()
  const shippingAddress = useSelector(selectShippingAddress)
  const user = useSelector((state) => state.auth?.user)

  const [isManualMode, setIsManualMode] = useState(false)

  // Auto-fill from user profile only on initial load if not entering a new address
  useEffect(() => {
    if (!isManualMode && user && !shippingAddress.fullName && user.username) {
      dispatch(updateShippingField({ field: 'fullName', value: user.username }))
    }
    if (!isManualMode && user && !shippingAddress.phone && user.phone) {
      dispatch(updateShippingField({ field: 'phone', value: user.phone }))
    }
  }, [user, isManualMode, shippingAddress.fullName, shippingAddress.phone, dispatch])

  const handleChange = (field, value) => {
    dispatch(updateShippingField({ field, value }))
  }

  const handleSelectSavedAddress = (addr) => {
    dispatch(
      setShippingAddress({
        fullName: addr.fullName || '',
        phone: addr.phone || '',
        city: addr.city || 'Cairo',
        address: addr.street || addr.address || '',
        postalCode: addr.postalCode || '',
        country: addr.country || 'Egypt',
      })
    )
  }

  const handleToggleManualMode = (manual) => {
    setIsManualMode(manual)
    if (manual) {
      // Empty the form completely so customer can enter a clean new address
      dispatch(
        setShippingAddress({
          fullName: '',
          phone: '',
          city: '',
          address: '',
          postalCode: '',
          country: 'Egypt',
        })
      )
    }
  }

  const isPhoneValid = validateEgyptianPhone(shippingAddress.phone)
  const isNameValid = Boolean(shippingAddress.fullName && shippingAddress.fullName.trim().length >= 2)
  const isCityValid = Boolean(shippingAddress.city && shippingAddress.city.trim().length >= 2)
  const isAddressValid = Boolean(shippingAddress.address && shippingAddress.address.trim().length >= 5)

  return (
    <div className="bg-bg-card dark:bg-dark-bg-card rounded-2xl border border-border-light dark:border-primary-medium/30 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-border-light dark:border-primary-medium/30">
        <div>
          <h2 className="text-lg sm:text-xl font-heading font-bold text-primary-dark dark:text-text-light">
            Shipping & Delivery Details
          </h2>
          <p className="text-xs text-text-secondary dark:text-slate-400 mt-0.5">
            Select a saved address or enter a new destination for fast delivery across Egypt
          </p>
        </div>
        <Badge variant="gold" size="sm" dot>
          Egypt Delivery
        </Badge>
      </div>

      {/* 1. Saved Addresses Selector (synced with orders & profile) */}
      <SavedAddressSelector
        selectedAddress={shippingAddress}
        onSelectAddress={handleSelectSavedAddress}
        isManualMode={isManualMode}
        onToggleManualMode={handleToggleManualMode}
      />

      {/* 2. When a saved address is active and user is not in manual mode */}
      {!isManualMode && isAddressValid && (
        <div className="p-4 rounded-xl border border-accent-gold/30 bg-accent-gold/5 dark:bg-accent-gold/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-accent-gold" />
              <span className="text-xs font-bold font-heading text-primary-dark dark:text-text-light">
                Delivering to: {shippingAddress.fullName}
              </span>
            </div>
            <p className="text-xs text-text-secondary dark:text-slate-300 pl-6">
              {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.country}
              {shippingAddress.postalCode ? ` (${shippingAddress.postalCode})` : ''}
              {shippingAddress.phone ? ` • ${shippingAddress.phone}` : ''}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsManualMode(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-gold hover:underline cursor-pointer self-start sm:self-auto shrink-0 font-heading"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit this address
          </button>
        </div>
      )}

      {/* 3. Manual Entry Form (when isManualMode = true or no saved address selected) */}
      {isManualMode && (
        <div className="space-y-4 pt-1 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Full Name */}
            <div className="sm:col-span-1">
              <Input
                label="Full Name *"
                placeholder="e.g. Mohamed Ahmed"
                value={shippingAddress.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                icon={User}
                required
                error={showErrors && !isNameValid ? 'Please enter your full name (at least 2 characters)' : undefined}
              />
            </div>

            {/* Phone Number with Egyptian Format Hint */}
            <div className="sm:col-span-1">
              <Input
                label="Phone Number *"
                type="tel"
                placeholder="01012345678 or +20..."
                value={shippingAddress.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                icon={Phone}
                required
                helperText={!shippingAddress.phone ? 'Egyptian mobile numbers (Vodafone, Orange, Etisalat, WE)' : undefined}
                error={
                  showErrors && !isPhoneValid
                    ? 'Valid Egyptian phone required (e.g. 01012345678 or +2010...)'
                    : undefined
                }
              />
            </div>

            {/* City / Governorate Dropdown */}
            <div className="sm:col-span-1 space-y-1.5">
              <label className="block text-xs font-bold text-primary-dark dark:text-text-light uppercase tracking-wider font-heading">
                City / Governorate *
              </label>
              <Dropdown
                value={shippingAddress.city}
                onChange={(val) => handleChange('city', val)}
                options={EGYPT_CITIES}
                placeholder="Select your governorate"
                className="w-full"
              />
              {showErrors && !isCityValid && (
                <p className="text-xs text-rose-500 font-medium">Please select your city or governorate</p>
              )}
            </div>

            {/* Country (Fixed to Egypt) */}
            <div className="sm:col-span-1 space-y-1.5">
              <label className="block text-xs font-bold text-primary-dark dark:text-text-light uppercase tracking-wider font-heading">
                Country
              </label>
              <div className="h-11 px-4 rounded-xl bg-bg-main/60 dark:bg-dark-bg-main border border-border-light dark:border-primary-medium/30 flex items-center justify-between text-sm font-medium text-text-primary dark:text-text-light">
                <span className="flex items-center gap-2">
                  <span className="text-base">🇪🇬</span> Egypt
                </span>
                <span className="text-xs text-text-secondary dark:text-slate-400">Domestic Delivery</span>
              </div>
            </div>

            {/* Detailed Address */}
            <div className="sm:col-span-2">
              <Input
                label="Street Address & Building / Apartment *"
                placeholder="e.g. 14 El-Tahrir St, Building 4, Apt 12, Floor 3"
                value={shippingAddress.address}
                onChange={(e) => handleChange('address', e.target.value)}
                icon={MapPin}
                required
                error={
                  showErrors && !isAddressValid
                    ? 'Detailed address required (street, building, apartment)'
                    : undefined
                }
              />
            </div>

            {/* Postal Code (Optional) */}
            <div className="sm:col-span-1">
              <Input
                label="Postal Code (Optional)"
                placeholder="e.g. 11511"
                value={shippingAddress.postalCode}
                onChange={(e) => handleChange('postalCode', e.target.value)}
                icon={Building}
              />
            </div>
          </div>
        </div>
      )}

      {/* 4. Delivery Notes (always accessible) */}
      <div className="space-y-1.5 pt-2">
        <label className="block text-xs font-bold text-primary-dark dark:text-text-light uppercase tracking-wider font-heading">
          Delivery Notes & Instructions (Optional)
        </label>
        <div className="relative">
          <textarea
            rows={3}
            placeholder="e.g. Please call upon arrival, leave with security, or deliver after 3 PM..."
            value={shippingAddress.customerNote || ''}
            onChange={(e) => handleChange('customerNote', e.target.value)}
            className="w-full rounded-xl bg-bg-card dark:bg-dark-bg-card border border-border-medium dark:border-primary-medium/40 p-3.5 text-sm text-text-primary dark:text-text-light placeholder:text-text-secondary/60 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-gold/40 focus:border-accent-gold transition-all duration-200 resize-none font-sans"
          />
          <FileText className="w-4 h-4 text-text-secondary/50 absolute bottom-3 right-3 pointer-events-none" />
        </div>
      </div>

      {/* Validation Status Indicator */}
      {isNameValid && isPhoneValid && isCityValid && isAddressValid && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 flex items-center gap-2.5 text-xs text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Shipping address complete and verified for Egyptian courier dispatch.</span>
        </div>
      )}
    </div>
  )
}
