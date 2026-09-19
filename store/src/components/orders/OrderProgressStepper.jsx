import React from 'react'
import { Package, Check, XCircle } from 'lucide-react'

const ORDER_STAGES = [
  'Pending',
  'Confirmed',
  'Processing',
  'Shipped',
  'Delivered',
]

/**
 * OrderProgressStepper Component
 * Displays the 5-stage order status progression timeline or a cancellation alert.
 *
 * @param {{ status: string, activeStage: number }} props
 */
export default function OrderProgressStepper({ status, activeStage }) {
  const isCancelled = status === 'Cancelled'

  return (
    <section className="rounded-2xl border border-border-light dark:border-primary-medium/25 bg-bg-card dark:bg-dark-bg-card p-5 sm:p-7 shadow-xs">
      <div className="mb-6 flex items-center gap-2 text-sm font-bold text-primary-dark dark:text-text-gold font-heading">
        <Package className="h-4 w-4 text-accent-gold" />
        <span>Order Progress</span>
      </div>

      {isCancelled ? (
        <div className="flex items-center gap-3 rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-3 text-sm font-semibold text-rose-600 dark:text-rose-400">
          <XCircle className="h-5 w-5 shrink-0" />
          <span>This order has been cancelled.</span>
        </div>
      ) : (
        <div className="relative grid grid-cols-5 gap-1 pt-1">
          {/* Background Track */}
          <div className="absolute left-[10%] right-[10%] top-4 h-0.5 bg-bg-input dark:bg-primary-medium/30" />

          {/* Active Fill Track */}
          <div
            className="absolute left-[10%] top-4 h-0.5 bg-primary-medium transition-all duration-500"
            style={{
              width: `${(activeStage / (ORDER_STAGES.length - 1)) * 80}%`,
            }}
          />

          {ORDER_STAGES.map((stage, index) => {
            const isComplete = index <= activeStage

            return (
              <div
                key={stage}
                className="relative z-10 flex flex-col items-center gap-2 text-center"
              >
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    isComplete
                      ? 'border-primary-medium bg-primary-medium text-white shadow-xs'
                      : 'border-bg-input dark:border-primary-medium/40 bg-bg-card dark:bg-dark-bg-card text-text-secondary'
                  }`}
                >
                  {isComplete ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-current opacity-40" />
                  )}
                </div>

                <span
                  className={`text-[10px] font-medium sm:text-xs transition-colors ${
                    isComplete
                      ? 'text-primary-dark dark:text-text-gold font-semibold'
                      : 'text-text-secondary'
                  }`}
                >
                  {stage}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
