import React from 'react'

/**
 * @typedef {Object} InputProps
 * @property {string} [label] - Input label rendered above the control
 * @property {string} [error] - Error message rendered beneath the control in rose palette
 * @property {string} [helperText] - Supplementary hint rendered beneath the control
 * @property {string} [id] - Explicit element ID; defaults to kebab-cased label
 * @property {string} [type='text'] - HTML input type (text, email, password, number, etc.)
 * @property {React.ComponentType<{ className?: string }>} [icon] - Lucide icon component for left adornment
 * @property {React.ComponentType<{ className?: string }>} [rightIcon] - Lucide icon component for right adornment
 * @property {() => void} [onRightIconClick] - Click handler for right icon (e.g., toggle password visibility)
 * @property {string} [className=''] - Additional CSS classes applied directly to the input element
 * @property {boolean} [required=false] - Whether the field is mandatory
 */

/**
 * Common Accessible Input Primitive
 * Features label binding, leading/trailing icon slots, field validation styles, and dark-mode tokens.
 *
 * @param {InputProps & React.InputHTMLAttributes<HTMLInputElement>} props
 * @returns {JSX.Element}
 */
export default function Input({
  label,
  error,
  helperText,
  id,
  type = 'text',
  icon: Icon,
  rightIcon: RightIcon,
  onRightIconClick,
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

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-text-secondary dark:text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          id={inputId}
          type={type}
          required={required}
          className={`w-full ${Icon ? 'pl-10' : 'pl-3.5'} ${RightIcon ? 'pr-10' : 'pr-3.5'} py-2.5 bg-bg-card dark:bg-dark-bg-main border rounded-xl text-sm text-text-primary dark:text-text-light placeholder-text-secondary/60 dark:placeholder:text-slate-400 font-body transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary-medium dark:focus:ring-accent-gold focus:border-transparent ${
            error
              ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/30 dark:bg-rose-950/20'
              : 'border-border-medium hover:border-primary-medium dark:border-primary-medium/40 dark:hover:border-accent-gold shadow-2xs'
          } ${className}`}
          {...props}
        />

        {RightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className={`absolute right-3.5 flex items-center text-text-secondary dark:text-slate-400 hover:text-text-primary dark:hover:text-white transition-colors ${
              onRightIconClick ? 'cursor-pointer' : 'pointer-events-none'
            }`}
          >
            <RightIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {error && <p className="text-[11px] text-rose-500 font-medium font-body">{error}</p>}
      {!error && helperText && (
        <p className="text-[11px] text-text-secondary dark:text-slate-400 font-body">{helperText}</p>
      )}
    </div>
  )
}
