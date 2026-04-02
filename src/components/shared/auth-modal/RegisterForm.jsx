//styles
import styles from './AuthModal.module.scss'

//components
import Input from '@ui/input/Input'
import Button from '@ui/button/Button'

//form libs
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import { register as registerUser } from '@api/auth.service'

const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "Ім'я не може бути порожнім" })
      .refine(
        (val) => {
          const words = val
            .trim()
            .split(' ')
            .filter((word) => word.length > 0)
          return words.length >= 2
        },
        { message: "Введіть повне ім'я та прізвище (мінімум 2 слова)" },
      ),
    email: z.string().email({ message: 'Невірний формат пошти' }),
    phone: z.string().min(10, { message: 'Введіть коректний номер телефону' }),
    password: z
      .string()
      .min(8, { message: 'Пароль має містити мінімум 8 символів' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Паролі не збігаються',
    path: ['confirmPassword'],
  })

function RegisterForm({ onSuccess }) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data) => {
    try {
      const { error } = await registerUser(
        data.email,
        data.password,
        data.name,
        data.phone,
      )

      if (error) {
        console.error('Помилка реєстрації Firebase:', error.message)

        setError('email', {
          type: 'server',
          message: 'Ця пошта вже використовується',
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
        type="text"
        label="Ім'я та Прізвище"
        {...register('name')}
        error={errors.name?.message}
      />

      <Input
        type="email"
        label="Email"
        {...register('email')}
        error={errors.email?.message}
      />

      <Input
        type="tel"
        label="Номер телефону"
        placeholder="+380"
        {...register('phone')}
        error={errors.phone?.message}
      />

      <Input
        type="password"
        label="Пароль"
        {...register('password')}
        error={errors.password?.message}
      />

      <Input
        type="password"
        label="Повторіть пароль"
        {...register('confirmPassword')}
        error={errors.confirmPassword?.message}
      />

      <Button type="submit" fullWidth disabled={isSubmitting}>
        {isSubmitting ? 'Створення акаунта...' : 'Зареєструватися'}
      </Button>
    </form>
  )
}

export default RegisterForm
