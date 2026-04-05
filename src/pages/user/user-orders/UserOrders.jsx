import styles from './UserOrders.module.scss'

//react-query
import { useQuery } from '@tanstack/react-query'

//api
import { getOrdersByUserId } from '@api/order.service'

//components
import Loader from '@layout/loader/Loader'
import Container from '@layout/container/Container'
import ErrorMessage from '@shared/error-message/ErrorMessage'

//utils
import { getDate } from '@utils/getDate'

//icons
import { Package, Clock } from 'lucide-react'

const getStatusBadge = (status) => {
  switch (status) {
    case 'pending':
      return (
        <span className={`${styles.badge} ${styles.pending}`}>В обробці</span>
      )
    case 'completed':
      return (
        <span className={`${styles.badge} ${styles.completed}`}>Виконано</span>
      )
    case 'cancelled':
      return (
        <span className={`${styles.badge} ${styles.cancelled}`}>Скасовано</span>
      )
    default:
      return <span className={styles.badge}>{status}</span>
  }
}

function UserOrders({ uid }) {
  const {
    data: orders,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['orders', uid],
    queryFn: () => getOrdersByUserId(uid),
    enabled: !!uid,
  })

  if (isLoading) return <Loader />

  if (isError) {
    return (
      <Container>
        <ErrorMessage
          message="Не вдалося завантажити замовлення."
          onRetry={refetch}
        />
      </Container>
    )
  }

  if (!orders || orders.length === 0) {
    return (
      <Container>
        <div className={styles.emptyState}>
          <Package size={64} className={styles.emptyIcon} />
          <h2>У вас ще немає замовлень</h2>
          <p>Щойно ви щось придбаєте, історія покупок з'явиться тут.</p>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <section className={styles.ordersSection}>
        <h2 className={styles.title}>Історія замовлень</h2>

        <div className={styles.ordersList}>
          {orders
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((order) => (
              <article key={order.id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <div className={styles.orderMeta}>
                    <h3>Замовлення №{order.id.slice(0, 8).toUpperCase()}</h3>
                    <div className={styles.date}>
                      <Clock size={14} />
                      <span>{getDate(order.createdAt)}</span>
                    </div>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                <hr className={styles.divider} />

                <div className={styles.orderBody}>
                  <div className={styles.itemsBlock}>
                    <h4>Товари:</h4>
                    <ul>
                      {order.items?.map((item, index) => (
                        <li key={index}>
                          <span className={styles.itemName}>{item.name}</span>
                          <span className={styles.itemCount}>
                            x{item.quantity}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {order.services && order.services.length > 0 && (
                    <div className={styles.servicesBlock}>
                      <h4>Послуги:</h4>
                      <ul>
                        {order.services.map((service, index) => (
                          <li key={index}>+ {service.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className={styles.orderFooter}>
                  <p className={styles.address}>
                    <strong>Доставка:</strong> {order.delivery?.city},{' '}
                    {order.delivery?.address}
                  </p>
                  <div className={styles.totalPrice}>
                    Разом: <span>${order.totalPrice}</span>
                  </div>
                </div>
              </article>
            ))}
        </div>
      </section>
    </Container>
  )
}

export default UserOrders
