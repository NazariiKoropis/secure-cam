//styles
import styles from './Input.module.scss'

//react
import { forwardRef, useId } from 'react'

//utils
import clsx from 'clsx'

const Input = forwardRef(
  ({ type = 'text', name, label, error, className, ...props }, ref) => {
    const uniqueId = useId()
    const inputId = name || uniqueId

    const inputStyle = clsx(
      styles.input,
      error && styles['input--error'],
      className,
    )

    return (
      <div className={styles.inputWrapper}>
        {label && (
          <label
            className={clsx(styles.label, 'visually-hidden')}
            htmlFor={inputId}
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          placeholder={label}
          className={inputStyle}
          {...props}
        />

        {error && <span className={styles.errorText}>{error}</span>}
      </div>
    )
  },
)

Input.displayName = 'Input'

export default Input
