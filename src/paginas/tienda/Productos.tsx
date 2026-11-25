import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { listarCategorias, listarProductos } from '../../api/productosApi'
import Aviso from '../../componentes/moleculas/Aviso'
import EstadoCarga from '../../componentes/moleculas/EstadoCarga'
import FiltrosProductos from '../../componentes/organismos/FiltrosProductos'
import ListaProductos from '../../componentes/organismos/ListaProductos'
import { useAgregarAlCarrito } from '../../hooks/useAgregarAlCarrito'
import { useCargar } from '../../hooks/useCargar'
import { filtrarProductos, filtrosVacios, type FiltrosProductos as Filtros } from '../../utilidades/productos'

function Productos() {
  // GET /api/productos y GET /api/categorias (ms-productos)
  const { datos, cargando, error, recargar } = useCargar(() => Promise.all([listarProductos(), listarCategorias()]))
  const [searchParams, setSearchParams] = useSearchParams()
  const [otrosFiltros, setOtrosFiltros] = useState<Omit<Filtros, 'texto'>>(filtrosVacios)
  const { aviso, agregar, cerrarAviso } = useAgregarAlCarrito()

  // El texto de busqueda vive en la URL (?buscar=) para que funcione el buscador del menu
  const filtros: Filtros = { ...otrosFiltros, texto: searchParams.get('buscar') ?? '' }
  const [productos, categorias] = datos ?? [[], []]
  const resultado = filtrarProductos(productos, filtros)

  function cambiarFiltros(nuevos: Filtros) {
    const { texto, ...resto } = nuevos
    setOtrosFiltros(resto)
    setSearchParams(texto ? { buscar: texto } : {}, { replace: true })
  }

  function limpiarFiltros() {
    setOtrosFiltros(filtrosVacios)
    setSearchParams({}, { replace: true })
  }

  return (
    <div className="container">
      <h1 className="h2">Productos</h1>
      <p className="text-muted">Catálogo completo de la Veterinaria San Marcos.</p>

      <FiltrosProductos
        filtros={filtros}
        categorias={categorias}
        onCambiar={cambiarFiltros}
        onLimpiar={limpiarFiltros}
      />

      <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} />

      {datos && (
        <>
          <p className="small text-muted" aria-live="polite">
            Mostrando {resultado.length} de {productos.length} productos
          </p>

          <Aviso mensaje={aviso?.mensaje} tipo={aviso?.tipo} onCerrar={cerrarAviso} />

          <ListaProductos
            productos={resultado}
            categorias={categorias}
            onAgregar={agregar}
            mensajeVacio="No se encontraron productos con esos filtros."
          />
        </>
      )}
    </div>
  )
}

export default Productos
