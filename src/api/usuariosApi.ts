// Microservicio ms-usuarios (puerto 8081, se llama a través del gateway): autenticación con JWT y CRUD de usuarios
import type { Usuario } from '../tipos'
import { pedir } from './cliente'
import { URL_USUARIOS } from './config'
import type { RespuestaTokens } from './tokens'

const AUTH = `${URL_USUARIOS}/api/auth`
const USUARIOS = `${URL_USUARIOS}/api/usuarios`

/** Datos que se envían para crear o editar un usuario (la contraseña vacía mantiene la actual) */
export type DatosUsuario = Omit<Usuario, 'id'>

export interface DatosRegistroCliente {
  run: string
  nombre: string
  apellidos: string
  correo: string
  clave: string
  fechaNacimiento: string
  region: string
  comuna: string
  direccion: string
}

// ---------- Autenticación (rutas públicas) ----------

export function iniciarSesion(correo: string, clave: string) {
  return pedir<RespuestaTokens>(`${AUTH}/login`, { metodo: 'POST', cuerpo: { correo, clave } })
}

export function registrarCliente(datos: DatosRegistroCliente) {
  return pedir<RespuestaTokens>(`${AUTH}/registro`, { metodo: 'POST', cuerpo: datos })
}

/** Anula el token de renovación en el servidor */
export function cerrarSesionEnServidor(tokenRenovacion: string) {
  return pedir<void>(`${AUTH}/logout`, { metodo: 'POST', cuerpo: { tokenRenovacion } })
}

// ---------- Mi perfil (cualquier usuario con sesión) ----------

export function obtenerMiPerfil() {
  return pedir<Usuario>(`${AUTH}/me`, { conToken: true })
}

export function actualizarMiPerfil(datos: DatosUsuario) {
  return pedir<Usuario>(`${AUTH}/me`, { metodo: 'PUT', cuerpo: datos, conToken: true })
}

// ---------- CRUD de usuarios (solo administrador) ----------

export function listarUsuarios() {
  return pedir<Usuario[]>(USUARIOS, { conToken: true })
}

export function obtenerUsuario(id: number) {
  return pedir<Usuario>(`${USUARIOS}/${id}`, { conToken: true })
}

export function crearUsuario(datos: DatosUsuario) {
  return pedir<Usuario>(USUARIOS, { metodo: 'POST', cuerpo: datos, conToken: true })
}

export function actualizarUsuario(id: number, datos: DatosUsuario) {
  return pedir<Usuario>(`${USUARIOS}/${id}`, { metodo: 'PUT', cuerpo: datos, conToken: true })
}

export function cambiarEstadoUsuario(id: number, activo: boolean) {
  return pedir<Usuario>(`${USUARIOS}/${id}/estado`, { metodo: 'PATCH', cuerpo: { activo }, conToken: true })
}

export function eliminarUsuario(id: number) {
  return pedir<void>(`${USUARIOS}/${id}`, { metodo: 'DELETE', conToken: true })
}
