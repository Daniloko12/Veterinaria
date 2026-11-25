import { useState, type FormEvent } from 'react'

interface BarraBusquedaProps {
  onBuscar: (texto: string) => void
  placeholder?: string
}

function BarraBusqueda({ onBuscar, placeholder = 'Buscar productos' }: BarraBusquedaProps) {
  const [texto, setTexto] = useState('')

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    onBuscar(texto.trim())
  }

  return (
    <form className="d-flex gap-2 w-100" role="search" onSubmit={enviar}>
      <input
        type="search"
        className="form-control form-control-sm"
        placeholder={placeholder}
        aria-label="Buscar productos"
        value={texto}
        onChange={(evento) => setTexto(evento.target.value)}
      />
      <button type="submit" className="btn btn-outline-success btn-sm">
        Buscar
      </button>
    </form>
  )
}

export default BarraBusqueda
