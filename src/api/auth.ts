import apiClient from './client'
import type {
  ApiResponse,
  User,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RefreshTokenRequest,
  ChangePasswordRequest,
  UpdateUserRequest,
  ShareDeviceRequest,
  DeviceShare,
  PaginatedResponse,
  PaginationParams,
} from '@/types'

// 用户注册
export const register = async (data: RegisterRequest): Promise<User> => {
  const response = await apiClient.post<ApiResponse<User>>('/users/register', data)
  return response.data.data!
}

// 用户登录
// 使用 httpOnly cookie，token 会自动由后端设置
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<ApiResponse<LoginResponse>>('/users/login', data)
  const result = response.data.data!
  // Cookie 会自动设置，无需手动处理
  return result
}

// 刷新令牌
// 使用 httpOnly cookie，refresh_token 在 cookie 中，不需要在 body 中传递
export const refreshToken = async (_data: RefreshTokenRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<ApiResponse<LoginResponse>>('/users/refresh', {})
  const result = response.data.data!
  // 新的 cookie 会自动设置，无需手动处理
  return result
}

// 用户登出
// 使用 httpOnly cookie，不需要传递 refresh_token
export const logout = async (): Promise<void> => {
  try {
    await apiClient.post('/users/logout', {})
    // Cookie 会由服务器自动清除
  } catch {
    // 忽略登出错误，cookie 可能已过期
  }
}

// 获取当前用户信息
export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<ApiResponse<User>>('/users/me')
  return response.data.data!
}

// 更新当前用户信息
export const updateCurrentUser = async (data: UpdateUserRequest): Promise<User> => {
  const response = await apiClient.put<ApiResponse<User>>('/users/me', data)
  return response.data.data!
}

// 修改密码
export const changePassword = async (data: ChangePasswordRequest): Promise<void> => {
  await apiClient.put('/users/me/password', data)
}

// 登出所有设备
export const logoutAll = async (): Promise<{ message: string; sessions_revoked: number }> => {
  const response = await apiClient.post<
    ApiResponse<{ message: string; sessions_revoked: number }>
  >('/users/logout-all')
  return response.data.data!
}

// 共享设备给用户
export const shareDevice = async (deviceId: string, data: ShareDeviceRequest): Promise<void> => {
  await apiClient.post(`/users/devices/${deviceId}/share`, data)
}

// 获取设备共享列表
export const getDeviceShares = async (deviceId: string): Promise<DeviceShare[]> => {
  const response = await apiClient.get<ApiResponse<DeviceShare[]>>(
    `/users/devices/${deviceId}/shares`
  )
  return response.data.data!
}

// 取消设备共享
export const removeDeviceShare = async (deviceId: string, userId: string): Promise<void> => {
  await apiClient.delete(`/users/devices/${deviceId}/share/${userId}`)
}

// 管理员：获取用户列表
export const getUsers = async (
  params: PaginationParams & { role?: string; is_active?: boolean; search?: string }
): Promise<PaginatedResponse<User>> => {
  const response = await apiClient.get<ApiResponse<PaginatedResponse<User>>>('/users', { params })
  return response.data.data!
}

// 管理员：获取用户详情
export const getUserById = async (userId: string): Promise<User> => {
  const response = await apiClient.get<ApiResponse<User>>(`/users/${userId}`)
  return response.data.data!
}

// 管理员：删除用户
export const deleteUser = async (userId: string): Promise<void> => {
  await apiClient.delete(`/users/${userId}`)
}
