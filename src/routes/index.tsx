import React from 'react'
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { AppLayout } from '@/components'
import { useAuthStore } from '@/stores'
import {
  LoginPage,
  RegisterPage,
  DashboardPage,
  DeviceListPage,
  CreateDevicePage,
  DeviceDetailPage,
  DeviceConfigPage,
  TokenManagePage,
  AlertRulesPage,
  AlertEventsPage,
  ProfilePage,
  SecurityPage,
} from '@/pages'

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
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
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
            element: <DashboardPage />,
          },
          {
            path: 'devices',
            element: <DeviceListPage />,
          },
          {
            path: 'devices/new',
            element: <CreateDevicePage />,
          },
          {
            path: 'devices/:id',
            element: <DeviceDetailPage />,
          },
          {
            path: 'devices/:id/config',
            element: <DeviceConfigPage />,
          },
          {
            path: 'devices/:id/tokens',
            element: <TokenManagePage />,
          },
          {
            path: 'alerts/rules',
            element: <AlertRulesPage />,
          },
          {
            path: 'alerts/events',
            element: <AlertEventsPage />,
          },
          {
            path: 'settings/profile',
            element: <ProfilePage />,
          },
          {
            path: 'settings/security',
            element: <SecurityPage />,
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
])
