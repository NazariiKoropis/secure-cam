//styles
import styles from './Hero.module.scss'

//components
import Container from '@layout/container/Container'
import Button from '@ui/button/Button'

//img
import img from '@images/home/home-hero-img.png'

import { ROUTES } from '@constants/routes'

function Hero() {
  return (
    <section className={styles.heroSection}>
      <Container>
        <div className={styles.hero}>
          <div className={styles.content}>
            <h1 className={styles.title}>
              Професійні рішення безпеки для <span> вашого спокою</span>
            </h1>
            <p className={styles.desc}>
              Проектування, установка та підтримка систем CCTV з легкістю. Наш
              штучний інтелект забезпечує безкомпромісну чіткість та 24/7
              надійність.
            </p>
            <div className={styles.buttonsWrapper}>
              <Button to={ROUTES.CATALOG}>Відкрити каталог</Button>
              <Button variant="ghost" to={ROUTES.CALCULATOR}>
                Розрахувати вартість
              </Button>
            </div>
          </div>
          <div className={styles.heroImage}>
            <img src={img} alt="SecureCam Розумна камера безпеки" />
            <span className={styles.liveBadge}>
              <span className={styles.dot}>●</span>
              Прямий потік 4K
            </span>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default Hero
