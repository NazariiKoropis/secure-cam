//router-dom
import { Outlet } from 'react-router-dom'

//components
import Header from '@layout/header/Header'
import Footer from '@layout/footer/Footer'

function Layout() {
  return (
    <div
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      <Header />
      <main style={{ flex: '1' }}>{<Outlet />}</main>
      <Footer />
    </div>
  )
}

export default Layout
