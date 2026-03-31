//styles
import styles from './AuthModal.module.scss'

//components
import Modal from '@ui/modal/Modal'
import Button from '@ui/button/Button'

//modal components
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

//react
import { useState } from 'react'

function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true)

  const handleClose = () => {
    onClose()
    setTimeout(() => setIsLogin(true), 300)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isLogin ? 'Вхід у систему' : 'Реєстрація'}
    >
      {isLogin ? (
        <LoginForm onSuccess={handleClose} />
      ) : (
        <RegisterForm onSuccess={handleClose} />
      )}

      <footer className={styles.footer}>
        <Button variant="ghost" fullWidth onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Зареєструватися' : 'Увійти'}
        </Button>
        <p className={styles.text}>
          {isLogin ? 'Ще немає акаунта?' : 'Вже маєте акаунт?'}
        </p>
      </footer>
    </Modal>
  )
}

export default AuthModal
