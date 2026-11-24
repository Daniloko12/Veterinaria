import { createContext } from 'react'
import type { Rol, Sesion } from '../tipos'

export interface ValorSesion {
  sesion: Sesion | null
  esAdmin: boolean
  /** Administrador o recepcionista: pueden entrar al panel */
  esPersonal: boolean
  tieneRol: (...roles: Rol[]) => boolean
  /** Llama al backend. Devuelve la sesión creada o lanza un error con el mensaje para el usuario */
  iniciarSesion: (correo: string, clave: string) => Promise<Sesion>
  cerrarSesion: () => Promise<void>
  actualizarSesion: (sesion: Sesion) => void
}

export const SesionContexto = createContext<ValorSesion | null>(null)
