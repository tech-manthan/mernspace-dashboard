import { Card, Col, Form, Input, Row, Select } from "antd";
import type { UserRole } from "../../types/user.type";
import type { ReactNode } from "react";
import { selectRolesOptions, selectStatusOptions } from "./data";

type UserFilterProps = {
  children?: ReactNode;
};

export const UsersFilter = ({ children }: UserFilterProps) => {
  return (
    <Card>
      <Row justify={"space-between"} align={"top"}>
        <Col span={24} sm={16}>
          <Row gutter={20} align={"top"}>
            <Col span={24} lg={12}>
              <Form.Item name={"q"}>
                <Input.Search placeholder="Search" allowClear />
              </Form.Item>
            </Col>
            <Col span={12} lg={6}>
              <Form.Item name={"role"}>
                <Select<UserRole>
                  options={selectRolesOptions}
                  placeholder={"Role"}
                  allowClear
                  style={{
                    width: "100%",
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12} lg={6}>
              <Form.Item name={"isBanned"}>
                <Select
                  options={selectStatusOptions}
                  placeholder={"Status"}
                  allowClear
                  style={{
                    width: "100%",
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Col>
        <Col>{children}</Col>
      </Row>
    </Card>
  );
};
