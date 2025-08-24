import { message } from "antd";
import { ToastContext } from "./ToastContext";

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toast, contextHolder] = message.useMessage({
    duration: 2,
    rtl: true,
    maxCount: 3,
  });

  return (
    <ToastContext.Provider value={toast}>
      {contextHolder}
      {children}
    </ToastContext.Provider>
  );
};
