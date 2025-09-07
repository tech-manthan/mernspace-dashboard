import { createBrowserRouter } from "react-router-dom";
import {
  HomePage,
  LoginPage,
  NotFoundPage,
  UsersPage,
  TenantsPage,
} from "./pages";
import { Dashboard, NonAuth, Root } from "./layouts";
import ErrorElement from "./components/common/ErrorElement";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorElement />,
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
          {
            path: "restaurants",
            element: <TenantsPage />,
          },
        ],
      },
      {
        path: "auth",
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
