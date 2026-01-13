import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { ApiResponse } from '@/types'

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 存储 token 的 key
const ACCESS_TOKEN_KEY = 'zinnia_access_token'
const REFRESH_TOKEN_KEY = 'zinnia_refresh_token'

// 获取 token
export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

// 设置 token
export const setTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}

// 清除 token
export const clearTokens = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

// 是否正在刷新 token
let isRefreshing = false
// 等待刷新完成的请求队列
let refreshSubscribers: ((token: string) => void)[] = []

// 添加到刷新等待队列
const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback)
}

// 通知所有等待的请求
const onTokenRefreshed = (newToken: string) => {
  refreshSubscribers.forEach((callback) => callback(newToken))
  refreshSubscribers = []
}

// 刷新 token
const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    return null
  }

  try {
    const response = await axios.post<ApiResponse<{ access_token: string; refresh_token: string }>>(
      `${import.meta.env.VITE_API_BASE_URL || '/api/v1'}/users/refresh`,
      { refresh_token: refreshToken },
      { headers: { 'Content-Type': 'application/json' } }
    )

    if (response.data.data) {
      const { access_token, refresh_token } = response.data.data
      setTokens(access_token, refresh_token)
      return access_token
    }
    return null
  } catch {
    clearTokens()
    return null
  }
}

// 请求拦截器
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
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
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`
            }
            resolve(apiClient(originalRequest))
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const newToken = await refreshAccessToken()
        if (newToken) {
          onTokenRefreshed(newToken)
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`
          }
          return apiClient(originalRequest)
        } else {
          // 刷新失败，跳转登录页
          clearTokens()
          window.location.href = '/login'
          return Promise.reject(error)
        }
      } catch (refreshError) {
        clearTokens()
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
