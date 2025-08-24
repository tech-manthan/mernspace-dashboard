import { Outlet } from "react-router-dom";

const DashboardMain: React.FC = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default DashboardMain;
