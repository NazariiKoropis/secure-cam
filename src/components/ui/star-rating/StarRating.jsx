import { useState } from 'react'
import { Star } from 'lucide-react'
import clsx from 'clsx'
import styles from './StarRating.module.scss'

function StarRating({ value = 0, onChange }) {
  const [hover, setHover] = useState(0)

  const stars = [1, 2, 3, 4, 5]

  return (
    <div className={styles.starContainer}>
      {stars.map((starIndex) => {
        const isActive = starIndex <= (hover || value)

        return (
          <button
            key={starIndex}
            type="button"
            className={clsx(styles.starBtn, isActive && styles.active)}
            onClick={() => onChange(starIndex)}
            onMouseEnter={() => setHover(starIndex)}
            onMouseLeave={() => setHover(0)}
          >
            <Star
              size={28}
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
