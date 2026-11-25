function Nosotros() {
  return (
    <div className="container">
      <div className="row g-4 align-items-center mb-5">
        <div className="col-md-7">
          <h1 className="h2">Nosotros</h1>
          <p>Veterinaria San Marcos es una clínica veterinaria ubicada en Rancagua.</p>
          <p>
            Fue fundada en 2009 y atiende principalmente perros y gatos, además de conejos y aves.
          </p>
          <p>
            Su objetivo es entregar atención veterinaria de calidad y mejorar la organización de citas, fichas y
            seguimiento de mascotas.
          </p>
        </div>
        <div className="col-md-5 text-center">
          <img src="/img/logo.jpg" alt="Logo de Veterinaria San Marcos" className="img-fluid rounded-circle logo-nosotros" />
        </div>
      </div>

      <div className="row row-cols-1 row-cols-md-2 g-4 mb-5">
        <div className="col">
          <article className="card h-100 shadow-sm">
            <div className="card-body">
              <h2 className="h5">Misión</h2>
              <p className="mb-0">
                Cuidar la salud y el bienestar de las mascotas de Rancagua con atención cercana y productos de confianza.
              </p>
            </div>
          </article>
        </div>
        <div className="col">
          <article className="card h-100 shadow-sm">
            <div className="card-body">
              <h2 className="h5">Visión</h2>
              <p className="mb-0">
                Ser la veterinaria de referencia de la región, combinando atención presencial con una tienda en línea
                simple de usar.
              </p>
            </div>
          </article>
        </div>
      </div>

      <section>
        <h2 className="h4">Equipo desarrollador</h2>
        <p>Giovanny Reyes y Danilo Poblete</p>
      </section>
    </div>
  )
}

export default Nosotros
