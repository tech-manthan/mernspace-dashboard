import { Outlet } from "react-router-dom";

function NonAuthMain() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default NonAuthMain;
