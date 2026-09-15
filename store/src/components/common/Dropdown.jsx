import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'

/**
 * @typedef {Object} DropdownOption
 * @property {string | number} value - Unique option identifier
 * @property {string} label - Display label
 */

/**
 * @typedef {Object} DropdownProps
 * @property {string | number} value - Currently selected value
 * @property {(value: string | number) => void} onChange - Selection change handler
 * @property {Array<DropdownOption | string>} [options=[]] - List of selectable options
 * @property {string} [placeholder='Select an option'] - Placeholder when no value selected
 * @property {string} [ariaLabel='Select option'] - Accessibility label
 * @property {string} [className=''] - Additional CSS classes
 */

/**
 * Common Accessible Dropdown Primitive
 * Provides animated toggle, keyboard dismissal (Escape), click-outside handling, and active check indicators.
 *
 * @param {DropdownProps} props
 * @returns {JSX.Element}
 */
export default function Dropdown({
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  ariaLabel = 'Select option',
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const normalizedOptions = options.map((option) =>
    typeof option === 'string' ? { value: option, label: option } : option
  )

  const selectedOption = normalizedOptions.find((option) => option.value === value)

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!dropdownRef.current?.contains(event.target)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const handleSelect = (option) => {
    onChange?.(option.value)
    setIsOpen(false)
  }

  return (
    <div ref={dropdownRef} className={`relative min-w-[160px] ${className}`}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className={`flex w-full items-center justify-between gap-3 rounded-xl border bg-bg-card px-3.5 py-2.5 text-left text-sm text-text-primary outline-none transition-colors dark:bg-dark-bg-card dark:border-primary-medium/30 dark:text-white ${
          isOpen
            ? 'border-accent-gold ring-2 ring-accent-gold/20'
            : 'border-border-medium hover:border-accent-gold'
        }`}
      >
        <span className="truncate">
          {selectedOption?.label || placeholder}
        </span>

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-text-secondary dark:text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-xl border border-border-medium bg-bg-card p-1 shadow-xl dark:bg-dark-bg-card dark:border-primary-medium/40 max-h-60 overflow-y-auto">
          {normalizedOptions.map((option) => {
            const isSelected = option.value === value

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-primary-medium text-white font-semibold dark:bg-accent-gold dark:text-primary-dark'
                    : 'text-text-primary hover:bg-bg-input/60 dark:text-slate-200 dark:hover:bg-primary-medium/30 dark:hover:text-white'
                }`}
              >
                <span className="truncate">{option.label}</span>
                {isSelected && <Check className="h-4 w-4 shrink-0 ml-2" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
