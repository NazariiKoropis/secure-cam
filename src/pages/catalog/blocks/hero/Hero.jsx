//styles
import styles from './Hero.module.scss'

//layout
import Container from '@layout/container/Container'

//ui
import ComboBox from '@ui/combo-box/ComboBox'

function Hero({ sortValue, sortOptions, onSortChange }) {
  return (
    <section className={styles.heroSection}>
      <Container className={styles.heroContainer}>
        <div className={styles.heroWrapper}>
          <h1 className={styles.title}>Каталог охоронного обладнання</h1>
          <p className={styles.desc}>
            Професійні рішення відеоспостереження, оптимізовані для
            стабільної роботи та складних умов експлуатації.
          </p>
        </div>

        <div className={styles.filterWrapper}>
          <ComboBox
            name="sort"
            label="Сортувати за"
            value={sortValue}
            options={sortOptions}
            onChange={onSortChange}
            direction="row"
          />
        </div>
      </Container>
    </section>
  )
}

export default Hero
