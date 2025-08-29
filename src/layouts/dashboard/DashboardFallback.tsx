import Icon from "@ant-design/icons";
import { Flex, Layout, Skeleton, theme } from "antd";
import Sider from "antd/es/layout/Sider";
import { useState } from "react";
import { Logo, LogoCircle } from "../../components/icons";
import { Content } from "antd/es/layout/layout";

const { Header, Footer } = Layout;

const DashboardFallback = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

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

        <Skeleton.Input
          active
          style={{
            marginBlock: 20,
            marginInline: 18,
          }}
        />
        <Skeleton.Input
          active
          style={{
            marginInline: 18,
            marginBottom: 20,
          }}
        />
        <Skeleton.Input
          active
          style={{
            marginInline: 18,
            marginBottom: 20,
          }}
        />
        <Skeleton.Input
          active
          style={{
            marginInline: 18,
            marginBottom: 20,
          }}
        />
        <Skeleton.Input
          active
          style={{
            marginInline: 18,
            marginBottom: 20,
          }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 10,
            paddingInline: 20,
            background: colorBgContainer,
          }}
        >
          <Flex
            justify="space-between"
            style={{
              height: "100%",
            }}
          >
            <Skeleton.Avatar size={"large"} active />
            <Skeleton.Button shape="round" size="large" active />
          </Flex>
        </Header>
        <Content style={{ margin: "20px 16px" }}>
          <Skeleton active />
          <Skeleton active />
          <Skeleton active />
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Mernspace ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
};

export default DashboardFallback;
