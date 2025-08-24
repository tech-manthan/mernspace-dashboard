import { createBrowserRouter } from "react-router-dom";
import { HomePage, LoginPage } from "./pages";
import { Dashboard, NonAuth } from "./layouts";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
    ],
  },
  {
    path: "/auth",
    element: <NonAuth />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
    ],
  },
]);
