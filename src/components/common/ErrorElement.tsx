import { Button, Result } from "antd";
import { Error } from "../icons";
import { useNavigate } from "react-router-dom";

const ErrorElement = () => {
  const navigate = useNavigate();
  return (
    <Result
      // status={"404"}
      icon={<Error />}
      title="500"
      subTitle="Sorry, there is some error in server, visit after some time"
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

export default ErrorElement;
