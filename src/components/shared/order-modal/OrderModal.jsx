//styles
import styles from './OrderModal.module.scss'

//components
import Modal from '@ui/modal/Modal'
import Button from '@ui/button/Button'
import Input from '@ui/input/Input'

// redux
import { useSelector, useDispatch } from 'react-redux'
import { clearCart } from '@/redux/cart/cartSlice' // ДОДАНО: екшен очищення кошика

//form libs
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import { useState, useEffect } from 'react'
import { getUserPhoneByID } from '@api/user.service'
import { createOrder } from '@api/order.service'
import toast from 'react-hot-toast'

const orderForm = z.object({
  city: z.string().min(1, { message: 'Місто не може бути порожнім' }),
  address: z.string().min(1, { message: 'Адреса не може бути порожня' }),
  postIndex: z.string().min(1, { message: 'Вкажіть поштовий індекс' }),
})

function OrderModal({ isOpen, onClose, orderData }) {
  const { currentUser } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const [phone, setPhone] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(orderForm),
    defaultValues: { city: '', address: '', postIndex: '' },
  })

  useEffect(() => {
    if (currentUser) {
      const fetchUserPhone = async () => {
        const data = await getUserPhoneByID(currentUser.uid)
        setPhone(data)
      }
      fetchUserPhone()
    }
  }, [currentUser])

  const onSubmit = async (data) => {
    try {
      const finalData = {
        userId: currentUser?.uid,
        customerName: currentUser?.displayName,
        phone: phone,
        delivery: {
          city: data.city,
          address: data.address,
          postIndex: data.postIndex,
        },
        items: orderData.items,
        services: orderData.services,
        totalPrice: orderData.totalPrice,
        status: 'pending',
      }

      console.log('Відправляємо в БД:', finalData)

      await createOrder(finalData)

      dispatch(clearCart())
      onClose()
      toast.success('Замовлення успішно оформлено!')
    } catch (error) {
      console.error('Помилка при оформленні замовлення:', error)
      toast.error('Сталася помилка. Спробуйте ще раз.')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={'Оформлення замовлення'}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="text"
          label="Місто"
          {...register('city')}
          error={errors.city?.message}
        />

        <Input
          type="text"
          label="Адреса"
          {...register('address')}
          error={errors.address?.message}
        />

        <Input
          type="text"
          label="Поштовий індекс"
          {...register('postIndex')}
          error={errors.postIndex?.message}
        />

        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? 'Оформлення...' : 'Оформити замовлення'}
        </Button>
      </form>
    </Modal>
  )
}

export default OrderModal
