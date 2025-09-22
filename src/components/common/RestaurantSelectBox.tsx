import { Form, Select } from "antd";
import { useGetInfiniteTenants } from "../../hooks/api/useGetInfiniteTenants";
import { useMemo, useState } from "react";
import { useAuthStore } from "../../store/auth.store";
import { debounce } from "lodash";
import { useGetTenant } from "../../hooks/api/useGetTenant";

export const RestaurantSelectBox = ({
  selectBoxId = "restaurantSelectBox",
  tenantId,
  isEditing = false,
}: {
  selectBoxId?: string;
  tenantId: number | undefined;
  isEditing?: boolean;
}) => {
  const { user } = useAuthStore();

  const [searchTenant, setSearchTenant] = useState("");

  const {
    data: tenants,
    fetchNextPage: fetchNextTenantPage,
    hasNextPage: hasNextTenantPage,
    isFetchingNextPage: isFetchingNextTenantPage,
    isLoading: isLoadingTenants,
  } = useGetInfiniteTenants(user?.role === "admin", searchTenant);

  const { data: tenant } = useGetTenant(
    isEditing ? tenantId : undefined,
    user?.role === "admin"
  );

  const onSearchTenant = useMemo(
    () => debounce((val: string) => setSearchTenant(val), 500),
    []
  );
  return (
    <Form.Item
      label="Restaurant"
      name={"tenantId"}
      rules={[
        {
          required: true,
          message: "Restaurant is required",
        },
      ]}
    >
      <Select
        id={selectBoxId}
        loading={isLoadingTenants || isFetchingNextTenantPage}
        filterOption={false}
        options={tenants?.pages.flatMap((page) =>
          page.data.map((t) => ({
            value: t.id,
            label: t.name,
          }))
        )}
        labelRender={({ label }) =>
          tenant && tenant.id === tenantId ? `${tenant.name}` : label
        }
        onSearch={onSearchTenant}
        onPopupScroll={(e) => {
          const target = e.target as HTMLElement;
          if (
            target.scrollTop + target.clientHeight >= target.scrollHeight - 2 &&
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
        size="large"
      />
    </Form.Item>
  );
};
