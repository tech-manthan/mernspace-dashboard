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
  // Divider,
  Drawer,
  Flex,
  Form,
  Modal,
  // Radio,
  Space,
  Spin,
  // Switch,
  Table,
  // Tag,
  theme,
  Typography,
} from "antd";
import { Link, Navigate } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import { useEffect, useMemo, useState } from "react";
import type { ResponseError } from "../../types/error.type";
import { useAuthStore } from "../../store/auth.store";
import type { FieldData, PriceType } from "../../types/common.type";
import { debounce } from "lodash";
import dayjs from "dayjs";

import type {
  CategoriesQueryParams,
  Category,
  CategoryPriceConfiguration,
} from "../../types/category.type";
import { useGetCategories } from "../../hooks/api/useGetCategories";
import { useCreateCategory } from "../../hooks/api/useCreateCategory";
import { useUpdateCategory } from "../../hooks/api/useUpdateCategory";
import { useDeleteCategory } from "../../hooks/api/useDeleteCategory";
import { CategoriesFilter, CategoryForm } from "../../components/categories";
import { PER_PAGE } from "../../constants";

const breadcrumb = [
  {
    title: <Link to={"/"}>Dashboard</Link>,
  },
  {
    title: "Categories",
  },
];

const tableColumns = [
  {
    title: "Category name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
  },
];

const CategoriesPage = () => {
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();

  const { user } = useAuthStore();
  const toast = useToast();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const [queryParams, setQueryParams] = useState<CategoriesQueryParams>({
    perPage: PER_PAGE,
    currentPage: 1,
    q: "",
  });
  const { data, isFetching, isLoading, isError, error } = useGetCategories(
    user?.role === "admin" || user?.role === "manager",
    queryParams
  );
  const {
    token: { colorBgLayout },
  } = theme.useToken();
  const { mutate: mutateCreate, isPending: isCreatePending } =
    useCreateCategory();
  const { mutate: mutateUpdate, isPending: isUpdatePending } =
    useUpdateCategory();
  const { mutate: mutateDelete, isPending: isDeletePending } =
    useDeleteCategory();

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null
  );

  const onHandleSubmit = async () => {
    await form.validateFields();

    const priceConfigurationFormValue: Array<{
      key: string;
      priceType: PriceType;
      availableOptions: string[];
    }> = form.getFieldsValue().priceConfiguration || [];

    const priceConfiguration: CategoryPriceConfiguration =
      priceConfigurationFormValue.reduce(
        (
          acc: CategoryPriceConfiguration,
          { key, priceType, availableOptions }
        ) => {
          acc[key] = { priceType, availableOptions };
          return acc;
        },
        {}
      );

    const isEditing = !!editingCategory;

    if (isEditing) {
      const values = form.getFieldsValue({}) as Record<string, unknown>;
      const changedValues: Record<string, unknown> = {};
      for (const key in values) {
        if (key === "priceConfiguration") {
          continue;
        }
        if (form.isFieldTouched(key)) {
          changedValues[key] = values[key];
        }
      }
      if (form.isFieldTouched("priceConfiguration")) {
        changedValues["priceConfiguration"] = priceConfiguration;
      }
      mutateUpdate(
        {
          id: editingCategory._id,
          categoryData: changedValues,
        },
        {
          onSettled: () => {
            form.resetFields();
            setOpenDrawer(false);
            setEditingCategory(null);
          },
        }
      );
    } else {
      mutateCreate(
        {
          ...form.getFieldsValue(),
          priceConfiguration,
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
    const isDeleting = !!deletingCategory;

    if (isDeleting) {
      mutateDelete(deletingCategory._id, {
        onSettled: () => {
          setOpenModal(false);
          setDeletingCategory(null);
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
    if (editingCategory) {
      setOpenDrawer(true);
      const priceConfiguration = Object.entries(
        editingCategory.priceConfiguration
      ).map(([key, { priceType, availableOptions }]) => ({
        key,
        priceType,
        availableOptions,
      }));
      form.setFieldsValue({ ...editingCategory, priceConfiguration });
    }
  }, [editingCategory, form]);

  useEffect(() => {
    if (deletingCategory) {
      setOpenModal(true);
    }
  }, [deletingCategory]);

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
          <CategoriesFilter>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setOpenDrawer(true)}
            >
              Create Category
            </Button>
          </CategoriesFilter>
        </Form>

        <Table
          columns={[
            ...tableColumns,
            {
              title: "Actions",
              align: "center",
              render: (_: string, record: Category) => {
                return (
                  <Space size={2}>
                    <Button
                      type="link"
                      icon={<EditOutlined />}
                      size="large"
                      onClick={() => setEditingCategory(record)}
                    />
                    <Button
                      type="link"
                      size="large"
                      icon={<DeleteOutlined />}
                      onClick={() => setDeletingCategory(record)}
                    />
                  </Space>
                );
              },
            },
          ]}
          dataSource={data?.data}
          loading={isLoading}
          rowKey={"_id"}
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
          scroll={{
            x: "max-content",
          }}
        />
      </Space>
      <Drawer
        title={editingCategory ? "Editing Category" : "Create Category"}
        width={720}
        destroyOnHidden={true}
        onClose={() => {
          form.resetFields();
          setOpenDrawer(false);
          setEditingCategory(null);
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
                setEditingCategory(null);
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
          <CategoryForm />
        </Form>
      </Drawer>
      <Modal
        title={"Deleting Category"}
        open={openModal}
        onOk={onHandleDelete}
        confirmLoading={isDeletePending}
        onCancel={() => {
          setDeletingCategory(null);
          setOpenModal(false);
        }}
        okText={"Delete"}
      >
        <Typography.Paragraph>
          Do you want to delete the category
        </Typography.Paragraph>
      </Modal>
    </>
  );
};

export default CategoriesPage;
