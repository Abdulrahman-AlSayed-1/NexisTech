import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'

export default function Dropdown({
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  ariaLabel = 'Select option',
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
    onChange(option.value)
    setIsOpen(false)
  }

  return (
    <div ref={dropdownRef} className="relative min-w-[170px]">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className={`flex w-full items-center justify-between gap-3 rounded-2xl border bg-bg-card px-4 py-3 text-left text-sm text-text-primary outline-none transition-colors dark:bg-dark-bg-main dark:border-primary-medium/30 dark:text-white ${
          isOpen
            ? 'border-accent-gold ring-2 ring-accent-gold/20'
            : 'border-border-light hover:border-accent-gold'
        }`}
      >
        <span className="truncate">
          {selectedOption?.label || placeholder}
        </span>

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-text-secondary dark:text-slate-400 transition-transform duration-200  ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-border-light bg-bg-card p-1 shadow-xl dark:bg-dark-bg-card dark:border-primary-medium/40">
          {normalizedOptions.map((option) => {
            const isSelected = option.value === value

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-primary-medium text-white font-semibold'
                    : 'text-text-primary hover:bg-bg-input dark:text-slate-200 dark:hover:bg-primary-medium/30 dark:hover:text-white'
                }`}
              >
                <span>{option.label}</span>

                {isSelected && <Check className="h-4 w-4 text-text-gold" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
