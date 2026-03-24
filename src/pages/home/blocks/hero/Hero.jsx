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
              Professional Security Solutions for{' '}
              <span> Your Peace of Mind</span>
            </h1>
            <p className={styles.desc}>
              Design, install, and support CCTV systems with ease. Our Al-driven
              surveillance provides uncompromising clarity and 24/7 reliability.
            </p>
            <div className={styles.buttonsWrapper}>
              <Button to={ROUTES.CALCULATOR}>Open Catalog</Button>
              <Button variant="ghost" to={ROUTES.CALCULATOR}>
                Calculate cost
              </Button>
            </div>
          </div>
          <div className={styles.heroImage}>
            <img src={img} alt="SecureCam Smart Security Camera" />
            <span className={styles.liveBadge}>
              <span className={styles.dot}>●</span>
              Live Stream 4K
            </span>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default Hero
