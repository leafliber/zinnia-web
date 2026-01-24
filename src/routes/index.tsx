import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components'
import {
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
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
} from './routeLazyImports'
import { SuspenseWrapper } from './routeWrappers'
import { ProtectedRoute, PublicRoute } from './routeGuards'

/**
 * 应用路由配置
 *
 * 使用 React Router 7 的 createBrowserRouter 和代码分割
 */
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
