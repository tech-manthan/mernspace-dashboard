import { createBrowserRouter } from "react-router-dom";
import { HomePage, LoginPage, NotFoundPage, UsersPage } from "./pages";
import { Dashboard, NonAuth, Root } from "./layouts";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "",
        element: <Dashboard />,
        children: [
          {
            path: "",
            element: <HomePage />,
          },
          {
            path: "users",
            element: <UsersPage />,
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
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
