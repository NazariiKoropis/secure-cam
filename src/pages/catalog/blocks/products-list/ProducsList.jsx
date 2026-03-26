// styles
import styles from './ProductsList.module.scss'

// components
import TechCard from '@shared/tech-card/TechCard'

// icons
import { SearchX } from 'lucide-react'

function ProductsList({ products = [] }) {
  if (products.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.iconWrapper}>
          <SearchX size={48} strokeWidth={1.5} />
        </div>
        <h3 className={styles.emptyTitle}>Товарів не знайдено</h3>
        <p className={styles.emptyDesc}>
          Спробуйте змінити параметри фільтрації або скинути фільтри, щоб
          побачити більше обладнання.
        </p>
      </div>
    )
  }

  return (
    <section className={styles.listSection}>
      <ul className={styles.grid}>
        {products.map((product) => (
          <li key={product.id} className={styles.gridItem}>
            <TechCard item={product} />
          </li>
        ))}
      </ul>
    </section>
  )
}

export default ProductsList
