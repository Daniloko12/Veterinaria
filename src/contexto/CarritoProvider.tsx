import { useEffect, useState, type ReactNode } from 'react'
import { guardarCarrito, obtenerCarrito, obtenerProductoPorId } from '../datos/baseDatos'
import type { ItemCarrito, Producto } from '../tipos'
import { calcularTotal, contarUnidades } from '../utilidades/carrito'
import { precioFinal } from '../utilidades/productos'
import { CarritoContexto } from './CarritoContexto'

interface CarritoProviderProps {
  children: ReactNode
}

// Estado global del carrito, persistido en localStorage
function CarritoProvider({ children }: CarritoProviderProps) {
  const [items, setItems] = useState<ItemCarrito[]>(() => obtenerCarrito())

  // Cada vez que cambia el carrito se guarda en localStorage
  useEffect(() => {
    guardarCarrito(items)
  }, [items])

  function agregarProducto(producto: Producto, cantidad = 1): boolean {
    const existente = items.find((item) => item.productoId === producto.id)
    const cantidadActual = existente?.cantidad ?? 0

    if (cantidad <= 0 || cantidadActual + cantidad > producto.stock) {
      return false
    }

    if (existente) {
      setItems(
        items.map((item) =>
          item.productoId === producto.id ? { ...item, cantidad: item.cantidad + cantidad } : item,
        ),
      )
    } else {
      setItems([
        ...items,
        {
          productoId: producto.id,
          nombre: producto.nombre,
          precio: precioFinal(producto),
          cantidad,
          imagen: producto.imagen,
        },
      ])
    }
    return true
  }

  function cambiarCantidad(productoId: number, cantidad: number) {
    if (cantidad <= 0) {
      quitarProducto(productoId)
      return
    }
    const stock = obtenerProductoPorId(productoId)?.stock ?? cantidad
    const permitida = Math.min(cantidad, stock)
    setItems((actuales) =>
      actuales.map((item) => (item.productoId === productoId ? { ...item, cantidad: permitida } : item)),
    )
  }

  function quitarProducto(productoId: number) {
    setItems((actuales) => actuales.filter((item) => item.productoId !== productoId))
  }

  function vaciarCarrito() {
    setItems([])
  }

  return (
    <CarritoContexto.Provider
      value={{
        items,
        total: calcularTotal(items),
        cantidadTotal: contarUnidades(items),
        agregarProducto,
        cambiarCantidad,
        quitarProducto,
        vaciarCarrito,
      }}
    >
      {children}
    </CarritoContexto.Provider>
  )
}

export default CarritoProvider
