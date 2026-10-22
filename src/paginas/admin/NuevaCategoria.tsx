import { useNavigate } from 'react-router-dom'
import EncabezadoPagina from '../../componentes/moleculas/EncabezadoPagina'
import FormularioCategoria from '../../componentes/organismos/FormularioCategoria'
import { crearCategoria, obtenerCategorias } from '../../datos/baseDatos'
import type { Categoria } from '../../tipos'
import { normalizarTexto } from '../../utilidades/productos'

function NuevaCategoria() {
  const navigate = useNavigate()

  function guardar(datos: Omit<Categoria, 'id'>) {
    const repetida = obtenerCategorias().some(
      (categoria) => normalizarTexto(categoria.nombre) === normalizarTexto(datos.nombre),
    )
    if (repetida) {
      return { nombre: 'Ya existe una categoría con ese nombre' }
    }
    const nueva = crearCategoria(datos)
    navigate('/admin/categorias', { state: { aviso: `Categoría "${nueva.nombre}" creada correctamente` } })
    return {}
  }

  return (
    <div>
      <EncabezadoPagina titulo="Nueva categoría" />
      <FormularioCategoria onGuardar={guardar} />
    </div>
  )
}

export default NuevaCategoria
