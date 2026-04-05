//router-dom
import { Route, Routes } from 'react-router-dom'

//pages public
import Home from '@pages/home/Home'
import Catalog from '@pages/catalog/Catalog'
import CatalogDetails from '@pages/catalog-details/CatalogDetails'
import Calculator from '@pages/calculator/Calculator'
import NotFound from '@pages/not-found/NotFound'
import Cart from '@pages/cart/Cart'

//pages protected
import Admin from '@pages/admin/Admin'
import User from '@pages/user/User'
import AdminDashboard from '@pages/admin/blocks/admin-dashboard/AdminDashboard'
import AdminOrders from '@pages/admin/blocks/admin-orders/AdminOrder'
import AdminProducts from '@pages/admin/blocks/admin-products/AdminProducts'
import AdminReviews from '@pages/admin/blocks/admin-reviews/AdminReviews'

//constants
import { ADMIN_ROUTES, ROUTES } from '@constants/routes'

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
            <Route path={ROUTES.ADMIN} element={<Admin />}>
              <Route index element={<AdminDashboard />} />
              <Route path={ADMIN_ROUTES.ORDERS} element={<AdminOrders />} />
              <Route path={ADMIN_ROUTES.PRODUCTS} element={<AdminProducts />} />
              <Route path={ADMIN_ROUTES.REVIEWS} element={<AdminReviews />} />
            </Route>
          </Route>

          <Route path={ROUTES.CART} element={<Cart />} />
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
