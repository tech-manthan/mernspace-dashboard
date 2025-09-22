import { Card, Col, Form, InputNumber, Row, Space, Typography } from "antd";
import { useGetCategory } from "../../../hooks/api/useGetCategory";

type PricingProps = {
  selectedCategoryId: string;
};

const Pricing = ({ selectedCategoryId }: PricingProps) => {
  const { data: fetchedCategory } = useGetCategory(selectedCategoryId, true);

  if (!fetchedCategory) return null;

  return (
    <Card title={<Typography.Text>Product price</Typography.Text>}>
      {Object.entries(fetchedCategory?.priceConfiguration).map(
        ([configurationKey, configurationValue]) => {
          return (
            <div key={configurationKey}>
              <Space
                direction="vertical"
                size="large"
                style={{ width: "100%" }}
              >
                <Typography.Text>
                  {`${configurationKey} (${configurationValue.priceType})`}
                </Typography.Text>

                <Row gutter={20}>
                  {configurationValue.availableOptions.map((option: string) => {
                    return (
                      <Col span={8} key={option}>
                        <Form.Item
                          label={option}
                          rules={[
                            {
                              required: true,
                              message: `${option} price is required`,
                            },
                          ]}
                          name={[
                            "priceConfiguration",
                            JSON.stringify({
                              configurationKey: configurationKey,
                              priceType: configurationValue.priceType,
                            }),
                            option,
                          ]}
                        >
                          <InputNumber addonAfter="₹" />
                        </Form.Item>
                      </Col>
                    );
                  })}
                </Row>
              </Space>
            </div>
          );
        }
      )}
    </Card>
  );
};

export default Pricing;
