// @vitest-environment jsdom
import { test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import FormularioContacto from "../componentes/organismos/FormularioContacto";

// Prueba 7 (validación): no deja enviar el formulario vacío
test("muestra un mensaje cuando el nombre está vacío", () => {
  // Función simulada para saber si el formulario se envió
  const alEnviar = vi.fn();

  // Mostramos el formulario
  render(<FormularioContacto onEnviar={alEnviar} />);

  // Simulamos que el usuario presiona Enviar sin completar nada
  fireEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));

  // Comprobamos el mensaje de validación y que no se envió
  expect(screen.getByText("El nombre es obligatorio")).toBeInTheDocument();
  expect(alEnviar).not.toHaveBeenCalled();
});
