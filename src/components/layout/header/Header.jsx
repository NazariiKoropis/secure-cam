//styles
import styles from './Header.module.scss'

//react
import { useState } from 'react'
//router-dom
import { Link } from 'react-router-dom'

//components
import Container from '@layout/container/Container'
import Logo from '@shared/Logo/Logo'
import AuthModal from '@/components/shared/auth-modal/AuthModal'

//header components
import Nav from './blocks/nav/Nav'
import BurgerMenu from './blocks/burger-menu/BurgerMenu'

//util
import clsx from 'clsx'

//constants
import { ROUTES } from '@constants/routes'

//redux
import { useSelector } from 'react-redux'

//api
import { logout } from '@/api/auth.service'

//nav items
const NAV_ITEMS = [
  { path: ROUTES.HOME, label: 'Головна' },
  { path: ROUTES.CATALOG, label: 'Каталог' },
  { path: ROUTES.CALCULATOR, label: 'Калькулятор' },
]

function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isOpenBurger, setIsOpenBurger] = useState(false)
  const { currentUser, userRole } = useSelector((state) => state.user)

  const onBurgerMenuClick = () => {
    setIsOpenBurger((prev) => !prev)
  }

  const handleLogout = async () => {
    await logout()
  }

  return (
    <header className={styles.headerWrapper}>
      <Container>
        <div className={styles.header}>
          <Link to="/" aria-label="Головна сторінка SecureCam">
            <Logo />
          </Link>

          <Nav
            items={NAV_ITEMS}
            onClick={() => setIsModalOpen(true)}
            currentUser={currentUser}
            userRole={userRole}
            onLogout={handleLogout}
          />

          <button
            type="button"
            className={clsx(
              styles.burgerBtn,
              isOpenBurger && styles['burgerBtn--active'],
            )}
            onClick={onBurgerMenuClick}
            aria-label="Перемкнути меню"
            aria-expanded={isOpenBurger}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </Container>

      <BurgerMenu
        items={NAV_ITEMS}
        isOpen={isOpenBurger}
        onClick={() => setIsModalOpen(true)}
        onClose={() => setIsOpenBurger(false)}
        currentUser={currentUser}
        userRole={userRole}
        onLogout={handleLogout}
      />
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </header>
  )
}

export default Header
