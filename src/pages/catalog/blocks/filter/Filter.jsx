import { useState } from 'react'
import styles from './Filter.module.scss'

//components
import Button from '@ui/button/Button'
import ComboBox from '@ui/combo-box/ComboBox'
import CheckBox from '@ui/check-box/CheckBox'
import RangeInput from '@ui/range-input/RangeInput'

const DEFAULT_FILTERS = {
  category: '',
  inStock: false,
  priceRange: [0, 10000],
}

function Filter({ categoryOptions = [], onFilterApply }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (onFilterApply) onFilterApply(filters)
  }

  const onClear = () => {
    setFilters(DEFAULT_FILTERS)
    if (onFilterApply) onFilterApply(DEFAULT_FILTERS)
  }

  return (
    <aside className={styles.filterSidebar}>
      <header className={styles.header}>
        <h2 className={styles.title}>Catalog filter</h2>
        <p className={styles.desc}>Precision hardware</p>
      </header>

      <form className={styles.form} onSubmit={onSubmit}>
        <div className={styles.filterGroup}>
          <ComboBox
            name="category"
            label="Category"
            options={categoryOptions}
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          />
        </div>

        <div className={styles.filterGroup}>
          <CheckBox
            label="В наявності"
            checked={filters.inStock}
            onChange={(e) => handleFilterChange('inStock', e.target.checked)}
          />
        </div>

        <div className={styles.filterGroup}>
          <RangeInput
            label="Ціна ($)"
            min={0}
            max={2000}
            step={10}
            value={filters.priceRange}
            onChange={(newRange) => handleFilterChange('priceRange', newRange)}
          />
        </div>

        <footer className={styles.footer}>
          <Button type="submit" className={styles.actionBtn}>
            Filter
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onClear}
            className={styles.actionBtn}
          >
            Clear
          </Button>
        </footer>
      </form>
    </aside>
  )
}

export default Filter
