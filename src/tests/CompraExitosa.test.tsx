// @vitest-environment jsdom
import { test, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";

import CompraExitosa from "../paginas/tienda/CompraExitosa";
import { renderConProveedores } from "./ayudantes";

// Prueba 14 (eventos): el botón de la boleta abre la impresión del navegador
test("el botón Imprimir boleta abre la impresión del navegador", () => {
  // Simulamos la función print del navegador
  const imprimir = vi.spyOn(window, "print").mockImplementation(() => {});

  // Mostramos la boleta de la orden 1 (ya pagada en los datos iniciales)
  renderConProveedores(<CompraExitosa />, { ruta: "/compra/exitosa/1", patron: "/compra/exitosa/:id" });

  // Simulamos que el usuario presiona Imprimir boleta
  fireEvent.click(screen.getByRole("button", { name: "Imprimir boleta" }));

  // Comprobamos que se llamó a window.print
  expect(imprimir).toHaveBeenCalledTimes(1);

  // Restauramos la función print
  imprimir.mockRestore();
});
