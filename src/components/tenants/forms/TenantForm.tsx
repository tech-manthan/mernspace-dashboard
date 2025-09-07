import { Card, Col, Form, Input, Row } from "antd";

export const TenantForm = () => {
  return (
    <Row>
      <Col span={24}>
        <Card title="Restaurant Info">
          <Row>
            <Col span={24}>
              <Form.Item
                label="Restaurant Name"
                name={"name"}
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Restaurant name is required",
                  },
                  {
                    min: 3,
                    message: "Restaurant name atleast have three characters",
                  },
                ]}
              >
                <Input size={"large"} placeholder="Restaurant Name" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Restaurant Address"
                name={"address"}
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Restaurant Address is required",
                  },
                  {
                    min: 10,
                    message: "Restaurant Address atleast have 10 character",
                  },
                ]}
              >
                <Input.TextArea
                  size="large"
                  placeholder="Restaurant Address"
                  rows={4}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};
