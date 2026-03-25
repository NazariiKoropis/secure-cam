//styles
import styles from './Featured.module.scss'

//components
import Container from '@layout/container/Container'

//card
import TechCard from '@shared/tech-card/TechCard'

//router-dom
import { Link } from 'react-router-dom'

//
import { ROUTES } from '@constants/routes'

const FEATURED_ITEMS = [
  {
    id: 'camera-1',
    title: 'Купольна IP-камера Pro 4K',
    price: '150',
    amenities: ['PoE', 'IR 30m'],
  },
  {
    id: 'camera-2',
    title: 'Розумна куля-камера',
    price: '120',
    amenities: ['Wi-Fi', 'AI Tracking'],
  },
  {
    id: 'camera-3',
    title: 'NVR 8-каналів',
    price: '200',
    amenities: ['2TB HDD', '4K Output'],
  },
  {
    id: 'camera-4',
    title: 'PTZ Поворотний купол',
    price: '450',
    amenities: ['36x Zoom', 'Auto-patrol'],
  },
]

function Featured() {
  return (
    <section className={styles.featuredSection}>
      <Container>
        <header className={styles.featuredHeader}>
          <div className={styles.textWrapper}>
            <h2 className={styles.featuredTitle}>РЕКОМЕНДОВАНЕ ОБЛАДНАННЯ</h2>
            <p className={styles.desc}>
              Найпопулярніші системи спостереження 2024 року
            </p>
          </div>

          <Link className={styles.link} to={ROUTES.CATALOG}>
            Переглянути весь каталог
          </Link>
        </header>
        <ul className={styles.featuredList}>
          {FEATURED_ITEMS.map((item) => (
            <li key={item.id}>
              <TechCard item={item} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

export default Featured
