import React, { useState } from 'react'
import { Form, Input, Button, Card, Typography, Space, Divider } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks'

const { Title, Text } = Typography

export const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth()
  const [form] = Form.useForm()

  const handleSubmit = async (values: { login: string; password: string }) => {
    try {
      await login(values.login, values.password)
    } catch {
      // 错误已在 useAuth 中处理
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Card
        style={{
          width: 400,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          borderRadius: 12,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <img src="/favicon.svg" alt="Logo" style={{ height: 48, marginBottom: 16 }} />
          <Title level={3} style={{ margin: 0 }}>
            欢迎回来
          </Title>
          <Text type="secondary">登录您的 Zinnia 账户</Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            name="login"
            rules={[{ required: true, message: '请输入邮箱或用户名' }]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="邮箱或用户名"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={isLoading}
            >
              登录
            </Button>
          </Form.Item>
        </Form>

        <Divider>
          <Text type="secondary">还没有账户？</Text>
        </Divider>

        <div style={{ textAlign: 'center' }}>
          <Link to="/register">
            <Button type="link">立即注册</Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
