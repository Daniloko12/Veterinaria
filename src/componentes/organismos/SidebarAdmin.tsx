import { NavLink } from 'react-router-dom'
import { useSesion } from '../../hooks/useSesion'
import type { Rol } from '../../tipos'
import Boton from '../atomos/Boton'
import BotonEnlace from '../atomos/BotonEnlace'

interface SidebarAdminProps {
  onCerrarSesion: () => void
}

const ADMIN: Rol[] = ['administrador']
const PERSONAL: Rol[] = ['administrador', 'recepcionista']

// Cada sección indica qué roles la pueden ver (la misma regla que aplica el backend)
const seccionesPanel = [
  { a: '/admin', texto: 'Dashboard', roles: PERSONAL },
  { a: '/admin/ordenes', texto: 'Órdenes', roles: PERSONAL },
  { a: '/admin/productos', texto: 'Productos', roles: ADMIN },
  { a: '/admin/productos/criticos', texto: 'Stock crítico', roles: PERSONAL },
  { a: '/admin/categorias', texto: 'Categorías', roles: ADMIN },
  { a: '/admin/usuarios', texto: 'Usuarios', roles: ADMIN },
  { a: '/admin/reportes', texto: 'Reportes', roles: ADMIN },
  { a: '/admin/perfil', texto: 'Perfil', roles: PERSONAL },
]

function SidebarAdmin({ onCerrarSesion }: SidebarAdminProps) {
  const { tieneRol } = useSesion()
  const secciones = seccionesPanel.filter((seccion) => tieneRol(...seccion.roles))

  return (
    <nav aria-label="Menú del administrador" className="d-flex flex-column gap-3">
      <ul className="nav nav-pills flex-column gap-1">
        {secciones.map((seccion) => (
          <li className="nav-item" key={seccion.a}>
            <NavLink to={seccion.a} end={seccion.a === '/admin' || seccion.a === '/admin/productos'} className="nav-link">
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
