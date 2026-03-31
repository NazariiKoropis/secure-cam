//styles
import styles from './ProductOverview.module.scss'

import { useState } from 'react'
import { Link } from 'react-router-dom'

//components
import Button from '@ui/button/Button'
import Counter from '@ui/counter/Counter'

//util
import { getImage } from '@/utils/getImage'
import { getDate } from '@/utils/getDate'

//icons
import { ChevronRight, X } from 'lucide-react'

function ProductOverview({ item }) {
  const [value, setValue] = useState(1)
  const [isZoomed, setIsZoomed] = useState(false)

  const {
    id,
    name,
    price,
    stock,
    description,
    category,
    amenities = [],
    createdAt,
  } = item

  const stockCount = Number.isFinite(Number(stock)) ? Number(stock) : 0
  const imgPath = getImage(id)

  const breadCrumbs = [
    { path: '/', name: 'Home' },
    { path: '/catalog', name: 'Catalog' },
    { path: '/catalog', name: category },
    { path: `/catalog/${id}`, name: name },
  ]

  return (
    <>
      <section className={styles.overviewWrapper}>
        <nav aria-label="Breadcrumb">
          <ul className={styles.breadCrumbs}>
            {breadCrumbs.map((crumb, index) => (
              <li
                className={styles.breadCrumbsItem}
                key={`${crumb.path}-${crumb.name}`}
              >
                {index > 0 && (
                  <ChevronRight size={16} className={styles.separator} />
                )}
                <Link to={crumb.path} className={styles.crumbLink}>
                  {crumb.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.contentWrapper}>
          <div className={styles.imageWrapper}>
            <img
              src={imgPath}
              alt={name}
              className={styles.thumbnail}
              onClick={() => setIsZoomed(true)}
            />
          </div>

          <div className={styles.infoWrapper}>
            <h1 className={styles.title}>{name}</h1>

            <div className={styles.priceStockWrapper}>
              <p className={styles.price}>${price}</p>
              <p className={styles.stock}>В наявності: {stockCount} шт.</p>
            </div>

            <p>{description}</p>

            <ul className={styles.amenities}>
              {amenities.map((amenity) => (
                <li className={styles.amenitiesItem} key={amenity}>
                  {amenity}
                </li>
              ))}
            </ul>

            <div className={styles.actionsWrapper}>
              <div className={styles.cartGroup}>
                <Counter
                  min={1}
                  max={stockCount > 0 ? stockCount : 1}
                  value={value}
                  setValue={setValue}
                />
                <Button fullWidth>ADD TO CART</Button>
              </div>
              <Button variant="ghost" fullWidth>
                CALCULATE IN KIT
              </Button>
            </div>

            {createdAt && (
              <p className={styles.createdAt}>{getDate(createdAt?.seconds)}</p>
            )}
          </div>
        </div>
      </section>

      {isZoomed && (
        <div className={styles.lightbox} onClick={() => setIsZoomed(false)}>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={() => setIsZoomed(false)}
          >
            <X size={32} color="white" />
          </button>

          <img
            src={imgPath}
            alt={name}
            className={styles.zoomedImg}
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}

export default ProductOverview
