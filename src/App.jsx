//router-dom
import { Route, Routes } from 'react-router-dom'

//pages
import Home from '@pages/home/Home'
import Catalog from '@pages/catalog/Catalog'
import Calculator from '@pages/calculator/Calculator'
import NotFound from '@pages/not-found/NotFound'

//constants
import { ROUTES } from '@constants/routes'

//components
import Layout from '@layout/Layout'
import Loader from '@layout/loader/Loader'

//hooks
import { useAuthListener } from '@hooks/useAuthListener'

function App() {
  const { isAuthReady } = useAuthListener()

  if (!isAuthReady) return <Loader />

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.CATALOG} element={<Catalog />} />
        <Route path={ROUTES.CALCULATOR} element={<Calculator />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
