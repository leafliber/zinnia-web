// 用户角色
export type UserRole = 'admin' | 'user' | 'readonly'

// 用户信息
export interface User {
  id: string
  email: string
  username: string
  role: UserRole
  email_verified: boolean
  created_at: string
  last_login_at: string | null
  metadata?: Record<string, unknown>
}

// 注册请求
export interface RegisterRequest {
  email: string
  username: string
  password: string
  confirm_password: string
}

// 登录请求
export interface LoginRequest {
  login: string
  password: string
  device_info?: string
}

// 登录响应
export interface LoginResponse {
  user: User
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

// 刷新令牌请求
export interface RefreshTokenRequest {
  refresh_token: string
}

// 修改密码请求
export interface ChangePasswordRequest {
  current_password: string
  new_password: string
  confirm_password: string
}

// 更新用户信息请求
export interface UpdateUserRequest {
  username?: string
  metadata?: Record<string, unknown>
}

// 设备共享请求
export interface ShareDeviceRequest {
  user_identifier: string
  permission: 'read' | 'write' | 'admin'
}

// 设备共享记录
export interface DeviceShare {
  id: string
  device_id: string
  user_id: string
  username: string
  email: string
  permission: 'read' | 'write' | 'admin'
  created_at: string
}
