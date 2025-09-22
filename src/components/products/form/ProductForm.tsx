import { Card, Col, Form, Input, Row, Space, Switch, Typography } from "antd";

import Pricing from "./Pricing";
import { useAuthStore } from "../../../store/auth.store";
import Attributes from "./Attributes";
import { ImageUploader } from "../../common";
import { CategorySelectBox } from "../../common/CategorySelectBox";
import { RestaurantSelectBox } from "../../common/RestaurantSelectBox";

type ProductFormProps = {
  image?: string;
};

const ProductForm = ({ image }: ProductFormProps) => {
  const { user } = useAuthStore();
  const categoryId = Form.useWatch<string | undefined>("categoryId");
  const form = Form.useFormInstance();
  const tenantId = Form.useWatch<number | undefined>("tenantId", form);

  return (
    <Row>
      <Col span={24}>
        <Space direction="vertical" size="large">
          <Card title="Product info">
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  label="Product name"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Product name is required",
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
                  label="Description"
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: "Description is required",
                    },
                  ]}
                >
                  <Input.TextArea
                    rows={2}
                    maxLength={100}
                    style={{ resize: "none" }}
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Card title="Product image">
            <Row gutter={20}>
              <Col span={12}>
                <ImageUploader image={image} name="product" />
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

          {categoryId && <Pricing selectedCategoryId={categoryId} />}
          {categoryId && <Attributes selectedCategoryId={categoryId} />}

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

export default ProductForm;
