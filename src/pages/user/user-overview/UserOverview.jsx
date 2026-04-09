import styles from './UserOverview.module.scss'
import Container from '@layout/container/Container'

import { getDate } from '@utils/getDate'
import Button from '@ui/button/Button'
import EditProfileModal from '@shared/edit-profile-modal/EditProfileModal'
import { User } from 'lucide-react'
import { useState } from 'react'

function UserOverview({ user }) {
  const [isOpen, setIsOpen] = useState(false)
  const {
    displayName = 'Користувач',
    email = 'Електронна пошта не вказана',
    photoURL,
    uid,
    phone,
    createdAt,
  } = user || {}

  return (
    <Container>
      <section className={styles.overviewWrapper}>
        <div className={styles.photoWrapper}>
          {photoURL ? (
            <img src={photoURL} alt={displayName} />
          ) : (
            <div className={styles.noPhoto}>
              <User size={64} />
            </div>
          )}
        </div>

        <div className={styles.infoWrapper}>
          <h1>Вітаємо, {displayName}!</h1>

          <div className={styles.details}>
            <p>
              <strong>Електронна пошта:</strong> {email}
            </p>

            <p>
              <strong>Телефон:</strong>{' '}
              {phone || <span className={styles.empty}>Не вказано</span>}
            </p>

            {createdAt && (
              <p>
                <strong>В системі з:</strong> {getDate(createdAt)}
              </p>
            )}
          </div>

          <div className={styles.actions}>
            <Button onClick={() => setIsOpen(true)}>Редагувати профіль</Button>
          </div>
        </div>
      </section>

      <EditProfileModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        uid={uid}
      />
    </Container>
  )
}

export default UserOverview
