import React, { useEffect, useState } from 'react'
import {
  Card,
  Form,
  InputNumber,
  Switch,
  Button,
  Space,
  Typography,
  message,
  Alert,
} from 'antd'
import { ArrowLeftOutlined, SaveOutlined, ReloadOutlined, KeyOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { devicesApi } from '@/api'
import { CopyableKey, LoadingSpinner } from '@/components'
import type { DeviceConfig, UpdateDeviceConfigRequest, RotateKeyResponse } from '@/types'

const { Title } = Typography

export const DeviceConfigPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const [config, setConfig] = useState<DeviceConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [rotating, setRotating] = useState(false)
  const [newApiKey, setNewApiKey] = useState<RotateKeyResponse | null>(null)

  useEffect(() => {
    if (id) {
      loadConfig()
    }
  }, [id])

  const loadConfig = async () => {
    if (!id) return
    setLoading(true)
    try {
      const data = await devicesApi.getDeviceConfig(id)
      setConfig(data)
      form.setFieldsValue(data)
    } catch (error) {
      message.error('加载配置失败')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (values: UpdateDeviceConfigRequest) => {
    if (!id) return
    setSaving(true)
    try {
      const updated = await devicesApi.updateDeviceConfig(id, values)
      setConfig(updated)
      message.success('配置已保存')
    } catch (error) {
      message.error('保存配置失败')
    } finally {
      setSaving(false)
    }
  }

  const handleRotateKey = async () => {
    if (!id) return
    setRotating(true)
    try {
      const response = await devicesApi.rotateDeviceKey(id)
      setNewApiKey(response)
      message.success('API Key 已轮换')
    } catch (error) {
      message.error('轮换密钥失败')
    } finally {
      setRotating(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Space style={{ marginBottom: 24 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(`/devices/${id}`)}>
          返回详情
        </Button>
        <Title level={4} style={{ margin: 0 }}>
          设备配置
        </Title>
      </Space>

      {/* 阈值配置 */}
      <Card title="阈值配置" style={{ marginBottom: 16 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={config || {}}
        >
          <Form.Item
            name="low_battery_threshold"
            label="低电量阈值（%）"
            rules={[
              { required: true, message: '请输入低电量阈值' },
              { type: 'number', min: 1, max: 100, message: '阈值范围为 1-100' },
            ]}
            extra="当电量低于此值时，触发低电量预警"
          >
            <InputNumber min={1} max={100} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="critical_battery_threshold"
            label="临界电量阈值（%）"
            rules={[
              { required: true, message: '请输入临界电量阈值' },
              { type: 'number', min: 1, max: 100, message: '阈值范围为 1-100' },
            ]}
            extra="当电量低于此值时，触发临界电量预警"
          >
            <InputNumber min={1} max={100} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="high_temperature_threshold"
            label="高温阈值（℃）"
            rules={[
              { required: true, message: '请输入高温阈值' },
              { type: 'number', min: -40, max: 200, message: '阈值范围为 -40℃ 到 200℃' },
            ]}
            extra="当温度高于此值时，触发高温预警"
          >
            <InputNumber min={-40} max={200} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="report_interval_seconds"
            label="上报间隔（秒）"
            rules={[
              { required: true, message: '请输入上报间隔' },
              { type: 'number', min: 10, max: 3600, message: '间隔范围为 10-3600 秒' },
            ]}
            extra="设备上报电量数据的间隔时间"
          >
            <InputNumber min={10} max={3600} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={saving}>
                保存配置
              </Button>
              <Button icon={<ReloadOutlined />} onClick={loadConfig}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/* 密钥轮换 */}
      <Card title="API Key 管理">
        <Alert
          message="密钥轮换说明"
          description="轮换 API Key 后，旧密钥将立即失效。请确保在轮换后及时更新设备配置。"
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />

        {newApiKey ? (
          <div style={{ marginBottom: 16 }}>
            <Alert
              message="新密钥已生成"
              description="请立即保存以下 API Key，此密钥仅显示一次。"
              type="success"
              showIcon
              style={{ marginBottom: 16 }}
            />
            <CopyableKey value={newApiKey.api_key} label="新 API Key" />
          </div>
        ) : (
          <Button
            danger
            icon={<KeyOutlined />}
            onClick={handleRotateKey}
            loading={rotating}
          >
            轮换 API Key
          </Button>
        )}
      </Card>
    </div>
  )
}
