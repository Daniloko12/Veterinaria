import { useState } from 'react'
import { mensajeDeError } from '../../api/cliente'
import { actualizarStock, listarProductosCriticos } from '../../api/productosApi'
import Boton from '../../componentes/atomos/Boton'
import BotonEnlace from '../../componentes/atomos/BotonEnlace'
import Aviso from '../../componentes/moleculas/Aviso'
import EncabezadoPagina from '../../componentes/moleculas/EncabezadoPagina'
import EstadoCarga from '../../componentes/moleculas/EstadoCarga'
import { useCargar } from '../../hooks/useCargar'
import { useSesion } from '../../hooks/useSesion'
import type { Producto } from '../../tipos'

// Productos cuyo stock es menor o igual a su stock crítico.
// GET /api/productos/criticos y PATCH /api/productos/{id}/stock (administrador y recepcionista)
function ProductosCriticos() {
  const { esAdmin } = useSesion()
  const { datos: criticos, cargando, error, recargar } = useCargar(listarProductosCriticos)
  const [cantidades, setCantidades] = useState<Record<number, string>>({})
  const [aviso, setAviso] = useState<{ tipo: string; mensaje: string } | null>(null)

  async function reponer(producto: Producto) {
    const texto = cantidades[producto.id] ?? ''
    const nuevoStock = Number(texto)
    if (texto.trim() === '' || !Number.isInteger(nuevoStock) || nuevoStock < 0) {
      setAviso({ tipo: 'warning', mensaje: 'Ingresa el nuevo stock (número entero mayor o igual a 0)' })
      return
    }
    try {
      await actualizarStock(producto.id, nuevoStock)
      setAviso({ tipo: 'success', mensaje: `Stock de "${producto.nombre}" actualizado a ${nuevoStock} unidades` })
      setCantidades((actuales) => ({ ...actuales, [producto.id]: '' }))
      recargar()
    } catch (problema) {
      setAviso({ tipo: 'danger', mensaje: mensajeDeError(problema) })
    }
  }

  return (
    <div>
      <EncabezadoPagina
        titulo="Productos críticos"
        descripcion="Productos con stock igual o menor a su stock crítico"
        acciones={esAdmin && <BotonEnlace a="/admin/productos" texto="Volver" variante="outline-secondary" />}
      />

      <Aviso mensaje={aviso?.mensaje} tipo={aviso?.tipo} onCerrar={() => setAviso(null)} />
      <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} />

      {criticos && criticos.length === 0 && <p className="alert alert-success">No hay productos con stock crítico.</p>}

      {criticos && criticos.length > 0 && (
        <div className="table-responsive bg-white rounded shadow-sm">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th scope="col">Código</th>
                <th scope="col">Nombre</th>
                <th scope="col">Stock</th>
                <th scope="col">Stock crítico</th>
                <th scope="col">Nuevo stock</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {criticos.map((producto) => (
                <tr key={producto.id} className="table-danger">
                  <td>{producto.codigo}</td>
                  <td>{producto.nombre}</td>
                  <td>{producto.stock}</td>
                  <td>{producto.stockCritico}</td>
                  <td>
                    <input
                      type="number"
                      min={0}
                      className="form-control form-control-sm"
                      style={{ width: '6rem' }}
                      aria-label={`Nuevo stock de ${producto.nombre}`}
                      value={cantidades[producto.id] ?? ''}
                      onChange={(evento) =>
                        setCantidades((actuales) => ({ ...actuales, [producto.id]: evento.target.value }))
                      }
                    />
                  </td>
                  <td>
                    <div className="d-flex flex-wrap gap-1">
                      <Boton
                        texto="Reponer stock"
                        variante="outline-dark"
                        tamano="sm"
                        etiquetaAccesible={`Reponer stock de ${producto.nombre}`}
                        onClick={() => reponer(producto)}
                      />
                      {esAdmin && (
                        <BotonEnlace
                          a={`/admin/productos/${producto.id}/editar`}
                          texto="Editar"
                          variante="outline-secondary"
                          tamano="sm"
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ProductosCriticos
