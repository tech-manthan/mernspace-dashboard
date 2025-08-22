import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import LoginPage from "./LoginPage";
import { MemoryRouter } from "react-router-dom";

describe("Login Page", () => {
  it("should render with required fields", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Sign in")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "Log in",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", {
        name: "Remember me",
      })
    );
    expect(screen.getByText("Forgot password")).toBeInTheDocument();

    // getBy -> throws an error
    // queryBy -> null
    // findBy -> Async
  });
});
