import {
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Space,
  Switch,
  Typography,
} from "antd";

import {
  CategorySelectBox,
  ImageUploader,
  RestaurantSelectBox,
} from "../../common";
import { useAuthStore } from "../../../store/auth.store";

type ToppingFormProps = {
  image?: string;
};

const ToppingForm = ({ image }: ToppingFormProps) => {
  const { user } = useAuthStore();
  const categoryId = Form.useWatch<string | undefined>("categoryId");
  const form = Form.useFormInstance();
  const tenantId = Form.useWatch<number | undefined>("tenantId", form);
  return (
    <Row>
      <Col span={24}>
        <Space direction="vertical" size="large">
          <Card title="Topping info">
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  label="Topping name"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Topping name is required",
                    },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <CategorySelectBox
                  selectBoxId="productCategoryId"
                  categoryId={categoryId}
                />
              </Col>
              <Col span={24}>
                <Form.Item
                  label="Price"
                  name="price"
                  rules={[
                    {
                      required: true,
                      message: "Price is required",
                    },
                  ]}
                >
                  <InputNumber addonAfter="₹" size="large" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Card title="Topping image">
            <Row gutter={20}>
              <Col span={12}>
                <ImageUploader image={image} name="topping" />
              </Col>
            </Row>
          </Card>
          {user?.role !== "manager" && (
            <Card title="Restaurant info">
              <Row gutter={24}>
                <Col span={24}>
                  <RestaurantSelectBox
                    selectBoxId="productRestaurant"
                    tenantId={tenantId}
                    isEditing={!!image}
                  />
                </Col>
              </Row>
            </Card>
          )}

          <Card title="Other properties">
            <Row gutter={24}>
              <Col span={24}>
                <Space>
                  <Form.Item name="isPublish" initialValue={false}>
                    <Switch checkedChildren="Yes" unCheckedChildren="No" />
                  </Form.Item>
                  <Typography.Text
                    style={{ marginBottom: 22, display: "block" }}
                  >
                    Published
                  </Typography.Text>
                </Space>
              </Col>
            </Row>
          </Card>
        </Space>
      </Col>
    </Row>
  );
};

export default ToppingForm;
