import { lazy, Suspense } from "react";
import DashboardFallback from "./DashboardFallback";
import { useAuthStore } from "../../store/auth.store";
import { Navigate } from "react-router-dom";

const DashboardMain = lazy(() => import("./DahboardMain"));

const Dashboard = () => {
  const { hasUser } = useAuthStore();

  if (!hasUser()) {
    return <Navigate to={"/auth/login"} replace={true} />;
  }

  return (
    <Suspense fallback={<DashboardFallback />}>
      <DashboardMain />
    </Suspense>
  );
};

export default Dashboard;
