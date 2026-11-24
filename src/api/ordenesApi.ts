// Microservicio ms-ordenes (puerto 8083, se llama a través del gateway): compras, pago simulado y boletas
import type { DatosCliente, DatosTarjeta, DireccionEntrega, EstadoOrden, Orden } from '../tipos'
import { pedir } from './cliente'
import { URL_ORDENES } from './config'
import { leerSesionGuardada } from './tokens'

const ORDENES = `${URL_ORDENES}/api/ordenes`

export interface DatosNuevaOrden {
  cliente: DatosCliente
  direccion: DireccionEntrega
  /** Solo se envía el id y la cantidad: el precio lo pone el backend */
  items: { productoId: number; cantidad: number }[]
  tarjeta: DatosTarjeta
}

/**
 * Crea la orden y procesa el pago. Es pública (se puede comprar sin cuenta);
 * si hay sesión se envía el token para asociar la compra al usuario.
 */
export function crearOrden(datos: DatosNuevaOrden) {
  return pedir<Orden>(ORDENES, { metodo: 'POST', cuerpo: datos, conToken: leerSesionGuardada() !== null })
}

/** Todas las órdenes (administrador y recepcionista) */
export function listarOrdenes() {
  return pedir<Orden[]>(ORDENES, { conToken: true })
}

/** Compras del usuario conectado */
export function listarMisOrdenes() {
  return pedir<Orden[]>(`${ORDENES}/mis-ordenes`, { conToken: true })
}

export function obtenerOrden(id: number) {
  return pedir<Orden>(`${ORDENES}/${id}`, { conToken: true })
}

/** pagada → enviada → entregada (administrador y recepcionista) */
export function cambiarEstadoOrden(id: number, estado: EstadoOrden) {
  return pedir<Orden>(`${ORDENES}/${id}/estado`, { metodo: 'PUT', cuerpo: { estado }, conToken: true })
}

/** Solo administrador */
export function eliminarOrden(id: number) {
  return pedir<void>(`${ORDENES}/${id}`, { metodo: 'DELETE', conToken: true })
}
