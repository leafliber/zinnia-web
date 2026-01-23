// 设备状态
export type DeviceStatus = 'online' | 'offline' | 'maintenance' | 'disabled'

// 设备信息
export interface Device {
  id: string
  owner_id: string | null
  name: string
  device_type: string
  status: DeviceStatus
  api_key_prefix: string
  created_at: string
  updated_at: string
  last_seen_at: string | null
  metadata?: Record<string, unknown>
}

// 创建设备请求
export interface CreateDeviceRequest {
  name: string
  device_type: string
  metadata?: Record<string, unknown>
}

// 创建设备响应
export interface CreateDeviceResponse {
  device: Device
  api_key: string
  config: DeviceConfig
}

// 更新设备请求
export interface UpdateDeviceRequest {
  name?: string
  status?: DeviceStatus
  metadata?: Record<string, unknown>
}

// 设备配置
export interface DeviceConfig {
  device_id: string
  low_battery_threshold: number
  critical_battery_threshold: number
  report_interval_seconds: number
  high_temperature_threshold: number
  updated_at?: string
}

// 更新设备配置请求
export interface UpdateDeviceConfigRequest {
  low_battery_threshold?: number
  critical_battery_threshold?: number
  report_interval_seconds?: number
  high_temperature_threshold?: number
}

// 轮换密钥响应
export interface RotateKeyResponse {
  api_key: string
  api_key_prefix: string
}

// 令牌权限
export type TokenPermission = 'read' | 'write' | 'all'

// 创建设备令牌请求
export interface CreateDeviceTokenRequest {
  name: string
  permission: TokenPermission
  expires_in_hours?: number
  allowed_ips?: string[]
  rate_limit_per_minute?: number
}

// 设备令牌
export interface DeviceToken {
  id: string
  device_id: string
  name: string
  token?: string // 仅创建时返回
  token_prefix: string
  permission: TokenPermission
  is_revoked: boolean
  expires_at: string | null
  last_used_at: string | null
  use_count: number
  created_at: string
}

// 设备列表查询参数
export interface DeviceListParams {
  page?: number
  page_size?: number
  status?: DeviceStatus
  device_type?: string
}

// 令牌列表查询参数
export interface TokenListParams {
  include_revoked?: boolean
  include_expired?: boolean
}
