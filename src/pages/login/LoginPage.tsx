import { LockFilled, LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Checkbox, Form, Input, Layout, Space } from "antd";
import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <>
      {/* <h1>Sign in</h1>
      <input type="text" placeholder="Username" />
      <input type="password" placeholder="Password" />
      <button>Log in</button>
      <label htmlFor="remember-me">Remember me</label>
      <input type="checkbox" id="remember-me" />
      <a href="#">Forgot password</a> */}

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
            <svg
              width="81"
              height="23"
              viewBox="0 0 81 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M39.746 9.432C39.746 10.164 39.578 10.836 39.242 11.448C38.906 12.048 38.39 12.534 37.694 12.906C36.998 13.278 36.134 13.464 35.102 13.464H33.194V18H30.116V5.364H35.102C36.11 5.364 36.962 5.538 37.658 5.886C38.354 6.234 38.876 6.714 39.224 7.326C39.572 7.938 39.746 8.64 39.746 9.432ZM34.868 11.016C35.456 11.016 35.894 10.878 36.182 10.602C36.47 10.326 36.614 9.936 36.614 9.432C36.614 8.928 36.47 8.538 36.182 8.262C35.894 7.986 35.456 7.848 34.868 7.848H33.194V11.016H34.868ZM44.4264 5.364V18H41.3484V5.364H44.4264ZM49.933 15.48H55.369V18H46.441V15.66L51.841 7.884H46.441V5.364H55.369V7.704L49.933 15.48ZM60.6557 15.48H66.0917V18H57.1637V15.66L62.5637 7.884H57.1637V5.364H66.0917V7.704L60.6557 15.48ZM75.9683 15.768H71.2523L70.4963 18H67.2743L71.8463 5.364H75.4103L79.9823 18H76.7243L75.9683 15.768ZM75.1763 13.392L73.6103 8.766L72.0623 13.392H75.1763Z"
                fill="#484848"
              />
              <circle
                cx="11"
                cy="11"
                r="7.5"
                stroke="#F65F42"
                stroke-width="7"
              />
            </svg>
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
            <Form>
              <Form.Item name="username">
                <Input placeholder="Username" prefix={<UserOutlined />} />
              </Form.Item>

              <Form.Item name="password">
                <Input.Password
                  placeholder="Password"
                  prefix={<LockOutlined />}
                />
              </Form.Item>

              <Form.Item name="remember">
                <Checkbox>Remember me</Checkbox>

                <Link to={"/auth/forgot-password"}>Forgot Password</Link>
              </Form.Item>

              <Form.Item name="remember">
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    width: "100%",
                  }}
                >
                  Log in
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Space>
      </Layout>
    </>
  );
}
