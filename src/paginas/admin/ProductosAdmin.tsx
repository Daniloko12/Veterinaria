import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { mensajeDeError } from '../../api/cliente'
import { eliminarProducto, listarProductos } from '../../api/productosApi'
import Boton from '../../componentes/atomos/Boton'
import BotonEnlace from '../../componentes/atomos/BotonEnlace'
import Insignia from '../../componentes/atomos/Insignia'
import Aviso from '../../componentes/moleculas/Aviso'
import EncabezadoPagina from '../../componentes/moleculas/EncabezadoPagina'
import EstadoCarga from '../../componentes/moleculas/EstadoCarga'
import { useCargar } from '../../hooks/useCargar'
import type { Producto } from '../../tipos'
import { formatearPrecio } from '../../utilidades/formato'
import { esStockCritico, normalizarTexto } from '../../utilidades/productos'

// Listado de productos del administrador (Leer + Eliminar del CRUD) con GET y DELETE /api/productos
function ProductosAdmin() {
  const location = useLocation()
  const { datos, cargando, error, recargar } = useCargar(listarProductos)
  const [busqueda, setBusqueda] = useState('')
  const [aviso, setAviso] = useState<{ tipo: string; mensaje: string } | null>(() => {
    const mensaje = (location.state as { aviso?: string } | null)?.aviso
    return mensaje ? { tipo: 'success', mensaje } : null
  })

  const productos = datos ?? []

  const texto = normalizarTexto(busqueda)
  const visibles = productos.filter(
    (producto) =>
      normalizarTexto(producto.nombre).includes(texto) || normalizarTexto(producto.codigo).includes(texto),
  )

  async function eliminar(producto: Producto) {
    if (!window.confirm(`¿Eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`)) {
      return
    }
    try {
      await eliminarProducto(producto.id)
      setAviso({ tipo: 'success', mensaje: `Producto "${producto.nombre}" eliminado` })
      recargar()
    } catch (problema) {
      setAviso({ tipo: 'danger', mensaje: mensajeDeError(problema) })
    }
  }

  return (
    <div>
      <EncabezadoPagina
        titulo="Productos"
        descripcion={`${productos.length} productos en el catálogo`}
        acciones={
          <>
            <BotonEnlace a="/admin/productos/nuevo" texto="Nuevo producto" />
            <BotonEnlace a="/admin/productos/criticos" texto="Productos críticos" variante="outline-danger" />
            <BotonEnlace a="/admin/productos/reportes" texto="Reportes" variante="outline-secondary" />
          </>
        }
      />

      <Aviso mensaje={aviso?.mensaje} tipo={aviso?.tipo} onCerrar={() => setAviso(null)} />
      <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} />

      <div className="mb-3" style={{ maxWidth: '22rem' }}>
        <label htmlFor="buscar-producto-admin" className="form-label">
          Buscar por nombre o código
        </label>
        <input
          id="buscar-producto-admin"
          type="text"
          className="form-control"
          value={busqueda}
          onChange={(evento) => setBusqueda(evento.target.value)}
        />
      </div>

      <div className="table-responsive bg-white rounded shadow-sm">
        <table className="table align-middle mb-0">
          <thead>
            <tr>
              <th scope="col">Código</th>
              <th scope="col">Imagen</th>
              <th scope="col">Nombre</th>
              <th scope="col">Categoría</th>
              <th scope="col">Precio</th>
              <th scope="col">Stock</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {visibles.map((producto) => (
              <tr key={producto.id}>
                <td>{producto.codigo}</td>
                <td>
                  <img src={producto.imagen} alt="" className="miniatura" />
                </td>
                <td>
                  <Link to={`/admin/productos/${producto.id}`}>{producto.nombre}</Link>
                  {producto.descuento > 0 && <Insignia texto={`-${producto.descuento}%`} color="danger" clase="ms-2" />}
                </td>
                <td>{producto.categoriaNombre ?? '—'}</td>
                <td>{formatearPrecio(producto.precio)}</td>
                <td>
                  <Insignia
                    texto={String(producto.stock)}
                    color={esStockCritico(producto) ? 'danger' : 'success'}
                  />
                </td>
                <td>
                  <div className="d-flex flex-wrap gap-1">
                    <BotonEnlace a={`/admin/productos/${producto.id}`} texto="Ver" variante="outline-primary" tamano="sm" />
                    <BotonEnlace
                      a={`/admin/productos/${producto.id}/editar`}
                      texto="Editar"
                      variante="outline-secondary"
                      tamano="sm"
                    />
                    <Boton
                      texto="Eliminar"
                      variante="outline-danger"
                      tamano="sm"
                      etiquetaAccesible={`Eliminar ${producto.nombre}`}
                      onClick={() => eliminar(producto)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {datos && visibles.length === 0 && <p className="alert alert-info mt-3">No hay productos que coincidan.</p>}
    </div>
  )
}

export default ProductosAdmin
