import type { Novedad } from '../../tipos'
import { formatearFecha } from '../../utilidades/formato'
import BotonEnlace from '../atomos/BotonEnlace'

interface CardNovedadProps {
  novedad: Novedad
}

function CardNovedad({ novedad }: CardNovedadProps) {
  return (
    <article className="card h-100 shadow-sm">
      <img src={novedad.imagen} className="card-img-top imagen-novedad" alt={novedad.titulo} />
      <div className="card-body d-flex flex-column">
        <small className="text-muted">{formatearFecha(novedad.fecha)}</small>
        <h3 className="card-title h5">{novedad.titulo}</h3>
        <p className="card-text">{novedad.resumen}</p>
        <div className="mt-auto">
          <BotonEnlace a={`/blog/${novedad.id}`} texto="Leer más" tamano="sm" />
        </div>
      </div>
    </article>
  )
}

export default CardNovedad
