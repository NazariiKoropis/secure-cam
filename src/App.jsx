//router-dom
import { Route, Routes } from 'react-router-dom'

//pages public
import Home from '@pages/home/Home'
import Catalog from '@pages/catalog/Catalog'
import CatalogDetails from '@pages/catalog-details/CatalogDetails'
import Calculator from '@pages/calculator/Calculator'
import NotFound from '@pages/not-found/NotFound'

//pages protected
import Admin from '@pages/admin/Admin'
import User from '@pages/user/User'

//constants
import { ROUTES } from '@constants/routes'

//components
import Layout from '@layout/Layout'
import Loader from '@layout/loader/Loader'

//hooks
import { useAuthListener } from '@hooks/useAuthListener'

//route
import ProtectedRoute from './routes/ProtectedRoute'

import { Toaster } from 'react-hot-toast'

function App() {
  const { isAuthReady } = useAuthListener()

  if (!isAuthReady) return <Loader />

  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.CATALOG} element={<Catalog />} />
          <Route path={ROUTES.CATALOG_ITEM} element={<CatalogDetails />} />
          <Route path={ROUTES.CALCULATOR} element={<Calculator />} />

          <Route element={<ProtectedRoute />}>
            <Route path={ROUTES.USER} element={<User />} />
          </Route>

          <Route element={<ProtectedRoute requireAdmin={true} />}>
            <Route path={ROUTES.ADMIN} element={<Admin />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
          },

          success: {
            style: {
              background: 'var(--success)',
            },
            iconTheme: {
              primary: 'white',
              secondary: 'var(--success)',
            },
          },
        }}
      />
    </>
  )
}

export default App
