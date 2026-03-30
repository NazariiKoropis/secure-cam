//styles
import styles from './Reviews.module.scss'

//components
import Loader from '@layout/loader/Loader'
import ErrorMessage from '@shared/error-message/ErrorMessage'
import Review from '@shared/review/Review'
import Input from '@ui/input/Input'

//api
import { getAllReviewsById } from '@api/reviews.service'

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

  if (reviews.length === 0) {
    return (
      <section className={styles.reviewsSection}>
        <div className={styles.emptyReviews}>
          <h3>Відгуків ще немає</h3>
          <p>Будьте першим, хто поділиться враженнями про цей товар!</p>
        </div>
      </section>
    )
  }

  //TODO: придумати як реалізувати добавлення коментарів та вивід відгуків

  return (
    <section className={styles.reviewsSection}>
      <h2 className={styles.title}>Відгуки покупців ({reviews.length})</h2>

      <ul className={styles.reviews}>
        {reviews.map((review) => (
          <li key={review.id}>
            <Review review={review} />
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Reviews
