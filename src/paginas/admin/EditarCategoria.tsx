import { useNavigate, useParams } from 'react-router-dom'
import BotonEnlace from '../../componentes/atomos/BotonEnlace'
import EncabezadoPagina from '../../componentes/moleculas/EncabezadoPagina'
import FormularioCategoria from '../../componentes/organismos/FormularioCategoria'
import { actualizarCategoria, obtenerCategoriaPorId, obtenerCategorias } from '../../datos/baseDatos'
import type { Categoria } from '../../tipos'
import { normalizarTexto } from '../../utilidades/productos'

function EditarCategoria() {
  const { id } = useParams()
  const categoria = obtenerCategoriaPorId(Number(id))
  const navigate = useNavigate()

  if (!categoria) {
    return (
      <div>
        <p className="alert alert-warning">La categoría no existe.</p>
        <BotonEnlace a="/admin/categorias" texto="Volver a categorías" variante="outline-secondary" />
      </div>
    )
  }

  function guardar(datos: Omit<Categoria, 'id'>) {
    if (!categoria) return {}
    const repetida = obtenerCategorias().some(
      (item) => item.id !== categoria.id && normalizarTexto(item.nombre) === normalizarTexto(datos.nombre),
    )
    if (repetida) {
      return { nombre: 'Ya existe otra categoría con ese nombre' }
    }
    actualizarCategoria(categoria.id, datos)
    navigate('/admin/categorias', { state: { aviso: 'Categoría actualizada correctamente' } })
    return {}
  }

  return (
    <div>
      <EncabezadoPagina titulo={`Editar categoría: ${categoria.nombre}`} />
      <FormularioCategoria categoria={categoria} onGuardar={guardar} />
    </div>
  )
}

export default EditarCategoria
