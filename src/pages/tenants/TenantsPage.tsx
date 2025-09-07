import { useEffect, useState } from "react";
import { useToast } from "../../hooks/useToast";
import { useAuthStore } from "../../store/auth.store";
import { useGetTenants } from "../../hooks/api/useGetTenants";
import type { ResponseError } from "../../types/error.type";
import { Link, Navigate } from "react-router-dom";
import { Breadcrumb, Button, Drawer, Form, Space, Table, theme } from "antd";
import { TenantForm, TenantsFilter } from "../../components/tenants";
import { PlusOutlined, RightOutlined } from "@ant-design/icons";
import { useCreateTenant } from "../../hooks/api/useCreateTenant";

const breadcrumb = [
  {
    title: <Link to={"/"}>Dashboard</Link>,
  },
  {
    title: "Restaurants",
  },
];

const tableColumns = [
  {
    title: "Id",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },

  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },

  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
  },
];

const TenantsPage = () => {
  const [form] = Form.useForm();
  const { user } = useAuthStore();
  const toast = useToast();
  const [openDrawer, setOpenDrawer] = useState(false);
  const { data, isLoading, isError, error } = useGetTenants(
    user?.role === "admin"
  );
  const {
    token: { colorBgLayout },
  } = theme.useToken();
  const { mutate } = useCreateTenant();

  const onHandleSubmit = async () => {
    await form.validateFields();
    mutate(form.getFieldsValue());
    form.resetFields();
    setOpenDrawer(false);
  };

  useEffect(() => {
    if (isError) {
      toast.error(
        (error as ResponseError).response.data.errors
          ? (error as ResponseError).response.data.errors[0].msg
          : error.message
      );
    }
  }, [error, isError, toast]);

  if (user?.role !== "admin") {
    return <Navigate to={"/"} replace={true} />;
  }

  return (
    <>
      <Space
        direction="vertical"
        style={{
          width: "100%",
        }}
        size={"large"}
      >
        <Breadcrumb items={breadcrumb} separator={<RightOutlined />} />
        <TenantsFilter
          onFilterChange={(filterName, filterValue) => {
            console.log(filterName, filterValue);
          }}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setOpenDrawer(true)}
          >
            Create Restaurant
          </Button>
        </TenantsFilter>

        <Table
          columns={tableColumns}
          dataSource={data?.data}
          loading={isLoading}
          rowKey={"id"}
        />
      </Space>
      <Drawer
        title="Create Restaurant"
        width={720}
        destroyOnHidden={true}
        onClose={() => {
          form.resetFields();
          setOpenDrawer(false);
        }}
        styles={{
          body: {
            backgroundColor: colorBgLayout,
          },
        }}
        open={openDrawer}
        extra={
          <Space>
            <Button
              onClick={() => {
                form.resetFields();
                setOpenDrawer(false);
              }}
            >
              Cancel
            </Button>
            <Button type="primary" onClick={onHandleSubmit}>
              Submit
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" form={form}>
          <TenantForm />
        </Form>
      </Drawer>
    </>
  );
};

export default TenantsPage;
