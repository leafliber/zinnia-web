import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Statistic, List, Tag, Button, Space, Typography, Empty } from 'antd'
import {
  DesktopOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  ThunderboltOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useDevices } from '@/hooks'
import { alertsApi, batteryApi } from '@/api'
import { LoadingSpinner } from '@/components'
import { DEVICE_STATUS_COLORS, DEVICE_STATUS_TEXT, formatRelativeTime, getBatteryColor } from '@/utils'
import type { AlertEvent, LatestBattery } from '@/types'
import { DEVICE_LIST_DISPLAY_LIMIT, DASHBOARD_DEVICE_DISPLAY_LIMIT, BATTERY_LOW_THRESHOLD } from '@/utils/constants'

const { Title, Text } = Typography

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const { devices, isLoading, fetchDevices } = useDevices()
  const [alerts, setAlerts] = useState<AlertEvent[]>([])
  const [batteryData, setBatteryData] = useState<Record<string, LatestBattery>>({})
  const [alertsLoading, setAlertsLoading] = useState(false)

  useEffect(() => {
    fetchDevices()
    loadAlerts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // 加载各设备的电量数据
    const loadBatteryData = async () => {
      const data: Record<string, LatestBattery> = {}
      for (const device of devices.slice(0, DEVICE_LIST_DISPLAY_LIMIT)) {
        try {
          const battery = await batteryApi.getLatestBattery(device.id)
          data[device.id] = battery
        } catch {
          // 忽略错误
        }
      }
      setBatteryData(data)
    }

    if (devices.length > 0) {
      loadBatteryData()
    }
  }, [devices])

  const loadAlerts = async () => {
    setAlertsLoading(true)
    try {
      const response = await alertsApi.getAlertEvents({
        status: 'active',
        page_size: 5,
      })
      setAlerts(response.items)
    } catch {
      // 忽略错误
    } finally {
      setAlertsLoading(false)
    }
  }

  // 统计数据
  const onlineCount = devices.filter((d) => d.status === 'online').length
  const offlineCount = devices.filter((d) => d.status === 'offline').length
  const alertCount = alerts.length
  const lowBatteryDevices = devices.filter((d) => {
    const battery = batteryData[d.id]
    return battery && battery.battery_level < BATTERY_LOW_THRESHOLD
  })

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>
          仪表盘
        </Title>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => { fetchDevices(); loadAlerts(); }}>
            刷新
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/devices/new')}>
            添加设备
          </Button>
        </Space>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="设备总数"
              value={devices.length}
              prefix={<DesktopOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="在线设备"
              value={onlineCount}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="离线设备"
              value={offlineCount}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#999' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="活跃预警"
              value={alertCount}
              prefix={<WarningOutlined />}
              valueStyle={{ color: alertCount > 0 ? '#ff4d4f' : '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 低电量设备 */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <ThunderboltOutlined style={{ color: '#faad14' }} />
                <span>低电量设备</span>
              </Space>
            }
            extra={
              <Button type="link" onClick={() => navigate('/devices')}>
                查看全部
              </Button>
            }
          >
            {lowBatteryDevices.length === 0 ? (
              <Empty description="暂无低电量设备" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              <List
                dataSource={lowBatteryDevices}
                renderItem={(device) => {
                  const battery = batteryData[device.id]
                  return (
                    <List.Item
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/devices/${device.id}`)}
                    >
                      <List.Item.Meta
                        title={device.name}
                        description={`类型：${device.device_type}`}
                      />
                      <Tag color={getBatteryColor(battery?.battery_level || 0)}>
                        {battery?.battery_level || 0}%
                      </Tag>
                    </List.Item>
                  )
                }}
              />
            )}
          </Card>
        </Col>

        {/* 最新预警 */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <WarningOutlined style={{ color: '#ff4d4f' }} />
                <span>最新预警</span>
              </Space>
            }
            extra={
              <Button type="link" onClick={() => navigate('/alerts/events')}>
                查看全部
              </Button>
            }
            loading={alertsLoading}
          >
            {alerts.length === 0 ? (
              <Empty description="暂无活跃预警" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              <List
                dataSource={alerts}
                renderItem={(alert) => (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <Space>
                          <Tag
                            color={
                              alert.level === 'critical'
                                ? 'red'
                                : alert.level === 'warning'
                                ? 'orange'
                                : 'blue'
                            }
                          >
                            {alert.level === 'critical'
                              ? '严重'
                              : alert.level === 'warning'
                              ? '警告'
                              : '信息'}
                          </Tag>
                          <span>{alert.message}</span>
                        </Space>
                      }
                      description={formatRelativeTime(alert.triggered_at)}
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
      </Row>

      {/* 最近设备 */}
      <Card
        title="最近设备"
        style={{ marginTop: 16 }}
        extra={
          <Button type="link" onClick={() => navigate('/devices')}>
            查看全部
          </Button>
        }
      >
        {devices.length === 0 ? (
          <Empty description="暂无设备">
            <Button type="primary" onClick={() => navigate('/devices/new')}>
              添加第一个设备
            </Button>
          </Empty>
        ) : (
          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4 }}
            dataSource={devices.slice(0, DASHBOARD_DEVICE_DISPLAY_LIMIT)}
            renderItem={(device) => {
              const battery = batteryData[device.id]
              return (
                <List.Item>
                  <Card
                    size="small"
                    hoverable
                    onClick={() => navigate(`/devices/${device.id}`)}
                  >
                    <Card.Meta
                      title={
                        <Space>
                          <span>{device.name}</span>
                          <Tag color={DEVICE_STATUS_COLORS[device.status]}>
                            {DEVICE_STATUS_TEXT[device.status]}
                          </Tag>
                        </Space>
                      }
                      description={
                        <Space direction="vertical" size={0}>
                          <Text type="secondary">{device.device_type}</Text>
                          {battery && (
                            <Text style={{ color: getBatteryColor(battery.battery_level) }}>
                              <ThunderboltOutlined /> {battery.battery_level}%
                              {battery.is_charging && ' 充电中'}
                            </Text>
                          )}
                        </Space>
                      }
                    />
                  </Card>
                </List.Item>
              )
            }}
          />
        )}
      </Card>
    </div>
  )
}
