import { useSelector } from 'react-redux'

//react-query
import { useQuery } from '@tanstack/react-query'

//api
import { getUserById } from '@api/user.service'

//components
import Loader from '@layout/loader/Loader'

//local components
import UserOverview from './user-overview/UserOverview'
import UserOrders from './user-orders/UserOrders'

function User() {
  const { currentUser } = useSelector((state) => state.user)

  const { data: user, isLoading } = useQuery({
    queryKey: ['user', currentUser?.uid],
    queryFn: () => getUserById(currentUser.uid),
    enabled: !!currentUser?.uid,
  })

  if (isLoading) return <Loader />

  if (!user) return null

  return (
    <>
      <UserOverview user={user} />
      <UserOrders uid={user.uid} />
    </>
  )
}

export default User
