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
              Побудуйте свій набір безпеки та розраховуйте вартість автоматично
            </h2>
            <p className={styles.desc}>
              Без прихованих комісій. Виберіть камери, обсяг сховища та
              складність установки, щоб отримати миттєву кошторис.
            </p>
            <Button to={ROUTES.CALCULATOR}>Спробувати калькулятор</Button>
          </div>

          <div className={styles.imageWrapper}>
            <img src={image} alt="Панель калькулятора набору безпеки" />
          </div>
        </div>
      </Container>
    </section>
  )
}

export default Teaser
