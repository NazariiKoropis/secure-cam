import { useMemo, useState } from 'react'
import styles from './Filter.module.scss'

// components
import Button from '@ui/button/Button'
import ComboBox from '@ui/combo-box/ComboBox'
import CheckBox from '@ui/check-box/CheckBox'
import RangeInput from '@ui/range-input/RangeInput'

const FALLBACK_PRICE_RANGE = [0, 2000]

const createDefaultFilters = (priceRangeLimits) => ({
  category: '',
  inStock: false,
  priceRange: priceRangeLimits,
})

function Filter({
  categoryOptions = [],
  onFilterApply,
  priceRangeLimits = FALLBACK_PRICE_RANGE,
}) {
  const defaultFilters = useMemo(
    () => createDefaultFilters(priceRangeLimits),
    [priceRangeLimits],
  )
  const [filters, setFilters] = useState(defaultFilters)

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const onSubmit = (event) => {
    event.preventDefault()
    if (onFilterApply) onFilterApply(filters)
  }

  const onClear = () => {
    setFilters(defaultFilters)
    if (onFilterApply) onFilterApply(defaultFilters)
  }

  return (
    <aside className={styles.filterSidebar}>
      <header className={styles.header}>
        <span className={styles.eyebrow}>Пошук по каталогу</span>
        <h2 className={styles.title}>Фільтри</h2>
        <p className={styles.desc}>
          Налаштуйте вибірку за категорією, наявністю та ціновим діапазоном.
        </p>
      </header>

      <form className={styles.form} onSubmit={onSubmit}>
        <div className={styles.filterGroup}>
          <ComboBox
            name="category"
            label="Категорія"
            options={categoryOptions}
            value={filters.category}
            onChange={(event) =>
              handleFilterChange('category', event.target.value)
            }
          />
        </div>

        <div className={styles.filterGroup}>
          <CheckBox
            label="В наявності"
            checked={filters.inStock}
            onChange={(event) =>
              handleFilterChange('inStock', event.target.checked)
            }
          />
        </div>

        <div className={styles.filterGroup}>
          <RangeInput
            label="Ціна (грн)"
            min={priceRangeLimits[0]}
            max={priceRangeLimits[1]}
            step={10}
            value={filters.priceRange}
            onChange={(newRange) => handleFilterChange('priceRange', newRange)}
          />
        </div>

        <footer className={styles.footer}>
          <Button type="submit" className={styles.actionBtn}>
            Застосувати
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onClear}
            className={styles.actionBtn}
          >
            Скинути
          </Button>
        </footer>
      </form>
    </aside>
  )
}

export default Filter
