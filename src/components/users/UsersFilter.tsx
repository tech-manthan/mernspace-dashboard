import { Card, Col, Form, Input, Row, Select } from "antd";
import type { UserRole } from "../../types/user.type";
import type { ReactNode } from "react";
import { selectRolesOptions, selectStatusOptions } from "./data";
import { useResponsive } from "../../hooks/useResponsive";

type UserFilterProps = {
  children?: ReactNode;
};

export const UsersFilter = ({ children }: UserFilterProps) => {
  const { isLaptop, isBigScreen, isDesktop } = useResponsive();
  return (
    <Card>
      <Row justify={"space-between"} align={"top"}>
        <Col span={24} sm={16}>
          <Row gutter={20} align={"top"}>
            <Col span={24} lg={12}>
              <Form.Item
                name={"q"}
                style={{
                  marginBottom: isLaptop || isDesktop || isBigScreen ? 0 : 16,
                }}
              >
                <Input.Search placeholder="Search" allowClear />
              </Form.Item>
            </Col>
            <Col span={12} lg={6}>
              <Form.Item
                name={"role"}
                style={{
                  marginBottom: isLaptop || isDesktop || isBigScreen ? 0 : 16,
                }}
              >
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
              <Form.Item name={"isBanned"} style={{ marginBottom: 0 }}>
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
