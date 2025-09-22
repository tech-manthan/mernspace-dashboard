import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, Input, Row, Select, Space } from "antd";
import type { CategoryAttribute } from "../../../types/category.type";

export const CategoryForm = () => {
  const form = Form.useFormInstance();

  return (
    <Row style={{ width: "100%" }}>
      <Col span={24}>
        <Space direction="vertical" size={"large"} style={{ width: "100%" }}>
          <Card title="Basic Info">
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  label="Category Name"
                  name={"name"}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "Category name is required",
                    },
                    {
                      min: 3,
                      message: "Category name atleast have three characters",
                    },
                  ]}
                >
                  <Input size={"large"} placeholder="Category Name" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card
            title="Price Configuration"
            extra={
              <Button
                type="dashed"
                onClick={() => {
                  const current =
                    form.getFieldValue("priceConfiguration") || [];
                  form.setFieldsValue({
                    priceConfiguration: [...current, {}],
                  });
                }}
                icon={<PlusOutlined />}
              >
                Add Option
              </Button>
            }
            style={{ marginBottom: 16 }}
          >
            <Form.List
              name="priceConfiguration"
              rules={[
                {
                  validator: (_, value: unknown[]) => {
                    if (!value || value.length < 1) {
                      return Promise.reject();
                    }
                    return Promise.resolve();
                  },
                  message: "Add atleast one price configuration",
                },
              ]}
            >
              {(fields, { add, remove }, { errors }) => (
                <>
                  <Space direction="vertical" style={{ width: "100%" }}>
                    {fields.map((field) => (
                      <Card
                        size="small"
                        key={field.key}
                        extra={
                          <Button
                            danger
                            type="text"
                            icon={<DeleteOutlined />}
                            onClick={() => remove(field.name)}
                          />
                        }
                      >
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              name={[field.name, "key"]}
                              label="Key"
                              rules={[
                                { required: true, message: "Key is required" },
                              ]}
                            >
                              <Input placeholder="Size / Crust" size="large" />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              name={[field.name, "priceType"]}
                              label="Price Type"
                              rules={[{ required: true }]}
                            >
                              <Select placeholder="Select type" size="large">
                                <Select.Option value="base">Base</Select.Option>
                                <Select.Option value="additional">
                                  Additional
                                </Select.Option>
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item
                              name={[field.name, "availableOptions"]}
                              label="Available Options"
                              rules={[{ required: true }]}
                            >
                              <Select
                                mode="tags"
                                placeholder="Enter options"
                                style={{ width: "100%" }}
                                size="large"
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Card>
                    ))}
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add Price Config
                    </Button>
                  </Space>
                  <Form.Item shouldUpdate>
                    <Form.ErrorList errors={errors} />
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Card>

          {/* Attributes */}
          <Card
            title="Attributes"
            extra={
              <Button
                type="dashed"
                onClick={() => {
                  const current = form.getFieldValue("attributes") || [];
                  form.setFieldsValue({ attributes: [...current, {}] });
                }}
                icon={<PlusOutlined />}
              >
                Add Attribute
              </Button>
            }
          >
            <Form.List
              name="attributes"
              rules={[
                {
                  validator: (_, value: CategoryAttribute[]) => {
                    if (!value || value.length < 1) {
                      return Promise.reject(
                        "Atleast add one attribute in category"
                      );
                    }

                    return Promise.resolve();
                  },
                },
              ]}
            >
              {(fields, { add, remove }, { errors }) => (
                <>
                  <Space direction="vertical" style={{ width: "100%" }}>
                    {fields.map((field) => (
                      <Card
                        size="small"
                        key={field.key}
                        extra={
                          <Button
                            danger
                            type="text"
                            icon={<DeleteOutlined />}
                            onClick={() => remove(field.name)}
                          />
                        }
                      >
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              name={[field.name, "name"]}
                              label="Attribute Name"
                              rules={[{ required: true }]}
                            >
                              <Input
                                placeholder="isHit / Spiciness"
                                size="large"
                              />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              name={[field.name, "widgetType"]}
                              label="Widget Type"
                              rules={[{ required: true }]}
                            >
                              <Select
                                size="large"
                                allowClear
                                placeholder="Widget Type"
                              >
                                <Select.Option value="switch">
                                  Switch
                                </Select.Option>
                                <Select.Option value="radio">
                                  Radio
                                </Select.Option>
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              name={[field.name, "availableOptions"]}
                              label="Available Options"
                              rules={[
                                {
                                  required: true,
                                  message: "Available Options is required",
                                },
                                {
                                  validator: (_, value: string[]) => {
                                    if (!value || value.length < 2) {
                                      return Promise.reject(
                                        new Error(
                                          "Minimum two options are required"
                                        )
                                      );
                                    }
                                    return Promise.resolve();
                                  },
                                },
                              ]}
                            >
                              <Select
                                size="large"
                                mode="tags"
                                placeholder="Enter options"
                                style={{ width: "100%" }}
                                allowClear
                              />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              noStyle
                              shouldUpdate={(prev, curr) =>
                                prev.attributes?.[field.name]
                                  ?.availableOptions !==
                                curr.attributes?.[field.name]?.availableOptions
                              }
                            >
                              {({ getFieldValue }) => {
                                const options =
                                  getFieldValue([
                                    "attributes",
                                    field.name,
                                    "availableOptions",
                                  ]) || [];

                                return (
                                  <Form.Item
                                    name={[field.name, "defaultValue"]}
                                    label="Default Value"
                                    rules={[
                                      {
                                        required: true,
                                        message: "Default Value is required",
                                      },
                                    ]}
                                  >
                                    <Select
                                      size="large"
                                      placeholder="Select default value"
                                      style={{ width: "100%" }}
                                      options={options.map((opt: string) => ({
                                        value: opt,
                                        label: opt,
                                      }))}
                                    />
                                  </Form.Item>
                                );
                              }}
                            </Form.Item>
                          </Col>
                        </Row>
                      </Card>
                    ))}
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add Attribute
                    </Button>
                  </Space>
                  <Form.Item shouldUpdate>
                    <Form.ErrorList errors={errors} />
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Card>
        </Space>
      </Col>
    </Row>
  );
};
