import React from 'react'
import { Layout, Menu, Avatar, Dropdown, Space, Badge } from 'antd'
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  BellOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks'
import { APP_TITLE } from '@/utils/constants'
import type { MenuProps } from 'antd'

const { Header: AntHeader } = Layout

export const Header: React.FC = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

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
        padding: '0 24px',
        background: '#fff',
        borderBottom: '1px solid #f0f0f0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
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
          style={{ height: 32, marginRight: 12 }}
        />
        <span style={{ fontSize: 18, fontWeight: 600, color: '#1890ff' }}>
          {APP_TITLE}
        </span>
      </div>

      <Space size="large">
        <Badge count={0} offset={[-2, 2]}>
          <BellOutlined
            style={{ fontSize: 18, cursor: 'pointer' }}
            onClick={() => navigate('/alerts/events')}
          />
        </Badge>

        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Space style={{ cursor: 'pointer' }}>
            <Avatar icon={<UserOutlined />} size="small" />
            <span>{user?.username || '用户'}</span>
          </Space>
        </Dropdown>
      </Space>
    </AntHeader>
  )
}
