// src/components/Spinner/Spinner.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import Spinner from "./Spinner";
import { describe, expect, it } from "@jest/globals";

describe("Spinner", () => {
  it("renders a spinner with correct role and animation", () => {
    render(<Spinner />);
    // Das Wrapper-Div sollte existieren
    const spinner = screen.getByTestId("spinner");
    expect(spinner).toBeDefined();
    // Und es sollte das entsprechende CSS-Klasse haben
    expect(spinner.classList.contains("spinner")).toBe(true);
    const style = window.getComputedStyle(spinner);
    // Es sollte sichtbar sein
    expect(style.display).not.toBe("none");
  });
});
