// styles
import styles from './Nav.module.scss'

//router dom
import { NavLink, Link } from 'react-router-dom'

//util
import clsx from 'clsx'

// components
import Button from '@ui/button/Button'

import { ROUTES } from '@constants/routes'

function Nav({
  items,
  mobile = false,
  onClick,
  onClose,
  currentUser,
  userRole,
  onLogout,
}) {
  const getNavLinkClass = ({ isActive }) => {
    return clsx(styles.navLink, isActive && styles['navLink--active'])
  }

  const profileRoute = userRole === 'admin' ? ROUTES.ADMIN : ROUTES.USER

  return (
    <nav className={clsx(styles.nav, mobile && styles['nav--mobile'])}>
      <ul className={clsx(styles.list, mobile && styles['list--mobile'])}>
        {items.map(({ path, label }) => (
          <li key={path}>
            <NavLink to={path} className={getNavLinkClass} onClick={onClose}>
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      {currentUser ? (
        <div className={styles.userProfile}>
          <Link
            to={profileRoute}
            className={styles.userContainer}
            onClick={onClose}
          >
            <img
              src={currentUser.photoURL}
              alt={currentUser.displayName}
              className={styles.avatar}
            />
            <span className={styles.userName}>{currentUser.displayName}</span>
          </Link>
          <Button
            variant="ghost"
            fullWidth={mobile}
            onClick={() => {
              onLogout()
              if (onClose) onClose()
            }}
          >
            Вийти
          </Button>
        </div>
      ) : (
        <Button
          onClick={() => {
            onClick()
            if (onClose) onClose()
          }}
          fullWidth={mobile}
        >
          Увійти
        </Button>
      )}
    </nav>
  )
}

export default Nav
