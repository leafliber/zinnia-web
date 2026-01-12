import React, { useEffect, useState } from 'react'
import { Table, Tag, Button, Space, Input, Select, Typography, Tooltip, Progress } from 'antd'
import {
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  ThunderboltOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useDevices } from '@/hooks'
import { batteryApi } from '@/api'
import {
  DEVICE_STATUS_COLORS,
  DEVICE_STATUS_TEXT,
  formatDateTime,
  formatRelativeTime,
  getBatteryColor,
} from '@/utils'
import type { Device, DeviceStatus, LatestBattery } from '@/types'
import type { ColumnsType } from 'antd/es/table'

const { Title } = Typography

export const DeviceListPage: React.FC = () => {
  const navigate = useNavigate()
  const { devices, pagination, isLoading, filters, setFilters, fetchDevices, changePage } =
    useDevices()

  const [searchText, setSearchText] = useState('')
  const [batteryData, setBatteryData] = useState<Record<string, LatestBattery>>({})

  useEffect(() => {
    fetchDevices()
  }, [])

  useEffect(() => {
    // 加载各设备的电量数据
    const loadBatteryData = async () => {
      const data: Record<string, LatestBattery> = {}
      for (const device of devices) {
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

  const handleSearch = () => {
    // 客户端过滤（如需服务端搜索，可以添加 search 参数到 API）
    fetchDevices()
  }

  const handleStatusFilter = (status: DeviceStatus | undefined) => {
    setFilters({ status, page: 1 })
    fetchDevices()
  }

  const columns: ColumnsType<Device> = [
    {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Device) => (
        <a onClick={() => navigate(`/devices/${record.id}`)}>{name}</a>
      ),
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) =>
        record.name.toLowerCase().includes(String(value).toLowerCase()),
    },
    {
      title: '类型',
      dataIndex: 'device_type',
      key: 'device_type',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: DeviceStatus) => (
        <Tag color={DEVICE_STATUS_COLORS[status]}>{DEVICE_STATUS_TEXT[status]}</Tag>
      ),
    },
    {
      title: '电量',
      key: 'battery',
      render: (_: unknown, record: Device) => {
        const battery = batteryData[record.id]
        if (!battery) return '-'
        return (
          <Space>
            <Progress
              type="circle"
              percent={battery.battery_level}
              size={40}
              strokeColor={getBatteryColor(battery.battery_level)}
              format={(percent) => `${percent}%`}
            />
            {battery.is_charging && (
              <Tooltip title="充电中">
                <ThunderboltOutlined style={{ color: '#52c41a' }} />
              </Tooltip>
            )}
          </Space>
        )
      },
    },
    {
      title: 'API Key 前缀',
      dataIndex: 'api_key_prefix',
      key: 'api_key_prefix',
      render: (prefix: string) => (
        <code style={{ fontSize: 12, color: '#666' }}>{prefix}</code>
      ),
    },
    {
      title: '最后活跃',
      dataIndex: 'last_seen_at',
      key: 'last_seen_at',
      render: (time: string | null) => (
        <Tooltip title={time ? formatDateTime(time) : '从未上线'}>
          {time ? formatRelativeTime(time) : '-'}
        </Tooltip>
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
      render: (_: unknown, record: Device) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/devices/${record.id}`)}
        >
          查看
        </Button>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>
          设备列表
        </Title>
        <Space>
          <Input
            placeholder="搜索设备名称"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={handleSearch}
            style={{ width: 200 }}
          />
          <Select
            placeholder="状态筛选"
            allowClear
            style={{ width: 120 }}
            value={filters.status}
            onChange={handleStatusFilter}
            options={[
              { label: '全部', value: undefined },
              { label: '在线', value: 'online' },
              { label: '离线', value: 'offline' },
              { label: '维护中', value: 'maintenance' },
              { label: '已禁用', value: 'disabled' },
            ]}
          />
          <Button icon={<ReloadOutlined />} onClick={() => fetchDevices()}>
            刷新
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/devices/new')}>
            创建设备
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={devices}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: pagination.page,
          pageSize: pagination.page_size,
          total: pagination.total_items,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 个设备`,
          onChange: changePage,
        }}
      />
    </div>
  )
}
