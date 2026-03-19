//styles
import styles from './Modal.module.scss'

//react
import { useEffect } from 'react'
import { createPortal } from 'react-dom'

//icon
import { X } from 'lucide-react'

function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <header className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={32} />
          </button>
        </header>

        <div className={styles.body}>{children}</div>
      </div>
    </div>,
    document.body,
  )
}

export default Modal
