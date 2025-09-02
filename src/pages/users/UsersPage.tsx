import { RightOutlined } from "@ant-design/icons";
import { Breadcrumb, Table } from "antd";
import { Link, Navigate } from "react-router-dom";
import { useGetUsers } from "../../hooks/api/useGetUsers";
import type { User } from "../../types/user.type";
import type { Tenant } from "../../types/tenant.type";
import { useToast } from "../../hooks/useToast";
import { useEffect } from "react";
import type { ResponseError } from "../../types/error.type";
import { useAuthStore } from "../../store/auth.store";

const breadcrumb = [
  {
    title: <Link to={"/"}>Dashboard</Link>,
  },
  {
    title: "Users",
  },
];

const tableColumns = [
  {
    title: "Id",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Username",
    dataIndex: "firstName",
    key: "firstName",
    render: (_text: string, record: User) => {
      return (
        <div key={record.id}>
          {record.firstName} {record.lastName}
        </div>
      );
    },
  },

  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Status",
    dataIndex: "isBanned",
    key: "isBanned",
    render: (isBanned: boolean, record: User) => {
      return <div key={record.id}>{isBanned ? "banned" : "active"}</div>;
    },
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
  },
  {
    title: "Tenant",
    dataIndex: "tenant",
    key: "tenant",
    render: (tenant: Tenant | null, record: User) => {
      return <div key={record.id}>{tenant ? tenant.name : "None"}</div>;
    },
  },
];

const UsersPage = () => {
  const { user } = useAuthStore();
  const { data, isLoading, isError, error } = useGetUsers(
    user?.role === "admin"
  );
  const toast = useToast();

  useEffect(() => {
    if (isError) {
      toast.error((error as ResponseError).response.data.errors[0].msg);
    }
  }, [error, isError, toast]);

  if (user?.role !== "admin") {
    return <Navigate to={"/"} replace={true} />;
  }

  return (
    <>
      <Breadcrumb items={breadcrumb} separator={<RightOutlined />} />
      <Table
        style={{
          marginTop: 20,
        }}
        columns={tableColumns}
        dataSource={data?.data}
        loading={isLoading}
        rowKey={"id"}
      />
    </>
  );
};

export default UsersPage;
