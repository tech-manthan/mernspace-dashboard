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
  Modal,
  Space,
  Spin,
  Table,
  theme,
  Typography,
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
import { useDeleteTenant } from "../../hooks/api/useDeleteTenant";

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
  const [openModal, setOpenModal] = useState(false);

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
  const [deletingTenant, setDeletingTenant] = useState<Tenant | null>(null);

  const { mutate } = useCreateTenant();
  const { mutate: mutateUpdate } = useUpdateTenant();
  const { mutate: mutateDelete, isPending } = useDeleteTenant();

  const onHandleSubmit = async () => {
    await form.validateFields();
    const isEditing = !!editingTenant;
    if (isEditing) {
      const values = form.getFieldsValue({}) as Record<string, unknown>;
      const changedValues: Record<string, unknown> = {};
      for (const key in values) {
        if (form.isFieldTouched(key)) {
          changedValues[key] = values[key];
        }
      }
      mutateUpdate({
        id: editingTenant.id,
        tenantData: changedValues,
      });
    } else {
      mutate(form.getFieldsValue());
    }
    form.resetFields();
    setOpenDrawer(false);
    setEditingTenant(null);
  };

  const onHandleDelete = async () => {
    const isDeleting = !!deletingTenant;

    if (isDeleting) {
      mutateDelete(deletingTenant.id, {
        onSettled: () => {
          setOpenModal(false);
          setDeletingTenant(null);
        },
      });
    }
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
    if (deletingTenant) {
      setOpenModal(true);
    }
  }, [deletingTenant]);

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
                    <Button
                      type="link"
                      icon={<DeleteOutlined />}
                      onClick={() => setDeletingTenant(record)}
                    />
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
      <Modal
        title={"Deleting Restaurant"}
        open={openModal}
        onOk={onHandleDelete}
        confirmLoading={isPending}
        onCancel={() => {
          setDeletingTenant(null);
          setOpenModal(false);
        }}
        okText={"Delete"}
      >
        <Typography.Paragraph>
          Do you want to delete the Restaurant
        </Typography.Paragraph>
      </Modal>
    </>
  );
};

export default TenantsPage;
