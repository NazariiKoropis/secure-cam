//styles
import styles from './Teaser.module.scss'

//components
import Container from '@layout/container/Container'
import Button from '@ui/button/Button'

//img
import image from '@images/home/teaser.png'

import { ROUTES } from '@constants/routes'

function Teaser() {
  return (
    <section className={styles.teaserSection}>
      <Container>
        <div className={styles.teaserWrapper}>
          <div className={styles.teaserInfo}>
            <h2 className={styles.title}>
              Build your custom security kit and calculate the price
              automatically
            </h2>
            <p className={styles.desc}>
              No hidden fees. Select your cameras, storage capacity, and
              installation complexity to get an instant quote.
            </p>
            <Button to={ROUTES.CALCULATOR}>Try Calculator</Button>
          </div>

          <div className={styles.imageWrapper}>
            <img src={image} alt="Security kit calculator dashboard" />
          </div>
        </div>
      </Container>
    </section>
  )
}

export default Teaser
