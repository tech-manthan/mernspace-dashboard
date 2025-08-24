import type { message } from "antd";
import { createContext } from "react";

export const ToastContext = createContext<
  ReturnType<typeof message.useMessage>[0] | null
>(null);
