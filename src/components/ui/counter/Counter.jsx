import clsx from 'clsx'
import styles from './Counter.module.scss'

function Counter({ value = 1, setValue, min = 1, max = 99 }) {
  const onDecrementClick = () => {
    if (value <= min) return
    setValue((prev) => prev - 1)
  }

  const onIncrementClick = () => {
    if (value >= max) return
    setValue((prev) => prev + 1)
  }

  return (
    <div className={styles.counterWrapper}>
      <button
        type="button"
        className={clsx(styles.counterButton, value <= min && styles.disabled)}
        onClick={onDecrementClick}
        disabled={value <= min}
      >
        -
      </button>

      <span className={styles.value}>{value}</span>

      <button
        type="button"
        className={clsx(styles.counterButton, value >= max && styles.disabled)}
        onClick={onIncrementClick}
        disabled={value >= max}
      >
        +
      </button>
    </div>
  )
}

export default Counter
