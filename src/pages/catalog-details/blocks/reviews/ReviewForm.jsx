import styles from './Reviews.module.scss' // Можеш потім винести в окремий ReviewForm.module.scss

import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import toast from 'react-hot-toast'
import { SendHorizontal } from 'lucide-react'

//components
import Input from '@ui/input/Input'
import Button from '@ui/button/Button'
import AuthModal from '@shared/auth-modal/AuthModal'
import StarRating from '@ui/star-rating/StarRating'

//api
import { createReview } from '@api/reviews.service'

const reviewSchema = z.object({
  rating: z.number().min(1, { message: 'Оберіть оцінку від 1 до 5' }),
  reviewText: z
    .string()
    .min(1, { message: 'Відгук не може бути порожнім' })
    .max(500, { message: 'Максимальна довжина відгуку 500 символів' }),
})

function ReviewForm({ productId }) {
  const { currentUser } = useSelector((state) => state.user)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      reviewText: '',
    },
  })

  const onSubmit = async (data) => {
    if (!currentUser) {
      setIsModalOpen(true)
      return
    }

    try {
      const review = {
        userId: currentUser.uid,
        userName: currentUser.displayName,
        desc: data.reviewText,
        rating: data.rating,
        product_id: productId,
        isApproved: false,
      }

      await createReview(review)
      reset({ rating: 0, reviewText: '' })
      toast.success('Дякуємо! Відгук відправлено на модерацію.')
    } catch (error) {
      console.error('Неочікувана помилка фронтенду:', error)
      toast.error('Щось пішло не так. Спробуйте пізніше.')
    }
  }

  return (
    <>
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

      {/* Модалка живе тут, бо вона потрібна тільки для форми */}
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}

export default ReviewForm
