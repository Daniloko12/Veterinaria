import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useSesion } from '../../hooks/useSesion'
import SidebarAdmin from '../organismos/SidebarAdmin'

// Estructura del panel de administracion: barra superior + menu lateral + contenido
function LayoutAdmin() {
  const { sesion, cerrarSesion } = useSesion()
  const navigate = useNavigate()

  function salir() {
    cerrarSesion()
    navigate('/login')
  }

  return (
    <div className="min-vh-100 bg-body-tertiary">
      <header className="navbar navbar-dark bg-dark px-3">
        <Link to="/admin" className="navbar-brand">
          Veterinaria San Marcos · Admin
        </Link>
        <span className="text-white-50 small">Sesión: {sesion?.nombre}</span>
      </header>

      <div className="container-fluid">
        <div className="row">
          <aside className="col-md-3 col-xl-2 bg-white border-end py-3 sidebar-admin">
            <SidebarAdmin onCerrarSesion={salir} />
          </aside>
          <main className="col-md-9 col-xl-10 py-4 px-md-4">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default LayoutAdmin
