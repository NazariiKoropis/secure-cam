import styles from './Review.module.scss'

import { getDate } from '@utils/getDate'

const getReviewDate = (review) => {
  const rawDate = review.createdAt

  if (!rawDate) {
    return null
  }

  if (typeof rawDate === 'object' && typeof rawDate.seconds === 'number') {
    return getDate(rawDate.seconds)
  }

  const parsedDate = new Date(rawDate)

  if (Number.isNaN(parsedDate.getTime())) {
    return null
  }

  return parsedDate.toLocaleDateString()
}

function Review({ review }) {
  const author = review.userName
  const text = review.desc
  const date = getReviewDate(review)
  const rating = Number(review.rating)
  const safeRating = Number.isFinite(rating)
    ? Math.max(0, Math.min(5, Math.round(rating)))
    : null

  return (
    <article className={styles.reviewCard}>
      <header className={styles.header}>
        <div>
          <h3 className={styles.author}>{author}</h3>
          {date && <p className={styles.meta}>{date}</p>}
        </div>

        {safeRating !== null && (
          <p
            className={styles.rating}
            aria-label={`Оцінка: ${safeRating} з 5`}
          >
            {'★'.repeat(safeRating)}
            {'☆'.repeat(5 - safeRating)}
          </p>
        )}
      </header>

      <p className={styles.text}>{text}</p>
    </article>
  )
}

export default Review
