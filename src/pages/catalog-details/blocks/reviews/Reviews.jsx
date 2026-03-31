//styles
import styles from './Reviews.module.scss'

//components
import Loader from '@layout/loader/Loader'
import ErrorMessage from '@shared/error-message/ErrorMessage'
import Review from '@shared/review/Review'
import Input from '@ui/input/Input'
import Button from '@ui/button/Button'

//api
import { getAllReviewsById } from '@api/reviews.service'

//react
import { useQuery } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'

import StarRating from '@ui/star-rating/StarRating'

//icons
import { SendHorizontal } from 'lucide-react'

const reviewSchema = z.object({
  rating: z.number().min(1, { message: 'Оберіть оцінку від 1 до 5' }),
  reviewText: z.string().min(1, { message: 'Відгук не може бути порожнім' }),
})

function Reviews({ id }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      reviewText: '',
    },
  })

  const onSubmit = async (data) => {
    console.log(data)
  }

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

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {errors.rating && (
          <span className={styles.errorText}>{errors.rating.message}</span>
        )}

        <div className={styles.ratingWrapper}>
          <Controller
            name="rating"
            control={control}
            render={({ field }) => (
              <StarRating value={field.value} onChange={field.onChange} />
            )}
          />
        </div>

        <div className={styles.reviewForm}>
          <div className={styles.inputWrapper}>
            <Input
              type="text"
              name="reviewText"
              label="Ваш відгук"
              {...register('reviewText')}
              error={errors.reviewText?.message}
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            <SendHorizontal />
          </Button>
        </div>
      </form>

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
