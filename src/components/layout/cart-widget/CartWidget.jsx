import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import styles from './CartWidget.module.scss'
import { ROUTES } from '@/constants/routes' // Твої роути

function CartWidget() {
  const navigate = useNavigate()

  const { items } = useSelector((state) => state.cart)

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  if (totalItems === 0) return null

  return (
    <div className={styles.widgetWrapper} onClick={() => navigate(ROUTES.CART)}>
      <div className={styles.iconBox}>
        <ShoppingCart size={24} />
        <span className={styles.badge}>{totalItems}</span>
      </div>
      <span className={styles.label}>Кошик</span>
    </div>
  )
}

export default CartWidget
