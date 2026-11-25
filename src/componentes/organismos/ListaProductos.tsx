import type { Categoria, Producto } from '../../tipos'
import CardProducto from '../moleculas/CardProducto'

interface ListaProductosProps {
  productos: Producto[]
  categorias?: Categoria[]
  onAgregar?: (producto: Producto) => void
  mensajeVacio?: string
}

// Grilla responsiva de productos (1 a 4 columnas segun el ancho de pantalla)
function ListaProductos({
  productos,
  categorias = [],
  onAgregar,
  mensajeVacio = 'No hay productos para mostrar.',
}: ListaProductosProps) {
  if (productos.length === 0) {
    return <p className="alert alert-info">{mensajeVacio}</p>
  }

  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
      {productos.map((producto) => (
        <div className="col" key={producto.id}>
          <CardProducto
            producto={producto}
            categoria={categorias.find((categoria) => categoria.id === producto.categoriaId)?.nombre}
            onAgregar={onAgregar}
          />
        </div>
      ))}
    </div>
  )
}

export default ListaProductos
