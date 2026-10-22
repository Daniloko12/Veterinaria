import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Boton from '../../componentes/atomos/Boton'
import BotonEnlace from '../../componentes/atomos/BotonEnlace'
import Aviso from '../../componentes/moleculas/Aviso'
import EncabezadoPagina from '../../componentes/moleculas/EncabezadoPagina'
import { eliminarCategoria, obtenerCategorias, obtenerProductos } from '../../datos/baseDatos'
import type { Categoria } from '../../tipos'

function CategoriasAdmin() {
  const location = useLocation()
  const [categorias, setCategorias] = useState(() => obtenerCategorias())
  const [productos] = useState(() => obtenerProductos())
  const [aviso, setAviso] = useState<{ tipo: string; mensaje: string } | null>(() => {
    const mensaje = (location.state as { aviso?: string } | null)?.aviso
    return mensaje ? { tipo: 'success', mensaje } : null
  })

  function contarProductos(categoriaId: number) {
    return productos.filter((producto) => producto.categoriaId === categoriaId).length
  }

  function eliminar(categoria: Categoria) {
    if (!window.confirm(`¿Eliminar la categoría "${categoria.nombre}"?`)) {
      return
    }
    if (eliminarCategoria(categoria.id)) {
      setCategorias(obtenerCategorias())
      setAviso({ tipo: 'success', mensaje: `Categoría "${categoria.nombre}" eliminada` })
    } else {
      setAviso({ tipo: 'danger', mensaje: 'No se puede eliminar una categoría que tiene productos' })
    }
  }

  return (
    <div>
      <EncabezadoPagina
        titulo="Categorías"
        descripcion="Organiza los productos de la tienda"
        acciones={<BotonEnlace a="/admin/categorias/nueva" texto="Nueva categoría" />}
      />

      <Aviso mensaje={aviso?.mensaje} tipo={aviso?.tipo} onCerrar={() => setAviso(null)} />

      <div className="table-responsive bg-white rounded shadow-sm">
        <table className="table align-middle mb-0">
          <thead>
            <tr>
              <th scope="col">Imagen</th>
              <th scope="col">Nombre</th>
              <th scope="col">Descripción</th>
              <th scope="col">Productos</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria) => {
              const cantidad = contarProductos(categoria.id)
              return (
                <tr key={categoria.id}>
                  <td>
                    <img src={categoria.imagen} alt="" className="miniatura" />
                  </td>
                  <td>{categoria.nombre}</td>
                  <td className="small">{categoria.descripcion}</td>
                  <td>{cantidad}</td>
                  <td>
                    <div className="d-flex flex-wrap gap-1">
                      <BotonEnlace
                        a={`/admin/categorias/${categoria.id}/editar`}
                        texto="Editar"
                        variante="outline-secondary"
                        tamano="sm"
                      />
                      <Boton
                        texto="Eliminar"
                        variante="outline-danger"
                        tamano="sm"
                        etiquetaAccesible={`Eliminar ${categoria.nombre}`}
                        onClick={() => eliminar(categoria)}
                      />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CategoriasAdmin
