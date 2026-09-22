import { useRef, useEffect } from 'react'

/**
 * OtpInput Component
 * Accessible, keyboard-friendly multi-digit OTP input with automatic focus advancement,
 * backspace navigation, arrow key navigation, and clipboard paste support.
 *
 * @param {Object} props
 * @param {number} [props.length=6] - Number of OTP digit slots
 * @param {string} props.value - Current OTP string
 * @param {Function} props.onChange - Callback fired with the updated OTP string
 * @param {boolean} [props.disabled=false] - Whether inputs are disabled
 * @param {boolean} [props.hasError=false] - Whether to show error state
 * @param {boolean} [props.autoFocus=true] - Auto focus first slot on mount
 * @param {string} [props.className=''] - Additional container classes
 */
export default function OtpInput({
  length = 6,
  value = '',
  onChange,
  disabled = false,
  hasError = false,
  autoFocus = true,
  className = '',
}) {
  const inputsRef = useRef([])

  // Ensure digits array matches length
  const digits = Array.from({ length }, (_, i) => value[i] || '')

  useEffect(() => {
    if (autoFocus && inputsRef.current[0] && !disabled) {
      inputsRef.current[0].focus()
    }
  }, [autoFocus, disabled])

  const focusInput = (index) => {
    const clamped = Math.max(0, Math.min(length - 1, index))
    inputsRef.current[clamped]?.focus()
  }

  const handleChange = (e, index) => {
    const rawVal = e.target.value
    // Extract only digits
    const cleaned = rawVal.replace(/\D/g, '')

    if (!cleaned) {
      // Empty / cleared
      const updated = [...digits]
      updated[index] = ''
      onChange(updated.join(''))
      return
    }

    if (cleaned.length === 1) {
      const updated = [...digits]
      updated[index] = cleaned
      onChange(updated.join(''))
      if (index < length - 1) {
        focusInput(index + 1)
      }
    } else {
      // Multiple digits entered (e.g. autofill or browser paste)
      handlePasteString(cleaned, index)
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        // If current slot is empty, move back and clear previous slot
        const updated = [...digits]
        updated[index - 1] = ''
        onChange(updated.join(''))
        focusInput(index - 1)
        e.preventDefault()
      } else if (digits[index]) {
        const updated = [...digits]
        updated[index] = ''
        onChange(updated.join(''))
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      focusInput(index - 1)
      e.preventDefault()
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      focusInput(index + 1)
      e.preventDefault()
    }
  }

  const handlePasteString = (pastedText, startIndex = 0) => {
    const digitsOnly = pastedText.replace(/\D/g, '').slice(0, length)
    if (!digitsOnly) return

    const updated = [...digits]
    for (let i = 0; i < digitsOnly.length; i++) {
      const targetIndex = startIndex + i
      if (targetIndex < length) {
        updated[targetIndex] = digitsOnly[i]
      }
    }

    onChange(updated.join(''))
    // Focus next empty slot or the last populated slot
    const nextSlot = Math.min(length - 1, startIndex + digitsOnly.length)
    focusInput(nextSlot)
  }

  const handlePaste = (e, index) => {
    e.preventDefault()
    const text = e.clipboardData?.getData('text') || ''
    handlePasteString(text, index)
  }

  return (
    <div
      className={`flex items-center justify-between gap-1.5 sm:gap-2.5 max-w-sm mx-auto ${className}`}
      role="group"
      aria-label="One-Time Password input"
    >
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={(e) => handlePaste(e, i)}
          onFocus={(e) => e.target.select()}
          aria-label={`Digit ${i + 1} of ${length}`}
          className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold font-mono rounded-xl border transition-all duration-200 outline-none select-none
            ${
              hasError
                ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 focus:ring-2 focus:ring-rose-500/30'
                : digit
                ? 'border-accent-gold/80 dark:border-accent-gold/60 bg-bg-card dark:bg-dark-bg-card text-primary-dark dark:text-text-light shadow-xs shadow-accent-gold/10'
                : 'border-border-medium dark:border-primary-medium/40 bg-bg-input dark:bg-dark-bg-input text-text-primary dark:text-text-light hover:border-border-dark dark:hover:border-primary-medium'
            }
            focus:border-accent-gold focus:ring-3 focus:ring-accent-gold/25 focus:scale-105 disabled:opacity-50 disabled:cursor-not-allowed cursor-text`}
        />
      ))}
    </div>
  )
}
