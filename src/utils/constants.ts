// API 基础路径
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

// 应用标题
export const APP_TITLE = import.meta.env.VITE_APP_TITLE || 'Zinnia 设备监控平台'

// Token 刷新间隔（毫秒）
export const TOKEN_REFRESH_INTERVAL = Number(import.meta.env.VITE_TOKEN_REFRESH_INTERVAL) || 720000

// 设备状态颜色
export const DEVICE_STATUS_COLORS: Record<string, string> = {
  online: 'success',
  offline: 'default',
  maintenance: 'warning',
  disabled: 'error',
}

// 设备状态文字
export const DEVICE_STATUS_TEXT: Record<string, string> = {
  online: '在线',
  offline: '离线',
  maintenance: '维护中',
  disabled: '已禁用',
}

// 预警级别颜色
export const ALERT_LEVEL_COLORS: Record<string, string> = {
  info: 'blue',
  warning: 'orange',
  critical: 'red',
}

// 预警状态颜色
export const ALERT_STATUS_COLORS: Record<string, string> = {
  active: 'red',
  acknowledged: 'orange',
  resolved: 'green',
}

// 电量级别颜色
export const BATTERY_LEVEL_COLORS = {
  critical: '#ff4d4f', // < 10%
  low: '#faad14', // 10-20%
  normal: '#52c41a', // > 20%
}

// 获取电量颜色
export const getBatteryColor = (level: number): string => {
  if (level < 10) return BATTERY_LEVEL_COLORS.critical
  if (level < 20) return BATTERY_LEVEL_COLORS.low
  return BATTERY_LEVEL_COLORS.normal
}

// 分页默认值
export const DEFAULT_PAGE_SIZE = 20
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

// 时间格式
export const DATE_FORMAT = 'YYYY-MM-DD'
export const TIME_FORMAT = 'HH:mm:ss'
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
