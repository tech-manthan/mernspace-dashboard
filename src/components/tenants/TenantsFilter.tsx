import { Card, Col, Form, Input, Row } from "antd";
import type { ReactNode } from "react";

type TenantsFilterProps = {
  children?: ReactNode;
};

export const TenantsFilter = ({ children }: TenantsFilterProps) => {
  return (
    <Card>
      <Row justify={"space-between"}>
        <Col span={16}>
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item name={"q"}>
                <Input.Search placeholder="Search" allowClear />
              </Form.Item>
            </Col>
          </Row>
        </Col>
        <Col>{children}</Col>
      </Row>
    </Card>
  );
};
