//styles
import styles from './AdminControl.module.scss'

//router
import { NavLink } from 'react-router-dom'

//layout
import Container from '@layout/container/Container'

//icons
import {
  LayoutDashboard,
  MessageSquareMore,
  Package,
  ShoppingCart,
  ShieldCheck,
  User,
} from 'lucide-react'

//constants
import { ADMIN_ROUTES, ROUTES } from '@constants/routes'

const ADMIN_NAV_LINKS = [
  {
    path: ROUTES.ADMIN,
    label: 'Огляд',
    icon: LayoutDashboard,
    end: true,
  },
  {
    path: ADMIN_ROUTES.ORDERS,
    label: 'Замовлення',
    icon: ShoppingCart,
  },
  {
    path: ADMIN_ROUTES.PRODUCTS,
    label: 'Товари',
    icon: Package,
  },
  {
    path: ADMIN_ROUTES.REVIEWS,
    label: 'Відгуки',
    icon: MessageSquareMore,
  },
]

function AdminControl({ user }) {
  const {
    displayName = 'Адміністратор',
    email = 'Email не вказано',
    photoURL,
  } = user || {}

  return (
    <Container>
      <section className={styles.control}>
        <div className={styles.header}>
          <div className={styles.profileCard}>
            <div className={styles.avatarWrapper}>
              {photoURL ? (
                <img
                  src={photoURL}
                  alt={displayName}
                  className={styles.avatar}
                />
              ) : (
                <div className={styles.avatarFallback}>
                  <User size={34} />
                </div>
              )}
            </div>

            <div className={styles.profileContent}>
              <span className={styles.badge}>
                <ShieldCheck size={16} />
                Admin panel
              </span>

              <h1 className={styles.title}>Панель керування</h1>

              <p className={styles.subtitle}>
                Керуй товарами, замовленнями та відгуками з одного місця.
              </p>

              <div className={styles.meta}>
                <span>{displayName}</span>
                <span>{email}</span>
              </div>
            </div>
          </div>
        </div>

        <nav className={styles.nav} aria-label="Навігація адмінки">
          <ul className={styles.navList}>
            {ADMIN_NAV_LINKS.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  end={link.end}
                  className={({ isActive }) =>
                    isActive
                      ? `${styles.navLink} ${styles.navLinkActive}`
                      : styles.navLink
                  }
                >
                  <link.icon size={18} />
                  <span>{link.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </section>
    </Container>
  )
}

export default AdminControl
