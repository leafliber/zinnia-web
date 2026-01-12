import React from 'react'
import { Card, Form, Input, Button, Space, Typography, Descriptions, Tag, message } from 'antd'
import { UserOutlined, MailOutlined, SaveOutlined } from '@ant-design/icons'
import { useAuthStore } from '@/stores'
import { authApi } from '@/api'
import { formatDateTime } from '@/utils'
import type { UpdateUserRequest } from '@/types'

const { Title, Text } = Typography

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuthStore()
  const [form] = Form.useForm()
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (user) {
      form.setFieldsValue({
        username: user.username,
      })
    }
  }, [user, form])

  const handleSubmit = async (values: UpdateUserRequest) => {
    setLoading(true)
    try {
      const updated = await authApi.updateCurrentUser(values)
      updateUser(updated)
      message.success('个人资料已更新')
    } catch (error) {
      message.error('更新失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null
  }

  const roleLabels: Record<string, string> = {
    admin: '管理员',
    user: '普通用户',
    readonly: '只读用户',
  }

  const roleColors: Record<string, string> = {
    admin: 'red',
    user: 'blue',
    readonly: 'default',
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Title level={4} style={{ marginBottom: 24 }}>
        个人资料
      </Title>

      {/* 用户信息展示 */}
      <Card title="账户信息" style={{ marginBottom: 24 }}>
        <Descriptions column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="用户 ID">
            <Text copyable style={{ fontFamily: 'monospace', fontSize: 12 }}>
              {user.id}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="邮箱">
            <Space>
              <MailOutlined />
              {user.email}
              {user.email_verified ? (
                <Tag color="green">已验证</Tag>
              ) : (
                <Tag color="orange">未验证</Tag>
              )}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="用户名">
            <Space>
              <UserOutlined />
              {user.username}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="角色">
            <Tag color={roleColors[user.role]}>{roleLabels[user.role] || user.role}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="注册时间">{formatDateTime(user.created_at)}</Descriptions.Item>
          <Descriptions.Item label="最后登录">
            {user.last_login_at ? formatDateTime(user.last_login_at) : '-'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 编辑个人信息 */}
      <Card title="编辑资料">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ maxWidth: 400 }}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名至少 3 个字符' },
              { max: 50, message: '用户名最多 50 个字符' },
              {
                pattern: /^[a-zA-Z0-9_]+$/,
                message: '用户名只能包含字母、数字和下划线',
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
              保存更改
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
