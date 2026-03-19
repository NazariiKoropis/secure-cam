import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import clsx from 'clsx'

//components
import Container from '@layout/container/Container' // Виправив подвійний слеш
import Button from '@ui/button/Button'
import Logo from '@shared/Logo/Logo'
// import Modal from '@/components/ui/modal/Modal' // Поки закоментував, якщо не юзається

import styles from './Header.module.scss'

const NAV_ITEMS = [
  { path: '/', label: 'Головна' },
  { path: '/catalog', label: 'Каталог' },
  { path: '/calculator', label: 'Калькулятор' },
]

const getNavLinkClass = ({ isActive }) => {
  return clsx(styles.navLink, isActive && styles['navLink--active'])
}

function Header() {
  const [isOpenBurger, setIsOpenBurger] = useState(false)

  const onBurgerMenuClick = () => {
    setIsOpenBurger((prev) => !prev)
  }

  return (
    <header className={styles.headerWrapper}>
      <Container>
        <div className={styles.header}>
          <Link to="/" aria-label="Головна сторінка SecureCam">
            <Logo />
          </Link>

          <nav className={styles.desktopNav}>
            <ul className={styles.desktopList}>
              {NAV_ITEMS.map(({ path, label }) => (
                <li key={path}>
                  {' '}
                  <NavLink to={path} className={getNavLinkClass}>
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <Button onClick={() => alert('Вхід')}>Увійти</Button>
          </nav>

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
    </header>
  )
}

export default Header
