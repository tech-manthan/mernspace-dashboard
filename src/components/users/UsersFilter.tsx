import { Card, Col, Input, Row, Select } from "antd";
import type { UserRole } from "../../types/user.type";
import type { ReactNode } from "react";
import { selectRolesOptions, selectStatusOptions } from "./data";

type UserFilterProps = {
  onFilterChange: (
    filterName: string,
    filterValue: string | UserRole | boolean
  ) => void;
  children?: ReactNode;
};

export const UsersFilter = ({ onFilterChange, children }: UserFilterProps) => {
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
            <Col span={6}>
              <Select<UserRole>
                options={selectRolesOptions}
                placeholder={"Role"}
                allowClear
                style={{
                  width: "100%",
                }}
                onChange={(role) => onFilterChange("roleFilter", role)}
              />
            </Col>
            <Col span={6}>
              <Select
                options={selectStatusOptions}
                placeholder={"Status"}
                allowClear
                style={{
                  width: "100%",
                }}
                onChange={(value: boolean) =>
                  onFilterChange("statusFilter", value)
                }
              />
            </Col>
          </Row>
        </Col>
        <Col>{children}</Col>
      </Row>
    </Card>
  );
};
