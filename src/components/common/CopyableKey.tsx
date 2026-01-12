import React from 'react'
import { Input, Button, message } from 'antd'
import { CopyOutlined, CheckOutlined } from '@ant-design/icons'

interface CopyableKeyProps {
  value: string
  label?: string
  showFull?: boolean
}

export const CopyableKey: React.FC<CopyableKeyProps> = ({
  value,
  label = 'API Key',
  showFull = true,
}) => {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      message.success(`${label} 已复制到剪贴板`)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      message.error('复制失败，请手动复制')
    }
  }

  const displayValue = showFull ? value : value.slice(0, 16) + '...'

  return (
    <Input.Group compact style={{ display: 'flex' }}>
      <Input
        value={displayValue}
        readOnly
        style={{ flex: 1, fontFamily: 'monospace' }}
        addonBefore={label}
      />
      <Button
        icon={copied ? <CheckOutlined /> : <CopyOutlined />}
        onClick={handleCopy}
        type={copied ? 'primary' : 'default'}
      >
        {copied ? '已复制' : '复制'}
      </Button>
    </Input.Group>
  )
}
