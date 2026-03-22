//router-dom
import { Navigate, Outlet } from 'react-router-dom'

//redux
import { useSelector } from 'react-redux'

//constants
import { ROUTES } from '@constants/routes'

function ProtectedRoute({ redirectPath = ROUTES.HOME, requireAdmin = false }) {
  const { currentUser, userRole } = useSelector((state) => state.user)

  if (!currentUser) {
    return <Navigate to={redirectPath} replace />
  }

  if (requireAdmin && userRole !== 'admin') {
    return <Navigate to={redirectPath} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
