import apiClient from './client'
import type {
  ApiResponse,
  PaginatedResponse,
  AlertRule,
  CreateAlertRuleRequest,
  UpdateAlertRuleRequest,
  AlertEvent,
  AlertEventParams,
  ActiveAlertCount,
} from '@/types'

// 获取预警规则列表
export const getAlertRules = async (): Promise<AlertRule[]> => {
  const response = await apiClient.get<ApiResponse<AlertRule[]>>('/alerts/rules')
  return response.data.data!
}

// 创建预警规则
export const createAlertRule = async (data: CreateAlertRuleRequest): Promise<AlertRule> => {
  const response = await apiClient.post<ApiResponse<AlertRule>>('/alerts/rules', data)
  return response.data.data!
}

// 更新预警规则
export const updateAlertRule = async (
  id: string,
  data: UpdateAlertRuleRequest
): Promise<AlertRule> => {
  const response = await apiClient.put<ApiResponse<AlertRule>>(`/alerts/rules/${id}`, data)
  return response.data.data!
}

// 删除预警规则
export const deleteAlertRule = async (id: string): Promise<void> => {
  await apiClient.delete(`/alerts/rules/${id}`)
}

// 获取预警事件列表
export const getAlertEvents = async (
  params?: AlertEventParams
): Promise<PaginatedResponse<AlertEvent>> => {
  const response = await apiClient.get<ApiResponse<PaginatedResponse<AlertEvent>>>(
    '/alerts/events',
    { params }
  )
  return response.data.data!
}

// 确认预警
export const acknowledgeAlert = async (id: string): Promise<void> => {
  await apiClient.post(`/alerts/events/${id}/acknowledge`)
}

// 解决预警
export const resolveAlert = async (id: string): Promise<void> => {
  await apiClient.post(`/alerts/events/${id}/resolve`)
}

// 更新预警状态
export const updateAlertStatus = async (
  id: string,
  status: 'active' | 'acknowledged' | 'resolved'
): Promise<void> => {
  await apiClient.put(`/alerts/events/${id}/status`, { status })
}

// 获取设备活跃预警数
export const getDeviceActiveAlertCount = async (deviceId: string): Promise<ActiveAlertCount> => {
  const response = await apiClient.get<ApiResponse<ActiveAlertCount>>(
    `/alerts/devices/${deviceId}/count`
  )
  return response.data.data!
}
