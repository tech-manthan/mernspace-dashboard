import { Form, Select } from "antd";
import { useMemo, useState } from "react";
import { useAuthStore } from "../../store/auth.store";
import { debounce } from "lodash";
import { useGetInfiniteCategories } from "../../hooks/api/useGetInfiniteCategories";
import { useGetCategory } from "../../hooks/api/useGetCategory";

export const CategorySelectBox = ({
  selectBoxId = "restaurantSelectBox",
  categoryId,
}: {
  selectBoxId?: string;
  categoryId: string | undefined;
}) => {
  const { user } = useAuthStore();

  const [searchCategory, setSearchCategory] = useState("");

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

  const { data: category } = useGetCategory(categoryId, true);

  const onSearchCategory = useMemo(
    () => debounce((val: string) => setSearchCategory(val), 500),
    []
  );

  return (
    <Form.Item
      label="Categories"
      name={"categoryId"}
      rules={[
        {
          required: true,
          message: "Category is required",
        },
      ]}
    >
      <Select
        id={selectBoxId}
        loading={isLoadingCategories || isFetchingNextCategoryPage}
        filterOption={false}
        options={categories?.pages.flatMap((page) =>
          page.data.map((t) => ({ value: t._id, label: t.name }))
        )}
        labelRender={({ label }) =>
          category && category._id === categoryId ? `${category.name}` : label
        }
        onSearch={onSearchCategory}
        onPopupScroll={(e) => {
          const target = e.target as HTMLElement;
          if (
            target.scrollTop + target.clientHeight >= target.scrollHeight - 2 &&
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
        size="large"
      />
    </Form.Item>
  );
};
