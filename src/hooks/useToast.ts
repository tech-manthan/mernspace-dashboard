import { useContext } from "react";
import { ToastContext } from "../context/toast/ToastContext";

export const useToast = () => {
  const ctx = useContext(ToastContext);

  if (!ctx) {
    throw new Error("useToast must be used inside Toast Provider");
  }

  return ctx;
};
