import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Check, MapPin, Package, Calendar, ArrowRight, ChevronRight, ChevronLeft, Plus } from 'lucide-react'

import Button from '@/components/common/Button'
import Badge from '@/components/common/Badge'
import {
  fetchMyOrdersThunk,
  selectOrdersLoading,
  selectCustomerAddresses,
} from '@/store/slices/ordersSlice'

const INITIAL_LIMIT = 3

/**
 * AddressesTab Component
 * Displays real delivery addresses extracted directly from customer order history.
 * Renders up to 3 addresses initially in a horizontal scroll row with a "Show More" toggle.
 */
export default function AddressesTab() {
  const dispatch = useDispatch()
  const addresses = useSelector(selectCustomerAddresses)
  const isLoading = useSelector(selectOrdersLoading)

  const [showAll, setShowAll] = useState(false)

  // Fetch customer orders on mount if needed
  useEffect(() => {
    dispatch(fetchMyOrdersThunk({ limit: 20 }))
  }, [dispatch])

  const visibleAddresses = showAll ? addresses : addresses.slice(0, INITIAL_LIMIT)

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold font-heading text-primary-dark dark:text-text-light">
            Delivery Addresses
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-text-secondary dark:text-slate-400">
            Addresses automatically recorded from your previous orders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {addresses.length > INITIAL_LIMIT && (
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

          {addresses.length > 0 && (
            <Badge variant="gold" size="sm">
              {addresses.length} {addresses.length === 1 ? 'Address' : 'Addresses'} on file
            </Badge>
          )}
        </div>
      </div>

      {/* Loading state */}
      {isLoading && addresses.length === 0 && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-[280px] h-48 shrink-0 rounded-2xl bg-bg-card/50 dark:bg-dark-bg-card/50 border border-border-light dark:border-primary-medium/20 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Empty State: When user has no past order addresses */}
      {!isLoading && addresses.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border-medium/80 dark:border-primary-medium/30 p-8 sm:p-12 text-center bg-bg-card/40 dark:bg-dark-bg-card/40">
          <div className="w-12 h-12 rounded-2xl bg-accent-gold/15 text-accent-gold flex items-center justify-center mx-auto mb-3.5 shadow-2xs">
            <MapPin className="w-6 h-6" />
          </div>

          <h3 className="text-base font-bold font-heading text-primary-dark dark:text-text-light">
            No delivery addresses yet
          </h3>

          <p className="mt-1.5 text-xs sm:text-sm text-text-secondary dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Addresses you enter when placing orders will automatically appear here for fast one-click selection on future checkouts.
          </p>

          <div className="mt-6">
            <Link to="/products">
              <Button variant="gold" size="sm">
                <span>Start Shopping</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Horizontally scrollable address cards */}
      {addresses.length > 0 && (
        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 scrollbar-thin scrollbar-thumb-border-medium/60 scrollbar-track-transparent snap-x snap-mandatory">
          {visibleAddresses.map((addr) => (
            <div
              key={addr.id}
              className={`w-[280px] sm:w-[320px] shrink-0 snap-start p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                addr.isDefault
                  ? 'border-accent-gold/80 bg-accent-gold/5 dark:bg-accent-gold/5 dark:border-accent-gold/70 shadow-xs ring-1 ring-accent-gold/30'
                  : 'border-border-light dark:border-primary-medium/25 bg-bg-card dark:bg-dark-bg-card hover:border-border-medium'
              }`}
            >
              <div>
                {/* Card Top: Type & Default Tag */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-bg-input/60 dark:bg-dark-bg-main flex items-center justify-center text-text-secondary dark:text-accent-gold">
                      <Package className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-xs font-heading text-primary-dark dark:text-text-light">
                        {addr.type}
                      </span>
                      {addr.orderDate && (
                        <div className="flex items-center gap-1 text-[10px] text-text-secondary dark:text-slate-500">
                          <Calendar className="w-2.5 h-2.5" />
                          <span>
                            Ordered {new Date(addr.orderDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {addr.isDefault && (
                    <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-accent-gold text-primary-dark rounded-full font-heading flex items-center gap-1">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                      Latest
                    </span>
                  )}
                </div>

                {/* Recipient Details */}
                <div className="space-y-1">
                  {addr.fullName && (
                    <p className="text-sm font-semibold text-text-primary dark:text-text-light font-heading truncate">
                      {addr.fullName}
                    </p>
                  )}

                  <p className="text-xs text-text-secondary dark:text-slate-300 leading-relaxed line-clamp-2">
                    {addr.street}
                  </p>

                  <p className="text-xs text-text-secondary dark:text-slate-400">
                    {addr.city}, {addr.country}
                    {addr.postalCode ? ` • ${addr.postalCode}` : ''}
                  </p>

                  {addr.phone && (
                    <p className="text-xs font-mono text-text-secondary dark:text-slate-400 pt-1">
                      {addr.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-4 pt-3 border-t border-border-light dark:border-primary-medium/20 flex items-center justify-between">
                {addr.isDefault ? (
                  <span className="text-[11px] font-medium text-accent-gold flex items-center gap-1">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                    Latest delivery
                  </span>
                ) : (
                  <span className="text-[11px] text-text-secondary dark:text-slate-500">
                    Previous address
                  </span>
                )}

                {addr.orderId && (
                  <Link
                    to={`/orders/${addr.orderId}`}
                    className="text-[11px] text-text-secondary hover:text-primary-dark dark:hover:text-text-light hover:underline"
                  >
                    View order
                  </Link>
                )}
              </div>
            </div>
          ))}

          {/* Inline "+ X more" card when collapsed */}
          {!showAll && addresses.length > INITIAL_LIMIT && (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="w-[180px] shrink-0 snap-start p-5 rounded-2xl border border-dashed border-accent-gold/40 hover:border-accent-gold bg-accent-gold/5 dark:bg-accent-gold/5 flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-colors group"
            >
              <div className="w-9 h-9 rounded-full bg-accent-gold/15 text-accent-gold flex items-center justify-center group-hover:scale-105 transition-transform">
                <Plus className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold font-heading text-primary-dark dark:text-text-light">
                +{addresses.length - INITIAL_LIMIT} More
              </span>
              <span className="text-[11px] text-accent-gold font-medium">
                View all {addresses.length}
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
