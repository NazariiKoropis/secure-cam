import { useState, useMemo } from 'react'

// styles
import styles from './Catalog.module.scss'

// layout & ui
import Container from '@layout/container/Container'
import Loader from '@layout/loader/Loader'
import ErrorMessage from '@shared/error-message/ErrorMessage'

// blocks
import Hero from './blocks/hero/Hero'
import Filter from './blocks/filter/Filter'
import ProductsList from './blocks/products-list/ProducsList'

// api & query
import { useQuery } from '@tanstack/react-query'
import { getAllProducts } from '@api/produc.service'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Спочатку нові' },
  { value: 'price_asc', label: 'Від дешевих до дорогих' },
  { value: 'price_desc', label: 'Від дорогих до дешевих' },
]

function Catalog() {
  const [activeFilters, setActiveFilters] = useState({
    category: '',
    inStock: false,
    priceRange: [0, 2000],
  })
  const [sortOption, setSortOption] = useState('newest')

  const {
    data: products,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['products', 'all'],
    queryFn: getAllProducts,
  })

  const categoryOptions = useMemo(() => {
    if (!products) return []
    const uniqueCategories = new Set(
      products.map((p) => p.category).filter(Boolean),
    )
    return Array.from(uniqueCategories).map((cat) => ({
      value: cat,
      label: cat,
    }))
  }, [products])

  const filteredAndSortedProducts = useMemo(() => {
    if (!products) return []

    let result = [...products]

    if (activeFilters.category) {
      result = result.filter((p) => p.category === activeFilters.category)
    }

    if (activeFilters.inStock) {
      result = result.filter((p) => p.inStock === true)
    }

    result = result.filter(
      (p) =>
        p.price >= activeFilters.priceRange[0] &&
        p.price <= activeFilters.priceRange[1],
    )

    result.sort((a, b) => {
      if (sortOption === 'price_asc') return a.price - b.price
      if (sortOption === 'price_desc') return b.price - a.price

      return 0
    })

    return result
  }, [products, activeFilters, sortOption])

  return (
    <div className={styles.catalogPage}>
      <Hero
        sortValue={sortOption}
        sortOptions={SORT_OPTIONS}
        onSortChange={(e) => setSortOption(e.target.value)}
      />

      <Container>
        <div className={styles.catalogLayout}>
          <aside className={styles.sidebar}>
            <Filter
              categoryOptions={categoryOptions}
              onFilterApply={(newFilters) => setActiveFilters(newFilters)}
            />
          </aside>

          <section className={styles.mainContent}>
            {isLoading && <Loader />}
            {isError && (
              <ErrorMessage
                onRetry={refetch}
                message="Не вдалося завантажити каталог."
              />
            )}

            {!isLoading && !isError && products && (
              <ProductsList products={filteredAndSortedProducts} />
            )}
          </section>
        </div>
      </Container>
    </div>
  )
}

export default Catalog
