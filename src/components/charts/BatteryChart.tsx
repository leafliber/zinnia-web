import React, { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import { Card, Empty } from 'antd'
import dayjs from 'dayjs'
import type { AggregatedBatteryData } from '@/types'

interface BatteryChartProps {
  data: AggregatedBatteryData[]
  loading?: boolean
  title?: string
  height?: number
}

export const BatteryChart: React.FC<BatteryChartProps> = ({
  data,
  loading = false,
  title = '电量趋势',
  height = 400,
}) => {
  const option = useMemo(() => {
    if (!data || data.length === 0) {
      return null
    }

    const xAxisData = data.map((item) => dayjs(item.bucket).format('MM-DD HH:mm'))
    const avgData = data.map((item) => item.avg_level)
    const minData = data.map((item) => item.min_level)
    const maxData = data.map((item) => item.max_level)

    return {
      tooltip: {
        trigger: 'axis',
        formatter: (params: { name: string; data: number; seriesName: string; color: string }[]) => {
          let result = `<div style="font-weight: bold">${params[0].name}</div>`
          params.forEach((param) => {
            result += `<div>
              <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${param.color};margin-right:5px;"></span>
              ${param.seriesName}: ${param.data.toFixed(1)}%
            </div>`
          })
          return result
        },
      },
      legend: {
        data: ['平均电量', '最低电量', '最高电量'],
        bottom: 0,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '10%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xAxisData,
        axisLabel: {
          rotate: 45,
          fontSize: 10,
        },
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 100,
        axisLabel: {
          formatter: '{value}%',
        },
      },
      series: [
        {
          name: '平均电量',
          type: 'line',
          data: avgData,
          smooth: true,
          lineStyle: {
            width: 2,
            color: '#1890ff',
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
                { offset: 1, color: 'rgba(24, 144, 255, 0.05)' },
              ],
            },
          },
          itemStyle: {
            color: '#1890ff',
          },
        },
        {
          name: '最低电量',
          type: 'line',
          data: minData,
          smooth: true,
          lineStyle: {
            width: 1,
            type: 'dashed',
            color: '#ff4d4f',
          },
          itemStyle: {
            color: '#ff4d4f',
          },
        },
        {
          name: '最高电量',
          type: 'line',
          data: maxData,
          smooth: true,
          lineStyle: {
            width: 1,
            type: 'dashed',
            color: '#52c41a',
          },
          itemStyle: {
            color: '#52c41a',
          },
        },
      ],
    }
  }, [data])

  if (!data || data.length === 0) {
    return (
      <Card title={title} loading={loading}>
        <Empty description="暂无数据" />
      </Card>
    )
  }

  return (
    <Card title={title} loading={loading}>
      <ReactECharts
        option={option}
        style={{ height }}
        opts={{ renderer: 'svg' }}
        notMerge={true}
      />
    </Card>
  )
}
