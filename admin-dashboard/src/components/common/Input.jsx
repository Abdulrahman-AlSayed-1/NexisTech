export default function Input({
  label,
  error,
  helperText,
  id,
  type = 'text',
  className = '',
  required = false,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-bold text-primary-dark dark:text-text-light uppercase tracking-wider font-heading"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <input
        id={inputId}
        type={type}
        required={required}
        className={`w-full px-3.5 py-2.5 bg-white dark:bg-dark-bg-main border rounded-xl text-sm text-text-primary dark:text-text-light placeholder-text-secondary/60 dark:placeholder:text-slate-300 font-body transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary-medium dark:focus:ring-text-gold focus:border-transparent ${
          error
            ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/30 dark:bg-rose-950/20'
            : 'border-border-medium hover:border-primary-medium dark:border-primary-medium/40 dark:hover:border-text-gold shadow-2xs'
        } ${className}`}
        {...props}
      />

      {error && <p className="text-[11px] text-rose-500 font-medium font-body">{error}</p>}
      {!error && helperText && (
        <p className="text-[11px] text-text-secondary font-body">{helperText}</p>
      )}
    </div>
  )
}
