import { useState } from 'react'
import CardNovedad from '../../componentes/moleculas/CardNovedad'
import { obtenerNovedades } from '../../datos/baseDatos'

function Blog() {
  const [novedades] = useState(() => obtenerNovedades())

  return (
    <div className="container">
      <h1 className="h2">Blog</h1>
      <p className="text-muted">Consejos y publicaciones relacionadas con el cuidado de mascotas.</p>
      <div className="row row-cols-1 row-cols-md-2 g-4">
        {novedades.map((novedad) => (
          <div className="col" key={novedad.id}>
            <CardNovedad novedad={novedad} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Blog
