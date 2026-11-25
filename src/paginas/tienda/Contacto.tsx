import FormularioContacto from '../../componentes/organismos/FormularioContacto'

function Contacto() {
  return (
    <div className="container">
      <div className="row g-4">
        <div className="col-lg-4">
          <h1 className="h2">Contacto</h1>
          <p>¿Tienes dudas sobre un producto o quieres agendar una atención? Escríbenos.</p>
          <ul className="list-unstyled">
            <li>
              <strong>Ubicación:</strong> Rancagua, Región de O'Higgins
            </li>
            <li>
              <strong>Atención:</strong> lunes a sábado
            </li>
          </ul>
        </div>
        <div className="col-lg-8">
          <FormularioContacto />
        </div>
      </div>
    </div>
  )
}

export default Contacto
