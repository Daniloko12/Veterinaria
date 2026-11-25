// @vitest-environment jsdom
import { test, expect } from "vitest";

import {
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  obtenerProductoPorId,
  obtenerProductos,
} from "../datos/baseDatos";

// Prueba 15 (archivo de datos): funciones CRUD de productos con localStorage
test("CRUD de productos: crear, leer, actualizar y eliminar", () => {
  // Leer: al comenzar están los 10 productos iniciales
  expect(obtenerProductos()).toHaveLength(10);

  // Crear: se agrega un producto nuevo con el id 11
  const creado = crearProducto({
    codigo: "ACC-010",
    nombre: "Cama para perro",
    descripcion: "Cama acolchada",
    precio: 19990,
    descuento: 0,
    stock: 5,
    stockCritico: 2,
    categoriaId: 3,
    imagen: "/img/placeholder-accesorios.svg",
  });
  expect(creado.id).toBe(11);
  expect(obtenerProductos()).toHaveLength(11);

  // Actualizar: cambiamos solo el precio
  actualizarProducto(11, { precio: 17990 });
  expect(obtenerProductoPorId(11)?.precio).toBe(17990);
  expect(obtenerProductoPorId(11)?.nombre).toBe("Cama para perro");

  // Eliminar: el producto ya no existe
  expect(eliminarProducto(11)).toBe(true);
  expect(obtenerProductoPorId(11)).toBeUndefined();
});
