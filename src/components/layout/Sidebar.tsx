import React from 'react'
import { Layout, Menu } from 'antd'
import {
  DashboardOutlined,
  DesktopOutlined,
  AlertOutlined,
  BellOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import type { MenuProps } from 'antd'

const { Sider } = Layout

interface SidebarProps {
  collapsed: boolean
  onCollapse: (collapsed: boolean) => void
  onMenuClick?: () => void
  isMobile?: boolean
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  collapsed, 
  onCollapse, 
  onMenuClick,
  isMobile = false 
}) => {
  const navigate = useNavigate()
  const location = useLocation()

  // 根据当前路径获取选中的菜单项
  const getSelectedKey = () => {
    const path = location.pathname
    if (path === '/') return 'dashboard'
    if (path.startsWith('/devices')) return 'devices'
    if (path.startsWith('/alerts/rules')) return 'alert-rules'
    if (path.startsWith('/alerts/events')) return 'alert-events'
    if (path.startsWith('/settings')) return 'settings'
    return 'dashboard'
  }

  const handleNavigate = (path: string) => {
    navigate(path)
    // 移动端点击菜单后关闭抽屉
    onMenuClick?.()
  }

  const menuItems: MenuProps['items'] = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '仪表盘',
      onClick: () => handleNavigate('/'),
    },
    {
      key: 'devices',
      icon: <DesktopOutlined />,
      label: '设备管理',
      onClick: () => handleNavigate('/devices'),
    },
    {
      key: 'alerts',
      icon: <AlertOutlined />,
      label: '预警管理',
      children: [
        {
          key: 'alert-rules',
          icon: <SettingOutlined />,
          label: '预警规则',
          onClick: () => handleNavigate('/alerts/rules'),
        },
        {
          key: 'alert-events',
          icon: <BellOutlined />,
          label: '预警事件',
          onClick: () => handleNavigate('/alerts/events'),
        },
      ],
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系统设置',
      onClick: () => handleNavigate('/settings/profile'),
    },
  ]

  // 移动端模式下，直接渲染 Menu（不需要 Sider 包裹，因为已经在 Drawer 中）
  if (isMobile) {
    return (
      <Menu
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        defaultOpenKeys={['alerts']}
        items={menuItems}
        style={{ 
          borderRight: 0,
          height: '100%',
        }}
      />
    )
  }

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      theme="light"
      breakpoint="lg"
      collapsedWidth={80}
      style={{
        overflow: 'auto',
        height: 'calc(100vh - 64px)',
        position: 'sticky',
        top: 64,
        left: 0,
        borderRight: '1px solid #f0f0f0',
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        defaultOpenKeys={['alerts']}
        items={menuItems}
        style={{ borderRight: 0 }}
      />
    </Sider>
  )
}
