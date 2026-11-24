import { useEffect, useState, type ReactNode } from 'react'
import { guardarCarrito, obtenerCarrito } from '../datos/almacenamiento'
import type { ItemCarrito, Producto } from '../tipos'
import { calcularTotal, contarUnidades } from '../utilidades/carrito'
import { precioFinal } from '../utilidades/productos'
import { CarritoContexto } from './CarritoContexto'

interface CarritoProviderProps {
  children: ReactNode
}

// Estado global del carrito, persistido en localStorage (el carrito no se guarda en el backend)
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
          item.productoId === producto.id ? { ...item, cantidad: item.cantidad + cantidad, stock: producto.stock } : item,
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
          stock: producto.stock,
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
    // No se puede pedir más que el stock que había al agregar el producto (el backend lo vuelve a revisar al pagar)
    setItems((actuales) =>
      actuales.map((item) =>
        item.productoId === productoId ? { ...item, cantidad: Math.min(cantidad, item.stock ?? cantidad) } : item,
      ),
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
