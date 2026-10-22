import type { ReactNode } from 'react'

interface EncabezadoPaginaProps {
  titulo: string
  descripcion?: string
  /** Botones o enlaces que se muestran a la derecha */
  acciones?: ReactNode
}

function EncabezadoPagina({ titulo, descripcion, acciones }: EncabezadoPaginaProps) {
  return (
    <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-4">
      <div>
        <h1 className="h3 mb-1">{titulo}</h1>
        {descripcion && <p className="text-muted mb-0">{descripcion}</p>}
      </div>
      {acciones && <div className="d-flex flex-wrap gap-2">{acciones}</div>}
    </div>
  )
}

export default EncabezadoPagina
