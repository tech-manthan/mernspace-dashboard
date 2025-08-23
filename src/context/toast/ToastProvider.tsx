import { message } from "antd";
import { ToastContext } from "./hook";

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toast, contextHolder] = message.useMessage();

  return (
    <ToastContext.Provider value={toast}>
      {contextHolder}
      {children}
    </ToastContext.Provider>
  );
};
