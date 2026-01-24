import { useEffect, useRef } from 'react'
import { useAuthStore } from '@/stores'
import { authApi } from '@/api'
import { TOKEN_REFRESH_INTERVAL } from '@/utils/constants'

/**
 * Token 自动刷新 Hook
 * 在 access_token 过期前自动刷新
 * 使用 httpOnly cookie 时，我们定期调用刷新接口来保持 cookie 有效
 */
export const useRefreshToken = () => {
  const { isAuthenticated, logout } = useAuthStore()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      // 未认证时清除定时器
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    // 定时刷新 token
    const refreshAccessToken = async () => {
      try {
        // 调用刷新接口，refresh_token 在 httpOnly cookie 中
        await authApi.refreshToken({})
      } catch {
        // 刷新失败，登出用户
        logout()
      }
    }

    // 设置定时器
    intervalRef.current = setInterval(refreshAccessToken, TOKEN_REFRESH_INTERVAL)

    // 清理函数
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isAuthenticated, logout])
}
