import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCarrito } from '../../hooks/useCarrito'
import { useSesion } from '../../hooks/useSesion'
import { formatearPrecio } from '../../utilidades/formato'
import Boton from '../atomos/Boton'
import BotonEnlace from '../atomos/BotonEnlace'
import BarraBusqueda from '../moleculas/BarraBusqueda'

const enlaces = [
  { a: '/', texto: 'Inicio' },
  { a: '/productos', texto: 'Productos' },
  { a: '/categorias', texto: 'Categorías' },
  { a: '/ofertas', texto: 'Ofertas' },
  { a: '/nosotros', texto: 'Nosotros' },
  { a: '/blog', texto: 'Blog' },
  { a: '/contacto', texto: 'Contacto' },
]

function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const { sesion, esAdmin, cerrarSesion } = useSesion()
  const { total, cantidadTotal } = useCarrito()
  const navigate = useNavigate()

  function cerrarMenu() {
    setMenuAbierto(false)
  }

  function buscar(texto: string) {
    cerrarMenu()
    navigate(texto ? `/productos?buscar=${encodeURIComponent(texto)}` : '/productos')
  }

  function salir() {
    cerrarSesion()
    cerrarMenu()
    navigate('/')
  }

  return (
    <header>
      <nav className="navbar navbar-expand-lg bg-white border-bottom shadow-sm" aria-label="Navegación principal">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center gap-2" to="/" onClick={cerrarMenu}>
            <img src="/img/logo.jpg" alt="" width="40" height="40" className="rounded-circle logo-marca" />
            <span className="fw-semibold">Veterinaria San Marcos</span>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            aria-controls="menu-principal"
            aria-expanded={menuAbierto}
            aria-label="Mostrar menú"
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div id="menu-principal" className={`collapse navbar-collapse ${menuAbierto ? 'show' : ''}`.trim()}>
            <div className="d-flex flex-column w-100 gap-2 py-2 py-lg-0 ms-lg-4">
              {/* Fila 1: buscador + sesion */}
              <div className="d-flex flex-column flex-lg-row gap-2 align-items-lg-center">
                <div className="flex-grow-1 buscador-navbar">
                  <BarraBusqueda onBuscar={buscar} />
                </div>
                {sesion ? (
                  <div className="d-flex flex-wrap gap-2 align-items-center">
                    <span className="small text-nowrap">Hola, {sesion.nombre}</span>
                    {esAdmin && <BotonEnlace a="/admin" texto="Panel admin" variante="dark" tamano="sm" />}
                    <Boton texto="Cerrar sesión" variante="outline-danger" tamano="sm" onClick={salir} />
                  </div>
                ) : (
                  <div className="d-flex gap-2">
                    <BotonEnlace a="/login" texto="Iniciar sesión" variante="outline-primary" tamano="sm" clase="text-nowrap" />
                    <BotonEnlace a="/registro" texto="Crear cuenta" tamano="sm" clase="text-nowrap" />
                  </div>
                )}
              </div>

              {/* Fila 2: secciones + carrito */}
              <div className="d-flex flex-column flex-lg-row gap-2 align-items-lg-center justify-content-between">
                <ul className="navbar-nav">
                  {enlaces.map((enlace) => (
                    <li className="nav-item" key={enlace.a}>
                      <NavLink className="nav-link" to={enlace.a} end={enlace.a === '/'} onClick={cerrarMenu}>
                        {enlace.texto}
                      </NavLink>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/carrito"
                  className="btn btn-success btn-sm text-nowrap align-self-start align-self-lg-center"
                  onClick={cerrarMenu}
                  aria-label={`Carrito: ${cantidadTotal} productos, total ${formatearPrecio(total)}`}
                >
                  Carrito {formatearPrecio(total)}{' '}
                  <span className="badge text-bg-light">{cantidadTotal}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
