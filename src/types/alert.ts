// 预警类型
export type AlertType =
  | 'low_battery'
  | 'critical_battery'
  | 'high_temperature'
  | 'device_offline'
  | 'rapid_drain'

// 预警级别
export type AlertLevel = 'info' | 'warning' | 'critical'

// 预警状态
export type AlertStatus = 'active' | 'acknowledged' | 'resolved'

// 预警规则
export interface AlertRule {
  id: string
  user_id?: string // 所属用户ID
  name: string
  alert_type: AlertType
  level: AlertLevel
  cooldown_minutes: number
  enabled: boolean
  created_at: string
  updated_at: string
}

// 创建预警规则请求
export interface CreateAlertRuleRequest {
  name: string
  alert_type: AlertType
  level: AlertLevel
  cooldown_minutes?: number
  enabled?: boolean
}

// 更新预警规则请求
export interface UpdateAlertRuleRequest {
  name?: string
  alert_type?: AlertType
  level?: AlertLevel
  cooldown_minutes?: number
  enabled?: boolean
}

// 预警事件
export interface AlertEvent {
  id: string
  device_id: string
  rule_id: string
  alert_type: AlertType
  level: AlertLevel
  status: AlertStatus
  message: string
  value: number
  threshold: number
  triggered_at: string
  acknowledged_at: string | null
  resolved_at: string | null
}

// 预警事件查询参数
export interface AlertEventParams {
  device_id?: string
  level?: AlertLevel
  status?: AlertStatus
  alert_type?: AlertType
  page?: number
  page_size?: number
}

// 活跃预警数量
export interface ActiveAlertCount {
  active_count: number
}

// 预警类型显示名称映射
export const AlertTypeLabels: Record<AlertType, string> = {
  low_battery: '低电量',
  critical_battery: '临界电量',
  high_temperature: '高温',
  device_offline: '设备离线',
  rapid_drain: '电量快速下降',
}

// 预警级别显示名称映射
export const AlertLevelLabels: Record<AlertLevel, string> = {
  info: '信息',
  warning: '警告',
  critical: '严重',
}

// 预警状态显示名称映射
export const AlertStatusLabels: Record<AlertStatus, string> = {
  active: '活跃',
  acknowledged: '已确认',
  resolved: '已解决',
}
