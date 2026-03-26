//styles
import styles from './Hero.module.scss'

//layout
import Container from '@layout/container/Container'

//ui
import ComboBox from '@ui/combo-box/ComboBox'

function Hero({ sortValue, sortOptions, onSortChange }) {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroContainer}>
        <div className={styles.heroWrapper}>
          <h1 className={styles.title}>Security Equipment Catalog</h1>
          <p className={styles.desc}>
            Professional-grade surveillance hardware optimized for
            high-performance monitoring and environmental resilience.
          </p>
        </div>

        <div className={styles.filterWrapper}>
          <ComboBox
            name="sort"
            label="Sort by"
            value={sortValue}
            options={sortOptions}
            onChange={onSortChange}
            direction="row"
          />
        </div>
      </div>
    </section>
  )
}

export default Hero
