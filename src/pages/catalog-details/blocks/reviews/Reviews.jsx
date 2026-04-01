import styles from './Reviews.module.scss'

//components
import Loader from '@layout/loader/Loader'
import ErrorMessage from '@shared/error-message/ErrorMessage'
import Review from '@shared/review/Review'
import ReviewForm from './ReviewForm' // Імпортуємо нашу нову форму

//api
import { getAllReviewsById } from '@api/reviews.service'

//react
import { useQuery } from '@tanstack/react-query'

function Reviews({ id }) {
  const {
    data: reviews,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => getAllReviewsById(id),
    enabled: !!id,
  })

  if (isLoading) {
    return <Loader />
  }

  if (isError || !reviews) {
    return (
      <section className={styles.reviewsSection}>
        <ErrorMessage
          onRetry={refetch}
          message="Не вдалося завантажити відгуки."
        />
      </section>
    )
  }

  return (
    <section className={styles.reviewsSection}>
      <h2 className={styles.title}>Відгуки покупців ({reviews.length})</h2>

      <ReviewForm productId={id} />

      {reviews.length === 0 ? (
        <div className={styles.emptyReviews}>
          <h3>Відгуків ще немає</h3>
          <p>Будьте першим, хто поділиться враженнями про цей товар!</p>
        </div>
      ) : (
        <ul className={styles.reviewsList}>
          {reviews.map((item) => (
            <li key={item.id}>
              <Review review={item} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default Reviews
