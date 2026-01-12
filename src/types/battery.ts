// 省电模式
export type PowerSavingMode = 'off' | 'low' | 'medium' | 'high' | 'extreme'

// 电量数据
export interface BatteryData {
  id: string
  device_id: string
  battery_level: number
  is_charging: boolean
  power_saving_mode: PowerSavingMode
  temperature?: number
  voltage?: number
  recorded_at: string
  created_at: string
}

// 最新电量数据
export interface LatestBattery {
  device_id: string
  battery_level: number
  is_charging: boolean
  power_saving_mode: string
  recorded_at: string
  is_low_battery: boolean
  is_critical: boolean
  temperature?: number
  voltage?: number
}

// 电量统计摘要
export interface BatteryStats {
  device_id: string
  period_start: string
  period_end: string
  avg_battery_level: number
  min_battery_level: number
  max_battery_level: number
  total_records: number
  charging_duration_minutes: number
  low_battery_count: number
}

// 聚合数据点
export interface AggregatedBatteryData {
  bucket: string
  avg_level: number
  min_level: number
  max_level: number
  count: number
}

// 聚合间隔类型
export type AggregationInterval = 'minute' | 'hour' | 'day'

// 历史数据查询参数
export interface BatteryHistoryParams {
  start_time: string
  end_time: string
  limit?: number
  offset?: number
}

// 聚合数据查询参数
export interface BatteryAggregatedParams {
  start_time: string
  end_time: string
  interval?: AggregationInterval
}

// 统计摘要查询参数
export interface BatteryStatsParams {
  start_time: string
  end_time: string
}
