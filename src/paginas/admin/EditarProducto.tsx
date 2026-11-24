import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ErrorApi, erroresDeFormulario } from '../../api/cliente'
import { actualizarProducto, listarCategorias, obtenerProducto } from '../../api/productosApi'
import BotonEnlace from '../../componentes/atomos/BotonEnlace'
import Aviso from '../../componentes/moleculas/Aviso'
import EncabezadoPagina from '../../componentes/moleculas/EncabezadoPagina'
import EstadoCarga from '../../componentes/moleculas/EstadoCarga'
import FormularioProducto from '../../componentes/organismos/FormularioProducto'
import { useCargar } from '../../hooks/useCargar'
import type { Errores, Producto } from '../../tipos'
import type { DatosProductoFormulario } from '../../utilidades/validaciones'

const CAMPOS: (keyof DatosProductoFormulario)[] = ['codigo', 'nombre', 'descripcion', 'precio', 'descuento', 'stock', 'stockCritico', 'categoriaId', 'imagen']

async function cargarDatos(id: number) {
  try {
    const [producto, categorias] = await Promise.all([obtenerProducto(id), listarCategorias()])
    return { producto, categorias }
  } catch (error) {
    if (error instanceof ErrorApi && error.estado === 404) return { producto: null, categorias: [] }
    throw error
  }
}

// PUT /api/productos/{id} (solo administrador)
function EditarProducto() {
  const { id } = useParams()
  const { datos, cargando, error, recargar } = useCargar(() => cargarDatos(Number(id)))
  const [errorGeneral, setErrorGeneral] = useState('')
  const navigate = useNavigate()

  if (!datos) {
    return <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} />
  }

  const { producto, categorias } = datos
  if (!producto) {
    return (
      <div>
        <p className="alert alert-warning">El producto no existe.</p>
        <BotonEnlace a="/admin/productos" texto="Volver a productos" variante="outline-secondary" />
      </div>
    )
  }

  async function guardar(cambios: Omit<Producto, 'id'>): Promise<Errores<DatosProductoFormulario>> {
    if (!producto) return {}
    setErrorGeneral('')
    try {
      await actualizarProducto(producto.id, cambios)
      navigate(`/admin/productos/${producto.id}`, { state: { aviso: 'Cambios guardados correctamente' } })
      return {}
    } catch (problema) {
      const { errores, mensaje } = erroresDeFormulario<DatosProductoFormulario>(problema, CAMPOS)
      setErrorGeneral(mensaje)
      return errores
    }
  }

  return (
    <div>
      <EncabezadoPagina titulo={`Editar: ${producto.nombre}`} />
      <Aviso mensaje={errorGeneral} tipo="danger" onCerrar={() => setErrorGeneral('')} />
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
