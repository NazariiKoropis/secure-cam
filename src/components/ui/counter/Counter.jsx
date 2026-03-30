//styles
import styles from './Counter.module.scss'

function Counter({ value, setValue }) {
  const onDecrementClick = () => {
    if (!value) return

    setValue((prev) => prev - 1)
  }

  const onIncrementClick = () => {
    setValue((prev) => prev + 1)
  }

  return (
    <div className={styles.counterWrapper}>
      <button className={styles.counterButton} onClick={onDecrementClick}>
        -
      </button>
      <p className={styles.value}>{value}</p>
      <button className={styles.counterButton} onClick={onIncrementClick}>
        +
      </button>
    </div>
  )
}

export default Counter
