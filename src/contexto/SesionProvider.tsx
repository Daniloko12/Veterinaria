import { useEffect, useState, type ReactNode } from 'react'
import { cerrarSesionEnServidor, iniciarSesion as pedirLogin, obtenerMiPerfil } from '../api/usuariosApi'
import {
  actualizarUsuarioGuardado,
  alCambiarSesion,
  borrarSesionGuardada,
  guardarTokens,
  leerSesionGuardada,
} from '../api/tokens'
import type { Rol, Sesion } from '../tipos'
import { SesionContexto } from './SesionContexto'

interface SesionProviderProps {
  children: ReactNode
}

// Mantiene al usuario conectado. Los tokens JWT quedan en localStorage,
// por eso la sesión sigue iniciada aunque se recargue la página.
function SesionProvider({ children }: SesionProviderProps) {
  const [sesion, setSesion] = useState<Sesion | null>(() => leerSesionGuardada()?.usuario ?? null)

  useEffect(() => {
    // Si los tokens se renuevan o la sesión expira, se actualiza la pantalla
    const dejarDeEscuchar = alCambiarSesion((guardada) => setSesion(guardada?.usuario ?? null))

    // Al abrir la página con una sesión guardada, se comprueba el token con el backend.
    // Si venció se renueva solo; si ya no sirve, la sesión se cierra.
    if (leerSesionGuardada()) {
      obtenerMiPerfil().catch(() => {})
    }
    return dejarDeEscuchar
  }, [])

  async function iniciarSesion(correo: string, clave: string): Promise<Sesion> {
    const respuesta = await pedirLogin(correo, clave)
    guardarTokens(respuesta)
    return respuesta.usuario
  }

  async function cerrarSesion() {
    const guardada = leerSesionGuardada()
    borrarSesionGuardada()
    if (guardada) {
      // Se anula el token de renovación en el servidor (si falla, igual se cierra en el navegador)
      await cerrarSesionEnServidor(guardada.tokenRenovacion).catch(() => {})
    }
  }

  function actualizarSesion(nueva: Sesion) {
    actualizarUsuarioGuardado(nueva)
  }

  function tieneRol(...roles: Rol[]) {
    return sesion !== null && roles.includes(sesion.rol)
  }

  return (
    <SesionContexto.Provider
      value={{
        sesion,
        esAdmin: tieneRol('administrador'),
        esPersonal: tieneRol('administrador', 'recepcionista'),
        tieneRol,
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
