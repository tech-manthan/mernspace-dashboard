import { Badge, Flex, Typography } from "antd";

interface RecentOrderProps {
  order: {
    name: string;
    address: string;
    amount: number;
    status: string;
  };
}

const { Text } = Typography;

export const RecentOrder = ({
  order: { address, amount, name, status },
}: RecentOrderProps) => {
  return (
    <Flex justify="space-between" align="center">
      <Flex vertical>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 12,
          }}
        >
          {name}
        </Text>
        <Text
          style={{
            fontSize: 12,
          }}
        >
          {address}
        </Text>
      </Flex>
      <Flex gap={12}>
        <Text
          style={{
            fontWeight: "bold",
          }}
        >
          $ {amount}
        </Text>
        <Badge
          count={status}
          style={{
            fontSize: 10,
            color: "#ff2345",
            backgroundColor: "#ff234444",
          }}
        />
      </Flex>
    </Flex>
  );
};
