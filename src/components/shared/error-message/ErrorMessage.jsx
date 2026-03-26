//styles
import styles from './ErrorMessage.module.scss'

//icons
import { ServerCrash } from 'lucide-react'

//components
import Button from '@ui/button/Button'

function ErrorMessage({
  title = 'Ой, щось пішло не так',
  message = "Не вдалося завантажити дані. Перевірте з'єднання або спробуйте пізніше.",
  onRetry,
}) {
  return (
    <div className={styles.errorWrapper}>
      <div className={styles.iconBox}>
        <ServerCrash size={48} strokeWidth={1.5} />
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.message}>{message}</p>

      {onRetry && (
        <div className={styles.action}>
          <Button onClick={onRetry} variant="ghost">
            Спробувати знову
          </Button>
        </div>
      )}
    </div>
  )
}

export default ErrorMessage
