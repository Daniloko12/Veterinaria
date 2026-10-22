import { useEffect, useState } from 'react'

export interface Diapositiva {
  imagen: string
  titulo: string
  descripcion: string
}

interface CarruselProps {
  diapositivas: Diapositiva[]
  /** Milisegundos entre cada cambio automatico (0 = sin cambio automatico) */
  intervalo?: number
}

// Carrusel controlado con estado de React (no depende del JavaScript de Bootstrap)
function Carrusel({ diapositivas, intervalo = 5000 }: CarruselProps) {
  const [indice, setIndice] = useState(0)
  const total = diapositivas.length

  // Avance automatico. Se reinicia cada vez que cambia la diapositiva.
  useEffect(() => {
    if (intervalo <= 0 || total < 2) {
      return
    }
    const temporizador = setInterval(() => {
      setIndice((actual) => (actual + 1) % total)
    }, intervalo)
    return () => clearInterval(temporizador)
  }, [intervalo, total, indice])

  if (total === 0) {
    return null
  }

  function siguiente() {
    setIndice((indice + 1) % total)
  }

  function anterior() {
    setIndice((indice - 1 + total) % total)
  }

  return (
    <div className="carousel slide carrusel" aria-roledescription="carrusel" aria-label="Destacados">
      <div className="carousel-indicators">
        {diapositivas.map((diapositiva, i) => (
          <button
            key={diapositiva.titulo}
            type="button"
            className={i === indice ? 'active' : ''}
            aria-current={i === indice ? 'true' : undefined}
            aria-label={`Ir a la diapositiva ${i + 1}`}
            onClick={() => setIndice(i)}
          />
        ))}
      </div>

      <div className="carousel-inner rounded-3">
        {diapositivas.map((diapositiva, i) => (
          <div
            key={diapositiva.titulo}
            className={`carousel-item ${i === indice ? 'active' : ''}`.trim()}
            aria-hidden={i !== indice}
          >
            <img src={diapositiva.imagen} className="d-block w-100" alt={diapositiva.titulo} />
            <div className="carousel-caption">
              <h2 className="h3">{diapositiva.titulo}</h2>
              <p className="mb-0">{diapositiva.descripcion}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="carousel-control-prev" type="button" onClick={anterior} aria-label="Anterior">
        <span className="carousel-control-prev-icon" aria-hidden="true" />
      </button>
      <button className="carousel-control-next" type="button" onClick={siguiente} aria-label="Siguiente">
        <span className="carousel-control-next-icon" aria-hidden="true" />
      </button>
    </div>
  )
}

export default Carrusel
