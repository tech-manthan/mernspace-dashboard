import Icon, {
  BellFilled,
  DownOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Dropdown,
  Flex,
  Layout,
  Menu,
  Space,
  theme,
  type MenuProps,
} from "antd";
import { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Basket,
  Category,
  Food,
  Gift,
  Home,
  Logo,
  LogoCircle,
  Topping,
  User,
} from "../../components/icons";
import { useAuthStore } from "../../store/auth.store";
import { useLogout } from "../../hooks/api/useLogout";
import { useResponsive } from "../../hooks/useResponsive";
import type { UserRole } from "../../types/user.type";
const { Sider, Content, Footer, Header } = Layout;

const getMenuItems = (role: UserRole) => {
  const baseItems = [
    {
      key: "/",
      icon: <Icon component={Home} />,
      label: <NavLink to={"/"}>Home</NavLink>,
    },

    {
      key: "/products",
      icon: <Icon component={Basket} />,
      label: <NavLink to={"/products"}>Products</NavLink>,
    },
    {
      key: "/toppings",
      icon: <Icon component={Topping} />,
      label: <NavLink to={"/toppings"}>Toppings</NavLink>,
    },
    {
      key: "/promos",
      icon: <Icon component={Gift} />,
      label: <NavLink to={"/promos"}>Promos</NavLink>,
    },
  ];

  if (role === "admin") {
    const items = [...baseItems];
    items.splice(
      1,
      0,
      {
        key: "/users",
        icon: <Icon component={User} />,
        label: <NavLink to={"/users"}>Users</NavLink>,
      },
      {
        key: "/restaurants",
        icon: <Icon component={Food} />,
        label: <NavLink to={"/restaurants"}>Restaurants</NavLink>,
      },
      {
        key: "/categories",
        icon: <Icon component={Category} />,
        label: <NavLink to={"/categories"}>Categories</NavLink>,
      }
    );
    return items;
  } else {
    return baseItems;
  }
};

const DashboardMain: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();
  const { user } = useAuthStore();
  const { mutate } = useLogout();
  const { isMobile } = useResponsive();

  const dropDownItems: MenuProps["items"] = [
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: () => mutate(),
    },
  ];

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const menuItems = getMenuItems(user?.role as UserRole);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme="light"
        breakpoint="md"
      >
        <Icon
          component={collapsed ? LogoCircle : Logo}
          style={{
            marginBlock: 20,
            marginInline: 30,
          }}
        />
        <Menu
          mode="inline"
          items={menuItems}
          defaultSelectedKeys={["/"]}
          selectedKeys={[
            menuItems.find((item) => item.key.includes(pathname))?.key || "",
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 20, background: colorBgContainer }}>
          <Flex
            justify="space-between"
            align="center"
            style={{
              height: "100%",
            }}
          >
            <Badge
              count={
                user?.role === "admin"
                  ? "Admin User"
                  : String(user?.tenant?.name)
              }
              style={{
                fontSize: 12,
                fontWeight: "bold",
              }}
            />
            <Space size={16} align="center">
              <Link to={"/notifications"}>
                <Badge size="small">
                  <BellFilled
                    size={20}
                    style={{
                      fontSize: 18,
                    }}
                  />
                </Badge>
              </Link>
              <Dropdown placement="bottomRight" menu={{ items: dropDownItems }}>
                <Space size={5} style={{ cursor: "pointer" }}>
                  <Avatar
                    style={{
                      backgroundColor: "#fde3cf",
                      color: "#f65f42",
                    }}
                  >
                    {user?.firstName[0]}
                  </Avatar>
                  <DownOutlined
                    style={{
                      fontSize: 10,
                    }}
                  />
                </Space>
              </Dropdown>
            </Space>
          </Flex>
        </Header>
        <Content style={{ margin: isMobile ? "16px" : "24px" }}>
          <Outlet />
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Mernspace ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
};

export default DashboardMain;
