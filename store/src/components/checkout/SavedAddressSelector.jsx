import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Check, Plus, Package, ArrowLeft, ChevronRight, ChevronLeft } from 'lucide-react'

import {
  fetchMyOrdersThunk,
  selectOrders,
  selectCustomerAddresses,
} from '@/store/slices/ordersSlice'

const INITIAL_LIMIT = 3

/**
 * SavedAddressSelector Component
 * Enables customer to pick an address previously used in past orders during checkout,
 * displaying up to 3 addresses initially in a horizontal scroll row with a "Show More" toggle.
 *
 * @param {{
 *   selectedAddress: object,
 *   onSelectAddress: (address: object) => void,
 *   isManualMode: boolean,
 *   onToggleManualMode: (manual: boolean) => void,
 * }} props
 */
export default function SavedAddressSelector({
  selectedAddress,
  onSelectAddress,
  isManualMode,
  onToggleManualMode,
}) {
  const dispatch = useDispatch()
  const orders = useSelector(selectOrders)
  const addresses = useSelector(selectCustomerAddresses)

  const [showAll, setShowAll] = useState(false)

  // Fetch orders if not yet loaded
  useEffect(() => {
    if (!orders || orders.length === 0) {
      dispatch(fetchMyOrdersThunk({ limit: 20 }))
    }
  }, [dispatch, orders])

  // If no saved addresses from past orders, default to manual mode
  useEffect(() => {
    if (addresses.length === 0 && !isManualMode) {
      onToggleManualMode(true)
    }
  }, [addresses.length, isManualMode, onToggleManualMode])

  // Auto-select default address on initial load if none selected yet
  useEffect(() => {
    if (addresses.length > 0 && !isManualMode && (!selectedAddress || !selectedAddress.address)) {
      const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0]
      if (defaultAddr) {
        onSelectAddress(defaultAddr)
      }
    }
  }, [addresses, isManualMode, selectedAddress, onSelectAddress])

  if (addresses.length === 0) {
    return null
  }

  const isAddressSelected = (addr) => {
    if (isManualMode) return false
    if (!selectedAddress) return false
    const matchStreet =
      selectedAddress.address &&
      (selectedAddress.address === addr.street || selectedAddress.address === addr.address)
    const matchCity = selectedAddress.city && selectedAddress.city === addr.city
    return Boolean(matchStreet && matchCity)
  }

  const visibleAddresses = showAll ? addresses : addresses.slice(0, INITIAL_LIMIT)

  return (
    <div className="space-y-3 pb-5 border-b border-border-light dark:border-primary-medium/25">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary dark:text-slate-400 font-heading">
            {isManualMode ? 'Manual Address Entry' : 'Previous Delivery Addresses'}
          </label>
          {!isManualMode && addresses.length > INITIAL_LIMIT && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent-gold/15 text-accent-gold font-heading">
              Showing {visibleAddresses.length} of {addresses.length}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {!isManualMode && addresses.length > INITIAL_LIMIT && (
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-1 text-xs font-bold text-accent-gold hover:underline cursor-pointer font-heading"
            >
              {showAll ? (
                <>
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Show Top 3
                </>
              ) : (
                <>
                  View All ({addresses.length})
                  <ChevronRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          )}

          {isManualMode ? (
            <button
              type="button"
              onClick={() => {
                const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0]
                if (defaultAddr) {
                  onSelectAddress(defaultAddr)
                }
                onToggleManualMode(false)
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-gold hover:underline cursor-pointer font-heading"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Use a previous address
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onToggleManualMode(true)}
              className="inline-flex items-center gap-1 text-xs font-bold text-accent-gold hover:underline cursor-pointer font-heading"
            >
              <Plus className="w-3.5 h-3.5" />
              Deliver to a new address
            </button>
          )}
        </div>
      </div>

      {/* Horizontally scrollable address cards */}
      {!isManualMode && (
        <div className="flex gap-3 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-border-medium/60 scrollbar-track-transparent snap-x snap-mandatory">
          {visibleAddresses.map((addr) => {
            const isSelected = isAddressSelected(addr)

            return (
              <div
                key={addr.id}
                onClick={() => onSelectAddress(addr)}
                className={`w-[270px] sm:w-[300px] shrink-0 snap-start relative p-4 rounded-2xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
                  isSelected
                    ? 'border-accent-gold bg-accent-gold/5 dark:bg-accent-gold/10 shadow-xs ring-1 ring-accent-gold'
                    : 'border-border-light dark:border-primary-medium/25 bg-bg-card dark:bg-dark-bg-card hover:border-border-medium'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-bg-input/60 dark:bg-dark-bg-main flex items-center justify-center text-text-secondary dark:text-accent-gold">
                        <Package className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-xs font-heading text-primary-dark dark:text-text-light">
                        {addr.type}
                      </span>
                      {addr.isDefault && (
                        <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-accent-gold text-primary-dark rounded-full font-heading">
                          Default
                        </span>
                      )}
                    </div>

                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'border-accent-gold bg-accent-gold text-primary-dark'
                          : 'border-border-medium dark:border-primary-medium/40'
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    {addr.fullName && (
                      <p className="text-xs font-semibold text-text-primary dark:text-text-light truncate">
                        {addr.fullName}
                      </p>
                    )}
                    <p className="text-xs text-text-secondary dark:text-slate-400 line-clamp-2">
                      {addr.street}
                    </p>
                    <p className="text-[11px] text-text-secondary dark:text-slate-400">
                      {addr.city}, {addr.country || 'Egypt'}
                    </p>
                  </div>
                </div>

                {addr.phone && (
                  <p className="text-[11px] font-mono text-text-secondary dark:text-slate-400 pt-2 border-t border-border-light/60 dark:border-primary-medium/20 mt-2">
                    {addr.phone}
                  </p>
                )}
              </div>
            )
          })}

          {/* Inline "+ X more" card when collapsed */}
          {!showAll && addresses.length > INITIAL_LIMIT && (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="w-[160px] shrink-0 snap-start p-4 rounded-2xl border border-dashed border-accent-gold/40 hover:border-accent-gold bg-accent-gold/5 dark:bg-accent-gold/5 flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-accent-gold/15 text-accent-gold flex items-center justify-center group-hover:scale-105 transition-transform">
                <Plus className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold font-heading text-primary-dark dark:text-text-light">
                +{addresses.length - INITIAL_LIMIT} More
              </span>
              <span className="text-[10px] text-accent-gold font-medium">
                View all saved
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
