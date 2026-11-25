import { listarCategorias, listarOfertas } from '../../api/productosApi'
import Aviso from '../../componentes/moleculas/Aviso'
import EstadoCarga from '../../componentes/moleculas/EstadoCarga'
import ListaProductos from '../../componentes/organismos/ListaProductos'
import { useAgregarAlCarrito } from '../../hooks/useAgregarAlCarrito'
import { useCargar } from '../../hooks/useCargar'

function Ofertas() {
  const { datos, cargando, error, recargar } = useCargar(() => Promise.all([listarOfertas(), listarCategorias()]))
  const { aviso, agregar, cerrarAviso } = useAgregarAlCarrito()

  return (
    <div className="container">
      <h1 className="h2">Ofertas</h1>
      <p className="text-muted">Productos con descuento, ordenados de mayor a menor descuento.</p>
      <Aviso mensaje={aviso?.mensaje} tipo={aviso?.tipo} onCerrar={cerrarAviso} />
      <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} />
      {datos && (
        <ListaProductos
          productos={datos[0]}
          categorias={datos[1]}
          onAgregar={agregar}
          mensajeVacio="Por ahora no hay productos en oferta."
        />
      )}
    </div>
  )
}

export default Ofertas
