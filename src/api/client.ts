import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { ApiResponse } from '@/types'

// 创建 axios 实例
// withCredentials: true - 关键配置，用于发送/接收 httpOnly cookie
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 30000,
  withCredentials: true, // 启用 cookie 支持
  headers: {
    'Content-Type': 'application/json',
  },
})

// 使用 httpOnly cookie 存储 token，不再需要 localStorage 存储
// 保留这些方法用于向后兼容，但实际不再使用

// 获取 token (已废弃，保留用于向后兼容)
export const getAccessToken = (): string | null => {
  // httpOnly cookie 无法通过 JavaScript 读取，返回 null
  return null
}

export const getRefreshToken = (): string | null => {
  // httpOnly cookie 无法通过 JavaScript 读取，返回 null
  return null
}

// 设置 token (已废弃，保留用于向后兼容)
export const setTokens = (_accessToken: string, _refreshToken: string): void => {
  // token 现在存储在 httpOnly cookie 中，不再需要手动设置
}

// 清除 token (已废弃，保留用于向后兼容)
export const clearTokens = (): void => {
  // token 现在由服务器通过 httpOnly cookie 管理，无法手动清除
  // 登出时会调用后端 /users/logout 接口来清除 cookie
}

// 是否正在刷新 token
let isRefreshing = false
// 等待刷新完成的请求队列
let refreshSubscribers: ((success: boolean) => void)[] = []

// 添加到刷新等待队列
const subscribeTokenRefresh = (callback: (success: boolean) => void) => {
  refreshSubscribers.push(callback)
}

// 通知所有等待的请求
const onTokenRefreshed = (success: boolean) => {
  refreshSubscribers.forEach((callback) => callback(success))
  refreshSubscribers = []
}

// 刷新 token
// 使用 httpOnly cookie，不需要传递 refresh_token
const refreshAccessToken = async (): Promise<boolean> => {
  try {
    await axios.post<ApiResponse<{ access_token: string; refresh_token: string }>>(
      `${import.meta.env.VITE_API_BASE_URL || '/api/v1'}/users/refresh`,
      {}, // 不需要 request body，refresh_token 在 cookie 中
      { withCredentials: true } // 确保携带 cookie
    )

    // 新的 cookie 会自动设置，不需要手动存储
    return true
  } catch {
    // 刷新失败，cookie 可能会被后端清除
    return false
  }
}

// 请求拦截器
// 使用 httpOnly cookie 认证后，不再需要手动添加 Authorization header
// cookie 会自动由浏览器发送
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 不再需要添加 Authorization header
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError<ApiResponse<null>>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // 提取错误信息
    const extractErrorMessage = (): string => {
      if (error.response?.data) {
        const data = error.response.data as { message?: string; error?: { message?: string; code?: string } }
        // 优先使用 error.message
        if (data.error?.message) {
          return data.error.message
        }
        // 其次使用顶层 message
        if (data.message) {
          return data.message
        }
      }
      // 默认错误信息
      if (error.response?.status === 400) {
        return '请求参数错误'
      }
      if (error.response?.status === 401) {
        return '认证失败'
      }
      if (error.response?.status === 403) {
        return '权限不足'
      }
      if (error.response?.status === 404) {
        return '资源不存在'
      }
      if (error.response?.status === 429) {
        return '请求过于频繁，请稍后重试'
      }
      if (error.response?.status && error.response.status >= 500) {
        return '服务器错误，请稍后重试'
      }
      return error.message || '网络请求失败'
    }

    // 如果是 401 错误且不是刷新 token 的请求
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/users/refresh') &&
      !originalRequest.url?.includes('/users/login')
    ) {
      if (isRefreshing) {
        // 如果正在刷新，加入等待队列
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((success: boolean) => {
            if (success) {
              resolve(apiClient(originalRequest))
            } else {
              reject(error)
            }
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const success = await refreshAccessToken()
        if (success) {
          // 刷新成功，通知所有等待的请求
          onTokenRefreshed(true)
          return apiClient(originalRequest)
        } else {
          // 刷新失败，跳转登录页
          onTokenRefreshed(false)
          window.location.href = '/login'
          return Promise.reject(error)
        }
      } catch (refreshError) {
        onTokenRefreshed(false)
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // 对于其他错误，返回包含具体信息的 Error
    const errorMessage = extractErrorMessage()
    const enhancedError = new Error(errorMessage)
    ;(enhancedError as Error & { response?: typeof error.response }).response = error.response
    return Promise.reject(enhancedError)
  }
)

export default apiClient
