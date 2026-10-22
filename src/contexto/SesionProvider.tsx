import { useState, type ReactNode } from 'react'
import { autenticarUsuario, eliminarSesion, guardarSesion, obtenerSesion } from '../datos/baseDatos'
import type { Sesion } from '../tipos'
import { SesionContexto } from './SesionContexto'

interface SesionProviderProps {
  children: ReactNode
}

// Mantiene en estado al usuario conectado y lo sincroniza con localStorage
function SesionProvider({ children }: SesionProviderProps) {
  const [sesion, setSesion] = useState<Sesion | null>(() => obtenerSesion())

  function iniciarSesion(correo: string, clave: string): Sesion | null {
    const usuario = autenticarUsuario(correo, clave)
    if (!usuario) {
      return null
    }
    const nueva: Sesion = {
      id: usuario.id,
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      correo: usuario.correo,
      rol: usuario.rol,
    }
    guardarSesion(nueva)
    setSesion(nueva)
    return nueva
  }

  function cerrarSesion() {
    eliminarSesion()
    setSesion(null)
  }

  function actualizarSesion(nueva: Sesion) {
    guardarSesion(nueva)
    setSesion(nueva)
  }

  return (
    <SesionContexto.Provider
      value={{
        sesion,
        esAdmin: sesion?.rol === 'administrador',
        iniciarSesion,
        cerrarSesion,
        actualizarSesion,
      }}
    >
      {children}
    </SesionContexto.Provider>
  )
}

export default SesionProvider
