//styles
import styles from './BurgerMenu.module.scss'

//header components
import Nav from '../nav/Nav'

//util
import clsx from 'clsx'

function BurgerMenu({
  items,
  isOpen,
  onClick,
  onClose,
  currentUser,
  onLogout,
}) {
  return (
    <div
      className={clsx(styles.overlay, {
        [styles['overlay--open']]: isOpen,
      })}
      onClick={onClose}
      inert={!isOpen ? true : undefined}
    >
      <div
        className={clsx(styles.burgerMenu, {
          [styles['burgerMenu--open']]: isOpen,
        })}
        onClick={(e) => e.stopPropagation()}
      >
        <Nav
          items={items}
          mobile
          onClick={onClick}
          onClose={onClose}
          currentUser={currentUser}
          onLogout={onLogout}
        />
      </div>
    </div>
  )
}

export default BurgerMenu
