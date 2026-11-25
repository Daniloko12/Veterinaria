// @vitest-environment jsdom
import { test, expect, vi } from "vitest";

import { actualizarProducto, crearProducto, eliminarProducto, listarProductos, obtenerProducto } from "../api/productosApi";
import { guardarTokens } from "../api/tokens";
import { iniciarSesion } from "../api/usuariosApi";

// Prueba 15 (conexión con la API): CRUD de productos usando el token JWT del administrador
test("CRUD de productos con la API: crear, leer, actualizar y eliminar", async () => {
  // Iniciamos sesión como administrador: el backend entrega el token JWT
  guardarTokens(await iniciarSesion("admin@veterinaria.cl", "admin123"));

  // Leer: al comenzar están los 10 productos iniciales
  expect(await listarProductos()).toHaveLength(10);

  // Crear: se agrega un producto nuevo con el id 11
  const datos = {
    codigo: "ACC-010",
    nombre: "Cama para perro",
    descripcion: "Cama acolchada",
    precio: 19990,
    descuento: 0,
    stock: 5,
    stockCritico: 2,
    categoriaId: 3,
    imagen: "/img/placeholder-accesorios.svg",
  };
  const creado = await crearProducto(datos);
  expect(creado.id).toBe(11);
  expect(await listarProductos()).toHaveLength(11);

  // La petición para crear llevó el token en el encabezado Authorization
  const peticionCrear = vi.mocked(fetch).mock.calls.find(([, opciones]) => opciones?.method === "POST" && opciones.body?.toString().includes("ACC-010"));
  expect(peticionCrear?.[1]?.headers).toMatchObject({ Authorization: "Bearer token-de-prueba-admin" });

  // Actualizar: cambiamos solo el precio
  await actualizarProducto(11, { ...datos, precio: 17990 });
  const actualizado = await obtenerProducto(11);
  expect(actualizado.precio).toBe(17990);
  expect(actualizado.nombre).toBe("Cama para perro");

  // Eliminar: el producto ya no existe (el backend responde 404)
  await eliminarProducto(11);
  await expect(obtenerProducto(11)).rejects.toMatchObject({ estado: 404 });
});
