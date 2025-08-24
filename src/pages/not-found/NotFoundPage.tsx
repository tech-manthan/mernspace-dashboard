import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { NotFound } from "../../components/icons";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Result
      // status={"404"}
      icon={<NotFound />}
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button
          type="default"
          onClick={() =>
            navigate("/", {
              replace: true,
            })
          }
        >
          Back Home
        </Button>
      }
    />
  );
};

export default NotFoundPage;
