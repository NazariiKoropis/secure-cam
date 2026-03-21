//styles
import styles from './AuthModal.module.scss'

//components
import Input from '@ui/input/Input'
import Button from '@ui/button/Button'

//form libs
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const loginSchema = z.object({
  email: z.string().email({ message: 'Невірний формат пошти' }),
  password: z
    .string()
    .min(8, { message: 'Пароль має містити мінімум 8 символів' }),
})

function LoginForm({ onSuccess }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data) => {
    try {
      console.log('Дані логіну для Firebase:', data)

      //auth logic

      if (onSuccess) onSuccess()
    } catch (error) {
      console.error('Помилка входу:', error)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <Input
        type="email"
        label="Email"
        {...register('email')}
        error={errors.email?.message}
      />

      <Input
        type="password"
        label="Пароль"
        {...register('password')}
        error={errors.password?.message}
      />

      <Button type="submit" fullWidth disabled={isSubmitting}>
        {isSubmitting ? 'Вхід...' : 'Увійти'}
      </Button>
    </form>
  )
}

export default LoginForm
