import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores'
import { message } from 'antd'

/**
 * 认证相关 Hook
 */
export const useAuth = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, isLoading, login, register, logout, fetchCurrentUser } =
    useAuthStore()

  // 登录处理
  const handleLogin = useCallback(
    async (loginId: string, password: string) => {
      try {
        await login(loginId, password)
        message.success('登录成功')
        navigate('/')
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : '登录失败，请检查用户名和密码'
        message.error(errorMessage)
        throw error
      }
    },
    [login, navigate]
  )

  // 注册处理
  const handleRegister = useCallback(
    async (email: string, username: string, password: string) => {
      try {
        await register(email, username, password)
        message.success('注册成功，请登录')
        navigate('/login')
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '注册失败，请稍后重试'
        message.error(errorMessage)
        throw error
      }
    },
    [register, navigate]
  )

  // 登出处理
  const handleLogout = useCallback(async () => {
    try {
      await logout()
      message.success('已退出登录')
      navigate('/login')
    } catch {
      // 即使登出 API 失败，也跳转到登录页
      navigate('/login')
    }
  }, [logout, navigate])

  return {
    user,
    isAuthenticated,
    isLoading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    fetchCurrentUser,
  }
}
