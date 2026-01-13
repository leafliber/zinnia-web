import { RouterProvider } from 'react-router-dom'
import { ConfigProvider, App as AntApp } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { router } from './routes'
import { ErrorBoundary } from './components'

// Ant Design 主题配置
const theme = {
  token: {
    colorPrimary: '#667eea',
    borderRadius: 6,
  },
}

function App() {
  return (
    <ConfigProvider locale={zhCN} theme={theme}>
      <AntApp>
        <ErrorBoundary>
          <RouterProvider router={router} />
        </ErrorBoundary>
      </AntApp>
    </ConfigProvider>
  )
}

export default App
