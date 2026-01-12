import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

// 配置 dayjs
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

// 格式化日期时间
export const formatDateTime = (date: string | Date | null | undefined): string => {
  if (!date) return '-'
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

// 格式化日期
export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return '-'
  return dayjs(date).format('YYYY-MM-DD')
}

// 格式化时间
export const formatTime = (date: string | Date | null | undefined): string => {
  if (!date) return '-'
  return dayjs(date).format('HH:mm:ss')
}

// 相对时间
export const formatRelativeTime = (date: string | Date | null | undefined): string => {
  if (!date) return '-'
  return dayjs(date).fromNow()
}

// 格式化电量百分比
export const formatBatteryLevel = (level: number): string => {
  return `${Math.round(level)}%`
}

// 格式化温度
export const formatTemperature = (temp: number | undefined): string => {
  if (temp === undefined) return '-'
  return `${temp.toFixed(1)}°C`
}

// 格式化电压
export const formatVoltage = (voltage: number | undefined): string => {
  if (voltage === undefined) return '-'
  return `${voltage.toFixed(2)}V`
}

// 格式化时长（分钟）
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} 分钟`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (mins === 0) {
    return `${hours} 小时`
  }
  return `${hours} 小时 ${mins} 分钟`
}

// 截断字符串
export const truncateString = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength) + '...'
}

// 隐藏 API Key 中间部分
export const maskApiKey = (key: string): string => {
  if (key.length <= 16) return key
  return key.slice(0, 12) + '...' + key.slice(-4)
}
