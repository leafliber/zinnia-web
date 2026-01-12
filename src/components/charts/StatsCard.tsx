import React from 'react'
import { Card, Statistic, Progress, Space, Tag } from 'antd'
import {
  ThunderboltOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import { formatDuration, getBatteryColor } from '@/utils'
import type { BatteryStats } from '@/types'

interface StatsCardProps {
  stats: BatteryStats | null
  loading?: boolean
}

export const StatsCard: React.FC<StatsCardProps> = ({ stats, loading = false }) => {
  if (!stats) {
    return (
      <Card loading={loading} title="统计摘要">
        <div style={{ textAlign: 'center', color: '#999' }}>暂无数据</div>
      </Card>
    )
  }

  return (
    <Card title="统计摘要" loading={loading}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <Statistic
            title="平均电量"
            value={stats.avg_battery_level}
            precision={1}
            suffix="%"
            prefix={<ThunderboltOutlined />}
            valueStyle={{ color: getBatteryColor(stats.avg_battery_level) }}
          />
          <Statistic
            title="最高电量"
            value={stats.max_battery_level}
            suffix="%"
            prefix={<ArrowUpOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
          <Statistic
            title="最低电量"
            value={stats.min_battery_level}
            suffix="%"
            prefix={<ArrowDownOutlined />}
            valueStyle={{ color: stats.min_battery_level < 20 ? '#ff4d4f' : '#1890ff' }}
          />
        </div>

        <div>
          <div style={{ marginBottom: 8 }}>
            <span>电量范围</span>
          </div>
          <Progress
            percent={stats.max_battery_level}
            success={{ percent: stats.min_battery_level }}
            strokeColor={getBatteryColor(stats.avg_battery_level)}
            format={() => `${stats.min_battery_level}% - ${stats.max_battery_level}%`}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <ClockCircleOutlined style={{ marginRight: 8 }} />
            <span>充电时长：</span>
            <Tag color="green">{formatDuration(stats.charging_duration_minutes)}</Tag>
          </div>
          <div>
            <span>低电量次数：</span>
            <Tag color={stats.low_battery_count > 0 ? 'orange' : 'green'}>
              {stats.low_battery_count} 次
            </Tag>
          </div>
          <div>
            <span>记录数：</span>
            <Tag color="blue">{stats.total_records}</Tag>
          </div>
        </div>
      </Space>
    </Card>
  )
}
