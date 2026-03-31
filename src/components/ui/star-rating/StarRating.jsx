import { useState } from 'react'
import { Star } from 'lucide-react'
import clsx from 'clsx'
import styles from './StarRating.module.scss'

function StarRating({ value = 0, onChange }) {
  // Стан для відстеження, на яку зірку наведено мишкою
  const [hover, setHover] = useState(0)

  // Масив з 5 елементів для малювання зірок
  const stars = [1, 2, 3, 4, 5]

  return (
    <div className={styles.starContainer}>
      {stars.map((starIndex) => {
        // Зірка активна, якщо її номер менший або дорівнює
        // або стану наведення (hover), або вже обраному значенню (value)
        const isActive = starIndex <= (hover || value)

        return (
          <button
            key={starIndex}
            type="button"
            className={clsx(styles.starBtn, isActive && styles.active)}
            onClick={() => onChange(starIndex)}
            onMouseEnter={() => setHover(starIndex)}
            onMouseLeave={() => setHover(0)} // Коли прибрали мишку - скидаємо hover
          >
            <Star
              size={28}
              // Якщо зірка активна, замальовуємо її повністю (fill), інакше вона просто контурна
              fill={isActive ? 'currentColor' : 'none'}
              strokeWidth={isActive ? 0 : 2}
            />
          </button>
        )
      })}
    </div>
  )
}

export default StarRating
