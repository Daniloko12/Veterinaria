import { useState } from 'react'
import { useParams } from 'react-router-dom'
import Aviso from '../../componentes/moleculas/Aviso'
import CardCategoria from '../../componentes/moleculas/CardCategoria'
import ListaProductos from '../../componentes/organismos/ListaProductos'
import { obtenerCategorias, obtenerProductos } from '../../datos/baseDatos'
import { useAgregarAlCarrito } from '../../hooks/useAgregarAlCarrito'

// Vista de categorias. Con /categorias/:id muestra los productos de esa categoria.
function Categorias() {
  const { id } = useParams()
  const [categorias] = useState(() => obtenerCategorias())
  const [productos] = useState(() => obtenerProductos())
  const { aviso, agregar, cerrarAviso } = useAgregarAlCarrito()

  const seleccionada = id ? categorias.find((categoria) => categoria.id === Number(id)) : undefined
  const productosCategoria = seleccionada
    ? productos.filter((producto) => producto.categoriaId === seleccionada.id)
    : []

  return (
    <div className="container">
      <h1 className="h2 mb-3">Categorías</h1>

      <div className="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-3 mb-5">
        {categorias.map((categoria) => (
          <div className="col" key={categoria.id}>
            <CardCategoria
              categoria={categoria}
              cantidadProductos={productos.filter((producto) => producto.categoriaId === categoria.id).length}
              activa={categoria.id === seleccionada?.id}
            />
          </div>
        ))}
      </div>

      {!id && <p className="alert alert-light border">Selecciona una categoría para ver sus productos.</p>}

      {id && !seleccionada && <p className="alert alert-warning">La categoría seleccionada no existe.</p>}

      {seleccionada && (
        <section>
          <h2 className="h3">{seleccionada.nombre}</h2>
          <p className="text-muted">{seleccionada.descripcion}</p>
          <Aviso mensaje={aviso?.mensaje} tipo={aviso?.tipo} onCerrar={cerrarAviso} />
          <ListaProductos
            productos={productosCategoria}
            onAgregar={agregar}
            mensajeVacio="Esta categoría todavía no tiene productos."
          />
        </section>
      )}
    </div>
  )
}

export default Categorias
