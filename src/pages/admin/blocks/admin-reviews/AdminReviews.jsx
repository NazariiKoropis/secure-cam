import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import Container from '@layout/container/Container'
import Loader from '@layout/loader/Loader'
import ErrorMessage from '@shared/error-message/ErrorMessage'

import { getAllProducts } from '@api/product.service'
import { getAllReviews, updateReviewApproval } from '@api/reviews.service'

import { getDate } from '@utils/getDate'

import styles from '../admin-shared/AdminSection.module.scss'
import {
  getReviewStatusMeta,
  getTimestampValue,
  renderRating,
} from '../admin-shared/admin.helpers'

const REVIEW_STATUS_OPTIONS = [
  { value: 'all', label: 'Усі відгуки' },
  { value: 'pending', label: 'На модерації' },
  { value: 'approved', label: 'Опубліковані' },
]

function AdminReviews() {
  const queryClient = useQueryClient()
  const [searchValue, setSearchValue] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['admin', 'reviews'],
    queryFn: async () => {
      const [reviews, products] = await Promise.all([
        getAllReviews(),
        getAllProducts(),
      ])

      if (!reviews || !products) {
        throw new Error('Failed to load admin reviews')
      }

      const productMap = Object.fromEntries(
        products.map((product) => [product.id, product.name]),
      )

      return {
        reviews,
        productMap,
      }
    },
  })

  const moderationMutation = useMutation({
    mutationFn: async ({ reviewId, isApproved }) => {
      const result = await updateReviewApproval(reviewId, isApproved)

      if (!result) {
        throw new Error('Failed to update review approval')
      }

      return result
    },
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] }),
        queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] }),
        queryClient.invalidateQueries({ queryKey: ['reviews'] }),
      ])

      toast.success(
        variables.isApproved
          ? 'Відгук опубліковано.'
          : 'Відгук повернуто на модерацію.',
      )
    },
    onError: () => {
      toast.error('Не вдалося оновити статус відгуку.')
    },
  })

  const filteredReviews = useMemo(() => {
    if (!data?.reviews) return []

    const normalizedSearch = searchValue.trim().toLowerCase()

    return [...data.reviews]
      .filter((review) => {
        if (statusFilter === 'approved' && review.isApproved !== true) {
          return false
        }

        if (statusFilter === 'pending' && review.isApproved === true) {
          return false
        }

        if (!normalizedSearch) {
          return true
        }

        const productName = data.productMap[review.product_id] || ''

        const haystack = [review.userName, review.desc, productName]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        return haystack.includes(normalizedSearch)
      })
      .sort(
        (a, b) => getTimestampValue(b.createdAt) - getTimestampValue(a.createdAt),
      )
  }, [data, searchValue, statusFilter])

  if (isLoading) return <Loader />

  if (isError || !data) {
    return (
      <Container>
        <ErrorMessage
          message="Не вдалося завантажити відгуки для модерації."
          onRetry={refetch}
        />
      </Container>
    )
  }

  const reviewRatings = data.reviews
    .map((review) => Number(review.rating))
    .filter((rating) => Number.isFinite(rating))
  const averageRating = reviewRatings.length
    ? (
        reviewRatings.reduce((sum, rating) => sum + rating, 0) /
        reviewRatings.length
      ).toFixed(1)
    : '0.0'
  const approvedCount = data.reviews.filter(
    (review) => review.isApproved === true,
  ).length
  const pendingCount = data.reviews.length - approvedCount

  return (
    <Container>
      <section className={styles.section}>
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>Відгуки</span>
            <h2 className={styles.title}>Модеруйте клієнтський фідбек швидше</h2>
            <p className={styles.subtitle}>
              Переглядайте нові повідомлення, перевіряйте до якого товару вони
              належать і вирішуйте, що показувати на вітрині.
            </p>
          </div>
        </div>

        <div className={styles.toolbar}>
          <input
            type="search"
            className={styles.search}
            placeholder="Пошук за автором, текстом або товаром"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />

          <div className={styles.filterGroup}>
            <select
              className={styles.select}
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              {REVIEW_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.statsGrid}>
          <article className={styles.statCard}>
            <p className={styles.statLabel}>Усього відгуків</p>
            <h3 className={styles.statValue}>{data.reviews.length}</h3>
            <p className={styles.statHint}>Усі отримані повідомлення</p>
          </article>

          <article className={styles.statCard}>
            <p className={styles.statLabel}>На модерації</p>
            <h3 className={styles.statValue}>{pendingCount}</h3>
            <p className={styles.statHint}>Потребують рішення адміністратора</p>
          </article>

          <article className={styles.statCard}>
            <p className={styles.statLabel}>Опубліковано</p>
            <h3 className={styles.statValue}>{approvedCount}</h3>
            <p className={styles.statHint}>Вже показуються на сайті</p>
          </article>

          <article className={styles.statCard}>
            <p className={styles.statLabel}>Середній рейтинг</p>
            <h3 className={styles.statValue}>{averageRating}</h3>
            <p className={styles.statHint}>За всіма наявними оцінками</p>
          </article>
        </div>

        <section className={styles.panel}>
          <header className={styles.panelHeader}>
            <div>
              <h3 className={styles.panelTitle}>Список відгуків</h3>
              <p className={styles.panelSubtitle}>
                Знайдено {filteredReviews.length} записів за поточними фільтрами
              </p>
            </div>
          </header>

          {filteredReviews.length === 0 ? (
            <div className={styles.emptyState}>
              За поточними параметрами відгуків не знайдено.
            </div>
          ) : (
            <div className={styles.list}>
              {filteredReviews.map((review) => {
                const statusMeta = getReviewStatusMeta(review.isApproved === true)
                const productName =
                  data.productMap[review.product_id] || 'Товар не знайдено'

                return (
                  <article key={review.id} className={styles.reviewCard}>
                    <div className={styles.cardTop}>
                      <div>
                        <h4 className={styles.cardTitle}>
                          {review.userName || 'Користувач без імені'}
                        </h4>
                        <p className={styles.cardMeta}>
                          {productName} · {getDate(review.createdAt)}
                        </p>
                      </div>

                      <span
                        className={`${styles.badge} ${styles[`badge${statusMeta.tone}`]}`}
                      >
                        {statusMeta.label}
                      </span>
                    </div>

                    <div className={styles.productMetaRow}>
                      <span className={styles.reviewRating}>
                        {renderRating(review.rating)}
                      </span>
                    </div>

                    <p className={styles.description}>{review.desc}</p>

                    <div className={styles.actionsRow}>
                      <button
                        type="button"
                        className={styles.statusButton}
                        disabled={moderationMutation.isPending}
                        onClick={() =>
                          moderationMutation.mutate({
                            reviewId: review.id,
                            isApproved: review.isApproved !== true,
                          })
                        }
                      >
                        {review.isApproved === true
                          ? 'Повернути на модерацію'
                          : 'Опублікувати'}
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </section>
    </Container>
  )
}

export default AdminReviews
