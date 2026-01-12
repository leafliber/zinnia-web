import apiClient from './client'
import type {
  ApiResponse,
  PaginatedResponse,
  Device,
  CreateDeviceRequest,
  CreateDeviceResponse,
  UpdateDeviceRequest,
  DeviceConfig,
  UpdateDeviceConfigRequest,
  RotateKeyResponse,
  DeviceToken,
  CreateDeviceTokenRequest,
  DeviceListParams,
  TokenListParams,
} from '@/types'

// 获取设备列表
export const getDevices = async (
  params?: DeviceListParams
): Promise<PaginatedResponse<Device>> => {
  const response = await apiClient.get<ApiResponse<PaginatedResponse<Device>>>('/devices', {
    params,
  })
  return response.data.data!
}

// 创建设备
export const createDevice = async (data: CreateDeviceRequest): Promise<CreateDeviceResponse> => {
  const response = await apiClient.post<ApiResponse<CreateDeviceResponse>>('/devices', data)
  return response.data.data!
}

// 获取设备详情
export const getDevice = async (id: string): Promise<Device> => {
  const response = await apiClient.get<ApiResponse<Device>>(`/devices/${id}`)
  return response.data.data!
}

// 更新设备
export const updateDevice = async (id: string, data: UpdateDeviceRequest): Promise<Device> => {
  const response = await apiClient.put<ApiResponse<Device>>(`/devices/${id}`, data)
  return response.data.data!
}

// 删除设备
export const deleteDevice = async (id: string): Promise<void> => {
  await apiClient.delete(`/devices/${id}`)
}

// 获取设备配置
export const getDeviceConfig = async (id: string): Promise<DeviceConfig> => {
  const response = await apiClient.get<ApiResponse<DeviceConfig>>(`/devices/${id}/config`)
  return response.data.data!
}

// 更新设备配置
export const updateDeviceConfig = async (
  id: string,
  data: UpdateDeviceConfigRequest
): Promise<DeviceConfig> => {
  const response = await apiClient.put<ApiResponse<DeviceConfig>>(`/devices/${id}/config`, data)
  return response.data.data!
}

// 轮换设备 API Key
export const rotateDeviceKey = async (id: string): Promise<RotateKeyResponse> => {
  const response = await apiClient.post<ApiResponse<RotateKeyResponse>>(
    `/devices/${id}/rotate-key`
  )
  return response.data.data!
}

// 创建设备访问令牌
export const createDeviceToken = async (
  deviceId: string,
  data: CreateDeviceTokenRequest
): Promise<DeviceToken> => {
  const response = await apiClient.post<ApiResponse<DeviceToken>>(
    `/devices/${deviceId}/tokens`,
    data
  )
  return response.data.data!
}

// 获取设备令牌列表
export const getDeviceTokens = async (
  deviceId: string,
  params?: TokenListParams
): Promise<DeviceToken[]> => {
  const response = await apiClient.get<ApiResponse<DeviceToken[]>>(
    `/devices/${deviceId}/tokens`,
    { params }
  )
  return response.data.data!
}

// 吊销单个令牌
export const revokeDeviceToken = async (deviceId: string, tokenId: string): Promise<void> => {
  await apiClient.delete(`/devices/${deviceId}/tokens/${tokenId}`)
}

// 吊销设备所有令牌
export const revokeAllDeviceTokens = async (
  deviceId: string
): Promise<{ revoked_count: number; message: string }> => {
  const response = await apiClient.delete<
    ApiResponse<{ revoked_count: number; message: string }>
  >(`/devices/${deviceId}/tokens`)
  return response.data.data!
}
