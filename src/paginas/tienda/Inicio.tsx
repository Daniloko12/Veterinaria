import { useState } from 'react'
import BotonEnlace from '../../componentes/atomos/BotonEnlace'
import Aviso from '../../componentes/moleculas/Aviso'
import CardCategoria from '../../componentes/moleculas/CardCategoria'
import CardNovedad from '../../componentes/moleculas/CardNovedad'
import Carrusel, { type Diapositiva } from '../../componentes/organismos/Carrusel'
import ListaProductos from '../../componentes/organismos/ListaProductos'
import { obtenerCategorias, obtenerNovedades, obtenerProductos } from '../../datos/baseDatos'
import { useAgregarAlCarrito } from '../../hooks/useAgregarAlCarrito'

const diapositivas: Diapositiva[] = [
  {
    imagen: '/img/cuidados-animales.jpg',
    titulo: 'Cuidamos a tu mascota',
    descripcion: 'Atención veterinaria simple y cercana en Rancagua.',
  },
  {
    imagen: '/img/importancia-vacunas.jpg',
    titulo: 'Vacunación al día',
    descripcion: 'Control de vacunas y seguimiento preventivo.',
  },
  {
    imagen: '/img/correa-perro.jpg',
    titulo: 'Ofertas en accesorios',
    descripcion: 'Descubre los productos con descuento de esta semana.',
  },
]

const servicios = [
  { titulo: 'Consulta general', descripcion: 'Revisión general y orientación para el cuidado de tu mascota.' },
  { titulo: 'Vacunación', descripcion: 'Control de vacunas y seguimiento preventivo.' },
  { titulo: 'Desparasitación', descripcion: 'Apoyo para el control preventivo de parásitos.' },
]

function Inicio() {
  const [productos] = useState(() => obtenerProductos())
  const [categorias] = useState(() => obtenerCategorias())
  const [novedades] = useState(() => obtenerNovedades())
  const { aviso, agregar, cerrarAviso } = useAgregarAlCarrito()

  const destacados = productos.filter((producto) => producto.descuento > 0).slice(0, 4)

  return (
    <div className="container">
      <Carrusel diapositivas={diapositivas} />

      <section className="text-center my-5">
        <h1 className="display-6 fw-semibold">Veterinaria San Marcos</h1>
        <p className="lead text-muted">Productos y servicios para el bienestar de perros, gatos, conejos y aves.</p>
        <div className="d-flex justify-content-center gap-2">
          <BotonEnlace a="/productos" texto="Ver productos" />
          <BotonEnlace a="/contacto" texto="Contactar" variante="outline-secondary" />
        </div>
      </section>

      <section className="mb-5">
        <h2 className="h4 mb-3">Servicios destacados</h2>
        <div className="row row-cols-1 row-cols-md-3 g-3">
          {servicios.map((servicio) => (
            <div className="col" key={servicio.titulo}>
              <article className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <h3 className="h6">{servicio.titulo}</h3>
                  <p className="mb-0 text-muted">{servicio.descripcion}</p>
                </div>
              </article>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-5">
        <h2 className="h4 mb-3">Categorías</h2>
        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-3">
          {categorias.map((categoria) => (
            <div className="col" key={categoria.id}>
              <CardCategoria
                categoria={categoria}
                cantidadProductos={productos.filter((producto) => producto.categoriaId === categoria.id).length}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h4 mb-0">Ofertas destacadas</h2>
          <BotonEnlace a="/ofertas" texto="Ver todas" variante="link" />
        </div>
        <Aviso mensaje={aviso?.mensaje} tipo={aviso?.tipo} onCerrar={cerrarAviso} />
        <ListaProductos productos={destacados} categorias={categorias} onAgregar={agregar} />
      </section>

      <section className="mb-4">
        <h2 className="h4 mb-3">Novedades del blog</h2>
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {novedades.map((novedad) => (
            <div className="col" key={novedad.id}>
              <CardNovedad novedad={novedad} />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Inicio
