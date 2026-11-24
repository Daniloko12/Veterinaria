import type { Errores } from '../tipos'
import { URL_USUARIOS } from './config'
import { borrarSesionGuardada, guardarTokens, leerSesionGuardada, type RespuestaTokens } from './tokens'

/** Error que devuelve el backend: { estado, mensaje, errores } */
export class ErrorApi extends Error {
  estado: number
  errores: Record<string, string>

  constructor(estado: number, mensaje: string, errores: Record<string, string> = {}) {
    super(mensaje)
    this.name = 'ErrorApi'
    this.estado = estado
    this.errores = errores
  }
}

type Metodo = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface OpcionesPeticion {
  metodo?: Metodo
  cuerpo?: unknown
  /** true = envía el token JWT en el encabezado Authorization */
  conToken?: boolean
}

// Si el token vence en menos de 30 segundos, se renueva antes de usarlo
const MARGEN_RENOVACION = 30_000

/**
 * Hace una petición a la API REST y devuelve el JSON de la respuesta.
 * Si el token de acceso venció, lo renueva con el token de renovación y repite la petición una vez.
 */
export async function pedir<T>(url: string, { metodo = 'GET', cuerpo, conToken = false }: OpcionesPeticion = {}): Promise<T> {
  let token = conToken ? await tokenVigente() : null
  let respuesta = await enviar(url, metodo, cuerpo, token)

  // 401 con token = el JWT venció o no es válido: se intenta renovar una sola vez.
  // Si otra petición ya lo renovó mientras tanto, se usa el token nuevo directamente.
  if (respuesta.status === 401 && token) {
    const tokenActual = leerSesionGuardada()?.tokenAcceso
    const renovado = (tokenActual && tokenActual !== token) || (await renovarTokens())
    token = renovado ? leerSesionGuardada()?.tokenAcceso ?? null : null
    if (!token) {
      borrarSesionGuardada()
      throw new ErrorApi(401, 'Tu sesión expiró. Inicia sesión nuevamente.')
    }
    respuesta = await enviar(url, metodo, cuerpo, token)
  }

  if (respuesta.status === 204) {
    return undefined as T
  }
  const datos = await leerJson(respuesta)
  if (!respuesta.ok) {
    const error = (datos ?? {}) as { mensaje?: string; errores?: Record<string, string> }
    throw new ErrorApi(respuesta.status, error.mensaje ?? mensajePorEstado(respuesta.status), error.errores ?? {})
  }
  return datos as T
}

async function enviar(url: string, metodo: Metodo, cuerpo: unknown, token: string | null): Promise<Response> {
  const encabezados: Record<string, string> = {}
  if (cuerpo !== undefined) encabezados['Content-Type'] = 'application/json'
  if (token) encabezados.Authorization = `Bearer ${token}`
  try {
    return await fetch(url, {
      method: metodo,
      headers: encabezados,
      body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
    })
  } catch {
    throw new ErrorApi(0, 'No se pudo conectar con el servidor. Revisa que el backend esté encendido.')
  }
}

async function leerJson(respuesta: Response): Promise<unknown> {
  const texto = await respuesta.text()
  if (!texto) return null
  try {
    return JSON.parse(texto)
  } catch {
    return null
  }
}

/** Devuelve el token de acceso; si está por vencer, primero lo renueva */
async function tokenVigente(): Promise<string | null> {
  const sesion = leerSesionGuardada()
  if (!sesion) return null
  if (sesion.expiraEn - Date.now() > MARGEN_RENOVACION) return sesion.tokenAcceso
  const renovado = await renovarTokens()
  return renovado ? leerSesionGuardada()?.tokenAcceso ?? null : null
}

// Si varias peticiones piden renovar al mismo tiempo, se hace una sola renovación
// (el token de renovación se puede usar una sola vez porque el backend lo rota).
let renovacionEnCurso: Promise<boolean> | null = null

export function renovarTokens(): Promise<boolean> {
  if (!renovacionEnCurso) {
    renovacionEnCurso = pedirTokensNuevos().finally(() => {
      renovacionEnCurso = null
    })
  }
  return renovacionEnCurso
}

async function pedirTokensNuevos(): Promise<boolean> {
  const sesion = leerSesionGuardada()
  if (!sesion) return false
  try {
    const respuesta = await fetch(`${URL_USUARIOS}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tokenRenovacion: sesion.tokenRenovacion }),
    })
    if (!respuesta.ok) return false
    guardarTokens((await respuesta.json()) as RespuestaTokens)
    return true
  } catch {
    return false
  }
}

function mensajePorEstado(estado: number): string {
  if (estado === 403) return 'No tienes permiso para realizar esta acción'
  if (estado === 404) return 'No se encontró lo que buscas'
  // 502/503/504: el gateway no encontró el microservicio en Eureka o este no respondió
  if (estado >= 502 && estado <= 504) return 'El servicio no está disponible en este momento. Intenta nuevamente en unos segundos.'
  return 'Ocurrió un error en el servidor'
}

/** Mensaje para mostrar en pantalla a partir de cualquier error */
export function mensajeDeError(error: unknown): string {
  return error instanceof Error ? error.message : 'Ocurrió un error inesperado'
}

/**
 * Separa un error de la API en errores por campo (para mostrarlos bajo cada input)
 * y un mensaje general (cuando el error no corresponde a un campo del formulario).
 */
export function erroresDeFormulario<T>(error: unknown, campos: (keyof T)[]): { errores: Errores<T>; mensaje: string } {
  const errores: Errores<T> = {}
  if (error instanceof ErrorApi) {
    for (const [campo, texto] of Object.entries(error.errores)) {
      if (campos.includes(campo as keyof T)) errores[campo as keyof T] = texto
    }
  }
  return { errores, mensaje: Object.keys(errores).length > 0 ? '' : mensajeDeError(error) }
}
