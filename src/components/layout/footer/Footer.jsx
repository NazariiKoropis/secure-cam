//styles
import styles from './Footer.module.scss'

//components
import Container from '@layout/container/Container'
import Logo from '@shared/Logo/Logo'

//router dom
import { Link } from 'react-router-dom'

//constants
import { ROUTES } from '@constants/routes'
import { CONTACTS } from '@constants/contacts'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link to={ROUTES.HOME} aria-label="Головна сторінка">
              <Logo width="180" height="45" />
            </Link>
            <p className={styles.description}>
              Професійні системи відеоспостереження та безпеки. Проєктування,
              встановлення та підтримка.
            </p>

            <a href={`mailto:${CONTACTS.EMAIL}`} className={styles.contact}>
              {CONTACTS.EMAIL}
            </a>
          </div>

          <div className={styles.linksWrapper}>
            <div className={styles.linkGroup}>
              <h4 className={styles.title}>Навігація</h4>
              <nav className={styles.nav}>
                <Link to={ROUTES.CATALOG}>Каталог обладнання</Link>
                <Link to={ROUTES.CALCULATOR}>Калькулятор вартості</Link>
                <Link to={ROUTES.ABOUT}>Про компанію</Link>
              </nav>
            </div>

            <div className={styles.linkGroup}>
              <h4 className={styles.title}>Клієнтам</h4>
              <nav className={styles.nav}>
                <Link to={ROUTES.FAQ}>Часті питання</Link>
                <Link to={ROUTES.DELIVERY}>Доставка та оплата</Link>
                <Link to={ROUTES.PRIVACY}>Політика конфіденційності</Link>
              </nav>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {currentYear} SecureCam. Всі права захищені.</p>
          <p>Створено з турботою про безпеку</p>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
