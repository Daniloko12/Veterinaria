import { Outlet } from 'react-router-dom'
import Footer from '../organismos/Footer'
import Navbar from '../organismos/Navbar'

// Estructura comun de todas las vistas publicas de la tienda
function LayoutTienda() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1 py-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default LayoutTienda
