import {
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Switch,
  Typography,
} from "antd";
import type { UserRole } from "../../../types/user.type";
import { selectRolesOptions } from "../data";
import { useMemo, useState } from "react";
import { useGetInfiniteTenants } from "../../../hooks/api/useGetInfiniteTenants";
import { debounce } from "lodash";
import type { Tenant } from "../../../types/tenant.type";

interface UserFormProps {
  tenant?: Tenant | null;
  isEditing?: boolean;
}

export const UserForm = ({ tenant, isEditing = false }: UserFormProps) => {
  const form = Form.useFormInstance();
  const role = Form.useWatch<UserRole | undefined>("role", form);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const changedTenantId = Form.useWatch<number | undefined>("tenantId", form);

  const [search, setSearch] = useState("");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetInfiniteTenants(role === "manager", search);

  const onSearch = useMemo(
    () => debounce((val: string) => setSearch(val), 500),
    []
  );

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
              {isEditing && (
                <Col span={12}>
                  <Space direction="vertical">
                    <Typography.Text>Update Password</Typography.Text>
                    <Switch onChange={(val) => setIsResettingPassword(val)} />
                  </Space>
                </Col>
              )}
              {(!isEditing || isResettingPassword) && (
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
              )}
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
                    id="userFormRole"
                    options={selectRolesOptions}
                    placeholder={"Role"}
                    allowClear
                    style={{
                      width: "100%",
                    }}
                    size="large"
                    onChange={(value) => {
                      if (value !== "manager") {
                        form.setFieldsValue({ tenantId: undefined });
                      }
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
                      id="userFormRestaurant"
                      loading={isLoading || isFetchingNextPage}
                      filterOption={false}
                      options={data?.pages.flatMap((page) =>
                        page.data.map((t) => ({ value: t.id, label: t.name }))
                      )}
                      labelRender={({ label }) =>
                        tenant && tenant.id === changedTenantId
                          ? `${tenant.name}`
                          : label
                      }
                      onSearch={onSearch}
                      onPopupScroll={(e) => {
                        const target = e.target as HTMLElement;
                        if (
                          target.scrollTop + target.clientHeight >=
                            target.scrollHeight - 2 &&
                          hasNextPage
                        ) {
                          fetchNextPage();
                        }
                      }}
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
                  <Switch id="userFormIsBanned" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Space>
      </Col>
    </Row>
  );
};
