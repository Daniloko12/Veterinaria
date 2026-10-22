import { NavLink } from 'react-router-dom'
import Boton from '../atomos/Boton'
import BotonEnlace from '../atomos/BotonEnlace'

interface SidebarAdminProps {
  onCerrarSesion: () => void
}

const secciones = [
  { a: '/admin', texto: 'Dashboard' },
  { a: '/admin/ordenes', texto: 'Órdenes' },
  { a: '/admin/productos', texto: 'Productos' },
  { a: '/admin/categorias', texto: 'Categorías' },
  { a: '/admin/usuarios', texto: 'Usuarios' },
  { a: '/admin/reportes', texto: 'Reportes' },
  { a: '/admin/perfil', texto: 'Perfil' },
]

function SidebarAdmin({ onCerrarSesion }: SidebarAdminProps) {
  return (
    <nav aria-label="Menú del administrador" className="d-flex flex-column gap-3">
      <ul className="nav nav-pills flex-column gap-1">
        {secciones.map((seccion) => (
          <li className="nav-item" key={seccion.a}>
            <NavLink to={seccion.a} end={seccion.a === '/admin'} className="nav-link">
              {seccion.texto}
            </NavLink>
          </li>
        ))}
      </ul>
      <hr className="my-0" />
      <div className="d-grid gap-2">
        <BotonEnlace a="/" texto="Ver tienda" variante="dark" tamano="sm" />
        <Boton texto="Cerrar sesión" variante="danger" tamano="sm" onClick={onCerrarSesion} />
      </div>
    </nav>
  )
}

export default SidebarAdmin
