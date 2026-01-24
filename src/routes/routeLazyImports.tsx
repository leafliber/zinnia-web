import { lazy } from 'react'

/**
 * 懒加载的页面组件
 * 使用动态导入实现代码分割
 */
export const LoginPage = lazy(() => import('@/pages').then(m => ({ default: m.LoginPage })))
export const RegisterPage = lazy(() => import('@/pages').then(m => ({ default: m.RegisterPage })))
export const ForgotPasswordPage = lazy(() => import('@/pages').then(m => ({ default: m.ForgotPasswordPage })))
export const DashboardPage = lazy(() => import('@/pages').then(m => ({ default: m.DashboardPage })))
export const DeviceListPage = lazy(() => import('@/pages').then(m => ({ default: m.DeviceListPage })))
export const CreateDevicePage = lazy(() => import('@/pages').then(m => ({ default: m.CreateDevicePage })))
export const DeviceDetailPage = lazy(() => import('@/pages').then(m => ({ default: m.DeviceDetailPage })))
export const DeviceConfigPage = lazy(() => import('@/pages').then(m => ({ default: m.DeviceConfigPage })))
export const TokenManagePage = lazy(() => import('@/pages').then(m => ({ default: m.TokenManagePage })))
export const AlertRulesPage = lazy(() => import('@/pages').then(m => ({ default: m.AlertRulesPage })))
export const AlertEventsPage = lazy(() => import('@/pages').then(m => ({ default: m.AlertEventsPage })))
export const ProfilePage = lazy(() => import('@/pages').then(m => ({ default: m.ProfilePage })))
export const SecurityPage = lazy(() => import('@/pages').then(m => ({ default: m.SecurityPage })))
