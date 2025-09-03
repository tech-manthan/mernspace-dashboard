import { Card, Col, Input, Row } from "antd";
import type { ReactNode } from "react";

type TenantsFilterProps = {
  onFilterChange: (filterName: string, filterValue: string) => void;
  children?: ReactNode;
};

export const TenantsFilter = ({
  onFilterChange,
  children,
}: TenantsFilterProps) => {
  return (
    <Card>
      <Row justify={"space-between"}>
        <Col span={16}>
          <Row gutter={20}>
            <Col span={12}>
              <Input.Search
                placeholder="Search"
                allowClear
                onChange={(e) => {
                  onFilterChange("searchFilter", e.target.value);
                }}
              />
            </Col>
          </Row>
        </Col>
        <Col>{children}</Col>
      </Row>
    </Card>
  );
};
