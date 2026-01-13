import React, { useEffect, useState } from 'react'
import {
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
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons'
import { alertsApi } from '@/api'
import { LoadingSpinner } from '@/components'
import { formatDateTime, ALERT_LEVEL_COLORS } from '@/utils'
import type { AlertRule, CreateAlertRuleRequest, AlertType, AlertLevel } from '@/types'
import { AlertTypeLabels, AlertLevelLabels } from '@/types'
import type { ColumnsType } from 'antd/es/table'

const { Title } = Typography

export const AlertRulesPage: React.FC = () => {
  const [form] = Form.useForm()
  const [rules, setRules] = useState<AlertRule[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<AlertRule | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadRules()
  }, [])

  const loadRules = async () => {
    setLoading(true)
    try {
      const data = await alertsApi.getAlertRules()
      setRules(data)
    } catch (error) {
      message.error('加载预警规则失败')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditing(null)
    form.resetFields()
    form.setFieldsValue({
      enabled: true,
      cooldown_minutes: 30,
    })
    setModalOpen(true)
  }

  const handleEdit = (rule: AlertRule) => {
    setEditing(rule)
    form.setFieldsValue(rule)
    setModalOpen(true)
  }

  const handleSubmit = async (values: CreateAlertRuleRequest) => {
    setSaving(true)
    try {
      if (editing) {
        await alertsApi.updateAlertRule(editing.id, values)
        message.success('规则已更新')
      } else {
        await alertsApi.createAlertRule(values)
        message.success('规则已创建')
      }
      setModalOpen(false)
      form.resetFields()
      loadRules()
    } catch (error) {
      message.error(editing ? '更新规则失败' : '创建规则失败')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await alertsApi.deleteAlertRule(id)
      message.success('规则已删除')
      loadRules()
    } catch (error) {
      message.error('删除规则失败')
    }
  }

  const handleToggle = async (rule: AlertRule) => {
    try {
      await alertsApi.updateAlertRule(rule.id, { enabled: !rule.enabled })
      message.success(rule.enabled ? '规则已禁用' : '规则已启用')
      loadRules()
    } catch (error) {
      message.error('操作失败')
    }
  }

  const columns: ColumnsType<AlertRule> = [
    {
      title: '规则名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '预警类型',
      dataIndex: 'alert_type',
      key: 'alert_type',
      render: (type: AlertType) => AlertTypeLabels[type] || type,
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      render: (level: AlertLevel) => (
        <Tag color={ALERT_LEVEL_COLORS[level]}>{AlertLevelLabels[level]}</Tag>
      ),
    },
    {
      title: '阈值',
      dataIndex: 'threshold_value',
      key: 'threshold_value',
      render: (value: number, record: AlertRule) => {
        if (record.alert_type.includes('battery')) {
          return `${value}%`
        }
        if (record.alert_type === 'high_temperature') {
          return `${value}°C`
        }
        return value
      },
    },
    {
      title: '冷却时间',
      dataIndex: 'cooldown_minutes',
      key: 'cooldown_minutes',
      render: (minutes: number) => `${minutes} 分钟`,
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean, record: AlertRule) => (
        <Switch
          checked={enabled}
          onChange={() => handleToggle(record)}
          checkedChildren="启用"
          unCheckedChildren="禁用"
        />
      ),
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
      render: (_: unknown, record: AlertRule) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定要删除此规则吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="删除"
            cancelText="取消"
            okButtonProps={{ danger: true }}
          >
            <Button type="link" danger size="small" icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const alertTypeOptions: { label: string; value: AlertType }[] = [
    { label: '低电量', value: 'low_battery' },
    { label: '临界电量', value: 'critical_battery' },
    { label: '高温', value: 'high_temperature' },
    { label: '设备离线', value: 'device_offline' },
    { label: '电量快速下降', value: 'rapid_drain' },
  ]

  const alertLevelOptions: { label: string; value: AlertLevel }[] = [
    { label: '信息', value: 'info' },
    { label: '警告', value: 'warning' },
    { label: '严重', value: 'critical' },
  ]

  if (loading && rules.length === 0) {
    return <LoadingSpinner />
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>
          预警规则
        </Title>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={loadRules}>
            刷新
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            创建规则
          </Button>
        </Space>
      </div>

      <Table columns={columns} dataSource={rules} rowKey="id" loading={loading} pagination={false} />

      {/* 创建/编辑规则弹窗 */}
      <Modal
        title={editing ? '编辑预警规则' : '创建预警规则'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={500}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="规则名称"
            rules={[
              { required: true, message: '请输入规则名称' },
              { max: 100, message: '名称不能超过 100 个字符' },
            ]}
          >
            <Input placeholder="例如：低电量预警" />
          </Form.Item>

          <Form.Item
            name="alert_type"
            label="预警类型"
            rules={[{ required: true, message: '请选择预警类型' }]}
          >
            <Select placeholder="选择预警类型" options={alertTypeOptions} />
          </Form.Item>

          <Form.Item
            name="level"
            label="预警级别"
            rules={[{ required: true, message: '请选择预警级别' }]}
          >
            <Select placeholder="选择预警级别" options={alertLevelOptions} />
          </Form.Item>

          <Form.Item
            name="threshold_value"
            label="触发阈值"
            rules={[{ required: true, message: '请输入触发阈值' }]}
            extra="电量阈值为百分比（0-100），温度阈值为摄氏度"
          >
            <InputNumber min={0} max={100} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="cooldown_minutes"
            label="冷却时间（分钟）"
            rules={[
              { required: true, message: '请输入冷却时间' },
              { type: 'number', min: 1, max: 1440, message: '范围为 1-1440 分钟' },
            ]}
            extra="触发预警后，在冷却时间内不会重复触发"
          >
            <InputNumber min={1} max={1440} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="enabled" label="启用规则" valuePropName="checked">
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={saving}>
                {editing ? '保存' : '创建'}
              </Button>
              <Button onClick={() => setModalOpen(false)}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
