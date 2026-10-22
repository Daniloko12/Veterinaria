import { useState } from 'react'
import BotonEnlace from '../../componentes/atomos/BotonEnlace'
import EncabezadoPagina from '../../componentes/moleculas/EncabezadoPagina'
import { obtenerProductosCriticos } from '../../datos/baseDatos'

// Productos cuyo stock es menor o igual a su stock critico
function ProductosCriticos() {
  const [criticos] = useState(() => obtenerProductosCriticos())

  return (
    <div>
      <EncabezadoPagina
        titulo="Productos críticos"
        descripcion="Productos con stock igual o menor a su stock crítico"
        acciones={<BotonEnlace a="/admin/productos" texto="Volver" variante="outline-secondary" />}
      />

      {criticos.length === 0 ? (
        <p className="alert alert-success">No hay productos con stock crítico.</p>
      ) : (
        <div className="table-responsive bg-white rounded shadow-sm">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th scope="col">Código</th>
                <th scope="col">Nombre</th>
                <th scope="col">Stock</th>
                <th scope="col">Stock crítico</th>
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
                    <BotonEnlace
                      a={`/admin/productos/${producto.id}/editar`}
                      texto="Reponer stock"
                      variante="outline-dark"
                      tamano="sm"
                    />
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
