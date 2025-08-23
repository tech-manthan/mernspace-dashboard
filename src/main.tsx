import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "antd/dist/reset.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { ConfigProvider } from "antd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "./context/toast/ToastProvider";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#f65f42",
              colorInfo: "#f65f42",
            },
          }}
        >
          <RouterProvider router={router} />
        </ConfigProvider>
      </ToastProvider>
    </QueryClientProvider>
  </StrictMode>
);
