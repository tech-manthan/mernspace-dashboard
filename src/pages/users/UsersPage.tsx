import {
  LoadingOutlined,
  PlusOutlined,
  RightOutlined,
} from "@ant-design/icons";
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
import { Link, Navigate } from "react-router-dom";
import { useGetUsers } from "../../hooks/api/useGetUsers";
import type { User, UsersQueryParams } from "../../types/user.type";
import type { Tenant } from "../../types/tenant.type";
import { useToast } from "../../hooks/useToast";
import { useEffect, useMemo, useState } from "react";
import type { ResponseError } from "../../types/error.type";
import { useAuthStore } from "../../store/auth.store";
import { UserForm, UsersFilter } from "../../components/users";
import { useCreateUser } from "../../hooks/api/useCreateUser";
import { PER_PAGE } from "../../constants";
import type { FieldData } from "../../types/common.type";
import { debounce } from "lodash";
import dayjs from "dayjs";
import { useUpdateUser } from "../../hooks/api/useUpdateUser";

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
    title: "Tenant",
    dataIndex: "tenant",
    key: "tenant",
    render: (tenant: Tenant | null, record: User) => {
      return <div key={record.id}>{tenant ? tenant.name : ""}</div>;
    },
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

const UsersPage = () => {
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();

  const { user } = useAuthStore();
  const toast = useToast();
  const [openDrawer, setOpenDrawer] = useState(false);

  const [queryParams, setQueryParams] = useState<UsersQueryParams>({
    perPage: PER_PAGE,
    currentPage: 1,
    q: "",
    role: undefined,
    isBanned: undefined,
  });
  const { data, isFetching, isLoading, isError, error } = useGetUsers(
    user?.role === "admin",
    queryParams
  );
  const {
    token: { colorBgLayout },
  } = theme.useToken();
  const { mutate } = useCreateUser();
  const { mutate: mutateUpdate } = useUpdateUser();

  const [editingUser, setEditingUser] = useState<User | null>(null);

  const onHandleSubmit = async () => {
    await form.validateFields();
    mutate(form.getFieldsValue());
    form.resetFields();
    setOpenDrawer(false);
  };

  const onHandleUpdate = async (id: number) => {
    await form.validateFields();
    mutateUpdate({
      id: id,
      userData: form.getFieldsValue(),
    });
    form.resetFields();
    setOpenDrawer(false);
  };

  const debouncedQUpdate = useMemo(
    () =>
      debounce((value: string) => {
        setQueryParams((prev) => ({ ...prev, q: value, currentPage: 1 }));
      }, 500),
    []
  );

  const onFilterChange = async (changedFields: FieldData[]) => {
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
    if (editingUser) {
      setOpenDrawer(true);
      form.setFieldsValue({ ...editingUser, tenantId: editingUser.tenant?.id });
    }
  }, [editingUser, form]);

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
          {(isFetching || isLoading) && (
            <Spin indicator={<LoadingOutlined />} />
          )}
        </Flex>
        <Form form={filterForm} onFieldsChange={onFilterChange}>
          <UsersFilter>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setOpenDrawer(true)}
            >
              Create User
            </Button>
          </UsersFilter>
        </Form>

        <Table
          columns={[
            ...tableColumns,
            {
              title: "Actions",
              render: (_: string, record: User) => {
                return (
                  <Space>
                    <Button type="link" onClick={() => setEditingUser(record)}>
                      Edit
                    </Button>
                    <Button type="link">Delete</Button>
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
        title={editingUser ? "Editing User" : "Create User"}
        width={720}
        destroyOnHidden={true}
        onClose={() => {
          form.resetFields();
          setOpenDrawer(false);
          setEditingUser(null);
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
                setEditingUser(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={
                editingUser
                  ? onHandleUpdate.bind(this, editingUser.id)
                  : onHandleSubmit
              }
            >
              Submit
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" form={form}>
          <UserForm tenant={editingUser?.tenant} isEditing={!!editingUser} />
        </Form>
      </Drawer>
    </>
  );
};

export default UsersPage;
