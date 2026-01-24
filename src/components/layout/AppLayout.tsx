import React, { useState } from 'react'
import { Layout, Drawer, Grid } from 'antd'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { useRefreshToken } from '@/hooks'

const { Content } = Layout
const { useBreakpoint } = Grid

export const AppLayout: React.FC = () => {
  const screens = useBreakpoint()
  const isMobile = !screens.md
  const [collapsed, setCollapsed] = useState(isMobile)
  const [drawerVisible, setDrawerVisible] = useState(false)

  // 启用 Token 自动刷新
  useRefreshToken()

  const handleToggleSidebar = () => {
    if (isMobile) {
      setDrawerVisible(!drawerVisible)
    } else {
      setCollapsed(!collapsed)
    }
  }

  const handleDrawerClose = () => {
    setDrawerVisible(false)
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header onMenuClick={handleToggleSidebar} isMobile={isMobile} />
      <Layout>
        {/* 桌面端侧边栏 */}
        {!isMobile && (
          <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
        )}
        
        {/* 移动端抽屉式侧边栏 */}
        {isMobile && (
          <Drawer
            placement="left"
            open={drawerVisible}
            onClose={handleDrawerClose}
            styles={{ body: { padding: 0 } }}
            width={250}
          >
            <Sidebar 
              collapsed={false} 
              onCollapse={() => {}} 
              onMenuClick={handleDrawerClose}
              isMobile={true}
            />
          </Drawer>
        )}
        
        <Layout 
          style={{ 
            padding: isMobile ? '12px' : '24px',
            paddingBottom: isMobile ? 'calc(12px + env(safe-area-inset-bottom))' : '24px',
          }}
        >
          <Content
            style={{
              background: '#fff',
              padding: isMobile ? 12 : 24,
              margin: 0,
              minHeight: 280,
              borderRadius: 8,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}
