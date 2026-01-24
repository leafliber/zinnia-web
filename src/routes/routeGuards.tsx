import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores'

/**
 * 需要认证的路由守卫
 *
 * 如果用户未认证，重定向到登录页面
 */
export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

/**
 * 未认证路由守卫（已登录则跳转首页）
 *
 * 如果用户已认证，重定向到首页
 */
export const PublicRoute: React.FC = () => {
  const { isAuthenticated } = useAuthStore()

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
