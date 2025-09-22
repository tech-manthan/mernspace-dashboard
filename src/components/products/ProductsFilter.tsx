import { Card, Col, Form, Input, Row, Select } from "antd";
import { useMemo, useState, type ReactNode } from "react";
import { useGetInfiniteTenants } from "../../hooks/api/useGetInfiniteTenants";
import { useAuthStore } from "../../store/auth.store";
import { debounce } from "lodash";
import { useGetInfiniteCategories } from "../../hooks/api/useGetInfiniteCategories";

type ProductsFilterProps = {
  children?: ReactNode;
};

export const ProductsFilter = ({ children }: ProductsFilterProps) => {
  const { user } = useAuthStore();

  const [searchTenant, setSearchTenant] = useState("");
  const [searchCategory, setSearchCategory] = useState("");

  const {
    data: tenants,
    fetchNextPage: fetchNextTenantPage,
    hasNextPage: hasNextTenantPage,
    isFetchingNextPage: isFetchingNextTenantPage,
    isLoading: isLoadingTenants,
  } = useGetInfiniteTenants(user?.role === "admin", searchTenant);

  const {
    data: categories,
    fetchNextPage: fetchNextCategoryPage,
    hasNextPage: hasNextCategoryPage,
    isFetchingNextPage: isFetchingNextCategoryPage,
    isLoading: isLoadingCategories,
  } = useGetInfiniteCategories(
    user?.role === "admin" || user?.role === "manager",
    searchCategory
  );

  const onSearchTenant = useMemo(
    () => debounce((val: string) => setSearchTenant(val), 500),
    []
  );

  const onSearchCategory = useMemo(
    () => debounce((val: string) => setSearchCategory(val), 500),
    []
  );

  return (
    <Card>
      <Row justify={"space-between"} align={"top"} gutter={[10, 10]}>
        <Col span={24} lg={20}>
          <Row gutter={20} align={"top"}>
            <Col span={24} sm={12} lg={8}>
              <Form.Item name={"q"} style={{ marginBottom: 16 }}>
                <Input.Search placeholder="Search" allowClear />
              </Form.Item>
            </Col>
            {user?.role === "admin" && (
              <Col span={24} sm={12} lg={8}>
                <Form.Item name={"tenantId"} style={{ marginBottom: 16 }}>
                  <Select
                    id="productFilterRestaurant"
                    loading={isLoadingTenants || isFetchingNextTenantPage}
                    filterOption={false}
                    options={tenants?.pages.flatMap((page) =>
                      page.data.map((t) => ({ value: t.id, label: t.name }))
                    )}
                    onSearch={onSearchTenant}
                    onPopupScroll={(e) => {
                      const target = e.target as HTMLElement;
                      if (
                        target.scrollTop + target.clientHeight >=
                          target.scrollHeight - 2 &&
                        hasNextTenantPage
                      ) {
                        fetchNextTenantPage();
                      }
                    }}
                    placeholder={"Restaurant"}
                    allowClear
                    showSearch
                    style={{
                      width: "100%",
                    }}
                  />
                </Form.Item>
              </Col>
            )}
            <Col span={24} sm={12} lg={6}>
              <Form.Item name={"categoryId"} style={{ marginBottom: 16 }}>
                <Select
                  id="productFilterCategories"
                  loading={isLoadingCategories || isFetchingNextCategoryPage}
                  filterOption={false}
                  options={categories?.pages.flatMap((page) =>
                    page.data.map((t) => ({ value: t._id, label: t.name }))
                  )}
                  onSearch={onSearchCategory}
                  onPopupScroll={(e) => {
                    const target = e.target as HTMLElement;
                    if (
                      target.scrollTop + target.clientHeight >=
                        target.scrollHeight - 2 &&
                      hasNextCategoryPage
                    ) {
                      fetchNextCategoryPage();
                    }
                  }}
                  placeholder={"Category"}
                  allowClear
                  showSearch
                  style={{
                    width: "100%",
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={24} sm={12} lg={4}>
              <Form.Item name={"isPublish"} style={{ marginBottom: 0 }}>
                <Select
                  options={[
                    {
                      value: true,
                      label: "Published",
                    },
                    {
                      value: false,
                      label: "Draft",
                    },
                  ]}
                  placeholder={"Is Published"}
                  allowClear
                  style={{
                    width: "100%",
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Col>
        <Col>{children}</Col>
      </Row>
    </Card>
  );
};
