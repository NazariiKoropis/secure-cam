import styles from './AdminDashboard.module.scss'

import { useQuery } from '@tanstack/react-query'

import { Link } from 'react-router-dom'

import Container from '@layout/container/Container'
import Loader from '@layout/loader/Loader'
import ErrorMessage from '@shared/error-message/ErrorMessage'
import Button from '@ui/button/Button'

import { getAllProducts } from '@api/product.service'
import { getAllOrders } from '@api/order.service'
import { getAllReviews } from '@api/reviews.service'

import { ADMIN_ROUTES } from '@constants/routes'

import { getDate } from '@utils/getDate'

import {
  ArrowRight,
  Boxes,
  ClipboardList,
  MessageSquareMore,
  PackageX,
  ShieldAlert,
  Star,
  Wallet,
} from 'lucide-react'

const LOW_STOCK_LIMIT = 5
const RECENT_ORDERS_LIMIT = 4
const RECENT_REVIEWS_LIMIT = 3

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)

const getTimestampValue = (value) => {
  if (!value) return 0

  if (typeof value.toDate === 'function') {
    return value.toDate().getTime()
  }

  if (typeof value === 'object' && typeof value.seconds === 'number') {
    return value.seconds * 1000
  }

  const parsedDate = new Date(value)

  return Number.isNaN(parsedDate.getTime()) ? 0 : parsedDate.getTime()
}

const getStatusMeta = (status) => {
  switch (status) {
    case 'completed':
      return {
        label: 'Виконано',
        tone: 'success',
      }
    case 'cancelled':
      return {
        label: 'Скасовано',
        tone: 'danger',
      }
    case 'pending':
    default:
      return {
        label: 'В обробці',
        tone: 'warning',
      }
  }
}

const renderRating = (rating) => {
  const safeRating = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)))

  return `${'★'.repeat(safeRating)}${'☆'.repeat(5 - safeRating)}`
}

function AdminDashboard() {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: async () => {
      const [products, orders, reviews] = await Promise.all([
        getAllProducts(),
        getAllOrders(),
        getAllReviews(),
      ])

      if (!products || !orders || !reviews) {
        throw new Error('Failed to load admin dashboard data')
      }

      return { products, orders, reviews }
    },
  })

  if (isLoading) return <Loader />

  if (isError || !data) {
    return (
      <Container>
        <ErrorMessage
          message="Не вдалося завантажити аналітику адмін-панелі."
          onRetry={refetch}
        />
      </Container>
    )
  }

  const { products, orders, reviews } = data

  const categoriesCount = new Set(
    products.map((product) => product.category).filter(Boolean),
  ).size

  const outOfStockCount = products.filter(
    (product) => Number(product.stock) <= 0,
  ).length

  const lowStockProducts = [...products]
    .filter((product) => {
      const stock = Number(product.stock)
      return Number.isFinite(stock) && stock > 0 && stock <= LOW_STOCK_LIMIT
    })
    .sort((a, b) => Number(a.stock) - Number(b.stock))
    .slice(0, 4)

  const pendingOrders = orders.filter((order) => order.status === 'pending')
  const completedOrders = orders.filter((order) => order.status === 'completed')
  const cancelledOrders = orders.filter((order) => order.status === 'cancelled')
  const totalRevenue = orders
    .filter((order) => order.status !== 'cancelled')
    .reduce((sum, order) => sum + Number(order.totalPrice || 0), 0)

  const reviewRatings = reviews
    .map((review) => Number(review.rating))
    .filter((rating) => Number.isFinite(rating))

  const averageRating = reviewRatings.length
    ? (
        reviewRatings.reduce((sum, rating) => sum + rating, 0) /
        reviewRatings.length
      ).toFixed(1)
    : '0.0'

  const pendingReviews = reviews.filter((review) => review.isApproved !== true)

  const recentOrders = [...orders]
    .sort((a, b) => getTimestampValue(b.createdAt) - getTimestampValue(a.createdAt))
    .slice(0, RECENT_ORDERS_LIMIT)

  const recentReviews = [...reviews]
    .sort((a, b) => getTimestampValue(b.createdAt) - getTimestampValue(a.createdAt))
    .slice(0, RECENT_REVIEWS_LIMIT)

  const metrics = [
    {
      label: 'Товари',
      value: products.length,
      hint:
        categoriesCount > 0
          ? `${categoriesCount} категорій, ${outOfStockCount} немає в наявності`
          : `${outOfStockCount} немає в наявності`,
      icon: Boxes,
    },
    {
      label: 'Замовлення',
      value: orders.length,
      hint: `${pendingOrders.length} чекають на обробку`,
      icon: ClipboardList,
    },
    {
      label: 'Виручка',
      value: formatCurrency(totalRevenue),
      hint: `${completedOrders.length} виконаних замовлень`,
      icon: Wallet,
    },
    {
      label: 'Відгуки',
      value: reviews.length,
      hint: `${averageRating} середній рейтинг, ${pendingReviews.length} на модерації`,
      icon: MessageSquareMore,
    },
  ]

  return (
    <Container>
      <section className={styles.dashboard}>
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>Огляд системи</span>
            <h2 className={styles.title}>Контролюйте магазин з одного екрана</h2>
            <p className={styles.subtitle}>
              Стежте за замовленнями, залишками на складі та новими відгуками,
              щоб швидко реагувати на зміни.
            </p>
          </div>

          <div className={styles.heroActions}>
            <Button to={ADMIN_ROUTES.ORDERS}>
              До замовлень
              <ArrowRight size={18} />
            </Button>
            <Button to={ADMIN_ROUTES.REVIEWS} variant="ghost">
              Модерація відгуків
            </Button>
          </div>
        </div>

        <div className={styles.metricsGrid}>
          {metrics.map((metric) => (
            <article key={metric.label} className={styles.metricCard}>
              <div className={styles.metricIcon}>
                <metric.icon size={22} />
              </div>
              <p className={styles.metricLabel}>{metric.label}</p>
              <h3 className={styles.metricValue}>{metric.value}</h3>
              <p className={styles.metricHint}>{metric.hint}</p>
            </article>
          ))}
        </div>

        <div className={styles.summaryGrid}>
          <article className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <span className={styles.panelEyebrow}>Статуси замовлень</span>
                <h3 className={styles.panelTitle}>Поточне навантаження</h3>
              </div>
              <ShieldAlert size={20} />
            </div>

            <div className={styles.statusList}>
              {[
                {
                  label: 'В обробці',
                  value: pendingOrders.length,
                  tone: 'warning',
                },
                {
                  label: 'Виконано',
                  value: completedOrders.length,
                  tone: 'success',
                },
                {
                  label: 'Скасовано',
                  value: cancelledOrders.length,
                  tone: 'danger',
                },
              ].map((item) => (
                <div key={item.label} className={styles.statusItem}>
                  <span
                    className={`${styles.statusDot} ${styles[`statusDot${item.tone}`]}`}
                  />
                  <span className={styles.statusLabel}>{item.label}</span>
                  <strong className={styles.statusValue}>{item.value}</strong>
                </div>
              ))}
            </div>
          </article>

          <article className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <span className={styles.panelEyebrow}>Склад</span>
                <h3 className={styles.panelTitle}>Товари з низьким залишком</h3>
              </div>
              <PackageX size={20} />
            </div>

            {lowStockProducts.length > 0 ? (
              <div className={styles.inventoryList}>
                {lowStockProducts.map((product) => (
                  <div key={product.id} className={styles.inventoryItem}>
                    <div>
                      <p className={styles.inventoryTitle}>{product.name}</p>
                      <p className={styles.inventoryMeta}>
                        {product.category || 'Без категорії'}
                      </p>
                    </div>
                    <strong className={styles.inventoryStock}>
                      {product.stock} шт.
                    </strong>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyPanel}>
                Наразі всі товари мають комфортний залишок на складі.
              </div>
            )}
          </article>
        </div>

        <div className={styles.contentGrid}>
          <article className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <span className={styles.panelEyebrow}>Останні замовлення</span>
                <h3 className={styles.panelTitle}>Свіжа активність клієнтів</h3>
              </div>
              <Link to={ADMIN_ROUTES.ORDERS} className={styles.panelLink}>
                Перейти
              </Link>
            </div>

            {recentOrders.length > 0 ? (
              <div className={styles.ordersList}>
                {recentOrders.map((order) => {
                  const statusMeta = getStatusMeta(order.status)
                  const itemsCount = order.items?.reduce(
                    (sum, item) => sum + Number(item.quantity || 0),
                    0,
                  )

                  return (
                    <article key={order.id} className={styles.orderCard}>
                      <div className={styles.orderTop}>
                        <div>
                          <h4 className={styles.orderTitle}>
                            Замовлення #{order.id.slice(0, 8).toUpperCase()}
                          </h4>
                          <p className={styles.orderMeta}>
                            {order.customerName || 'Клієнт без імені'}
                          </p>
                        </div>
                        <span
                          className={`${styles.badge} ${styles[`badge${statusMeta.tone}`]}`}
                        >
                          {statusMeta.label}
                        </span>
                      </div>

                      <div className={styles.orderInfoRow}>
                        <span>{getDate(order.createdAt)}</span>
                        <span>{itemsCount || 0} товарів</span>
                        <strong>{formatCurrency(order.totalPrice)}</strong>
                      </div>
                    </article>
                  )
                })}
              </div>
            ) : (
              <div className={styles.emptyPanel}>
                Замовлень ще немає, щойно вони з'являться, тут буде остання
                активність.
              </div>
            )}
          </article>

          <article className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <span className={styles.panelEyebrow}>Відгуки</span>
                <h3 className={styles.panelTitle}>Останні повідомлення клієнтів</h3>
              </div>
              <Link to={ADMIN_ROUTES.REVIEWS} className={styles.panelLink}>
                Перейти
              </Link>
            </div>

            {recentReviews.length > 0 ? (
              <div className={styles.reviewsList}>
                {recentReviews.map((review) => (
                  <article key={review.id} className={styles.reviewCard}>
                    <div className={styles.reviewTop}>
                      <div>
                        <h4 className={styles.reviewAuthor}>
                          {review.userName || 'Користувач'}
                        </h4>
                        <p className={styles.reviewDate}>
                          {getDate(review.createdAt)}
                        </p>
                      </div>
                      <span className={styles.reviewRating}>
                        <Star size={16} />
                        {averageRating && renderRating(review.rating)}
                      </span>
                    </div>

                    <p className={styles.reviewText}>{review.desc}</p>

                    <span
                      className={`${styles.badge} ${review.isApproved === true ? styles.badgeSuccess : styles.badgeWarning}`}
                    >
                      {review.isApproved === true
                        ? 'Опубліковано'
                        : 'Очікує модерації'}
                    </span>
                  </article>
                ))}
              </div>
            ) : (
              <div className={styles.emptyPanel}>
                Відгуків поки немає, тому блок модерування ще порожній.
              </div>
            )}
          </article>
        </div>
      </section>
    </Container>
  )
}

export default AdminDashboard
