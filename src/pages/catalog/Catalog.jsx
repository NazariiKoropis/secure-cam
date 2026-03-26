//styles
import styles from './Catalog.module.scss'

//catalog components
import Hero from './blocks/hero/Hero'
import Filter from './blocks/filter/Filter'

function Catalog() {
  return (
    <div style={{ padding: '0px 20px' }}>
      <Hero />
      <Filter />
      <section>Category</section>
    </div>
  )
}

export default Catalog
