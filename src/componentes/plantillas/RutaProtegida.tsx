import type { ReactNode } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useSesion } from '../../hooks/useSesion'

interface RutaProtegidaProps {
  children?: ReactNode
}

// Solo deja pasar a usuarios con rol administrador; el resto va al login
function RutaProtegida({ children }: RutaProtegidaProps) {
  const { esAdmin } = useSesion()

  if (!esAdmin) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ aviso: 'Debes iniciar sesión como administrador para acceder al panel.' }}
      />
    )
  }

  return children ? <>{children}</> : <Outlet />
}

export default RutaProtegida
