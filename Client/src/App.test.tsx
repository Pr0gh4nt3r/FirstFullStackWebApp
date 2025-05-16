// src/App.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import LoginSignup from "@/Components/LoginSignup/LoginSignup";
import Account from "@/Components/Account/Account";
import Navbar from "@/Components/Navigation/Navbar";
import { AuthProvider } from "./Context/AuthContext";

// Hilfsfunktion, um sessionStorage zu mocken
function mockSessionStorage(token: string | null) {
  Object.defineProperty(window, "sessionStorage", {
    value: {
      getItem: jest.fn(() => token),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    },
    writable: true,
  });
}

describe("App Routing & Navbar", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("zeigt den LoginSignup auf '/' und keine Navbar", () => {
    mockSessionStorage(null);

    render(
      <MemoryRouter initialEntries={["/"]}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );

    // LoginSignup soll im Dokument sein
    expect(screen.getByText(/Sign Up|Login/i)).toBeInTheDocument();
    // Navbar nicht
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("zeigt Account und Navbar auf '/account' wenn eingeloggt", async () => {
    mockSessionStorage("fake-token");

    render(
      <MemoryRouter initialEntries={["/account"]}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );

    // Navbar vorhanden
    expect(screen.getByRole("navigation")).toBeInTheDocument();
    // Account-Komponente wird gemountet, prüfe ein Element darin
    expect(await screen.findByText(/Details zum Konto/i)).toBeInTheDocument();
  });

  it("leitet nicht-eingeloggte User von '/account' zurück auf '/'", () => {
    mockSessionStorage(null);

    render(
      <MemoryRouter initialEntries={["/account"]}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );

    // Nach Redirect sollte LoginSignup wieder sichtbar sein
    expect(screen.getByText(/Sign Up|Login/i)).toBeInTheDocument();
    // Navbar nicht
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });
});
