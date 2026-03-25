//styles
import styles from './TechCard.module.scss'

//components
import Button from '@ui/button/Button'

//icons
import { ShoppingBag, Image as ImageIcon } from 'lucide-react'

//constants
import { ROUTES } from '@constants/routes'

//utils
import { getImage } from '@utils/getImage'

//router-dom
import { useNavigate } from 'react-router-dom'

function TechCard({ item }) {
  const { id, title, price, amenities } = item
  const img = getImage(id)
  const navigate = useNavigate()

  const onTechCardClick = () => {
    navigate(`${ROUTES.CATALOG}/${id}`)
  }

  const onAddItemClick = (e) => {
    e.stopPropagation()
    alert('added to cart')
  }

  return (
    <article className={styles.techCard} onClick={onTechCardClick} tabIndex={0}>
      <header className={styles.cardImage}>
        {img ? (
          <img src={img} alt={title} />
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              opacity: 0.5,
            }}
          >
            <ImageIcon size={48} />
            <span style={{ fontSize: '0.8rem', marginTop: '8px' }}>
              Немає фото
            </span>
          </div>
        )}
      </header>

      <h3 className={styles.cardTitle}>{title}</h3>

      <ul className={styles.amenitiesList}>
        {amenities.map((item) => (
          <li key={item} className={styles.listItem}>
            {item}
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
