import { Card, Col, Flex, Radio, Row, Statistic, Typography } from "antd";
import { useAuthStore } from "../../store/auth.store";
import Icon from "@ant-design/icons";
import { BarChart, BuisnessBag } from "../../components/icons";
import { useState } from "react";
import { SalesChart } from "../../components/common/SalesChart";
import { RecentOrder } from "../../components/common/RecentOrder";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

type SalesTimePeriodFilter = "W" | "M" | "Y";

export default function HomePage() {
  const { user } = useAuthStore();
  const [salesFilter, setSalesFilter] = useState<SalesTimePeriodFilter>("M");

  return (
    <>
      <Title level={4}>Welcome, {user?.firstName} 😀</Title>
      <Row gutter={[16, 16]}>
        <Col span={24} lg={12}>
          <Row gutter={[16, 16]}>
            <Col span={24} sm={12}>
              <Card
                style={{
                  borderRadius: 5,
                  height: "100%",
                }}
              >
                <Flex align="flex-start" gap={10}>
                  <Icon
                    component={BuisnessBag}
                    style={{
                      color: "#29ff0dff",
                      fontSize: 14,
                      backgroundColor: "#32fd1f63",
                      padding: 6,
                      borderRadius: 10,
                    }}
                  />
                  <Flex vertical>
                    <Text
                      style={{
                        fontWeight: "bold",
                      }}
                    >
                      Total Orders
                    </Text>
                    <Statistic
                      value={10000}
                      valueStyle={{
                        fontWeight: "bold",
                        fontSize: 24,
                      }}
                    />
                  </Flex>
                </Flex>
              </Card>
            </Col>
            <Col span={24} sm={12}>
              <Card
                style={{
                  borderRadius: 5,
                  height: "100%",
                }}
              >
                <Flex gap={10} align="flex-start">
                  <Icon
                    component={BarChart}
                    style={{
                      color: "#0dbaffff",
                      fontSize: 14,
                      backgroundColor: "#38f2ff63",
                      padding: 6,
                      borderRadius: 10,
                    }}
                  />
                  <Flex vertical>
                    <Text
                      style={{
                        fontWeight: "bold",
                      }}
                    >
                      Total Sales
                    </Text>
                    <Statistic
                      value={50000}
                      valueStyle={{
                        fontWeight: "bold",
                        fontSize: 24,
                      }}
                      prefix={"$"}
                    />
                  </Flex>
                </Flex>
              </Card>
            </Col>
          </Row>
          <Row
            gutter={[16, 16]}
            style={{
              marginTop: 16,
            }}
          >
            <Col span={24}>
              <Card
                style={{
                  borderRadius: 5,
                  height: "100%",
                }}
              >
                <Flex
                  justify="space-between"
                  align="center"
                  style={{
                    marginBottom: 20,
                  }}
                >
                  <Flex gap={10}>
                    <Icon
                      component={BarChart}
                      style={{
                        color: "#0dbaffff",
                        fontSize: 14,
                        backgroundColor: "#38f2ff63",
                        padding: 6,
                        borderRadius: 10,
                      }}
                    />
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 20,
                      }}
                    >
                      Sales
                    </Text>
                  </Flex>
                  <Flex gap={10} align="center">
                    <Radio.Group
                      className="sales-filter"
                      style={{
                        display: "flex",
                        gap: 10,
                      }}
                      buttonStyle="solid"
                      defaultValue={"M"}
                      value={salesFilter}
                      onChange={(e) => setSalesFilter(e.target.value)}
                    >
                      <Radio.Button
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        value={"W"}
                      >
                        W
                      </Radio.Button>
                      <Radio.Button
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        value={"M"}
                      >
                        M
                      </Radio.Button>
                      <Radio.Button
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        value={"Y"}
                      >
                        Y
                      </Radio.Button>
                    </Radio.Group>
                  </Flex>
                </Flex>
                <SalesChart />
              </Card>
            </Col>
          </Row>
        </Col>
        <Col span={24} lg={12}>
          <Card
            style={{
              borderRadius: 5,
              height: "100%",
            }}
          >
            <Flex gap={10}>
              <Icon
                component={BuisnessBag}
                style={{
                  color: "#ff660dff",
                  fontSize: 14,
                  backgroundColor: "#fd9d1f63",
                  padding: 6,
                  borderRadius: 10,
                }}
              />
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 20,
                }}
              >
                Recent Orders
              </Text>
            </Flex>

            <Flex
              vertical
              style={{
                marginBlock: 20,
              }}
              gap={10}
            >
              {Array.from({ length: 5 }).map((_, index) => {
                return (
                  <RecentOrder
                    key={index}
                    order={{
                      name: "Rakesh Kohli",
                      address: "Main Street",
                      amount: 1200,
                      status: "Prepairing",
                    }}
                  />
                );
              })}
            </Flex>

            <Link
              to={"/orders"}
              style={{
                textDecorationLine: "underline",
              }}
            >
              See all orders
            </Link>
          </Card>
        </Col>
      </Row>
    </>
  );
}
