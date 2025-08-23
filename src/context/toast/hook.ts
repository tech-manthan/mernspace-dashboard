import { message } from "antd";
import { createContext, useContext } from "react";

export const ToastContext = createContext<
  ReturnType<typeof message.useMessage>[0] | null
>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);

  if (!ctx) {
    throw new Error("useToast must be used inside Toast Provider");
  }

  return ctx;
};
