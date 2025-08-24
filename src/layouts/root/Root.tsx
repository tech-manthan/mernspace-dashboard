import { lazy, Suspense, useEffect } from "react";
import { Loader } from "../../components/common";
import { useSelf } from "../../hooks/api/useSelf";
import { useAuthStore } from "../../store/auth.store";

const RootMain = lazy(() => import("./RootMain"));

function Root() {
  const { data, isLoading } = useSelf();
  const { setUser } = useAuthStore();

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data, setUser]);

  if (isLoading) {
    return <Loader size="large" />;
  }

  return (
    <Suspense fallback={<Loader size="large" />}>
      <RootMain />
    </Suspense>
  );
}

export default Root;
