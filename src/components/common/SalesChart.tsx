import { Line } from "@ant-design/plots";

export const SalesChart = () => {
  const data = [
    { day: "1 Jan", value: 10000 },
    { day: "2 Jan", value: 8000 },
    { day: "3 Jan", value: 20000 },
    { day: "4 Jan", value: 22000 },
    { day: "5 Jan", value: 18000 },
    { day: "6 Jan", value: 30000 },
  ];
  const config = {
    data,
    xField: "day",
    yField: "value",
    shapeField: "smooth",
    interaction: {
      tooltip: {
        marker: false,
      },
    },
    style: {
      lineWidth: 2,
    },
    height: 150,
  };
  return <Line {...config} />;
};
