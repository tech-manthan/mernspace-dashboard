import { createBrowserRouter } from "react-router-dom";
import { HomePage, LoginPage } from "./pages";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/auth/login",
    element: <LoginPage />,
  },
]);
