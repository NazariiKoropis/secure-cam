import styles from './Cart.module.scss'
import { useState } from 'react'

// redux
import { useSelector, useDispatch } from 'react-redux'
import { removeItem } from '@redux/cart/cartSlice'

// router
import { Link } from 'react-router-dom'

// components
import Button from '@ui/button/Button'
import Container from '@layout/container/Container'
import AuthModal from '@shared/auth-modal/AuthModal'
import OrderModal from '@shared/order-modal/OrderModal'
import { formatCurrency } from '@utils/formatCurrency'

// icons
import { Trash2, Check } from 'lucide-react'

const ADDITIONAL_SERVICES = [
  { id: 'install', name: 'Професійне встановлення', price: 50 },
  { id: 'setup', name: 'Налаштування та запуск', price: 20 },
  { id: 'warranty', name: 'Розширена гарантія (+1 рік)', price: 30 },
]

function Cart() {
  const { items } = useSelector((state) => state.cart)
  const { currentUser } = useSelector((state) => state.user)

  const [isOpen, setIsOpen] = useState(false)
  const dispatch = useDispatch()

  const [selectedServices, setSelectedServices] = useState([])

  const toggleService = (serviceId) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId],
    )
  }

  const itemsTotalPrice = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0,
  )

  const selectedServicesData = ADDITIONAL_SERVICES.filter((service) =>
    selectedServices.includes(service.id),
  )

  const servicesTotalPrice = selectedServicesData.reduce(
    (sum, service) => sum + service.price,
    0,
  )

  const finalTotal = itemsTotalPrice + servicesTotalPrice

  const orderPayload = {
    items: items,
    services: selectedServicesData,
    totalPrice: finalTotal,
  }

  if (items.length === 0) {
    return (
      <Container>
        <section className={styles.emptyCart}>
          <h2>Ваш кошик порожній</h2>
          <p>Ви ще не додали жодного товару. Час це виправити!</p>
          <Link to="/catalog">
            <Button>ПЕРЕЙТИ ДО КАТАЛОГУ</Button>
          </Link>
        </section>
      </Container>
    )
  }

  const ModalComponent = !currentUser ? AuthModal : OrderModal

  return (
    <Container>
      <section className={styles.cartSection}>
        <h1 className={styles.title}>Оформлення замовлення</h1>

        <div className={styles.cartLayout}>
          <div className={styles.leftColumn}>
            <div className={styles.itemsList}>
              {items.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.imageWrapper}>
                    <img src={item.imgPath} alt={item.name} />
                  </div>

                  <div className={styles.itemInfo}>
                    <h3>{item.name}</h3>
                    <p className={styles.category}>{item.category}</p>
                  </div>

                  <div className={styles.itemPrice}>
                    <p>{formatCurrency(item.price)}</p>
                    <span>x {item.quantity} шт.</span>
                  </div>

                  <div className={styles.itemTotal}>
                    <p>{formatCurrency(Number(item.price) * item.quantity)}</p>
                  </div>

                  <button
                    type="button"
                    className={styles.deleteBtn}
                    onClick={() => dispatch(removeItem(item.id))}
                    aria-label="Видалити товар"
                  >
                    <Trash2 size={24} />
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.servicesBlock}>
              <h2>Додаткові послуги</h2>
              <div className={styles.servicesList}>
                {ADDITIONAL_SERVICES.map((service) => {
                  const isSelected = selectedServices.includes(service.id)
                  return (
                    <label
                      key={service.id}
                      className={`${styles.serviceCard} ${
                        isSelected ? styles.active : ''
                      }`}
                    >
                      <div className={styles.checkbox}>
                        {isSelected && <Check size={16} strokeWidth={3} />}
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleService(service.id)}
                          hidden
                        />
                      </div>
                      <div className={styles.serviceInfo}>
                        <p>{service.name}</p>
                        <span>+{formatCurrency(service.price)}</span>
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>
          </div>

          <aside className={styles.summary}>
            <h2>Сума замовлення</h2>

            <div className={styles.summaryRow}>
              <span>Товари ({items.length}):</span>
              <span>{formatCurrency(itemsTotalPrice)}</span>
            </div>

            {servicesTotalPrice > 0 && (
              <div className={styles.summaryRow}>
                <span>Дод. послуги:</span>
                <span>+{formatCurrency(servicesTotalPrice)}</span>
              </div>
            )}

            <div className={styles.summaryRow}>
              <span>Доставка:</span>
              <span>За тарифами перевізника</span>
            </div>

            <hr className={styles.divider} />

            <div className={styles.summaryTotal}>
              <span>Всього до сплати:</span>
              <span>{formatCurrency(finalTotal)}</span>
            </div>

            <Button onClick={() => setIsOpen(true)} fullWidth>
              ОФОРМИТИ ЗАМОВЛЕННЯ
            </Button>
          </aside>
        </div>
      </section>

      {isOpen && (
        <ModalComponent
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          orderData={orderPayload}
        />
      )}
    </Container>
  )
}

export default Cart
