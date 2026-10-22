import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-dark text-white mt-auto pt-4 pb-3">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-5">
            <h2 className="h5">Veterinaria San Marcos</h2>
            <p className="small mb-0 text-white-50">
              Atención veterinaria simple y cercana para mascotas en Rancagua, Chile.
            </p>
          </div>
          <div className="col-6 col-md-3">
            <h2 className="h6">Tienda</h2>
            <ul className="list-unstyled small">
              <li><Link className="link-light" to="/productos">Productos</Link></li>
              <li><Link className="link-light" to="/ofertas">Ofertas</Link></li>
              <li><Link className="link-light" to="/categorias">Categorías</Link></li>
            </ul>
          </div>
          <div className="col-6 col-md-4">
            <h2 className="h6">Información</h2>
            <ul className="list-unstyled small">
              <li><Link className="link-light" to="/nosotros">Nosotros</Link></li>
              <li><Link className="link-light" to="/blog">Blog</Link></li>
              <li><Link className="link-light" to="/contacto">Contacto</Link></li>
            </ul>
          </div>
        </div>
        <hr className="border-secondary" />
        <p className="small text-center text-white-50 mb-0">&copy; 2026 Proyecto académico DSY1104</p>
      </div>
    </footer>
  )
}

export default Footer
