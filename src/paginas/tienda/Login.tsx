import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import BotonEnlace from '../../componentes/atomos/BotonEnlace'
import Aviso from '../../componentes/moleculas/Aviso'
import FormularioLogin from '../../componentes/organismos/FormularioLogin'
import { useSesion } from '../../hooks/useSesion'
import type { DatosLogin } from '../../utilidades/validaciones'

function Login() {
  const { sesion, iniciarSesion } = useSesion()
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const aviso = (location.state as { aviso?: string } | null)?.aviso

  function ingresar(datos: DatosLogin) {
    const nueva = iniciarSesion(datos.correo, datos.clave)
    if (!nueva) {
      setError('Correo o contraseña incorrectos, o usuario desactivado')
      return
    }
    setError('')
    navigate(nueva.rol === 'administrador' ? '/admin' : '/')
  }

  if (sesion) {
    return (
      <div className="container text-center py-5">
        <h1 className="h3">Ya iniciaste sesión como {sesion.nombre}</h1>
        <div className="d-flex justify-content-center gap-2 mt-3">
          <BotonEnlace a="/" texto="Ir a la tienda" variante="outline-primary" />
          {sesion.rol === 'administrador' && <BotonEnlace a="/admin" texto="Ir al panel" />}
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="mx-auto contenedor-login">
        <div className="text-center mb-3">
          <img src="/img/logo.jpg" alt="Logo de Veterinaria San Marcos" className="rounded-circle logo-login" />
          <h1 className="h3 mt-2">Iniciar sesión</h1>
        </div>

        <Aviso mensaje={aviso} tipo="warning" />
        <FormularioLogin onIngresar={ingresar} errorGeneral={error} />

        <p className="text-center mt-3">
          ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
        </p>
        <div className="small text-muted border rounded p-2 bg-white">
          <p className="mb-1">Cuenta demo administrador: admin@veterinaria.cl / admin123</p>
          <p className="mb-0">Cuenta demo cliente: cliente@correo.cl / 1234</p>
        </div>
      </div>
    </div>
  )
}

export default Login
