import React, { useEffect, useState, useCallback } from 'react'
import {
  Card,
  Descriptions,
  Tag,
  Button,
  Space,
  Tabs,
  Typography,
  Popconfirm,
  message,
  DatePicker,
  Select,
  Progress,
} from 'antd'
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  ReloadOutlined,
  KeyOutlined,
  SettingOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { devicesApi, batteryApi } from '@/api'
import { BatteryChart, StatsCard, LoadingSpinner } from '@/components'
import {
  DEVICE_STATUS_COLORS,
  DEVICE_STATUS_TEXT,
  formatDateTime,
  formatRelativeTime,
  getBatteryColor,
} from '@/utils'
import type { Device, LatestBattery, BatteryStats, AggregatedBatteryData, AggregationInterval } from '@/types'

const { Title } = Typography
const { RangePicker } = DatePicker

export const DeviceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [device, setDevice] = useState<Device | null>(null)
  const [latestBattery, setLatestBattery] = useState<LatestBattery | null>(null)
  const [batteryStats, setBatteryStats] = useState<BatteryStats | null>(null)
  const [chartData, setChartData] = useState<AggregatedBatteryData[]>([])
  const [loading, setLoading] = useState(true)
  const [chartLoading, setChartLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(24, 'hour'),
    dayjs(),
  ])
  const [interval, setInterval] = useState<AggregationInterval>('hour')

  const loadDeviceData = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const [deviceData, batteryData] = await Promise.all([
        devicesApi.getDevice(id),
        batteryApi.getLatestBattery(id).catch(() => null),
      ])
      setDevice(deviceData)
      setLatestBattery(batteryData)
    } catch {
      message.error('加载设备数据失败')
      navigate('/devices')
    } finally {
      setLoading(false)
    }
  }, [id, navigate])

  const loadChartData = useCallback(async () => {
    if (!id) return
    setChartLoading(true)
    try {
      const [aggregated, stats] = await Promise.all([
        batteryApi.getAggregatedBattery(id, {
          start_time: dateRange[0].toISOString(),
          end_time: dateRange[1].toISOString(),
          interval,
        }),
        batteryApi.getBatteryStats(id, {
          start_time: dateRange[0].toISOString(),
          end_time: dateRange[1].toISOString(),
        }),
      ])
      setChartData(aggregated)
      setBatteryStats(stats)
    } catch {
      // 忽略错误
    } finally {
      setChartLoading(false)
    }
  }, [id, dateRange, interval])

  useEffect(() => {
    if (id) {
      loadDeviceData()
    }
  }, [id, loadDeviceData])

  useEffect(() => {
    if (id) {
      loadChartData()
    }
  }, [id, loadChartData])

  const handleDelete = async () => {
    if (!id) return
    setDeleteLoading(true)
    try {
      await devicesApi.deleteDevice(id)
      message.success('设备已删除')
      navigate('/devices')
    } catch {
      message.error('删除设备失败')
    } finally {
      setDeleteLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!device) {
    return null
  }

  const tabItems = [
    {
      key: 'overview',
      label: '概览',
      children: (
        <div>
          <Card title="设备信息" style={{ marginBottom: 16 }}>
            <Descriptions column={{ xs: 1, sm: 2, md: 3 }}>
              <Descriptions.Item label="设备名称">{device.name}</Descriptions.Item>
              <Descriptions.Item label="设备类型">{device.device_type}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={DEVICE_STATUS_COLORS[device.status]}>
                  {DEVICE_STATUS_TEXT[device.status]}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="API Key 前缀">
                <code>{device.api_key_prefix}</code>
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {formatDateTime(device.created_at)}
              </Descriptions.Item>
              <Descriptions.Item label="最后活跃">
                {device.last_seen_at ? formatRelativeTime(device.last_seen_at) : '-'}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {latestBattery && (
            <Card title="当前电量" style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                <Progress
                  type="circle"
                  percent={latestBattery.battery_level}
                  size={120}
                  strokeColor={getBatteryColor(latestBattery.battery_level)}
                  format={(percent) => (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 24, fontWeight: 'bold' }}>{percent}%</div>
                      {latestBattery.is_charging && (
                        <div style={{ color: '#52c41a' }}>
                          <ThunderboltOutlined /> 充电中
                        </div>
                      )}
                    </div>
                  )}
                />
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="低电量">
                    <Tag color={latestBattery.is_low_battery ? 'orange' : 'green'}>
                      {latestBattery.is_low_battery ? '是' : '否'}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="临界状态">
                    <Tag color={latestBattery.is_critical ? 'red' : 'green'}>
                      {latestBattery.is_critical ? '是' : '否'}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="省电模式">
                    {latestBattery.power_saving_mode}
                  </Descriptions.Item>
                  <Descriptions.Item label="上报时间">
                    {formatDateTime(latestBattery.recorded_at)}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            </Card>
          )}
        </div>
      ),
    },
    {
      key: 'history',
      label: '电量历史',
      children: (
        <div>
          <Card style={{ marginBottom: 16 }}>
            <Space>
              <RangePicker
                showTime
                value={dateRange}
                onChange={(dates) => {
                  if (dates && dates[0] && dates[1]) {
                    setDateRange([dates[0], dates[1]])
                  }
                }}
              />
              <Select
                value={interval}
                onChange={setInterval}
                style={{ width: 120 }}
                options={[
                  { label: '按分钟', value: 'minute' },
                  { label: '按小时', value: 'hour' },
                  { label: '按天', value: 'day' },
                ]}
              />
              <Button icon={<ReloadOutlined />} onClick={loadChartData}>
                刷新
              </Button>
            </Space>
          </Card>

          <BatteryChart data={chartData} loading={chartLoading} />

          <div style={{ marginTop: 16 }}>
            <StatsCard stats={batteryStats} loading={chartLoading} />
          </div>
        </div>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/devices')}>
            返回
          </Button>
          <Title level={4} style={{ margin: 0 }}>
            {device.name}
          </Title>
          <Tag color={DEVICE_STATUS_COLORS[device.status]}>
            {DEVICE_STATUS_TEXT[device.status]}
          </Tag>
        </Space>

        <Space>
          <Button icon={<ReloadOutlined />} onClick={loadDeviceData}>
            刷新
          </Button>
          <Button icon={<KeyOutlined />} onClick={() => navigate(`/devices/${id}/tokens`)}>
            令牌管理
          </Button>
          <Button icon={<SettingOutlined />} onClick={() => navigate(`/devices/${id}/config`)}>
            配置
          </Button>
          <Popconfirm
            title="确定要删除此设备吗？"
            description="删除后所有数据将无法恢复"
            onConfirm={handleDelete}
            okText="删除"
            cancelText="取消"
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<DeleteOutlined />} loading={deleteLoading}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      </div>

      <Tabs items={tabItems} defaultActiveKey="overview" />
    </div>
  )
}
