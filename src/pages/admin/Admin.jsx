//local components
import AdminControl from './blocks/admin-control/AdminControl'

//components
import Loader from '@layout/loader/Loader'

//router
import { Outlet } from 'react-router-dom'

//api
import { getUserById } from '@api/user.service'

//redux
import { useSelector } from 'react-redux'

//query
import { useQuery } from '@tanstack/react-query'

function Admin() {
  const { currentUser } = useSelector((state) => state.user)

  const { data: user, isLoading } = useQuery({
    queryKey: ['user', currentUser.uid],
    queryFn: () => getUserById(currentUser.uid),
    enabled: !!currentUser.uid,
  })

  if (isLoading) return <Loader />

  return (
    <>
      <AdminControl user={user} />
      <Outlet />
    </>
  )
}

export default Admin
