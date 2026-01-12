import React, { useEffect, useState } from 'react'
import { Table, Button, Space, Typography, Tag, Select, message, Tooltip } from 'antd'
import {
  ReloadOutlined,
  CheckCircleOutlined,
  CheckOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { alertsApi } from '@/api'
import { LoadingSpinner } from '@/components'
import { formatDateTime, formatRelativeTime, ALERT_LEVEL_COLORS, ALERT_STATUS_COLORS } from '@/utils'
import type { AlertEvent, AlertLevel, AlertStatus } from '@/types'
import { AlertTypeLabels, AlertLevelLabels, AlertStatusLabels } from '@/types'
import type { ColumnsType } from 'antd/es/table'

const { Title } = Typography

export const AlertEventsPage: React.FC = () => {
  const navigate = useNavigate()
  const [events, setEvents] = useState<AlertEvent[]>([])
  const [pagination, setPagination] = useState({ page: 1, page_size: 20, total: 0 })
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<{
    level?: AlertLevel
    status?: AlertStatus
  }>({})

  useEffect(() => {
    loadEvents()
  }, [filters, pagination.page, pagination.page_size])

  const loadEvents = async () => {
    setLoading(true)
    try {
      const response = await alertsApi.getAlertEvents({
        ...filters,
        page: pagination.page,
        page_size: pagination.page_size,
      })
      setEvents(response.items)
      setPagination((prev) => ({
        ...prev,
        total: response.pagination.total_items,
      }))
    } catch (error) {
      message.error('加载预警事件失败')
    } finally {
      setLoading(false)
    }
  }

  const handleAcknowledge = async (id: string) => {
    try {
      await alertsApi.acknowledgeAlert(id)
      message.success('预警已确认')
      loadEvents()
    } catch (error) {
      message.error('操作失败')
    }
  }

  const handleResolve = async (id: string) => {
    try {
      await alertsApi.resolveAlert(id)
      message.success('预警已解决')
      loadEvents()
    } catch (error) {
      message.error('操作失败')
    }
  }

  const columns: ColumnsType<AlertEvent> = [
    {
      title: '预警消息',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
    },
    {
      title: '类型',
      dataIndex: 'alert_type',
      key: 'alert_type',
      render: (type: string) => AlertTypeLabels[type as keyof typeof AlertTypeLabels] || type,
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
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: AlertStatus) => (
        <Tag color={ALERT_STATUS_COLORS[status]}>{AlertStatusLabels[status]}</Tag>
      ),
    },
    {
      title: '当前值',
      key: 'value',
      render: (_: unknown, record: AlertEvent) => (
        <span>
          {record.value} / {record.threshold}
        </span>
      ),
    },
    {
      title: '触发时间',
      dataIndex: 'triggered_at',
      key: 'triggered_at',
      render: (time: string) => (
        <Tooltip title={formatDateTime(time)}>{formatRelativeTime(time)}</Tooltip>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: AlertEvent) => (
        <Space>
          <Tooltip title="查看设备">
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/devices/${record.device_id}`)}
            />
          </Tooltip>
          {record.status === 'active' && (
            <Button
              type="link"
              size="small"
              icon={<CheckOutlined />}
              onClick={() => handleAcknowledge(record.id)}
            >
              确认
            </Button>
          )}
          {record.status !== 'resolved' && (
            <Button
              type="link"
              size="small"
              icon={<CheckCircleOutlined />}
              onClick={() => handleResolve(record.id)}
            >
              解决
            </Button>
          )}
        </Space>
      ),
    },
  ]

  const levelOptions = [
    { label: '全部级别', value: undefined },
    { label: '信息', value: 'info' },
    { label: '警告', value: 'warning' },
    { label: '严重', value: 'critical' },
  ]

  const statusOptions = [
    { label: '全部状态', value: undefined },
    { label: '活跃', value: 'active' },
    { label: '已确认', value: 'acknowledged' },
    { label: '已解决', value: 'resolved' },
  ]

  if (loading && events.length === 0) {
    return <LoadingSpinner />
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>
          预警事件
        </Title>
        <Space>
          <Select
            placeholder="级别筛选"
            allowClear
            style={{ width: 120 }}
            value={filters.level}
            onChange={(value) => setFilters({ ...filters, level: value })}
            options={levelOptions}
          />
          <Select
            placeholder="状态筛选"
            allowClear
            style={{ width: 120 }}
            value={filters.status}
            onChange={(value) => setFilters({ ...filters, status: value })}
            options={statusOptions}
          />
          <Button icon={<ReloadOutlined />} onClick={loadEvents}>
            刷新
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={events}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.page,
          pageSize: pagination.page_size,
          total: pagination.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
          onChange: (page, pageSize) => {
            setPagination({ ...pagination, page, page_size: pageSize })
          },
        }}
      />
    </div>
  )
}
