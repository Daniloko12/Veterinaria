import type { ReactNode } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useSesion } from '../../hooks/useSesion'
import type { Rol } from '../../tipos'
import BotonEnlace from '../atomos/BotonEnlace'

interface RutaProtegidaProps {
  /** Roles que pueden ver la ruta. Por defecto: el personal (administrador y recepcionista) */
  roles?: Rol[]
  children?: ReactNode
}

// Sin sesión: va al login. Con sesión pero sin el rol necesario: muestra "acceso denegado".
function RutaProtegida({ roles = ['administrador', 'recepcionista'], children }: RutaProtegidaProps) {
  const { sesion } = useSesion()

  if (!sesion) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ aviso: 'Debes iniciar sesión con una cuenta autorizada para acceder a esta sección.' }}
      />
    )
  }

  if (!roles.includes(sesion.rol)) {
    return (
      <div className="container text-center py-5">
        <h1 className="h3">Acceso denegado</h1>
        <p className="text-muted">Tu cuenta ({sesion.rol}) no tiene permiso para ver esta sección.</p>
        <BotonEnlace a="/" texto="Volver a la tienda" />
      </div>
    )
  }

  return children ? <>{children}</> : <Outlet />
}

export default RutaProtegida
