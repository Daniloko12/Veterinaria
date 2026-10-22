import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Aviso from '../../componentes/moleculas/Aviso'
import FiltrosProductos from '../../componentes/organismos/FiltrosProductos'
import ListaProductos from '../../componentes/organismos/ListaProductos'
import { obtenerCategorias, obtenerProductos } from '../../datos/baseDatos'
import { useAgregarAlCarrito } from '../../hooks/useAgregarAlCarrito'
import { filtrarProductos, filtrosVacios, type FiltrosProductos as Filtros } from '../../utilidades/productos'

function Productos() {
  const [productos] = useState(() => obtenerProductos())
  const [categorias] = useState(() => obtenerCategorias())
  const [searchParams, setSearchParams] = useSearchParams()
  const [otrosFiltros, setOtrosFiltros] = useState<Omit<Filtros, 'texto'>>(filtrosVacios)
  const { aviso, agregar, cerrarAviso } = useAgregarAlCarrito()

  // El texto de busqueda vive en la URL (?buscar=) para que funcione el buscador del menu
  const filtros: Filtros = { ...otrosFiltros, texto: searchParams.get('buscar') ?? '' }
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
    </div>
  )
}

export default Productos
