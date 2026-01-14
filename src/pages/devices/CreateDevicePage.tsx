import React, { useState } from 'react'
import { Form, Input, Button, Card, Typography, Space, Alert, Result, Steps } from 'antd'
import { ArrowLeftOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useDevices } from '@/hooks'
import { CopyableKey } from '@/components'
import type { CreateDeviceRequest, CreateDeviceResponse } from '@/types'

const { Title, Paragraph } = Typography

export const CreateDevicePage: React.FC = () => {
  const navigate = useNavigate()
  const { createDevice, createLoading } = useDevices()
  const [form] = Form.useForm()
  const [currentStep, setCurrentStep] = useState(0)
  const [createdDevice, setCreatedDevice] = useState<CreateDeviceResponse | null>(null)

  const handleSubmit = async (values: CreateDeviceRequest) => {
    try {
      const response = await createDevice(values)
      setCreatedDevice(response)
      setCurrentStep(1)
    } catch {
      // 错误已在 hook 中处理
    }
  }

  const handleFinish = () => {
    navigate(`/devices/${createdDevice?.device.id}`)
  }

  const handleAddAnother = () => {
    setCurrentStep(0)
    setCreatedDevice(null)
    form.resetFields()
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Space style={{ marginBottom: 24 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/devices')}>
          返回列表
        </Button>
      </Space>

      <Steps
        current={currentStep}
        items={[
          { title: '填写信息' },
          { title: '保存密钥' },
        ]}
        style={{ marginBottom: 24 }}
      />

      {currentStep === 0 && (
        <Card title="创建新设备">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              metadata: {},
            }}
          >
            <Form.Item
              name="name"
              label="设备名称"
              rules={[
                { required: true, message: '请输入设备名称' },
                { max: 100, message: '设备名称不能超过 100 个字符' },
              ]}
            >
              <Input placeholder="例如：客厅传感器" />
            </Form.Item>

            <Form.Item
              name="device_type"
              label="设备类型"
              rules={[
                { required: true, message: '请输入设备类型' },
                { max: 50, message: '设备类型不能超过 50 个字符' },
              ]}
            >
              <Input placeholder="例如：battery_sensor" />
            </Form.Item>

            <Form.Item
              name={['metadata', 'location']}
              label="位置（可选）"
            >
              <Input placeholder="例如：living_room" />
            </Form.Item>

            <Form.Item
              name={['metadata', 'description']}
              label="描述（可选）"
            >
              <Input.TextArea rows={3} placeholder="设备描述信息" />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" loading={createLoading}>
                  创建设备
                </Button>
                <Button onClick={() => navigate('/devices')}>取消</Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      )}

      {currentStep === 1 && createdDevice && (
        <Card>
          <Result
            icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            title="设备创建成功！"
            subTitle={`设备 "${createdDevice.device.name}" 已成功创建`}
          />

          <Alert
            message="重要提示"
            description="请立即保存以下 API Key，此密钥仅显示一次，关闭后将无法再次查看。"
            type="warning"
            showIcon
            style={{ marginBottom: 24 }}
          />

          <div style={{ marginBottom: 24 }}>
            <Title level={5}>API Key</Title>
            <CopyableKey value={createdDevice.api_key} label="API Key" />
            <Paragraph type="secondary" style={{ marginTop: 8 }}>
              设备需要使用此 API Key 进行认证，请妥善保管。
            </Paragraph>
          </div>

          <div style={{ marginBottom: 24 }}>
            <Title level={5}>设备配置</Title>
            <Card size="small" style={{ background: '#f5f5f5' }}>
              <p><strong>设备 ID：</strong>{createdDevice.device.id}</p>
              <p><strong>低电量阈值：</strong>{createdDevice.config.low_battery_threshold}%</p>
              <p><strong>临界电量阈值：</strong>{createdDevice.config.critical_battery_threshold}%</p>
              <p><strong>高温阈值：</strong>{createdDevice.config.high_temperature_threshold}℃</p>
              <p><strong>上报间隔：</strong>{createdDevice.config.report_interval_seconds} 秒</p>
            </Card>
          </div>

          <Space>
            <Button type="primary" onClick={handleFinish}>
              查看设备详情
            </Button>
            <Button onClick={handleAddAnother}>继续添加设备</Button>
            <Button onClick={() => navigate('/devices')}>返回列表</Button>
          </Space>
        </Card>
      )}
    </div>
  )
}
