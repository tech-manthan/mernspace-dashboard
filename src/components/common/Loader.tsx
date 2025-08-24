import { Flex, Spin } from "antd";

type LoaderProps = {
  size?: "default" | "large" | "small";
};

export const Loader: React.FC<LoaderProps> = ({ size = "default" }) => {
  return (
    <Flex
      align="center"
      justify="center"
      style={{
        height: "100vh",
      }}
    >
      <Spin size={size} />
    </Flex>
  );
};
