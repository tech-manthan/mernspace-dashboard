import { Outlet } from "react-router-dom";

const NonAuth: React.FC = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default NonAuth;
