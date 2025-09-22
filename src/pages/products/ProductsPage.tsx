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
import type { Product, ProductsQueryParams } from "../../types/product.type";
import { useGetProducts } from "../../hooks/api/useGetProducts";
import { ProductForm, ProductsFilter } from "../../components/products";
import { useCreateProduct } from "../../hooks/api/useCreateProduct";
import { useUpdateProduct } from "../../hooks/api/useUpdateProduct";
import { useDeleteProduct } from "../../hooks/api/useDeleteProduct";
import { useAuthStore } from "../../store/auth.store";
import { PER_PAGE } from "../../constants";

const { Paragraph } = Typography;

const breadcrumb = [
  {
    title: <Link to={"/"}>Dashboard</Link>,
  },
  {
    title: "Products",
  },
];

const tableColumns = [
  {
    title: "Product Name",
    dataIndex: "name",
    key: "name",
    render: (_text: string, record: Product) => {
      return (
        <Space>
          <Image width={60} src={record.image} preview={false} />
          <Typography.Text>{record.name}</Typography.Text>
        </Space>
      );
    },
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
    width: 300,
    render: (desc: string) => (
      <Paragraph ellipsis={{ rows: 2 }}>{desc}</Paragraph>
    ),
  },
  {
    title: "Category",
    dataIndex: ["category", "name"],
    key: "category",
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

const ProductsPage = () => {
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();

  const toast = useToast();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const { user } = useAuthStore();

  const [queryParams, setQueryParams] = useState<ProductsQueryParams>({
    perPage: PER_PAGE,
    currentPage: 1,
    q: "",
    categoryId: "",
    isPublish: undefined,
    tenantId: user?.role === "manager" ? String(user.tenant?.id) : "",
  });

  const { data, isFetching, isLoading, isError, error } = useGetProducts(
    true,
    queryParams
  );

  const {
    token: { colorBgLayout },
  } = theme.useToken();

  const { mutate: mutateCreate, isPending: isCreatePending } =
    useCreateProduct();
  const { mutate: mutateUpdate, isPending: isUpdatePending } =
    useUpdateProduct();
  const { mutate: mutateDelete, isPending: isDeletePending } =
    useDeleteProduct();

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const onHandleSubmit = async () => {
    await form.validateFields();

    const isEditing = !!editingProduct;

    const priceConfiguration = Object.entries(
      form.getFieldValue("priceConfiguration")
    ).reduce((acc, [key, value]) => {
      const parsedKey = JSON.parse(key);
      return {
        ...acc,
        [parsedKey.configurationKey]: {
          priceType: parsedKey.priceType,
          availableOptions: value,
        },
      };
    }, {});

    const attributes = Object.entries(form.getFieldValue("attributes")).map(
      ([key, value]) => {
        return {
          name: key,
          value: value,
        };
      }
    );

    if (isEditing) {
      const values = form.getFieldsValue({}) as Record<string, unknown>;
      const changedValues: Record<string, unknown> = {};

      if (values["name"] !== editingProduct.name) {
        changedValues["name"] = values["name"];
      }

      if (values["description"] !== editingProduct.description) {
        changedValues["description"] = values["description"];
      }

      if (values["categoryId"] !== editingProduct.categoryId) {
        changedValues["categoryId"] = values["categoryId"];
      }

      if (values["isPublish"] !== editingProduct.isPublish) {
        changedValues["isPublish"] = values["isPublish"];
      }

      {
        if (user?.role === "admin") {
          if (values["tenantId"] !== editingProduct.tenantId) {
            changedValues["tenantId"] = values["tenantId"];
          }
        }
      }
      if (values["image"] instanceof File) {
        changedValues["image"] = values["image"];
      }

      if (form.isFieldTouched("attributes")) {
        changedValues["attributes"] = attributes;
      }
      if (form.isFieldTouched("priceConfiguration")) {
        changedValues["priceConfiguration"] = priceConfiguration;
      }

      mutateUpdate(
        {
          id: editingProduct._id,
          productData: changedValues,
        },
        {
          onSettled: () => {
            form.resetFields();
            setOpenDrawer(false);
            setEditingProduct(null);
          },
        }
      );
    } else {
      mutateCreate(
        {
          ...form.getFieldsValue(),
          priceConfiguration: priceConfiguration,
          attributes: attributes,
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
    if (deletingProduct) {
      mutateDelete(deletingProduct._id, {
        onSettled: () => {
          setOpenModal(false);
          setDeletingProduct(null);
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
    if (editingProduct) {
      setOpenDrawer(true);
      const priceConfiguration = Object.entries(
        editingProduct.priceConfiguration
      ).reduce((acc, [configurationKey, { priceType, availableOptions }]) => {
        const key = JSON.stringify({ configurationKey, priceType });
        return {
          ...acc,
          [key]: availableOptions,
        };
      }, {});

      const attributes = editingProduct.attributes.reduce(
        (acc, { name, value }) => ({
          ...acc,
          [name]: value,
        }),
        {}
      );

      form.setFieldsValue({
        ...editingProduct,
        tenantId: Number(editingProduct.tenantId),
        priceConfiguration,
        attributes,
      });
    }
  }, [editingProduct, form]);

  useEffect(() => {
    if (deletingProduct) {
      setOpenModal(true);
    }
  }, [deletingProduct]);

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
          <ProductsFilter>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setOpenDrawer(true)}
            >
              Create Product
            </Button>
          </ProductsFilter>
        </Form>

        <Table
          columns={[
            ...tableColumns,
            {
              title: "Actions",
              align: "center",
              render: (_: string, record: Product) => (
                <Space size={2}>
                  <Button
                    type="link"
                    icon={<EditOutlined />}
                    size="large"
                    onClick={() => setEditingProduct(record)}
                  />
                  <Button
                    type="link"
                    icon={<DeleteOutlined />}
                    size="large"
                    onClick={() => setDeletingProduct(record)}
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
        title={editingProduct ? "Editing Product" : "Create Product"}
        width={720}
        onClose={() => {
          form.resetFields();
          setOpenDrawer(false);
          setEditingProduct(null);
        }}
        styles={{ body: { backgroundColor: colorBgLayout } }}
        open={openDrawer}
        extra={
          <Space>
            <Button
              onClick={() => {
                form.resetFields();
                setOpenDrawer(false);
                setEditingProduct(null);
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
          <ProductForm
            image={editingProduct ? editingProduct.image : undefined}
          />
        </Form>
      </Drawer>

      <Modal
        title="Deleting Product"
        open={openModal}
        onOk={onHandleDelete}
        confirmLoading={isDeletePending}
        onCancel={() => {
          setDeletingProduct(null);
          setOpenModal(false);
        }}
        okText="Delete"
      >
        <Paragraph>Do you want to delete this product?</Paragraph>
      </Modal>
    </>
  );
};

export default ProductsPage;
