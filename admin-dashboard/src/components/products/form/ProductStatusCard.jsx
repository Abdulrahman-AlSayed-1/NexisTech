import { Sliders, Check } from 'lucide-react'
import Button from '@/components/common/Button'

export default function ProductStatusCard({
  isActive,
  featured,
  onToggleActive,
  onToggleFeatured,
  onCancel,
  isLoading = false,
  mode = 'create',
}) {
  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-dark-bg-card border border-border-medium dark:border-primary-medium/30 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-primary-dark dark:text-text-gold" />
          <h3 className="text-xs font-bold uppercase tracking-wider font-heading text-primary-dark dark:text-text-light">
            Status & Actions
          </h3>
        </div>
        <span
          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full font-heading flex items-center gap-1.5 ${
            isActive
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/40'
              : 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-900/50 dark:text-slate-400 dark:border-slate-800'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
            }`}
          />
          {isActive ? 'Active' : 'Draft / Hidden'}
        </span>
      </div>

      {/* Active in Store toggle */}
      <button
        type="button"
        onClick={onToggleActive}
        className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
          isActive
            ? 'bg-bg-main/70 dark:bg-primary-medium/15 border-primary-medium/40'
            : 'bg-bg-main/30 dark:bg-dark-bg-main/40 border-border-medium dark:border-primary-medium/20'
        }`}
      >
        <div className="space-y-0.5">
          <p className="text-xs font-bold font-heading text-primary-dark dark:text-text-light">
            Active in Store
          </p>
          <p className="text-[11px] text-text-secondary font-body">
            Visible to shoppers in catalog & search
          </p>
        </div>
        <div
          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
            isActive
              ? 'border-primary-medium bg-primary-medium text-white'
              : 'border-border-medium bg-white dark:bg-dark-bg-card'
          }`}
        >
          {isActive && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </div>
      </button>

      {/* Featured on Homepage toggle */}
      <button
        type="button"
        onClick={onToggleFeatured}
        className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
          featured
            ? 'bg-bg-main/70 dark:bg-primary-medium/15 border-primary-medium/40'
            : 'bg-bg-main/30 dark:bg-dark-bg-main/40 border-border-medium dark:border-primary-medium/20'
        }`}
      >
        <div className="space-y-0.5">
          <p className="text-xs font-bold font-heading text-primary-dark dark:text-text-light">
            Featured Product
          </p>
          <p className="text-[11px] text-text-secondary font-body">
            Showcase in homepage highlights
          </p>
        </div>
        <div
          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
            featured
              ? 'border-primary-medium bg-primary-medium text-white'
              : 'border-border-medium bg-white dark:bg-dark-bg-card'
          }`}
        >
          {featured && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </div>
      </button>

      {/* Sticky Action Buttons */}
      <div className="space-y-2 pt-2 border-t border-border-medium dark:border-primary-medium/30">
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isLoading}
          className="w-full font-bold shadow-xs cursor-pointer py-3"
        >
          {mode === 'edit' ? 'Save Changes' : 'Create Product'}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full cursor-pointer"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
