import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import Container from '@layout/container/Container'
import Loader from '@layout/loader/Loader'
import ErrorMessage from '@shared/error-message/ErrorMessage'

import { getAllOrders, updateOrderStatus } from '@api/order.service'

import { getDate } from '@utils/getDate'

import styles from '../admin-shared/AdminSection.module.scss'
import {
  formatCurrency,
  getOrderStatusMeta,
  getTimestampValue,
} from '../admin-shared/admin.helpers'

const ORDER_STATUS_OPTIONS = [
  { value: 'all', label: 'Усі статуси' },
  { value: 'pending', label: 'В обробці' },
  { value: 'completed', label: 'Виконано' },
  { value: 'cancelled', label: 'Скасовано' },
]

const ORDER_STATUS_ACTIONS = [
  { value: 'pending', label: 'В обробку' },
  { value: 'completed', label: 'Позначити виконаним' },
  { value: 'cancelled', label: 'Скасувати' },
]

function AdminOrders() {
  const queryClient = useQueryClient()
  const [searchValue, setSearchValue] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const {
    data: orders,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: getAllOrders,
  })

  const statusMutation = useMutation({
    mutationFn: async ({ orderId, status }) => {
      const result = await updateOrderStatus(orderId, status)

      if (!result) {
        throw new Error('Failed to update order status')
      }

      return result
    },
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] }),
        queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] }),
        queryClient.invalidateQueries({ queryKey: ['orders'] }),
      ])

      const statusMeta = getOrderStatusMeta(variables.status)
      toast.success(`Статус оновлено: ${statusMeta.label.toLowerCase()}.`)
    },
    onError: () => {
      toast.error('Не вдалося оновити статус замовлення.')
    },
  })

  const filteredOrders = useMemo(() => {
    if (!orders) return []

    const normalizedSearch = searchValue.trim().toLowerCase()

    return [...orders]
      .filter((order) => {
        if (statusFilter !== 'all' && order.status !== statusFilter) {
          return false
        }

        if (!normalizedSearch) {
          return true
        }

        const haystack = [
          order.id,
          order.customerName,
          order.phone,
          order.delivery?.city,
          order.delivery?.address,
          order.delivery?.postIndex,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        return haystack.includes(normalizedSearch)
      })
      .sort(
        (a, b) => getTimestampValue(b.createdAt) - getTimestampValue(a.createdAt),
      )
  }, [orders, searchValue, statusFilter])

  if (isLoading) return <Loader />

  if (isError || !orders) {
    return (
      <Container>
        <ErrorMessage
          message="Не вдалося завантажити замовлення для адмінки."
          onRetry={refetch}
        />
      </Container>
    )
  }

  const pendingOrders = orders.filter((order) => order.status === 'pending')
  const completedOrders = orders.filter((order) => order.status === 'completed')
  const cancelledOrders = orders.filter((order) => order.status === 'cancelled')
  const revenue = orders
    .filter((order) => order.status !== 'cancelled')
    .reduce((sum, order) => sum + Number(order.totalPrice || 0), 0)

  return (
    <Container>
      <section className={styles.section}>
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>Замовлення</span>
            <h2 className={styles.title}>Керуйте обробкою в одному списку</h2>
            <p className={styles.subtitle}>
              Перемикайте статуси, перевіряйте склад замовлення та контролюйте
              доставку без переходів між кількома сторінками.
            </p>
          </div>
        </div>

        <div className={styles.toolbar}>
          <input
            type="search"
            className={styles.search}
            placeholder="Пошук за клієнтом, телефоном, адресою або ID"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />

          <div className={styles.filterGroup}>
            <select
              className={styles.select}
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              {ORDER_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.statsGrid}>
          <article className={styles.statCard}>
            <p className={styles.statLabel}>Усі замовлення</p>
            <h3 className={styles.statValue}>{orders.length}</h3>
            <p className={styles.statHint}>Поточний обсяг адмін-черги</p>
          </article>

          <article className={styles.statCard}>
            <p className={styles.statLabel}>Потребують реакції</p>
            <h3 className={styles.statValue}>{pendingOrders.length}</h3>
            <p className={styles.statHint}>Ще в обробці</p>
          </article>

          <article className={styles.statCard}>
            <p className={styles.statLabel}>Виконано</p>
            <h3 className={styles.statValue}>{completedOrders.length}</h3>
            <p className={styles.statHint}>Успішно закриті замовлення</p>
          </article>

          <article className={styles.statCard}>
            <p className={styles.statLabel}>Виручка</p>
            <h3 className={styles.statValue}>{formatCurrency(revenue)}</h3>
            <p className={styles.statHint}>
              {cancelledOrders.length} скасованих замовлень не враховано
            </p>
          </article>
        </div>

        <section className={styles.panel}>
          <header className={styles.panelHeader}>
            <div>
              <h3 className={styles.panelTitle}>Список замовлень</h3>
              <p className={styles.panelSubtitle}>
                Знайдено {filteredOrders.length} записів за поточними фільтрами
              </p>
            </div>
          </header>

          {filteredOrders.length === 0 ? (
            <div className={styles.emptyState}>
              Немає замовлень, що відповідають поточному пошуку або вибраному
              статусу.
            </div>
          ) : (
            <div className={styles.list}>
              {filteredOrders.map((order) => {
                const statusMeta = getOrderStatusMeta(order.status)
                const itemsCount = order.items?.reduce(
                  (sum, item) => sum + Number(item.quantity || 0),
                  0,
                )

                return (
                  <article key={order.id} className={styles.orderCard}>
                    <div className={styles.cardTop}>
                      <div>
                        <h4 className={styles.cardTitle}>
                          Замовлення #{order.id.slice(0, 8).toUpperCase()}
                        </h4>
                        <p className={styles.cardMeta}>
                          {order.customerName || 'Клієнт без імені'}
                        </p>
                      </div>

                      <span
                        className={`${styles.badge} ${styles[`badge${statusMeta.tone}`]}`}
                      >
                        {statusMeta.label}
                      </span>
                    </div>

                    <div className={styles.infoGrid}>
                      <div className={styles.infoCard}>
                        <span className={styles.infoLabel}>Дата</span>
                        <div className={styles.infoValue}>
                          {getDate(order.createdAt)}
                        </div>
                      </div>

                      <div className={styles.infoCard}>
                        <span className={styles.infoLabel}>Контакти</span>
                        <div className={styles.infoValue}>
                          {order.phone || 'Телефон не вказано'}
                        </div>
                      </div>

                      <div className={styles.infoCard}>
                        <span className={styles.infoLabel}>Сума</span>
                        <div className={styles.infoValue}>
                          {formatCurrency(order.totalPrice)}
                        </div>
                      </div>
                    </div>

                    <div className={styles.itemsGrid}>
                      <div className={styles.infoCard}>
                        <span className={styles.infoLabel}>
                          Товари ({itemsCount || 0})
                        </span>
                        {order.items?.length ? (
                          <ul className={styles.itemList}>
                            {order.items.map((item, index) => (
                              <li key={`${item.id || item.name}-${index}`}>
                                {item.name} x{item.quantity}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className={styles.muted}>Позицій не знайдено</div>
                        )}
                      </div>

                      <div className={styles.infoCard}>
                        <span className={styles.infoLabel}>Доставка</span>
                        <div className={styles.infoValue}>
                          {order.delivery?.city || 'Місто не вказано'}
                          <br />
                          <span className={styles.cardMeta}>
                            {order.delivery?.address || 'Адресу не вказано'}
                            {order.delivery?.postIndex
                              ? `, ${order.delivery.postIndex}`
                              : ''}
                          </span>
                        </div>
                        {order.services?.length ? (
                          <ul className={styles.itemList}>
                            {order.services.map((service, index) => (
                              <li key={`${service.name}-${index}`}>
                                Послуга: {service.name}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    </div>

                    <div className={styles.actionsRow}>
                      {ORDER_STATUS_ACTIONS.map((action) => (
                        <button
                          key={action.value}
                          type="button"
                          className={
                            order.status === action.value
                              ? `${styles.statusButton} ${styles.statusButtonActive}`
                              : styles.statusButton
                          }
                          disabled={
                            order.status === action.value || statusMutation.isPending
                          }
                          onClick={() =>
                            statusMutation.mutate({
                              orderId: order.id,
                              status: action.value,
                            })
                          }
                        >
                          {action.label}
                        </button>
                      ))}
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

export default AdminOrders
