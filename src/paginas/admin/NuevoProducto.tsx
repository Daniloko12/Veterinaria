import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { erroresDeFormulario } from '../../api/cliente'
import { crearProducto, listarCategorias } from '../../api/productosApi'
import Aviso from '../../componentes/moleculas/Aviso'
import EncabezadoPagina from '../../componentes/moleculas/EncabezadoPagina'
import EstadoCarga from '../../componentes/moleculas/EstadoCarga'
import FormularioProducto from '../../componentes/organismos/FormularioProducto'
import { useCargar } from '../../hooks/useCargar'
import type { Errores, Producto } from '../../tipos'
import type { DatosProductoFormulario } from '../../utilidades/validaciones'

const CAMPOS: (keyof DatosProductoFormulario)[] = ['codigo', 'nombre', 'descripcion', 'precio', 'descuento', 'stock', 'stockCritico', 'categoriaId', 'imagen']

// POST /api/productos (solo administrador). El backend rechaza un código repetido (409).
function NuevoProducto() {
  const { datos: categorias, cargando, error, recargar } = useCargar(listarCategorias)
  const [errorGeneral, setErrorGeneral] = useState('')
  const navigate = useNavigate()

  async function guardar(datos: Omit<Producto, 'id'>): Promise<Errores<DatosProductoFormulario>> {
    setErrorGeneral('')
    try {
      const nuevo = await crearProducto(datos)
      navigate('/admin/productos', { state: { aviso: `Producto "${nuevo.nombre}" creado correctamente` } })
      return {}
    } catch (problema) {
      const { errores, mensaje } = erroresDeFormulario<DatosProductoFormulario>(problema, CAMPOS)
      setErrorGeneral(mensaje)
      return errores
    }
  }

  return (
    <div>
      <EncabezadoPagina titulo="Nuevo producto" descripcion="Completa los datos para agregarlo al catálogo" />
      <Aviso mensaje={errorGeneral} tipo="danger" onCerrar={() => setErrorGeneral('')} />
      <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} />
      {categorias && <FormularioProducto categorias={categorias} onGuardar={guardar} rutaCancelar="/admin/productos" />}
    </div>
  )
}

export default NuevoProducto
