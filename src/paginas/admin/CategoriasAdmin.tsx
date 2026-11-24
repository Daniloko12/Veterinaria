import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { mensajeDeError } from '../../api/cliente'
import { eliminarCategoria, listarCategorias } from '../../api/productosApi'
import Boton from '../../componentes/atomos/Boton'
import BotonEnlace from '../../componentes/atomos/BotonEnlace'
import Aviso from '../../componentes/moleculas/Aviso'
import EncabezadoPagina from '../../componentes/moleculas/EncabezadoPagina'
import EstadoCarga from '../../componentes/moleculas/EstadoCarga'
import { useCargar } from '../../hooks/useCargar'
import type { Categoria } from '../../tipos'

// CRUD de categorías con /api/categorias (ms-productos), solo administrador
function CategoriasAdmin() {
  const location = useLocation()
  const { datos, cargando, error, recargar } = useCargar(listarCategorias)
  const categorias = datos ?? []
  const [aviso, setAviso] = useState<{ tipo: string; mensaje: string } | null>(() => {
    const mensaje = (location.state as { aviso?: string } | null)?.aviso
    return mensaje ? { tipo: 'success', mensaje } : null
  })

  // El backend responde 409 si la categoría todavía tiene productos
  async function eliminar(categoria: Categoria) {
    if (!window.confirm(`¿Eliminar la categoría "${categoria.nombre}"?`)) {
      return
    }
    try {
      await eliminarCategoria(categoria.id)
      setAviso({ tipo: 'success', mensaje: `Categoría "${categoria.nombre}" eliminada` })
      recargar()
    } catch (problema) {
      setAviso({ tipo: 'danger', mensaje: mensajeDeError(problema) })
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
      <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} />

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
              const cantidad = categoria.cantidadProductos ?? 0
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
