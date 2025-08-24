import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastProvider } from "../../context/toast/ToastProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginPage from "./LoginPage";

describe("Login Page", () => {
  it("should render with required fields", () => {
    const client = new QueryClient();
    render(
      <MemoryRouter>
        <QueryClientProvider client={client}>
          <ToastProvider>
            <LoginPage />
          </ToastProvider>
        </QueryClientProvider>
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
