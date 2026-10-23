// @vitest-environment jsdom
import { test, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { useState } from "react";

import CampoFormulario from "../componentes/moleculas/CampoFormulario";

// Prueba 6 (estado): el estado del formulario cambia cuando el usuario escribe
test("el estado del formulario cambia cuando el usuario escribe", () => {
  // Formulario de prueba que guarda el texto en un estado
  function FormularioDePrueba() {
    const [texto, setTexto] = useState("");
    return (
      <>
        <CampoFormulario id="mascota" etiqueta="Mascota" valor={texto} alCambiar={setTexto} />
        <p>Escribiste: {texto}</p>
      </>
    );
  }
  render(<FormularioDePrueba />);

  // Simulamos que el usuario escribe
  fireEvent.change(screen.getByLabelText("Mascota"), { target: { value: "Firulais" } });

  // Comprobamos que el estado se actualizó
  expect(screen.getByLabelText("Mascota")).toHaveValue("Firulais");
  expect(screen.getByText("Escribiste: Firulais")).toBeInTheDocument();
});
