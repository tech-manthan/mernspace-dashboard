import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import { lazy, Suspense } from "react";
import { Loader } from "../../components/common";

const NonAuthMain = lazy(() => import("./NonAuthMain"));

const NonAuth: React.FC = () => {
  const { hasUser } = useAuthStore();
  const location = useLocation();

  if (hasUser()) {
    const returnTo =
      new URLSearchParams(location.search).get("returnTo") || "/";
    return <Navigate to={returnTo} replace={true} />;
  }
  return (
    <Suspense fallback={<Loader size="large" />}>
      <NonAuthMain />
    </Suspense>
  );
};

export default NonAuth;
