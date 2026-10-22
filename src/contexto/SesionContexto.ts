import { createContext } from 'react'
import type { Sesion } from '../tipos'

export interface ValorSesion {
  sesion: Sesion | null
  esAdmin: boolean
  /** Devuelve la sesion creada o null si las credenciales no son validas */
  iniciarSesion: (correo: string, clave: string) => Sesion | null
  cerrarSesion: () => void
  actualizarSesion: (sesion: Sesion) => void
}

export const SesionContexto = createContext<ValorSesion | null>(null)
