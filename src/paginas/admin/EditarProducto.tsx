import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BotonEnlace from '../../componentes/atomos/BotonEnlace'
import EncabezadoPagina from '../../componentes/moleculas/EncabezadoPagina'
import FormularioProducto from '../../componentes/organismos/FormularioProducto'
import {
  actualizarProducto,
  existeCodigoProducto,
  obtenerCategorias,
  obtenerProductoPorId,
} from '../../datos/baseDatos'
import type { Producto } from '../../tipos'

function EditarProducto() {
  const { id } = useParams()
  const producto = obtenerProductoPorId(Number(id))
  const [categorias] = useState(() => obtenerCategorias())
  const navigate = useNavigate()

  if (!producto) {
    return (
      <div>
        <p className="alert alert-warning">El producto no existe.</p>
        <BotonEnlace a="/admin/productos" texto="Volver a productos" variante="outline-secondary" />
      </div>
    )
  }

  function guardar(datos: Omit<Producto, 'id'>) {
    if (!producto) return {}
    if (existeCodigoProducto(datos.codigo, producto.id)) {
      return { codigo: 'Ya existe otro producto con ese código' }
    }
    actualizarProducto(producto.id, datos)
    navigate(`/admin/productos/${producto.id}`, { state: { aviso: 'Cambios guardados correctamente' } })
    return {}
  }

  return (
    <div>
      <EncabezadoPagina titulo={`Editar: ${producto.nombre}`} />
      <FormularioProducto
        categorias={categorias}
        producto={producto}
        onGuardar={guardar}
        rutaCancelar={`/admin/productos/${producto.id}`}
      />
    </div>
  )
}

export default EditarProducto
