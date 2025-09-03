import { Button, Card, Col, Input, Row, Select } from "antd";
import type { UserRole } from "../../types/user.type";
import { PlusOutlined } from "@ant-design/icons";

const selectRolesOptions: Array<{ value: UserRole; label: string }> = [
  {
    value: "customer",
    label: "Customer",
  },
  {
    value: "manager",
    label: "Manager",
  },
  {
    value: "admin",
    label: "Admin",
  },
];

const selectStatusOptions: Array<{
  value: boolean;
  label: string;
}> = [
  {
    value: true,
    label: "Banned",
  },
  {
    value: false,
    label: "Active",
  },
];

type UserFilterProps = {
  onFilterChange: (
    filterName: string,
    filterValue: string | UserRole | boolean
  ) => void;
};

export const UsersFilter = ({ onFilterChange }: UserFilterProps) => {
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
        <Col>
          <Button type="primary" icon={<PlusOutlined />}>
            Create User
          </Button>
        </Col>
      </Row>
    </Card>
  );
};
