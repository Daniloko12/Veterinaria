// El frontend habla con un solo punto de entrada: el API Gateway (Spring Cloud Gateway, puerto 8080).
// El gateway reenvía cada petición al microservicio que corresponde (lo busca en Eureka):
//   /api/auth/**, /api/usuarios/**         -> ms-usuarios
//   /api/productos/**, /api/categorias/**  -> ms-productos
//   /api/ordenes/**                        -> ms-ordenes
// Se pueden cambiar con un archivo .env (ver .env.example) sin tocar el código.
const GATEWAY = import.meta.env.VITE_API_GATEWAY ?? 'http://localhost:8080'

export const URL_USUARIOS = import.meta.env.VITE_API_USUARIOS ?? GATEWAY
export const URL_PRODUCTOS = import.meta.env.VITE_API_PRODUCTOS ?? GATEWAY
export const URL_ORDENES = import.meta.env.VITE_API_ORDENES ?? GATEWAY
