// styles
import styles from './TechCard.module.scss'

// components
import Button from '@ui/button/Button'

// icons
import { Image as ImageIcon, ShoppingBag } from 'lucide-react'

// constants
import { ROUTES } from '@constants/routes'

// utils
import { getImage } from '@utils/getImage'

// router-dom
import { useNavigate } from 'react-router-dom'

function TechCard({ item }) {
  const { id, name, price, amenities = [] } = item
  const img = getImage(id)
  const navigate = useNavigate()

  const onTechCardClick = () => {
    navigate(`${ROUTES.CATALOG}/${id}`)
  }

  const onAddItemClick = (event) => {
    event.stopPropagation()
    alert('Додано до кошика')
  }

  const onKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onTechCardClick()
    }
  }

  return (
    <article
      className={styles.techCard}
      onClick={onTechCardClick}
      onKeyDown={onKeyDown}
      tabIndex={0}
    >
      <header className={styles.cardImage}>
        {img ? (
          <img src={img} alt={name} />
        ) : (
          <div className={styles.imageFallback}>
            <ImageIcon size={48} />
            <span className={styles.imageFallbackText}>Немає фото</span>
          </div>
        )}
      </header>

      <h3 className={styles.cardTitle}>{name}</h3>

      <ul className={styles.amenitiesList}>
        {amenities.map((amenity) => (
          <li key={amenity} className={styles.listItem}>
            {amenity}
          </li>
        ))}
      </ul>

      <footer className={styles.cardFooter}>
        <p className={styles.price}>$ {price}</p>
        <Button onClick={onAddItemClick}>
          <ShoppingBag />
        </Button>
      </footer>
    </article>
  )
}

export default TechCard
