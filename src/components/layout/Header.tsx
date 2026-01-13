import React from 'react'
import { Layout, Dropdown, Space, Badge, Button, Grid } from 'antd'
import {
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  SafetyCertificateOutlined,
  MenuOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks'
import { APP_TITLE } from '@/utils/constants'
import type { MenuProps } from 'antd'

const { Header: AntHeader } = Layout
const { useBreakpoint } = Grid

interface HeaderProps {
  onMenuClick?: () => void
  isMobile?: boolean
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, isMobile = false }) => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const screens = useBreakpoint()

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
      onClick: () => navigate('/settings/profile'),
    },
    {
      key: 'security',
      icon: <SafetyCertificateOutlined />,
      label: '安全设置',
      onClick: () => navigate('/settings/security'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: logout,
    },
  ]

  return (
    <AntHeader
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: isMobile ? '0 12px' : '0 24px',
        background: '#fff',
        borderBottom: '1px solid #f0f0f0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        height: isMobile ? 56 : 64,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? 8 : 12,
        }}
      >
        {/* 移动端菜单按钮 */}
        {isMobile && (
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={onMenuClick}
            style={{ 
              fontSize: 18,
              width: 40,
              height: 40,
            }}
          />
        )}
        
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/')}
        >
          <img
            src="/favicon.svg"
            alt="Logo"
            style={{ 
              height: isMobile ? 28 : 32, 
              marginRight: isMobile ? 8 : 12 
            }}
          />
          {/* 移动端只显示短名称 */}
          {screens.sm && (
            <span style={{ 
              fontSize: isMobile ? 16 : 18, 
              fontWeight: 600, 
              color: '#1890ff' 
            }}>
              {APP_TITLE}
            </span>
          )}
        </div>
      </div>

      <Space size={isMobile ? 'small' : 'large'}>
        <Badge count={0} offset={[-2, 2]}>
          <Button
            type="text"
            icon={<BellOutlined style={{ fontSize: isMobile ? 16 : 18 }} />}
            onClick={() => navigate('/alerts/events')}
            style={{ 
              width: isMobile ? 36 : 40,
              height: isMobile ? 36 : 40,
            }}
          />
        </Badge>

        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Space style={{ cursor: 'pointer' }}>
            <Button
              type="text"
              icon={<UserOutlined />}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                height: isMobile ? 36 : 40,
              }}
            >
              {/* 小屏幕隐藏用户名 */}
              {screens.sm && (
                <span>{user?.username || '用户'}</span>
              )}
            </Button>
          </Space>
        </Dropdown>
      </Space>
    </AntHeader>
  )
}
