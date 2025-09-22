import { Card, Col, Form, Input, Row } from "antd";
import type { ReactNode } from "react";

type CategoriesFilterProps = {
  children?: ReactNode;
};

export const CategoriesFilter = ({ children }: CategoriesFilterProps) => {
  return (
    <Card>
      <Row justify={"space-between"}>
        <Col span={24} sm={12} lg={8}>
          <Form.Item name={"q"} style={{ marginBottom: 0 }}>
            <Input.Search placeholder="Search" allowClear />
          </Form.Item>
        </Col>
        <Col>{children}</Col>
      </Row>
    </Card>
  );
};
