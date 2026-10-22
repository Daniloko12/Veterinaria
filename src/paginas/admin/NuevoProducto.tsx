import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EncabezadoPagina from '../../componentes/moleculas/EncabezadoPagina'
import FormularioProducto from '../../componentes/organismos/FormularioProducto'
import { crearProducto, existeCodigoProducto, obtenerCategorias } from '../../datos/baseDatos'
import type { Producto } from '../../tipos'

function NuevoProducto() {
  const [categorias] = useState(() => obtenerCategorias())
  const navigate = useNavigate()

  function guardar(datos: Omit<Producto, 'id'>) {
    if (existeCodigoProducto(datos.codigo)) {
      return { codigo: 'Ya existe un producto con ese código' }
    }
    const nuevo = crearProducto(datos)
    navigate('/admin/productos', { state: { aviso: `Producto "${nuevo.nombre}" creado correctamente` } })
    return {}
  }

  return (
    <div>
      <EncabezadoPagina titulo="Nuevo producto" descripcion="Completa los datos para agregarlo al catálogo" />
      <FormularioProducto categorias={categorias} onGuardar={guardar} rutaCancelar="/admin/productos" />
    </div>
  )
}

export default NuevoProducto
