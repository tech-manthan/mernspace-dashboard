import { Card, Col, Form, Input, Row, Select, Space, Switch } from "antd";
import type { UserRole } from "../../../types/user.type";
import { selectRolesOptions } from "../data";
import { useState } from "react";
import { useGetTenants } from "../../../hooks/api/useGetTenants";

export const UserForm = () => {
  const [role, setRole] = useState<UserRole | undefined>();
  const { data } = useGetTenants(role === "manager");
  return (
    <Row>
      <Col span={24}>
        <Space direction="vertical" size={"large"}>
          <Card title="Basic Info">
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  label="First Name"
                  name={"firstName"}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "First name is required",
                    },
                    {
                      min: 3,
                      message: "First name atleast have three characters",
                    },
                  ]}
                >
                  <Input size={"large"} placeholder="Manthan" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Last Name"
                  name={"lastName"}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "Last name is required",
                    },
                    {
                      min: 1,
                      message: "Last name atleast have one character",
                    },
                  ]}
                >
                  <Input size={"large"} placeholder="Sharma" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Email"
                  name={"email"}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "Email is required",
                    },
                    {
                      type: "email",
                      message: "Email is invalid",
                    },
                  ]}
                >
                  <Input size={"large"} placeholder="manthan@mern.com" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title="Security Info">
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  label="Password"
                  name={"password"}
                  rules={[
                    {
                      required: true,
                      message: "Password is required",
                    },
                    {
                      pattern:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
                      message:
                        "Password must be 8-20 characters and include uppercase, lowercase, number, and special character",
                    },
                  ]}
                >
                  <Input.Password size={"large"} placeholder="*******" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title="Role">
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  label="Role"
                  name={"role"}
                  rules={[
                    {
                      required: true,
                      message: "Role is required",
                    },
                  ]}
                >
                  <Select<UserRole>
                    options={selectRolesOptions}
                    placeholder={"Role"}
                    allowClear
                    style={{
                      width: "100%",
                    }}
                    size="large"
                    onChange={(role) => {
                      setRole(role);
                    }}
                  />
                </Form.Item>
              </Col>
              {role === "manager" && (
                <Col span={12}>
                  <Form.Item
                    label="Restaurant"
                    name={"tenantId"}
                    rules={[
                      {
                        required: true,
                        message: "Restaurant is required",
                      },
                    ]}
                  >
                    <Select
                      options={data?.data.map((tenant) => ({
                        value: tenant.id,
                        label: tenant.name,
                      }))}
                      placeholder={"Restaurant"}
                      allowClear
                      showSearch
                      style={{
                        width: "100%",
                      }}
                      size="large"
                    />
                  </Form.Item>
                </Col>
              )}
            </Row>
          </Card>

          <Card title="Other Properties">
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  label="Banned"
                  name={"isBanned"}
                  initialValue={false}
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Space>
      </Col>
    </Row>
  );
};
