import { Link } from 'react-router-dom'
import { listarOrdenes } from '../../api/ordenesApi'
import { listarProductos } from '../../api/productosApi'
import { listarUsuarios } from '../../api/usuariosApi'
import Aviso from '../../componentes/moleculas/Aviso'
import EncabezadoPagina from '../../componentes/moleculas/EncabezadoPagina'
import EstadoCarga from '../../componentes/moleculas/EstadoCarga'
import TarjetaEstadistica from '../../componentes/moleculas/TarjetaEstadistica'
import { useCargar } from '../../hooks/useCargar'
import { useSesion } from '../../hooks/useSesion'
import type { Rol } from '../../tipos'
import { formatearPrecio } from '../../utilidades/formato'
import { esStockCritico } from '../../utilidades/productos'
import { resumenVentas } from '../../utilidades/reportes'

const ADMIN: Rol[] = ['administrador']
const PERSONAL: Rol[] = ['administrador', 'recepcionista']

const accesos = [
  { a: '/admin/ordenes', titulo: 'Órdenes', descripcion: 'Gestión y seguimiento de todas las órdenes de compra.', roles: PERSONAL },
  { a: '/admin/productos', titulo: 'Productos', descripcion: 'Administrar inventario y detalles de los productos.', roles: ADMIN },
  { a: '/admin/productos/criticos', titulo: 'Stock crítico', descripcion: 'Productos por reponer.', roles: PERSONAL },
  { a: '/admin/categorias', titulo: 'Categorías', descripcion: 'Organizar productos en categorías.', roles: ADMIN },
  { a: '/admin/usuarios', titulo: 'Usuarios', descripcion: 'Gestión de cuentas de usuario y sus roles.', roles: ADMIN },
  { a: '/admin/reportes', titulo: 'Reportes', descripcion: 'Informes de ventas e inventario.', roles: ADMIN },
  { a: '/admin/perfil', titulo: 'Perfil', descripcion: 'Información personal y configuración de la cuenta.', roles: PERSONAL },
  { a: '/', titulo: 'Tienda', descripcion: 'Ver la tienda tal como la ven los clientes.', roles: PERSONAL },
]

// Cada rol solo pide al backend lo que tiene permiso de ver
async function cargarResumen(esAdmin: boolean) {
  const [ordenes, productos] = await Promise.all([listarOrdenes(), listarProductos()])
  const usuarios = esAdmin ? await listarUsuarios() : null
  return { ordenes, productos, usuarios }
}

function Dashboard() {
  const { esAdmin, tieneRol } = useSesion()
  const { datos, cargando, error, recargar } = useCargar(() => cargarResumen(esAdmin))

  if (!datos) {
    return (
      <div>
        <EncabezadoPagina titulo="Dashboard" descripcion="Resumen de las actividades de la tienda" />
        <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} />
      </div>
    )
  }

  const { ordenes, productos, usuarios } = datos
  const resumen = resumenVentas(ordenes)
  const inventario = productos.reduce((suma, producto) => suma + producto.stock, 0)
  const criticos = productos.filter(esStockCritico).length
  const misAccesos = accesos.filter((acceso) => tieneRol(...acceso.roles))

  return (
    <div>
      <EncabezadoPagina titulo="Dashboard" descripcion="Resumen de las actividades de la tienda" />

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <TarjetaEstadistica
            titulo="Compras"
            valor={resumen.ordenesPagadas}
            detalle={`Total vendido: ${formatearPrecio(resumen.totalVendido)}`}
            color="primary"
          />
        </div>
        <div className="col-md-4">
          <TarjetaEstadistica
            titulo="Productos"
            valor={productos.length}
            detalle={`Inventario actual: ${inventario} unidades`}
            color="success"
          />
        </div>
        <div className="col-md-4">
          {usuarios ? (
            <TarjetaEstadistica
              titulo="Usuarios"
              valor={usuarios.length}
              detalle={`Clientes registrados: ${usuarios.filter((usuario) => usuario.rol === 'cliente').length}`}
              color="warning"
            />
          ) : (
            <TarjetaEstadistica titulo="Stock crítico" valor={criticos} detalle="Productos por reponer" color="warning" />
          )}
        </div>
      </div>

      {criticos > 0 && (
        <Aviso
          tipo="danger"
          mensaje={`Hay ${criticos} productos con stock crítico. Revisa el listado de productos críticos.`}
        />
      )}

      <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-4 g-3">
        {misAccesos.map((acceso) => (
          <div className="col" key={acceso.a}>
            <Link to={acceso.a} className="card h-100 text-decoration-none shadow-sm acceso-admin">
              <div className="card-body text-center">
                <h2 className="h6 text-primary">{acceso.titulo}</h2>
                <p className="small text-muted mb-0">{acceso.descripcion}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard
