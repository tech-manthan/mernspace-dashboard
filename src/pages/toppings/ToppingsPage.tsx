import {
  DeleteOutlined,
  EditOutlined,
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
  Image,
  Modal,
  //   Radio,
  Space,
  Spin,
  //   Switch,
  Table,
  Tag,
  //   Tag,
  Typography,
  theme,
} from "antd";
import { Link } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import { useEffect, useMemo, useState } from "react";
import type { ResponseError } from "../../types/error.type";
import type { FieldData } from "../../types/common.type";
import { debounce } from "lodash";
import dayjs from "dayjs";

import { useAuthStore } from "../../store/auth.store";
import type { Topping, ToppingsQueryParams } from "../../types/topping.type";
import { useGetToppings } from "../../hooks/api/useGetToppings";
import { useCreateTopping } from "../../hooks/api/useCreateTopping";
import { useUpdateTopping } from "../../hooks/api/useUpdateTopping";
import { useDeleteTopping } from "../../hooks/api/useDeleteTopping";
import { ToppingForm, ToppingsFilter } from "../../components/toppings";

const { Paragraph } = Typography;

const breadcrumb = [
  {
    title: <Link to={"/"}>Dashboard</Link>,
  },
  {
    title: "Toppings",
  },
];

const tableColumns = [
  {
    title: "Topping Name",
    dataIndex: "name",
    key: "name",
    render: (_text: string, record: Topping) => {
      return (
        <Space>
          <Image width={60} src={record.image} preview={false} />
          <Typography.Text>{record.name}</Typography.Text>
        </Space>
      );
    },
  },
  {
    title: "Status",
    dataIndex: "isPublish",
    key: "isPublish",
    render: (value: boolean) => {
      return value ? (
        <Tag color="green">Published</Tag>
      ) : (
        <Tag color="red">Draft</Tag>
      );
    },
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
  },
];

const ToppingsPage = () => {
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();

  const toast = useToast();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const { user } = useAuthStore();

  const [queryParams, setQueryParams] = useState<ToppingsQueryParams>({
    perPage: 5,
    currentPage: 1,
    q: "",
    categoryId: "",
    isPublish: undefined,
    tenantId: user?.role === "manager" ? String(user.tenant?.id) : "",
  });

  const { data, isFetching, isLoading, isError, error } = useGetToppings(
    true,
    queryParams
  );

  const {
    token: { colorBgLayout },
  } = theme.useToken();

  const { mutate: mutateCreate, isPending: isCreatePending } =
    useCreateTopping();
  const { mutate: mutateUpdate, isPending: isUpdatePending } =
    useUpdateTopping();
  const { mutate: mutateDelete, isPending: isDeletePending } =
    useDeleteTopping();

  const [editingTopping, setEditingTopping] = useState<Topping | null>(null);
  const [deletingTopping, setDeletingTopping] = useState<Topping | null>(null);

  const onHandleSubmit = async () => {
    await form.validateFields();

    const isEditing = !!editingTopping;

    if (isEditing) {
      const values = form.getFieldsValue({}) as Record<string, unknown>;
      const changedValues: Record<string, unknown> = {};

      if (values["name"] !== editingTopping.name) {
        changedValues["name"] = values["name"];
      }

      if (values["price"] !== editingTopping.price) {
        changedValues["price"] = values["price"];
      }

      if (values["categoryId"] !== editingTopping.categoryId) {
        changedValues["categoryId"] = values["categoryId"];
      }

      if (values["isPublish"] !== editingTopping.isPublish) {
        changedValues["isPublish"] = values["isPublish"];
      }

      {
        if (user?.role === "admin") {
          if (values["tenantId"] !== editingTopping.tenantId) {
            changedValues["tenantId"] = values["tenantId"];
          }
        }
      }
      if (values["image"] instanceof File) {
        changedValues["image"] = values["image"];
      }

      mutateUpdate(
        {
          id: editingTopping._id,
          toppingData: changedValues,
        },
        {
          onSettled: () => {
            form.resetFields();
            setOpenDrawer(false);
            setEditingTopping(null);
          },
        }
      );
    } else {
      mutateCreate(
        {
          ...form.getFieldsValue(),
          tenantId:
            user?.role === "manager"
              ? user.tenant?.id
              : form.getFieldValue("tenantId"),
        },
        {
          onSettled: () => {
            form.resetFields();
            setOpenDrawer(false);
          },
        }
      );
    }
  };

  const onHandleDelete = async () => {
    if (deletingTopping) {
      mutateDelete(deletingTopping._id, {
        onSettled: () => {
          setOpenModal(false);
          setDeletingTopping(null);
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

  const onFilterChange = async (changedFields: FieldData[]) => {
    const changedFilterFields = changedFields
      .map((item) => ({ [item.name[0]]: item.value }))
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
    if (editingTopping) {
      setOpenDrawer(true);

      form.setFieldsValue({
        ...editingTopping,
        tenantId: Number(editingTopping.tenantId),
      });
    }
  }, [editingTopping, form]);

  useEffect(() => {
    if (deletingTopping) {
      setOpenModal(true);
    }
  }, [deletingTopping]);

  useEffect(() => {
    return () => {
      debouncedQUpdate.cancel();
    };
  }, [debouncedQUpdate]);

  useEffect(() => {
    if (isError) {
      toast.error(
        (error as ResponseError).response?.data?.errors
          ? (error as ResponseError).response.data.errors[0].msg
          : error.message
      );
    }
  }, [error, isError, toast]);

  return (
    <>
      <Space direction="vertical" style={{ width: "100%" }} size={"large"}>
        <Flex justify="space-between">
          <Breadcrumb items={breadcrumb} separator={<RightOutlined />} />
          {(isFetching || isLoading) && (
            <Spin indicator={<LoadingOutlined />} />
          )}
        </Flex>

        <Form form={filterForm} onFieldsChange={onFilterChange}>
          <ToppingsFilter>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setOpenDrawer(true)}
            >
              Create Topping
            </Button>
          </ToppingsFilter>
        </Form>

        <Table
          columns={[
            ...tableColumns,
            {
              title: "Actions",
              align: "center",
              render: (_: string, record: Topping) => (
                <Space size={2}>
                  <Button
                    type="link"
                    icon={<EditOutlined />}
                    size="large"
                    onClick={() => setEditingTopping(record)}
                  />
                  <Button
                    type="link"
                    icon={<DeleteOutlined />}
                    size="large"
                    onClick={() => setDeletingTopping(record)}
                  />
                </Space>
              ),
            },
          ]}
          dataSource={data?.data}
          loading={isLoading}
          rowKey={"_id"}
          pagination={{
            total: data?.total,
            pageSize: queryParams.perPage,
            current: queryParams.currentPage,
            onChange: (page) =>
              setQueryParams((prev) => ({ ...prev, currentPage: page })),
            showTotal: (total, range) =>
              `Showing ${range[0]}-${range[1]} of ${total} items`,
          }}
          scroll={{ x: "max-content" }}
        />
      </Space>

      <Drawer
        title={editingTopping ? "Editing Topping" : "Create Topping"}
        width={720}
        onClose={() => {
          form.resetFields();
          setOpenDrawer(false);
          setEditingTopping(null);
        }}
        styles={{ body: { backgroundColor: colorBgLayout } }}
        open={openDrawer}
        extra={
          <Space>
            <Button
              onClick={() => {
                form.resetFields();
                setOpenDrawer(false);
                setEditingTopping(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={onHandleSubmit}
              loading={isCreatePending || isUpdatePending}
            >
              Submit
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" form={form}>
          <ToppingForm
            image={editingTopping ? editingTopping.image : undefined}
          />
        </Form>
      </Drawer>

      <Modal
        title="Deleting Topping"
        open={openModal}
        onOk={onHandleDelete}
        confirmLoading={isDeletePending}
        onCancel={() => {
          setDeletingTopping(null);
          setOpenModal(false);
        }}
        okText="Delete"
      >
        <Paragraph>Do you want to delete this topping?</Paragraph>
      </Modal>
    </>
  );
};

export default ToppingsPage;
