import { Link, Outlet } from "react-router-dom";

const DashboardMain: React.FC = () => {
  return (
    <div>
      <Link to={"/auth/login"}>Go</Link>
      <Outlet />
    </div>
  );
};

export default DashboardMain;
