import { Link } from 'react-router-dom'
import type { Categoria } from '../../tipos'

interface CardCategoriaProps {
  categoria: Categoria
  cantidadProductos: number
  activa?: boolean
}

function CardCategoria({ categoria, cantidadProductos, activa = false }: CardCategoriaProps) {
  return (
    <Link
      to={`/categorias/${categoria.id}`}
      className={`card h-100 text-decoration-none card-categoria ${activa ? 'border-primary border-2' : ''}`.trim()}
      aria-current={activa ? 'page' : undefined}
    >
      <img src={categoria.imagen} className="card-img-top" alt="" />
      <div className="card-body text-center">
        <h3 className="h6 card-title mb-1">{categoria.nombre}</h3>
        <small className="text-muted">
          {cantidadProductos} {cantidadProductos === 1 ? 'producto' : 'productos'}
        </small>
      </div>
    </Link>
  )
}

export default CardCategoria
