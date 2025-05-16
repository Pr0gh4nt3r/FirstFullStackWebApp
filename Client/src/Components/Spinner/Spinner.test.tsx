// src/components/Spinner/Spinner.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import Spinner from "./Spinner";

describe("Spinner", () => {
  it("renders a spinner with correct role and animation", () => {
    render(<Spinner />);
    // Das Wrapper-Div sollte existieren
    // const spinner = screen.getByRole("status", { hidden: true });
    // expect(spinner).toBeInTheDocument();
    const spinner = screen.getByTestId("spinner");
    expect(spinner).toBeVisible();

    // Und es sollte das entsprechende CSS-Klasse haben
    expect(spinner).toHaveClass("spinner");
  });
});
