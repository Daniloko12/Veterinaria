// Lo único que se sigue guardando en el navegador: el carrito y la última compra.
// Productos, usuarios y órdenes ahora vienen del backend (carpeta src/api).
import type { ItemCarrito, Orden } from '../tipos'

export const CLAVES = {
  carrito: 'vsm_carrito',
  ultimaOrden: 'vsm_ultima_orden',
} as const

export function obtenerCarrito(): ItemCarrito[] {
  try {
    return JSON.parse(localStorage.getItem(CLAVES.carrito) ?? '[]') as ItemCarrito[]
  } catch {
    return []
  }
}

export function guardarCarrito(items: ItemCarrito[]): void {
  localStorage.setItem(CLAVES.carrito, JSON.stringify(items))
}

/**
 * Guarda la orden recién creada para mostrar la boleta.
 * Así también la ve quien compró sin iniciar sesión (sessionStorage se borra al cerrar la pestaña).
 */
export function guardarUltimaOrden(orden: Orden): void {
  sessionStorage.setItem(CLAVES.ultimaOrden, JSON.stringify(orden))
}

export function leerUltimaOrden(id: number): Orden | null {
  try {
    const orden = JSON.parse(sessionStorage.getItem(CLAVES.ultimaOrden) ?? 'null') as Orden | null
    return orden && orden.id === id ? orden : null
  } catch {
    return null
  }
}
