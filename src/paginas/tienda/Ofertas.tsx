import { useState } from 'react'
import Aviso from '../../componentes/moleculas/Aviso'
import ListaProductos from '../../componentes/organismos/ListaProductos'
import { obtenerCategorias, obtenerProductosEnOferta } from '../../datos/baseDatos'
import { useAgregarAlCarrito } from '../../hooks/useAgregarAlCarrito'

function Ofertas() {
  const [ofertas] = useState(() => obtenerProductosEnOferta())
  const [categorias] = useState(() => obtenerCategorias())
  const { aviso, agregar, cerrarAviso } = useAgregarAlCarrito()

  return (
    <div className="container">
      <h1 className="h2">Ofertas</h1>
      <p className="text-muted">Productos con descuento, ordenados de mayor a menor descuento.</p>
      <Aviso mensaje={aviso?.mensaje} tipo={aviso?.tipo} onCerrar={cerrarAviso} />
      <ListaProductos
        productos={ofertas}
        categorias={categorias}
        onAgregar={agregar}
        mensajeVacio="Por ahora no hay productos en oferta."
      />
    </div>
  )
}

export default Ofertas
