//styles
import styles from './CatalogDetails.module.scss'

//components
import Loader from '@layout/loader/Loader'
import ErrorMessage from '@shared/error-message/ErrorMessage'
import Container from '@layout/container/Container'

//router-dom
import { useParams } from 'react-router-dom'

//react-query
import { useQuery } from '@tanstack/react-query'

//api
import { getProductById } from '@api/product.service'

function CatalogDetails() {
  const { item_id } = useParams()

  const {
    data: item,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['product', item_id],
    queryFn: () => getProductById(item_id),
    enabled: !!item_id,
  })

  if (isLoading) {
    return <Loader />
  }

  if (isError || !item) {
    return (
      <section className={styles.featuredSection}>
        <Container>
          <ErrorMessage
            onRetry={refetch}
            message="Не вдалося завантажити дані про товар."
          />
        </Container>
      </section>
    )
  }

  return (
    <Container>
      <div style={{ padding: '40px 0' }}>
        <h1>{item.title || item.name}</h1>{' '}
      </div>
    </Container>
  )
}

export default CatalogDetails
