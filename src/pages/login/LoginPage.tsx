import { LockFilled, LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Checkbox, Flex, Form, Input, Layout, Space } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "../../components/icons";
import { useMutation } from "@tanstack/react-query";
import type { LoginData } from "../../types/auth.type";
import { login } from "../../http/api";
import { useToast } from "../../context/toast/hook";
import type { ResponseError } from "../../types/error.type";

const loginUser = async ({ email, password }: LoginData) => {
  const { data } = await login({
    email,
    password,
  });

  return data;
};

export default function LoginPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: loginUser,
    onSuccess: async () => {
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
