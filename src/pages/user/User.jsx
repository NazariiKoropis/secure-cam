import { useSelector } from 'react-redux'

import { useQuery } from '@tanstack/react-query'

import { getUserById } from '@api/user.service'

import Loader from '@layout/loader/Loader'

//local components
import UserOverview from './user-overview/UserOverview'

function User() {
  const { currentUser } = useSelector((state) => state.user)

  const { data: user, isLoading } = useQuery({
    queryKey: ['user', currentUser?.uid],
    queryFn: () => getUserById(currentUser.uid),
    enabled: !!currentUser?.uid,
  })

  if (isLoading) return <Loader />

  if (!user) return null

  return <UserOverview user={user} />
}

export default User
