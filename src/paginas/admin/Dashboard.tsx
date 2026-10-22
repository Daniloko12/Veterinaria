import { useState } from 'react'
import { Link } from 'react-router-dom'
import Aviso from '../../componentes/moleculas/Aviso'
import EncabezadoPagina from '../../componentes/moleculas/EncabezadoPagina'
import TarjetaEstadistica from '../../componentes/moleculas/TarjetaEstadistica'
import { obtenerOrdenes, obtenerProductos, obtenerUsuarios } from '../../datos/baseDatos'
import { formatearPrecio } from '../../utilidades/formato'
import { esStockCritico } from '../../utilidades/productos'
import { resumenVentas } from '../../utilidades/reportes'

const accesos = [
  { a: '/admin/ordenes', titulo: 'Órdenes', descripcion: 'Gestión y seguimiento de todas las órdenes de compra.' },
  { a: '/admin/productos', titulo: 'Productos', descripcion: 'Administrar inventario y detalles de los productos.' },
  { a: '/admin/categorias', titulo: 'Categorías', descripcion: 'Organizar productos en categorías.' },
  { a: '/admin/usuarios', titulo: 'Usuarios', descripcion: 'Gestión de cuentas de usuario y sus roles.' },
  { a: '/admin/reportes', titulo: 'Reportes', descripcion: 'Informes de ventas e inventario.' },
  { a: '/admin/perfil', titulo: 'Perfil', descripcion: 'Información personal y configuración de la cuenta.' },
  { a: '/', titulo: 'Tienda', descripcion: 'Ver la tienda tal como la ven los clientes.' },
]

function Dashboard() {
  const [ordenes] = useState(() => obtenerOrdenes())
  const [productos] = useState(() => obtenerProductos())
  const [usuarios] = useState(() => obtenerUsuarios())

  const resumen = resumenVentas(ordenes)
  const inventario = productos.reduce((suma, producto) => suma + producto.stock, 0)
  const criticos = productos.filter(esStockCritico).length
  const clientes = usuarios.filter((usuario) => usuario.rol === 'cliente').length

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
          <TarjetaEstadistica
            titulo="Usuarios"
            valor={usuarios.length}
            detalle={`Clientes registrados: ${clientes}`}
            color="warning"
          />
        </div>
      </div>

      {criticos > 0 && (
        <Aviso
          tipo="danger"
          mensaje={`Hay ${criticos} productos con stock crítico. Revisa el listado de productos críticos.`}
        />
      )}

      <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-4 g-3">
        {accesos.map((acceso) => (
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
