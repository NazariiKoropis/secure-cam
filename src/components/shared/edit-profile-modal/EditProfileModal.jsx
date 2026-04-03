//styles
import styles from './EditProfileModal.module.scss'

//components
import Input from '@ui/input/Input'
import Button from '@ui/button/Button'
import Modal from '@ui/modal/Modal'

//api
import { updateUserPhone, updateUserName } from '@api/user.service'
import toast from 'react-hot-toast'

//forms
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'

const editScheme = z.object({
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
  phone: z.string().min(10, { message: 'Введіть коректний номер телефону' }),
})

function EditProfileModal({ isOpen, onClose, uid }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(editScheme),
    defaultValues: {
      name: '',
      phone: '',
    },
  })

  const onSubmit = async (data) => {
    try {
      await updateUserName(uid, data.name)
      await updateUserPhone(uid, data.phone)

      toast.success('Профіль успішно оновлено!')
      reset()
      onClose()
    } catch (error) {
      console.error('Помилка:', error)
      toast.error('Не вдалося оновити профіль')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={'Редагувати профіль'}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="text"
          label="Ім'я та Прізвище"
          {...register('name')}
          error={errors.name?.message}
        />

        <Input
          type="tel"
          label="Номер телефону"
          placeholder="+380"
          {...register('phone')}
          error={errors.phone?.message}
        />

        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? 'Збереження...' : 'Редагувати'}
        </Button>
      </form>
    </Modal>
  )
}

export default EditProfileModal
