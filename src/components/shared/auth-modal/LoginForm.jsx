//styles
import styles from './AuthModal.module.scss'

//components
import Input from '@ui/input/Input'
import Button from '@ui/button/Button'

//form libs
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

//api
import { login } from '@api/auth.service'

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
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data) => {
    try {
      const { error } = await login(data.email, data.password)

      if (error) {
        console.error('Помилка входу Firebase:', error.message)

        setError('email', {
          type: 'server',
          message: 'Невірна пошта або пароль',
        })
        setError('password', {
          type: 'server',
          message: 'Невірна пошта або пароль',
        })
        return
      }

      if (onSuccess) onSuccess()
    } catch (error) {
      console.error('Неочікувана помилка фронтенду:', error)
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
