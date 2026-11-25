import type { Sesion } from '../tipos'

// La sesión (tokens + datos del usuario) se guarda en localStorage
// para que siga iniciada aunque se recargue la página.
const CLAVE_SESION = 'vsm_sesion_jwt'

export interface SesionGuardada {
  /** JWT que se envía en cada petición privada (dura 15 minutos) */
  tokenAcceso: string
  /** Token para pedir un JWT nuevo cuando vence el anterior (dura 7 días) */
  tokenRenovacion: string
  /** Momento (en milisegundos) en que vence el token de acceso */
  expiraEn: number
  usuario: Sesion
}

/** Respuesta del backend al iniciar sesión, registrarse o renovar */
export interface RespuestaTokens {
  tokenAcceso: string
  tokenRenovacion: string
  tipo: string
  expiraEnSegundos: number
  usuario: Sesion
}

type Oyente = (sesion: SesionGuardada | null) => void
const oyentes = new Set<Oyente>()

export function leerSesionGuardada(): SesionGuardada | null {
  try {
    const texto = localStorage.getItem(CLAVE_SESION)
    const sesion = texto ? (JSON.parse(texto) as SesionGuardada) : null
    return sesion?.tokenAcceso && sesion.tokenRenovacion ? sesion : null
  } catch {
    return null
  }
}

export function guardarTokens(respuesta: RespuestaTokens): SesionGuardada {
  const sesion: SesionGuardada = {
    tokenAcceso: respuesta.tokenAcceso,
    tokenRenovacion: respuesta.tokenRenovacion,
    expiraEn: Date.now() + respuesta.expiraEnSegundos * 1000,
    usuario: respuesta.usuario,
  }
  escribir(sesion)
  return sesion
}

/** Cambia solo los datos del usuario (por ejemplo, después de editar el perfil) */
export function actualizarUsuarioGuardado(usuario: Sesion): void {
  const actual = leerSesionGuardada()
  if (actual) escribir({ ...actual, usuario })
}

export function borrarSesionGuardada(): void {
  localStorage.removeItem(CLAVE_SESION)
  oyentes.forEach((oyente) => oyente(null))
}

/** Avisa cuando la sesión cambia (renovación de tokens o sesión expirada) */
export function alCambiarSesion(oyente: Oyente): () => void {
  oyentes.add(oyente)
  return () => {
    oyentes.delete(oyente)
  }
}

function escribir(sesion: SesionGuardada) {
  localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion))
  oyentes.forEach((oyente) => oyente(sesion))
}
