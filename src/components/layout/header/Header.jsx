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

const NAV_ITEMS = [
  { path: '/', label: 'Головна' },
  { path: '/catalog', label: 'Каталог' },
  { path: '/calculator', label: 'Калькулятор' },
]

function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isOpenBurger, setIsOpenBurger] = useState(false)

  const onBurgerMenuClick = () => {
    setIsOpenBurger((prev) => !prev)
  }

  const onModalOpenClick = () => {
    setIsModalOpen((prev) => !prev)
  }

  return (
    <header className={styles.headerWrapper}>
      <Container>
        <div className={styles.header}>
          <Link to="/" aria-label="Головна сторінка SecureCam">
            <Logo />
          </Link>

          <Nav items={NAV_ITEMS} onClick={onModalOpenClick} />

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
        onClick={onModalOpenClick}
        onClose={() => setIsOpenBurger(false)}
      />
      <AuthModal isOpen={isModalOpen} onClose={onModalOpenClick} />
    </header>
  )
}

export default Header
