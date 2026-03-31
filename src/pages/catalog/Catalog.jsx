import { useMemo, useState } from 'react'

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
import { getAllProducts } from '@api/product.service'

const FALLBACK_PRICE_RANGE = [0, 2000]

const clampPriceRange = (range, limits) => {
  const [rangeMin, rangeMax] = limits

  if (!Array.isArray(range)) {
    return limits
  }

  const rawMin = Number(range[0])
  const rawMax = Number(range[1])
  const nextMin = Math.min(
    Math.max(Number.isFinite(rawMin) ? rawMin : rangeMin, rangeMin),
    rangeMax,
  )
  const nextMax = Math.max(
    Math.min(Number.isFinite(rawMax) ? rawMax : rangeMax, rangeMax),
    rangeMin,
  )

  return nextMin <= nextMax ? [nextMin, nextMax] : limits
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Спочатку нові' },
  { value: 'price_asc', label: 'Від дешевих до дорогих' },
  { value: 'price_desc', label: 'Від дорогих до дешевих' },
]

function Catalog() {
  const [activeFilters, setActiveFilters] = useState({
    category: '',
    inStock: false,
    priceRange: null,
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

  const priceRangeLimits = useMemo(() => {
    if (!products?.length) {
      return FALLBACK_PRICE_RANGE
    }

    const prices = products
      .map((product) => Number(product.price))
      .filter((price) => Number.isFinite(price))

    if (!prices.length) {
      return FALLBACK_PRICE_RANGE
    }

    const minPrice = Math.max(0, Math.floor(Math.min(...prices)))
    const maxPrice = Math.ceil(Math.max(...prices))

    if (minPrice === maxPrice) {
      return [minPrice, minPrice + 100]
    }

    return [minPrice, maxPrice]
  }, [products])

  const categoryOptions = useMemo(() => {
    if (!products) return []

    const uniqueCategories = new Set(
      products.map((product) => product.category).filter(Boolean),
    )

    return Array.from(uniqueCategories).map((category) => ({
      value: category,
      label: category,
    }))
  }, [products])

  const normalizedActiveFilters = useMemo(
    () => ({
      ...activeFilters,
      priceRange: clampPriceRange(activeFilters.priceRange, priceRangeLimits),
    }),
    [activeFilters, priceRangeLimits],
  )

  const filteredAndSortedProducts = useMemo(() => {
    if (!products) return []

    let result = [...products]

    if (normalizedActiveFilters.category) {
      result = result.filter(
        (product) => product.category === normalizedActiveFilters.category,
      )
    }

    if (normalizedActiveFilters.inStock) {
      result = result.filter((product) => Number(product.stock) > 0)
    }

    result = result.filter(
      (product) =>
        product.price >= normalizedActiveFilters.priceRange[0] &&
        product.price <= normalizedActiveFilters.priceRange[1],
    )

    result.sort((a, b) => {
      if (sortOption === 'price_asc') return a.price - b.price
      if (sortOption === 'price_desc') return b.price - a.price

      return 0
    })

    return result
  }, [products, normalizedActiveFilters, sortOption])

  const productsCount = filteredAndSortedProducts.length
  const resultsLabel =
    productsCount === 1
      ? '1 товар у каталозі'
      : `${productsCount} товарів у каталозі`

  return (
    <div className={styles.catalogPage}>
      <Hero
        sortValue={sortOption}
        sortOptions={SORT_OPTIONS}
        onSortChange={(event) => setSortOption(event.target.value)}
      />

      <Container>
        <div className={styles.catalogLayout}>
          <aside className={styles.sidebar}>
            <Filter
              key={`${priceRangeLimits[0]}-${priceRangeLimits[1]}`}
              categoryOptions={categoryOptions}
              priceRangeLimits={priceRangeLimits}
              onFilterApply={(newFilters) =>
                setActiveFilters({
                  ...newFilters,
                  priceRange: clampPriceRange(
                    newFilters.priceRange,
                    priceRangeLimits,
                  ),
                })
              }
            />
          </aside>

          <section className={styles.mainContent}>
            <div className={styles.resultsPanel}>
              <div className={styles.resultsCopy}>
                <span className={styles.resultsEyebrow}>
                  Каталог обладнання
                </span>
                <h2 className={styles.resultsTitle}>{resultsLabel}</h2>
                <p className={styles.resultsDescription}>
                  Відфільтруйте камери за категорією, наявністю та вартістю, щоб
                  швидше знайти потрібну конфігурацію.
                </p>
              </div>

              <div className={styles.resultsBadge}>{productsCount}</div>
            </div>

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
