// @vitest-environment jsdom
import { test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import Boton from "../componentes/atomos/Boton";

// Prueba 1 (props): el botón recibe su etiqueta por props
test("el botón muestra el texto que recibe por props", () => {
  // Mostramos el botón
  render(<Boton texto="Comprar ahora" />);

  // Buscamos el botón por su texto
  const boton = screen.getByRole("button", { name: "Comprar ahora" });

  // Comprobamos que el texto es el recibido
  expect(boton.textContent).toBe("Comprar ahora");
});

// Prueba 2 (props y eventos): el botón recibe la función onClick y la ejecuta
test("al hacer clic se ejecuta la función onClick", () => {
  // Creamos una función simulada
  const alHacerClic = vi.fn();
  render(<Boton texto="Guardar" onClick={alHacerClic} />);

  // Simulamos que el usuario presiona el botón
  fireEvent.click(screen.getByRole("button", { name: "Guardar" }));

  // Comprobamos que la función se ejecutó una vez
  expect(alHacerClic).toHaveBeenCalledTimes(1);
});
