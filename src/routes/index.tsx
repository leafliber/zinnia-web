import React, { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { AppLayout, LoadingSpinner } from '@/components'
import { useAuthStore } from '@/stores'

// 使用动态导入实现代码分割
const LoginPage = lazy(() => import('@/pages').then(m => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import('@/pages').then(m => ({ default: m.RegisterPage })))
const ForgotPasswordPage = lazy(() => import('@/pages').then(m => ({ default: m.ForgotPasswordPage })))
const DashboardPage = lazy(() => import('@/pages').then(m => ({ default: m.DashboardPage })))
const DeviceListPage = lazy(() => import('@/pages').then(m => ({ default: m.DeviceListPage })))
const CreateDevicePage = lazy(() => import('@/pages').then(m => ({ default: m.CreateDevicePage })))
const DeviceDetailPage = lazy(() => import('@/pages').then(m => ({ default: m.DeviceDetailPage })))
const DeviceConfigPage = lazy(() => import('@/pages').then(m => ({ default: m.DeviceConfigPage })))
const TokenManagePage = lazy(() => import('@/pages').then(m => ({ default: m.TokenManagePage })))
const AlertRulesPage = lazy(() => import('@/pages').then(m => ({ default: m.AlertRulesPage })))
const AlertEventsPage = lazy(() => import('@/pages').then(m => ({ default: m.AlertEventsPage })))
const ProfilePage = lazy(() => import('@/pages').then(m => ({ default: m.ProfilePage })))
const SecurityPage = lazy(() => import('@/pages').then(m => ({ default: m.SecurityPage })))

// Suspense 包装组件
const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
)

// 需要认证的路由守卫
const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

// 未认证路由守卫（已登录则跳转首页）
const PublicRoute: React.FC = () => {
  const { isAuthenticated } = useAuthStore()

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export const router = createBrowserRouter([
  // 公开路由
  {
    element: <PublicRoute />,
    children: [
      {
        path: '/login',
        element: <SuspenseWrapper><LoginPage /></SuspenseWrapper>,
      },
      {
        path: '/register',
        element: <SuspenseWrapper><RegisterPage /></SuspenseWrapper>,
      },
      {
        path: '/forgot-password',
        element: <SuspenseWrapper><ForgotPasswordPage /></SuspenseWrapper>,
      },
    ],
  },

  // 需要认证的路由
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <SuspenseWrapper><DashboardPage /></SuspenseWrapper>,
          },
          {
            path: 'devices',
            element: <SuspenseWrapper><DeviceListPage /></SuspenseWrapper>,
          },
          {
            path: 'devices/new',
            element: <SuspenseWrapper><CreateDevicePage /></SuspenseWrapper>,
          },
          {
            path: 'devices/:id',
            element: <SuspenseWrapper><DeviceDetailPage /></SuspenseWrapper>,
          },
          {
            path: 'devices/:id/config',
            element: <SuspenseWrapper><DeviceConfigPage /></SuspenseWrapper>,
          },
          {
            path: 'devices/:id/tokens',
            element: <SuspenseWrapper><TokenManagePage /></SuspenseWrapper>,
          },
          {
            path: 'alerts/rules',
            element: <SuspenseWrapper><AlertRulesPage /></SuspenseWrapper>,
          },
          {
            path: 'alerts/events',
            element: <SuspenseWrapper><AlertEventsPage /></SuspenseWrapper>,
          },
          {
            path: 'settings/profile',
            element: <SuspenseWrapper><ProfilePage /></SuspenseWrapper>,
          },
          {
            path: 'settings/security',
            element: <SuspenseWrapper><SecurityPage /></SuspenseWrapper>,
          },
        ],
      },
    ],
  },

  // 404 重定向
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
], {
  future: {
    v7_startTransition: true,
  },
})
