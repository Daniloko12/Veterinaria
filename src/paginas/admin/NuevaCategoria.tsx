import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { erroresDeFormulario } from '../../api/cliente'
import { crearCategoria } from '../../api/productosApi'
import Aviso from '../../componentes/moleculas/Aviso'
import EncabezadoPagina from '../../componentes/moleculas/EncabezadoPagina'
import FormularioCategoria from '../../componentes/organismos/FormularioCategoria'
import type { Categoria, Errores } from '../../tipos'
import type { DatosCategoriaFormulario } from '../../utilidades/validaciones'

const CAMPOS: (keyof DatosCategoriaFormulario)[] = ['nombre', 'descripcion', 'imagen']

// POST /api/categorias (solo administrador). El backend rechaza un nombre repetido (409).
function NuevaCategoria() {
  const navigate = useNavigate()
  const [errorGeneral, setErrorGeneral] = useState('')

  async function guardar(datos: Omit<Categoria, 'id'>): Promise<Errores<DatosCategoriaFormulario>> {
    setErrorGeneral('')
    try {
      const nueva = await crearCategoria(datos)
      navigate('/admin/categorias', { state: { aviso: `Categoría "${nueva.nombre}" creada correctamente` } })
      return {}
    } catch (problema) {
      const { errores, mensaje } = erroresDeFormulario<DatosCategoriaFormulario>(problema, CAMPOS)
      setErrorGeneral(mensaje)
      return errores
    }
  }

  return (
    <div>
      <EncabezadoPagina titulo="Nueva categoría" />
      <Aviso mensaje={errorGeneral} tipo="danger" onCerrar={() => setErrorGeneral('')} />
      <FormularioCategoria onGuardar={guardar} />
    </div>
  )
}

export default NuevaCategoria
