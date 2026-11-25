// Backend simulado para las pruebas: reemplaza fetch y responde igual que los microservicios.
// Así las pruebas no necesitan tener Spring Boot ni MySQL encendidos.
import { vi } from 'vitest'
import type { Orden, Producto } from '../tipos'
import { detectarMarca, generarCodigoAutorizacion, tarjetaRechazada, ultimosCuatro } from '../utilidades/pago'
import { aplicarDescuento } from '../utilidades/productos'
import { categoriasIniciales, ordenesIniciales, productosIniciales, usuariosIniciales } from './datosPrueba'

interface RespuestaSimulada {
  status: number
  ok: boolean
  text: () => Promise<string>
  json: () => Promise<unknown>
}

function responder(estado: number, cuerpo?: unknown): RespuestaSimulada {
  const texto = cuerpo === undefined ? '' : JSON.stringify(cuerpo)
  return {
    status: estado,
    ok: estado >= 200 && estado < 300,
    text: async () => texto,
    json: async () => JSON.parse(texto),
  }
}

function error(estado: number, mensaje: string) {
  return responder(estado, { estado, mensaje, errores: {} })
}

const TOKEN_ADMIN = 'token-de-prueba-admin'

/** Reemplaza fetch por el backend simulado. Cada llamada parte con los datos iniciales. */
export function simularApi() {
  const productos: Producto[] = structuredClone(productosIniciales)
  const ordenes: Orden[] = structuredClone(ordenesIniciales)

  function conCategoria(producto: Producto) {
    const categoria = categoriasIniciales.find((item) => item.id === producto.categoriaId)
    return { ...producto, categoriaNombre: categoria?.nombre }
  }

  const fetchSimulado = vi.fn(async (entrada: RequestInfo | URL, opciones: RequestInit = {}) => {
    const url = new URL(String(entrada))
    const metodo = opciones.method ?? 'GET'
    const cuerpo = opciones.body ? JSON.parse(String(opciones.body)) : null
    const encabezados = (opciones.headers ?? {}) as Record<string, string>
    const conToken = encabezados.Authorization === `Bearer ${TOKEN_ADMIN}`
    const partes = url.pathname.split('/').filter(Boolean) // ej: ['api', 'productos', '3']
    const id = Number(partes[2])

    // ---------- ms-usuarios ----------
    if (url.pathname === '/api/auth/login' && metodo === 'POST') {
      const usuario = usuariosIniciales.find((item) => item.correo === cuerpo.correo && item.clave === cuerpo.clave)
      if (!usuario) return error(401, 'Correo o contraseña incorrectos, o usuario desactivado')
      const { id: idUsuario, nombre, apellidos, correo, rol } = usuario
      return responder(200, {
        tokenAcceso: TOKEN_ADMIN,
        tokenRenovacion: 'renovacion-de-prueba',
        tipo: 'Bearer',
        expiraEnSegundos: 900,
        usuario: { id: idUsuario, nombre, apellidos, correo, rol },
      })
    }

    // ---------- ms-productos ----------
    if (partes[1] === 'categorias' && metodo === 'GET') {
      return responder(
        200,
        categoriasIniciales.map((categoria) => ({
          ...categoria,
          cantidadProductos: productos.filter((producto) => producto.categoriaId === categoria.id).length,
        })),
      )
    }

    if (partes[1] === 'productos') {
      if (metodo === 'GET' && partes.length === 2) {
        return responder(200, productos.map(conCategoria))
      }
      if (metodo === 'GET') {
        const producto = productos.find((item) => item.id === id)
        return producto ? responder(200, conCategoria(producto)) : error(404, `No existe el producto con id ${id}`)
      }
      // Crear, editar y eliminar requieren el token del administrador
      if (!conToken) return error(401, 'Debes iniciar sesión')
      if (metodo === 'POST') {
        const nuevo = { ...cuerpo, id: Math.max(...productos.map((item) => item.id)) + 1 }
        productos.push(nuevo)
        return responder(201, conCategoria(nuevo))
      }
      const indice = productos.findIndex((item) => item.id === id)
      if (indice === -1) return error(404, `No existe el producto con id ${id}`)
      if (metodo === 'PUT') {
        productos[indice] = { ...cuerpo, id }
        return responder(200, conCategoria(productos[indice]))
      }
      if (metodo === 'DELETE') {
        productos.splice(indice, 1)
        return responder(204)
      }
    }

    // ---------- ms-ordenes ----------
    if (url.pathname === '/api/ordenes' && metodo === 'POST') {
      // Igual que el backend: los precios salen del catálogo, no del navegador
      const items = cuerpo.items.map((item: { productoId: number; cantidad: number }) => {
        const producto = productos.find((p) => p.id === item.productoId) as Producto
        return {
          productoId: producto.id,
          nombre: producto.nombre,
          precio: aplicarDescuento(producto.precio, producto.descuento),
          cantidad: item.cantidad,
          imagen: producto.imagen,
        }
      })
      const rechazada = tarjetaRechazada(cuerpo.tarjeta.numero)
      const nuevoId = Math.max(...ordenes.map((orden) => orden.id)) + 1
      const orden: Orden = {
        id: nuevoId,
        numero: `ORD-${String(nuevoId).padStart(5, '0')}`,
        fecha: new Date().toISOString(),
        cliente: cuerpo.cliente,
        direccion: cuerpo.direccion,
        items,
        total: items.reduce((suma: number, item: { precio: number; cantidad: number }) => suma + item.precio * item.cantidad, 0),
        estado: rechazada ? 'rechazada' : 'pagada',
        motivoRechazo: rechazada ? 'La tarjeta fue rechazada por el banco emisor' : '',
        usuarioId: null,
        pago: {
          marca: detectarMarca(cuerpo.tarjeta.numero),
          ultimos4: ultimosCuatro(cuerpo.tarjeta.numero),
          titular: cuerpo.tarjeta.titular.toUpperCase(),
          codigoAutorizacion: rechazada ? '' : generarCodigoAutorizacion(),
        },
      }
      ordenes.push(orden)
      return responder(201, orden)
    }

    return error(404, `Ruta no simulada: ${metodo} ${url.pathname}`)
  })

  vi.stubGlobal('fetch', fetchSimulado)
  return fetchSimulado
}
