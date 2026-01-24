import React, { useState } from 'react'
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Alert,
  message,
  Popconfirm,
} from 'antd'
import { LockOutlined, LogoutOutlined } from '@ant-design/icons'
import { authApi } from '@/api'
import { useAuth } from '@/hooks'
import type { ChangePasswordRequest } from '@/types'

const { Title, Paragraph } = Typography

export const SecurityPage: React.FC = () => {
  const { logout } = useAuth()
  const [passwordForm] = Form.useForm()
  const [changingPassword, setChangingPassword] = useState(false)
  const [loggingOutAll, setLoggingOutAll] = useState(false)

  const handleChangePassword = async (values: ChangePasswordRequest) => {
    setChangingPassword(true)
    try {
      await authApi.changePassword(values)
      message.success('密码已修改，请重新登录')
      passwordForm.resetFields()
      // 修改密码后自动登出
      setTimeout(() => {
        logout()
      }, 1500)
    } catch {
      message.error('修改密码失败，请检查当前密码是否正确')
    } finally {
      setChangingPassword(false)
    }
  }

  const handleLogoutAll = async () => {
    setLoggingOutAll(true)
    try {
      const result = await authApi.logoutAll()
      message.success(`已登出 ${result.sessions_revoked} 个设备`)
    } catch {
      message.error('操作失败，请稍后重试')
    } finally {
      setLoggingOutAll(false)
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Title level={4} style={{ marginBottom: 24 }}>
        安全设置
      </Title>

      {/* 修改密码 */}
      <Card title="修改密码" style={{ marginBottom: 24 }}>
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handleChangePassword}
          style={{ maxWidth: 400 }}
        >
          <Form.Item
            name="current_password"
            label="当前密码"
            rules={[{ required: true, message: '请输入当前密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="当前密码" />
          </Form.Item>

          <Form.Item
            name="new_password"
            label="新密码"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 8, message: '密码至少 8 个字符' },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="新密码" />
          </Form.Item>

          <Form.Item
            name="confirm_password"
            label="确认新密码"
            dependencies={['new_password']}
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('new_password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'))
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="确认新密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={changingPassword}>
              修改密码
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* 会话管理 */}
      <Card title="会话管理">
        <Paragraph>
          如果您在其他设备上登录过账户，可以选择登出所有其他设备的会话。
        </Paragraph>

        <Alert
          message="注意"
          description="登出所有设备后，其他设备上的会话将立即失效，需要重新登录。当前设备的会话不受影响。"
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <Popconfirm
          title="确定要登出所有其他设备吗？"
          description="此操作将使所有其他设备上的会话失效"
          onConfirm={handleLogoutAll}
          okText="确定"
          cancelText="取消"
        >
          <Button
            danger
            icon={<LogoutOutlined />}
            loading={loggingOutAll}
          >
            登出所有其他设备
          </Button>
        </Popconfirm>
      </Card>
    </div>
  )
}
