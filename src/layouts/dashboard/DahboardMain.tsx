import Icon from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Basket,
  Category,
  Food,
  Gift,
  Home,
  Logo,
  User,
} from "../../components/icons";
const { Sider, Content, Footer, Header } = Layout;

const items = [
  {
    key: "/",
    icon: <Icon component={Home} />,
    label: <NavLink to={"/"}>Home</NavLink>,
  },
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
  },
  {
    key: "/products",
    icon: <Icon component={Basket} />,
    label: <NavLink to={"/products"}>Products</NavLink>,
  },
  {
    key: "/promos",
    icon: <Icon component={Gift} />,
    label: <NavLink to={"/promos"}>Promos</NavLink>,
  },
];

const DashboardMain: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();

  console.log(items.find((item) => item.key.includes(pathname)));

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{}}
        theme="light"
        breakpoint="md"
      >
        <Icon
          component={Logo}
          style={{
            marginBlock: 20,
            marginInline: 30,
          }}
        />
        <Menu
          mode="inline"
          items={items}
          defaultSelectedKeys={["/"]}
          selectedKeys={[
            items.find((item) => item.key.includes(pathname))?.key || "",
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: "0 16px" }}>
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
