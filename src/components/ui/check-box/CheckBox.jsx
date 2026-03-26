//styles
import styles from './CheckBox.module.scss'

//util
import clsx from 'clsx'
import { useId } from 'react'

//icons
import { Check } from 'lucide-react'

function CheckBox({
  label,
  checked,
  onChange,
  disabled = false,
  name,
  id,
  className,
  ...props
}) {
  const generatedId = useId()
  const inputId = id || `checkbox-${name || generatedId.replace(/:/g, '')}`

  return (
    <label
      className={clsx(styles.wrapper, disabled && styles.disabled, className)}
      htmlFor={inputId}
    >
      <input
        type="checkbox"
        id={inputId}
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={styles.hiddenInput}
        {...props}
      />

      <div className={clsx(styles.customBox, checked && styles.checked)}>
        {checked && <Check size={14} strokeWidth={3} className={styles.icon} />}
      </div>

      {label && <span className={styles.label}>{label}</span>}
    </label>
  )
}

export default CheckBox
