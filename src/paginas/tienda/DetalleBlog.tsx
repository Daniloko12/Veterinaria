import { Link, useParams } from 'react-router-dom'
import BotonEnlace from '../../componentes/atomos/BotonEnlace'
import { obtenerNovedadPorId, obtenerNovedades } from '../../datos/baseDatos'
import { formatearFecha } from '../../utilidades/formato'

function DetalleBlog() {
  const { id } = useParams()
  const novedad = obtenerNovedadPorId(Number(id))

  if (!novedad) {
    return (
      <div className="container text-center py-5">
        <h1 className="h3">Publicación no encontrada</h1>
        <BotonEnlace a="/blog" texto="Volver al blog" />
      </div>
    )
  }

  const otras = obtenerNovedades().filter((item) => item.id !== novedad.id)

  return (
    <div className="container">
      <article className="mx-auto contenedor-angosto">
        <p className="small text-muted mb-1">
          {formatearFecha(novedad.fecha)} · {novedad.autor}
        </p>
        <h1 className="h2">{novedad.titulo}</h1>
        <p className="lead">{novedad.resumen}</p>
        <img src={novedad.imagen} alt={novedad.titulo} className="img-fluid rounded mb-4" />
        {novedad.contenido.map((parrafo) => (
          <p key={parrafo}>{parrafo}</p>
        ))}

        <BotonEnlace a="/blog" texto="Volver al blog" variante="outline-secondary" />

        {otras.length > 0 && (
          <aside className="mt-5">
            <h2 className="h5">Otras publicaciones</h2>
            <ul>
              {otras.map((item) => (
                <li key={item.id}>
                  <Link to={`/blog/${item.id}`}>{item.titulo}</Link>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </article>
    </div>
  )
}

export default DetalleBlog
