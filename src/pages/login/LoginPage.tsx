import { LockFilled, LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Checkbox, Flex, Form, Input, Layout, Space } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "../../components/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { LoginData } from "../../types/auth.type";
import { login, logout, self } from "../../http/api";
import { useToast } from "../../context/toast/hook";
import type { ResponseError } from "../../types/error.type";
import type { User } from "../../types/user.type";
import { useAuthStore } from "../../store/auth.store";
import { usePermission } from "../../hooks/usePermission";

const loginUser = async ({ email, password }: LoginData) => {
  const { data } = await login({
    email,
    password,
  });

  return data;
};

const selfData = async () => {
  const { data } = await self();

  return data;
};

const logoutUser = async () => {
  const { data } = await logout();
  return data;
};

export default function LoginPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const { setUser, removeUser } = useAuthStore();
  const { isAllowed } = usePermission();
  const { refetch } = useQuery<User>({
    queryKey: ["self"],
    queryFn: selfData,
    enabled: false,
  });
  const { mutate: mutateLogout } = useMutation({
    mutationKey: ["logout"],
    mutationFn: logoutUser,
    onSuccess: async () => {
      toast.success({
        content: "Logged out successfully",
        onClose: () => {
          window.location.href = import.meta.env.VITE_CLIENT_UI_URL;
        },
      });
    },
    onError: async (err) => {
      toast.error({
        content: (err as ResponseError).response.data.errors[0].msg,
      });
    },
  });
  const { mutate, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: loginUser,
    onSuccess: async () => {
      const result = await refetch();

      if (result.status === "error" || !result.data) {
        toast.error({
          content: "Login Failed, Try again",
        });
        return;
      }

      if (!isAllowed(result.data)) {
        toast.error({
          content: "Customer not allowed to access Mernspace Dashboard",
        });
        mutateLogout();
        removeUser();
        return;
      }

      setUser(result.data);
      toast.success({
        content: "Login Successfull",
        onClose: () => {
          navigate("/", {
            replace: true,
          });
        },
      });
    },
    onError: async (err) => {
      toast.error({
        content: (err as ResponseError).response.data.errors[0].msg,
      });
    },
  });
  return (
    <Layout
      style={{
        width: "100%",
        height: "100vh",
        display: "grid",
        placeItems: "center",
      }}
    >
      <Space direction="vertical" align="center" size="large">
        <Layout.Content>
          <Logo />
        </Layout.Content>
        <Card
          title={
            <Space
              style={{
                width: "100%",
                fontSize: 16,
                justifyContent: "center",
              }}
            >
              <LockFilled />
              Sign in
            </Space>
          }
          variant="borderless"
          style={{
            width: 300,
          }}
        >
          <Form
            initialValues={{
              remember: true,
            }}
            onFinish={(values) => {
              mutate({
                email: values.email,
                password: values.password,
              });
            }}
          >
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please enter your email",
                },
                {
                  type: "email",
                  message: "Email is invalid",
                },
              ]}
            >
              <Input placeholder="Username" prefix={<UserOutlined />} />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please enter your password",
                },
              ]}
            >
              <Input.Password
                placeholder="Password"
                prefix={<LockOutlined />}
              />
            </Form.Item>

            <Flex justify="space-between">
              <Form.Item name="remember" valuePropName="checked">
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <Link
                to={"/auth/forgot-password"}
                style={{
                  paddingTop: 6,
                  fontSize: 12,
                }}
              >
                Forgot password
              </Link>
            </Flex>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  width: "100%",
                }}
                loading={isPending}
              >
                Log in
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Space>
    </Layout>
  );
}
