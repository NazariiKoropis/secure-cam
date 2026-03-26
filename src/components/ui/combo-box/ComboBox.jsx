//libs
import clsx from 'clsx'
import styles from './ComboBox.module.scss'

//icons
import { ChevronDown } from 'lucide-react'

function ComboBox({
  className,
  name,
  label,
  options = [],
  onChange,
  baseValue = 'Оберіть варіант',
  value,
  direction = 'column',
  ...props
}) {
  const wrapperStyles = clsx(styles.comboBoxWrapper, styles[direction])
  const comboBoxStyles = clsx(styles.select, className)

  const handleChange = (e) => {
    if (onChange) onChange(e)
  }

  return (
    <div className={wrapperStyles}>
      {label && (
        <label className={styles.label} htmlFor={name}>
          {label}
        </label>
      )}

      <div className={styles.selectContainer}>
        <select
          name={name}
          id={name}
          value={value}
          onChange={handleChange}
          className={comboBoxStyles}
          {...props}
        >
          <option value="" disabled>
            {baseValue}
          </option>
          {options.map((option) => {
            const isObject = typeof option === 'object'
            const optionValue = isObject ? option.value : option
            const optionLabel = isObject ? option.label : option
            return (
              <option key={optionValue} value={optionValue}>
                {optionLabel}
              </option>
            )
          })}
        </select>

        <ChevronDown className={styles.customArrow} size={20} />
      </div>
    </div>
  )
}

export default ComboBox
