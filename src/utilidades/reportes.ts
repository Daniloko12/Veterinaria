import type { Categoria, Orden, Producto } from '../tipos'

export interface ResumenVentas {
  totalVendido: number
  ordenesPagadas: number
  ordenesRechazadas: number
  ticketPromedio: number
  unidadesVendidas: number
}

export function resumenVentas(ordenes: Orden[]): ResumenVentas {
  const pagadas = ordenes.filter((orden) => orden.estado === 'pagada')
  const totalVendido = pagadas.reduce((suma, orden) => suma + orden.total, 0)
  const unidadesVendidas = pagadas.reduce(
    (suma, orden) => suma + orden.items.reduce((s, item) => s + item.cantidad, 0),
    0,
  )
  return {
    totalVendido,
    ordenesPagadas: pagadas.length,
    ordenesRechazadas: ordenes.length - pagadas.length,
    ticketPromedio: pagadas.length > 0 ? Math.round(totalVendido / pagadas.length) : 0,
    unidadesVendidas,
  }
}

export interface ProductoVendido {
  productoId: number
  nombre: string
  unidades: number
  monto: number
}

export function productosMasVendidos(ordenes: Orden[], limite = 5): ProductoVendido[] {
  const acumulado = new Map<number, ProductoVendido>()

  ordenes
    .filter((orden) => orden.estado === 'pagada')
    .forEach((orden) => {
      orden.items.forEach((item) => {
        const actual = acumulado.get(item.productoId) ?? {
          productoId: item.productoId,
          nombre: item.nombre,
          unidades: 0,
          monto: 0,
        }
        actual.unidades += item.cantidad
        actual.monto += item.precio * item.cantidad
        acumulado.set(item.productoId, actual)
      })
    })

  return [...acumulado.values()].sort((a, b) => b.unidades - a.unidades).slice(0, limite)
}

export interface VentaCategoria {
  categoria: string
  monto: number
  porcentaje: number
}

export function ventasPorCategoria(ordenes: Orden[], productos: Producto[], categorias: Categoria[]): VentaCategoria[] {
  const montos = new Map<string, number>()

  ordenes
    .filter((orden) => orden.estado === 'pagada')
    .forEach((orden) => {
      orden.items.forEach((item) => {
        const producto = productos.find((p) => p.id === item.productoId)
        const categoria = categorias.find((c) => c.id === producto?.categoriaId)
        const nombre = categoria?.nombre ?? 'Sin categoría'
        montos.set(nombre, (montos.get(nombre) ?? 0) + item.precio * item.cantidad)
      })
    })

  const total = [...montos.values()].reduce((suma, monto) => suma + monto, 0)

  return [...montos.entries()]
    .map(([categoria, monto]) => ({
      categoria,
      monto,
      porcentaje: total > 0 ? Math.round((monto / total) * 100) : 0,
    }))
    .sort((a, b) => b.monto - a.monto)
}

export interface InventarioCategoria {
  categoria: string
  productos: number
  unidades: number
  valor: number
}

export function inventarioPorCategoria(productos: Producto[], categorias: Categoria[]): InventarioCategoria[] {
  return categorias.map((categoria) => {
    const propios = productos.filter((producto) => producto.categoriaId === categoria.id)
    return {
      categoria: categoria.nombre,
      productos: propios.length,
      unidades: propios.reduce((suma, producto) => suma + producto.stock, 0),
      valor: propios.reduce((suma, producto) => suma + producto.precio * producto.stock, 0),
    }
  })
}
