import { useState } from 'react'
import type { Producto } from '../tipos'
import { useCarrito } from './useCarrito'

export interface AvisoCarrito {
  tipo: 'success' | 'warning'
  mensaje: string
}

/** Agrega productos al carrito y entrega un aviso para mostrar en pantalla */
export function useAgregarAlCarrito() {
  const { agregarProducto } = useCarrito()
  const [aviso, setAviso] = useState<AvisoCarrito | null>(null)

  function agregar(producto: Producto, cantidad = 1) {
    const agregado = agregarProducto(producto, cantidad)
    setAviso(
      agregado
        ? { tipo: 'success', mensaje: `"${producto.nombre}" se añadió al carrito` }
        : { tipo: 'warning', mensaje: `No hay stock suficiente de "${producto.nombre}"` },
    )
  }

  function cerrarAviso() {
    setAviso(null)
  }

  return { aviso, agregar, cerrarAviso }
}
