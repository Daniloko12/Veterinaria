import { createContext } from 'react'
import type { ItemCarrito, Producto } from '../tipos'

export interface ValorCarrito {
  items: ItemCarrito[]
  total: number
  cantidadTotal: number
  /** Devuelve false si no hay stock suficiente para agregar */
  agregarProducto: (producto: Producto, cantidad?: number) => boolean
  cambiarCantidad: (productoId: number, cantidad: number) => void
  quitarProducto: (productoId: number) => void
  vaciarCarrito: () => void
}

export const CarritoContexto = createContext<ValorCarrito | null>(null)
