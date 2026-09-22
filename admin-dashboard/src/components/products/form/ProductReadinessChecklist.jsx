import { Sparkles, CheckCircle2, Circle } from 'lucide-react'

export default function ProductReadinessChecklist({
  checklist = [],
  completedCount = 0,
}) {
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-dark-bg-card border border-border-medium dark:border-primary-medium/30 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-text-gold" />
          <span className="text-xs font-bold font-heading text-primary-dark dark:text-text-light">
            Catalog Readiness
          </span>
        </div>
        <span className="text-[10px] font-bold font-heading px-2 py-0.5 rounded-full bg-bg-main dark:bg-dark-bg-main text-primary-medium dark:text-text-gold border border-border-medium dark:border-primary-medium/30">
          {completedCount} / 4 Complete
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-bg-main dark:bg-dark-bg-main rounded-full h-1.5 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-medium to-text-gold transition-all duration-300"
          style={{ width: `${(completedCount / 4) * 100}%` }}
        />
      </div>

      {/* Checklist Items */}
      <div className="space-y-2 pt-1">
        {checklist.map((item, idx) => (
          <div key={idx} className="flex items-start gap-2 text-xs">
            {item.done ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            ) : (
              <Circle className="w-4 h-4 text-text-secondary/40 shrink-0 mt-0.5" />
            )}
            <div>
              <p
                className={`font-semibold font-heading leading-tight ${
                  item.done
                    ? 'text-primary-dark dark:text-text-light'
                    : 'text-text-secondary'
                }`}
              >
                {item.label}
              </p>
              <p className="text-[10px] text-text-secondary/80 font-body">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
