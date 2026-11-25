import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ErrorApi, erroresDeFormulario } from '../../api/cliente'
import { actualizarCategoria, obtenerCategoria } from '../../api/productosApi'
import BotonEnlace from '../../componentes/atomos/BotonEnlace'
import Aviso from '../../componentes/moleculas/Aviso'
import EncabezadoPagina from '../../componentes/moleculas/EncabezadoPagina'
import EstadoCarga from '../../componentes/moleculas/EstadoCarga'
import FormularioCategoria from '../../componentes/organismos/FormularioCategoria'
import { useCargar } from '../../hooks/useCargar'
import type { Categoria, Errores } from '../../tipos'
import type { DatosCategoriaFormulario } from '../../utilidades/validaciones'

const CAMPOS: (keyof DatosCategoriaFormulario)[] = ['nombre', 'descripcion', 'imagen']

async function cargarCategoria(id: number) {
  try {
    return await obtenerCategoria(id)
  } catch (error) {
    if (error instanceof ErrorApi && error.estado === 404) return null
    throw error
  }
}

// PUT /api/categorias/{id} (solo administrador)
function EditarCategoria() {
  const { id } = useParams()
  const { datos: categoria, cargando, error, recargar } = useCargar(() => cargarCategoria(Number(id)))
  const [errorGeneral, setErrorGeneral] = useState('')
  const navigate = useNavigate()

  if (cargando || error) {
    return <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} />
  }

  if (!categoria) {
    return (
      <div>
        <p className="alert alert-warning">La categoría no existe.</p>
        <BotonEnlace a="/admin/categorias" texto="Volver a categorías" variante="outline-secondary" />
      </div>
    )
  }

  async function guardar(datos: Omit<Categoria, 'id'>): Promise<Errores<DatosCategoriaFormulario>> {
    if (!categoria) return {}
    setErrorGeneral('')
    try {
      await actualizarCategoria(categoria.id, datos)
      navigate('/admin/categorias', { state: { aviso: 'Categoría actualizada correctamente' } })
      return {}
    } catch (problema) {
      const { errores, mensaje } = erroresDeFormulario<DatosCategoriaFormulario>(problema, CAMPOS)
      setErrorGeneral(mensaje)
      return errores
    }
  }

  return (
    <div>
      <EncabezadoPagina titulo={`Editar categoría: ${categoria.nombre}`} />
      <Aviso mensaje={errorGeneral} tipo="danger" onCerrar={() => setErrorGeneral('')} />
      <FormularioCategoria categoria={categoria} onGuardar={guardar} />
    </div>
  )
}

export default EditarCategoria
