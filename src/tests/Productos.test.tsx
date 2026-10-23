// @vitest-environment jsdom
import { test, expect } from "vitest";
import { screen } from "@testing-library/react";

import Productos from "../paginas/tienda/Productos";
import { escribir, renderConProveedores } from "./ayudantes";

// Prueba 9 (filtros de búsqueda): la lista se filtra mientras el usuario escribe
test("filtra los productos mientras el usuario escribe", () => {
  // Mostramos la página de productos
  renderConProveedores(<Productos />, { ruta: "/productos" });

  // Al comienzo se ven los 10 productos
  expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(10);

  // Simulamos que el usuario busca "correa"
  escribir("Buscar", "correa");

  // Comprobamos que solo queda la correa
  const titulos = screen.getAllByRole("heading", { level: 3 }).map((titulo) => titulo.textContent);
  expect(titulos).toEqual(["Correa para perros"]);
});
