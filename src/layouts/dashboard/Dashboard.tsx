import { lazy, Suspense } from "react";
import DashboardFallback from "./DashboardFallback";

const DashboardMain = lazy(() => import("./DahboardMain"));

const Dashboard = () => {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <DashboardMain />
    </Suspense>
  );
};

export default Dashboard;
