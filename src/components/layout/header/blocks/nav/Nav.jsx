import { NavLink } from 'react-router-dom'
import clsx from 'clsx'

// components
import Button from '@ui/button/Button'

// styles
import styles from './Nav.module.scss'

function Nav({
  items,
  mobile = false,
  onClick,
  onClose,
  currentUser,
  onLogout,
}) {
  const getNavLinkClass = ({ isActive }) => {
    return clsx(styles.navLink, isActive && styles['navLink--active'])
  }

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
          <div className={styles.userContainer}>
            <img
              src={currentUser.photoURL}
              alt={currentUser.displayName}
              className={styles.avatar}
            />
            <span className={styles.userName}>{currentUser.displayName}</span>
          </div>
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
