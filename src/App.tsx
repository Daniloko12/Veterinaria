import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import LayoutAdmin from './componentes/plantillas/LayoutAdmin'
import LayoutTienda from './componentes/plantillas/LayoutTienda'
import RutaProtegida from './componentes/plantillas/RutaProtegida'
import CategoriasAdmin from './paginas/admin/CategoriasAdmin'
import Dashboard from './paginas/admin/Dashboard'
import DetalleOrden from './paginas/admin/DetalleOrden'
import DetalleProductoAdmin from './paginas/admin/DetalleProductoAdmin'
import DetalleUsuario from './paginas/admin/DetalleUsuario'
import EditarCategoria from './paginas/admin/EditarCategoria'
import EditarProducto from './paginas/admin/EditarProducto'
import EditarUsuario from './paginas/admin/EditarUsuario'
import NuevaCategoria from './paginas/admin/NuevaCategoria'
import NuevoProducto from './paginas/admin/NuevoProducto'
import NuevoUsuario from './paginas/admin/NuevoUsuario'
import Ordenes from './paginas/admin/Ordenes'
import Perfil from './paginas/admin/Perfil'
import ProductosAdmin from './paginas/admin/ProductosAdmin'
import ProductosCriticos from './paginas/admin/ProductosCriticos'
import Reportes from './paginas/admin/Reportes'
import ReportesProductos from './paginas/admin/ReportesProductos'
import UsuariosAdmin from './paginas/admin/UsuariosAdmin'
import NoEncontrada from './paginas/NoEncontrada'
import Blog from './paginas/tienda/Blog'
import Carrito from './paginas/tienda/Carrito'
import Categorias from './paginas/tienda/Categorias'
import Checkout from './paginas/tienda/Checkout'
import CompraExitosa from './paginas/tienda/CompraExitosa'
import CompraFallida from './paginas/tienda/CompraFallida'
import Contacto from './paginas/tienda/Contacto'
import DetalleBlog from './paginas/tienda/DetalleBlog'
import DetalleProducto from './paginas/tienda/DetalleProducto'
import Inicio from './paginas/tienda/Inicio'
import Login from './paginas/tienda/Login'
import Nosotros from './paginas/tienda/Nosotros'
import Ofertas from './paginas/tienda/Ofertas'
import Productos from './paginas/tienda/Productos'
import Registro from './paginas/tienda/Registro'

// Al cambiar de pagina se vuelve al inicio de la pantalla
function ScrollAlInicio() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function App() {
  return (
    <>
      <ScrollAlInicio />
      <Routes>
        {/* Vistas publicas de la tienda */}
        <Route element={<LayoutTienda />}>
          <Route path="/" element={<Inicio />} />
          <Route path="/productos" element={<Productos />} />
          {/* Ruta dinamica: muestra el detalle segun el id del producto */}
          <Route path="/producto/:id" element={<DetalleProducto />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/categorias/:id" element={<Categorias />} />
          <Route path="/ofertas" element={<Ofertas />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/compra/exitosa/:id" element={<CompraExitosa />} />
          <Route path="/compra/fallida/:id" element={<CompraFallida />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<DetalleBlog />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NoEncontrada />} />
        </Route>

        {/* Panel de administracion (solo rol administrador) */}
        <Route path="/admin" element={<RutaProtegida />}>
          <Route element={<LayoutAdmin />}>
            <Route index element={<Dashboard />} />
            <Route path="ordenes" element={<Ordenes />} />
            <Route path="ordenes/:id" element={<DetalleOrden />} />
            <Route path="productos" element={<ProductosAdmin />} />
            <Route path="productos/nuevo" element={<NuevoProducto />} />
            <Route path="productos/criticos" element={<ProductosCriticos />} />
            <Route path="productos/reportes" element={<ReportesProductos />} />
            <Route path="productos/:id" element={<DetalleProductoAdmin />} />
            <Route path="productos/:id/editar" element={<EditarProducto />} />
            <Route path="categorias" element={<CategoriasAdmin />} />
            <Route path="categorias/nueva" element={<NuevaCategoria />} />
            <Route path="categorias/:id/editar" element={<EditarCategoria />} />
            <Route path="usuarios" element={<UsuariosAdmin />} />
            <Route path="usuarios/nuevo" element={<NuevoUsuario />} />
            <Route path="usuarios/:id" element={<DetalleUsuario />} />
            <Route path="usuarios/:id/editar" element={<EditarUsuario />} />
            <Route path="reportes" element={<Reportes />} />
            <Route path="perfil" element={<Perfil />} />
            <Route path="*" element={<NoEncontrada />} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
