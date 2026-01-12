import React, { useEffect, useState } from 'react'
import {
  Card,
  Table,
  Button,
  Space,
  Typography,
  Tag,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Popconfirm,
  message,
  Alert,
  Tooltip,
} from 'antd'
import {
  ArrowLeftOutlined,
  PlusOutlined,
  DeleteOutlined,
  ReloadOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { devicesApi } from '@/api'
import { CopyableKey, LoadingSpinner } from '@/components'
import { formatDateTime, formatRelativeTime } from '@/utils'
import type { DeviceToken, CreateDeviceTokenRequest, TokenPermission } from '@/types'
import type { ColumnsType } from 'antd/es/table'

const { Title, Text } = Typography

export const TokenManagePage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const [tokens, setTokens] = useState<DeviceToken[]>([])
  const [loading, setLoading] = useState(true)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newToken, setNewToken] = useState<DeviceToken | null>(null)
  const [revokeAllLoading, setRevokeAllLoading] = useState(false)
  const [includeRevoked, setIncludeRevoked] = useState(false)
  const [includeExpired, setIncludeExpired] = useState(false)

  useEffect(() => {
    if (id) {
      loadTokens()
    }
  }, [id, includeRevoked, includeExpired])

  const loadTokens = async () => {
    if (!id) return
    setLoading(true)
    try {
      const data = await devicesApi.getDeviceTokens(id, {
        include_revoked: includeRevoked,
        include_expired: includeExpired,
      })
      setTokens(data)
    } catch (error) {
      message.error('加载令牌列表失败')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (values: CreateDeviceTokenRequest) => {
    if (!id) return
    setCreating(true)
    try {
      const token = await devicesApi.createDeviceToken(id, values)
      setNewToken(token)
      setCreateModalOpen(false)
      form.resetFields()
      loadTokens()
      message.success('令牌创建成功')
    } catch (error) {
      message.error('创建令牌失败')
    } finally {
      setCreating(false)
    }
  }

  const handleRevoke = async (tokenId: string) => {
    if (!id) return
    try {
      await devicesApi.revokeDeviceToken(id, tokenId)
      message.success('令牌已吊销')
      loadTokens()
    } catch (error) {
      message.error('吊销令牌失败')
    }
  }

  const handleRevokeAll = async () => {
    if (!id) return
    setRevokeAllLoading(true)
    try {
      const result = await devicesApi.revokeAllDeviceTokens(id)
      message.success(result.message)
      loadTokens()
    } catch (error) {
      message.error('吊销令牌失败')
    } finally {
      setRevokeAllLoading(false)
    }
  }

  const permissionLabels: Record<TokenPermission, string> = {
    read: '只读',
    write: '只写',
    all: '读写',
  }

  const permissionColors: Record<TokenPermission, string> = {
    read: 'blue',
    write: 'orange',
    all: 'green',
  }

  const columns: ColumnsType<DeviceToken> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '令牌前缀',
      dataIndex: 'token_prefix',
      key: 'token_prefix',
      render: (prefix: string) => <code style={{ fontSize: 12 }}>{prefix}</code>,
    },
    {
      title: '权限',
      dataIndex: 'permission',
      key: 'permission',
      render: (permission: TokenPermission) => (
        <Tag color={permissionColors[permission]}>{permissionLabels[permission]}</Tag>
      ),
    },
    {
      title: '状态',
      key: 'status',
      render: (_: unknown, record: DeviceToken) => {
        if (record.is_revoked) {
          return <Tag color="red">已吊销</Tag>
        }
        if (record.expires_at && new Date(record.expires_at) < new Date()) {
          return <Tag color="orange">已过期</Tag>
        }
        return <Tag color="green">有效</Tag>
      },
    },
    {
      title: '使用次数',
      dataIndex: 'use_count',
      key: 'use_count',
    },
    {
      title: '最后使用',
      dataIndex: 'last_used_at',
      key: 'last_used_at',
      render: (time: string | null) => (time ? formatRelativeTime(time) : '-'),
    },
    {
      title: '过期时间',
      dataIndex: 'expires_at',
      key: 'expires_at',
      render: (time: string | null) => (time ? formatDateTime(time) : '永久有效'),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (time: string) => formatDateTime(time),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: DeviceToken) => {
        if (record.is_revoked) {
          return <Text type="secondary">已吊销</Text>
        }
        return (
          <Popconfirm
            title="确定要吊销此令牌吗？"
            description="吊销后令牌将立即失效"
            onConfirm={() => handleRevoke(record.id)}
            okText="吊销"
            cancelText="取消"
            okButtonProps={{ danger: true }}
          >
            <Button type="link" danger size="small">
              吊销
            </Button>
          </Popconfirm>
        )
      },
    },
  ]

  if (loading && tokens.length === 0) {
    return <LoadingSpinner />
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(`/devices/${id}`)}>
            返回详情
          </Button>
          <Title level={4} style={{ margin: 0 }}>
            令牌管理
          </Title>
        </Space>

        <Space>
          <Switch
            checkedChildren="显示已吊销"
            unCheckedChildren="隐藏已吊销"
            checked={includeRevoked}
            onChange={setIncludeRevoked}
          />
          <Button icon={<ReloadOutlined />} onClick={loadTokens}>
            刷新
          </Button>
          <Popconfirm
            title="确定要吊销所有令牌吗？"
            description="此操作将使所有令牌立即失效"
            onConfirm={handleRevokeAll}
            okText="全部吊销"
            cancelText="取消"
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<WarningOutlined />} loading={revokeAllLoading}>
              吊销全部
            </Button>
          </Popconfirm>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateModalOpen(true)}>
            创建令牌
          </Button>
        </Space>
      </div>

      {/* 新创建的令牌展示 */}
      {newToken && newToken.token && (
        <Alert
          message="新令牌已创建"
          description={
            <div style={{ marginTop: 8 }}>
              <p>请立即保存以下令牌，此令牌仅显示一次：</p>
              <CopyableKey value={newToken.token} label="Token" />
            </div>
          }
          type="success"
          showIcon
          closable
          onClose={() => setNewToken(null)}
          style={{ marginBottom: 16 }}
        />
      )}

      <Table
        columns={columns}
        dataSource={tokens}
        rowKey="id"
        loading={loading}
        pagination={false}
      />

      {/* 创建令牌弹窗 */}
      <Modal
        title="创建访问令牌"
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            name="name"
            label="令牌名称"
            rules={[
              { required: true, message: '请输入令牌名称' },
              { max: 100, message: '名称不能超过 100 个字符' },
            ]}
          >
            <Input placeholder="例如：IoT 传感器令牌" />
          </Form.Item>

          <Form.Item
            name="permission"
            label="权限级别"
            rules={[{ required: true, message: '请选择权限级别' }]}
          >
            <Select
              placeholder="选择权限"
              options={[
                { label: '只读 - 仅允许读取数据', value: 'read' },
                { label: '只写 - 仅允许写入数据', value: 'write' },
                { label: '读写 - 允许读取和写入', value: 'all' },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="expires_in_hours"
            label="有效期（小时）"
            extra="留空表示永久有效，最长 8760 小时（1年）"
          >
            <InputNumber min={1} max={8760} style={{ width: '100%' }} placeholder="留空表示永久有效" />
          </Form.Item>

          <Form.Item
            name="rate_limit_per_minute"
            label="速率限制（次/分钟）"
            extra="留空表示不限制，范围 1-1000"
          >
            <InputNumber min={1} max={1000} style={{ width: '100%' }} placeholder="留空表示不限制" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={creating}>
                创建
              </Button>
              <Button onClick={() => setCreateModalOpen(false)}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
