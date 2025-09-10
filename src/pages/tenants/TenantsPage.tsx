import { useEffect, useMemo, useState } from "react";
import { useToast } from "../../hooks/useToast";
import { useAuthStore } from "../../store/auth.store";
import { useGetTenants } from "../../hooks/api/useGetTenants";
import type { ResponseError } from "../../types/error.type";
import { Link, Navigate } from "react-router-dom";
import {
  Breadcrumb,
  Button,
  Drawer,
  Flex,
  Form,
  Space,
  Spin,
  Table,
  theme,
} from "antd";
import { TenantForm, TenantsFilter } from "../../components/tenants";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useCreateTenant } from "../../hooks/api/useCreateTenant";
import { PER_PAGE } from "../../constants";
import type { Tenant, TenantsQueryParams } from "../../types/tenant.type";
import type { FieldData } from "../../types/common.type";
import { debounce } from "lodash";
import dayjs from "dayjs";
import { useUpdateTenant } from "../../hooks/api/useUpdateTenant";

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
    render: (date: Date) => {
      return dayjs(date).format("DD/MM/YYYY");
    },
  },
];

const TenantsPage = () => {
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();
  const { user } = useAuthStore();
  const toast = useToast();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [queryParams, setQueryParams] = useState<TenantsQueryParams>({
    perPage: PER_PAGE,
    currentPage: 1,
    q: "",
  });
  const { data, isLoading, isError, isFetching, error } = useGetTenants(
    user?.role === "admin",
    queryParams
  );
  const {
    token: { colorBgLayout },
  } = theme.useToken();
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);

  const { mutate } = useCreateTenant();
  const { mutate: mutateUpdate } = useUpdateTenant();

  const onHandleSubmit = async () => {
    await form.validateFields();
    const isEditing = !!editingTenant;
    if (isEditing) {
      mutateUpdate({
        id: editingTenant.id,
        tenantData: form.getFieldsValue(),
      });
    } else {
      mutate(form.getFieldsValue());
    }
    form.resetFields();
    setOpenDrawer(false);
    setEditingTenant(null);
  };

  const debouncedQUpdate = useMemo(
    () =>
      debounce((value: string) => {
        setQueryParams((prev) => ({ ...prev, q: value, currentPage: 1 }));
      }, 500),
    []
  );

  const onFilterChange = (changedFields: FieldData[]) => {
    const changedFilterFields = changedFields
      .map((item) => {
        return {
          [item.name[0]]: item.value,
        };
      })
      .reduce((acc, item) => ({ ...acc, ...item }), {});
    if ("q" in changedFilterFields) {
      debouncedQUpdate(changedFilterFields["q"] as string);
    } else {
      setQueryParams((prev) => ({
        ...prev,
        ...changedFilterFields,
        currentPage: 1,
      }));
    }
  };

  useEffect(() => {
    if (editingTenant) {
      setOpenDrawer(true);
      form.setFieldsValue(editingTenant);
    }
  }, [editingTenant, form]);

  useEffect(() => {
    return () => {
      debouncedQUpdate.cancel();
    };
  }, [debouncedQUpdate]);

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
        <Flex justify="space-between">
          <Breadcrumb items={breadcrumb} separator={<RightOutlined />} />
          {(isFetching || isLoading) && <Spin />}
        </Flex>
        <Form form={filterForm} onFieldsChange={onFilterChange}>
          <TenantsFilter>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setOpenDrawer(true)}
            >
              Create Restaurant
            </Button>
          </TenantsFilter>
        </Form>

        <Table
          columns={[
            ...tableColumns,
            {
              title: "Actions",
              align: "center",
              render: (_: string, record: Tenant) => {
                return (
                  <Space>
                    <Button
                      type="link"
                      onClick={() => setEditingTenant(record)}
                      icon={<EditOutlined />}
                    />
                    <Button type="link" icon={<DeleteOutlined />} />
                  </Space>
                );
              },
            },
          ]}
          dataSource={data?.data}
          loading={isLoading}
          rowKey={"id"}
          pagination={{
            total: data?.total,
            pageSize: queryParams.perPage,
            current: queryParams.currentPage,
            onChange: (page) => {
              console.log(page);
              setQueryParams((prev) => {
                return {
                  ...prev,
                  currentPage: page,
                };
              });
            },
            showTotal: (total, range) => {
              return `Showing ${range[0]}-${range[1]} of ${total} items`;
            },
          }}
        />
      </Space>
      <Drawer
        title={editingTenant ? "Update Restaurant" : "Create Restaurant"}
        width={720}
        destroyOnHidden={true}
        onClose={() => {
          form.resetFields();
          setOpenDrawer(false);
          setEditingTenant(null);
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
                setEditingTenant(null);
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
