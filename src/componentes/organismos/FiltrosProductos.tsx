import type { Categoria } from '../../tipos'
import type { FiltrosProductos as Filtros, OrdenProductos } from '../../utilidades/productos'

interface FiltrosProductosProps {
  filtros: Filtros
  categorias: Categoria[]
  onCambiar: (filtros: Filtros) => void
  onLimpiar: () => void
}

function FiltrosProductos({ filtros, categorias, onCambiar, onLimpiar }: FiltrosProductosProps) {
  return (
    <form className="card card-body shadow-sm mb-4" onSubmit={(evento) => evento.preventDefault()}>
      <div className="row g-3 align-items-end">
        <div className="col-md-4">
          <label htmlFor="filtro-texto" className="form-label">
            Buscar
          </label>
          <input
            id="filtro-texto"
            type="text"
            className="form-control"
            placeholder="Nombre, código o descripción"
            value={filtros.texto}
            onChange={(evento) => onCambiar({ ...filtros, texto: evento.target.value })}
          />
        </div>

        <div className="col-md-3">
          <label htmlFor="filtro-categoria" className="form-label">
            Categoría
          </label>
          <select
            id="filtro-categoria"
            className="form-select"
            value={filtros.categoriaId}
            onChange={(evento) => onCambiar({ ...filtros, categoriaId: Number(evento.target.value) })}
          >
            <option value={0}>Todas</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <label htmlFor="filtro-orden" className="form-label">
            Ordenar por
          </label>
          <select
            id="filtro-orden"
            className="form-select"
            value={filtros.orden}
            onChange={(evento) => onCambiar({ ...filtros, orden: evento.target.value as OrdenProductos })}
          >
            <option value="relevancia">Relevancia</option>
            <option value="precio-asc">Precio: menor a mayor</option>
            <option value="precio-desc">Precio: mayor a menor</option>
            <option value="nombre">Nombre (A-Z)</option>
          </select>
        </div>

        <div className="col-md-2">
          <div className="form-check mb-2">
            <input
              id="filtro-ofertas"
              type="checkbox"
              className="form-check-input"
              checked={filtros.soloOfertas}
              onChange={(evento) => onCambiar({ ...filtros, soloOfertas: evento.target.checked })}
            />
            <label htmlFor="filtro-ofertas" className="form-check-label">
              Solo ofertas
            </label>
          </div>
          <button type="button" className="btn btn-outline-secondary btn-sm w-100" onClick={onLimpiar}>
            Limpiar filtros
          </button>
        </div>
      </div>
    </form>
  )
}

export default FiltrosProductos
