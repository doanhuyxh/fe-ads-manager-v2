"use client"

import { useState, useEffect } from "react"
import { Form, Input, Button, Checkbox, Typography, message, Spin } from "antd"
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons"
const { Title, Text } = Typography
import { useRouter } from "next/navigation";
import { login } from "../libs/ApiClient/AuthApi"
import '../styles/login.css'

interface LoginFormValues {
  username: string
  password: string
  remember: boolean
}

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();


  const onFinish = async (values: LoginFormValues) => {
    setLoading(true)

    try {
      const dataLoginResponse = await login({ email: values.username, password: values.password })

      if (dataLoginResponse.status) {
        messageApi.success("Đăng nhập thành công!")
        router.push("/dashboard");
      } else {
        messageApi.error("Tài khoản hoặc mật khẩu không đúng")
      }

    } catch (error) {
      messageApi.error("Đăng nhập thất bại. Vui lòng thử lại!")
    } finally {
      setLoading(false)
    }
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo)
    messageApi.error("Vui lòng kiểm tra lại thông tin!")
  }

  useEffect(() => {
    fetch("/api/company/current")
      .then(res => res.json())
      .then(res=>{
        window.location.href="/report"
      })

  },[])

  return (
    <div className="login-container">
      {contextHolder}
      {/* Background with gradient and animated shapes */}
      <div className="login-background">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      {/* Login Form */}
      <div className="login-form-container">
        <div className="login-form-wrapper">
          {/* Logo/Brand */}
          <div className="login-header">
            <div className="logo">
              <UserOutlined className="logo-icon" />
            </div>
            <Title level={2} className="login-title">
              Đăng nhập hệ thống
            </Title>
            <Text className="login-subtitle">Vui lòng nhập thông tin đăng nhập</Text>
          </div>

          {/* Demo Account Info */}
          <div className="demo-info">
            <Text className="demo-text">
              <strong>Tài khoản demo:</strong> admin / 123456
            </Text>
          </div>

          {/* Form */}
          <Form
            form={form}
            name="login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            size="large"
            layout="vertical"
          >
            <Form.Item
              name="username"
              label="Tài khoản"
              rules={[
                { required: true, message: "Vui lòng nhập tài khoản!" },
                { min: 3, message: "Tài khoản phải có ít nhất 3 ký tự!" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="input-icon" />}
                placeholder="Nhập tài khoản của bạn"
                className="login-input"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu!" },
                { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="input-icon" />}
                placeholder="Nhập mật khẩu"
                className="login-input"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <Form.Item className="login-options">
              <div className="options-wrapper">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox className="remember-checkbox">Ghi nhớ đăng nhập</Checkbox>
                </Form.Item>
              </div>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-button" loading={loading} block>
                {loading ? (
                  <span>
                    <Spin size="small" className="login-spinner" />
                    Đang đăng nhập...
                  </span>
                ) : (
                  "Đăng nhập"
                )}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}
