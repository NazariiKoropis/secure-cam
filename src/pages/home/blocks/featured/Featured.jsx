//styles
import styles from './Featured.module.scss'

//components
import Container from '@layout/container/Container'
import TechCard from '@shared/tech-card/TechCard'
import Loader from '@layout/loader/Loader'
import ErrorMessage from '@shared/error-message/ErrorMessage'

//router-dom
import { Link } from 'react-router-dom'

//react-query
import { useQuery } from '@tanstack/react-query'

//api
import { getAllProducts } from '@api/produc.service'

//contants
import { ROUTES } from '@constants/routes'

function Featured() {
  const {
    data: products,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: getAllProducts,
  })

  if (isLoading) return <Loader />

  if (isError || !products) {
    return (
      <section className={styles.featuredSection}>
        <Container>
          <ErrorMessage
            onRetry={refetch}
            message="Не вдалося завантажити рекомендовані товари з сервера."
          />
        </Container>
      </section>
    )
  }

  const featuredItems = products.slice(0, 4)

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
          {featuredItems.map((item) => (
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
