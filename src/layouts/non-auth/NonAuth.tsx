import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import { lazy, Suspense } from "react";
import { Loader } from "../../components/common";

const NonAuthMain = lazy(() => import("./NonAuthMain"));

const NonAuth: React.FC = () => {
  const { hasUser } = useAuthStore();

  if (hasUser()) {
    return <Navigate to={"/"} replace={true} />;
  }
  return (
    <Suspense fallback={<Loader size="large" />}>
      <NonAuthMain />
    </Suspense>
  );
};

export default NonAuth;
