import BotonEnlace from '../componentes/atomos/BotonEnlace'

function NoEncontrada() {
  return (
    <div className="container text-center py-5">
      <p className="display-4 fw-bold text-muted">404</p>
      <h1 className="h3">Página no encontrada</h1>
      <p className="text-muted">La dirección que buscas no existe.</p>
      <BotonEnlace a="/" texto="Volver al inicio" />
    </div>
  )
}

export default NoEncontrada
