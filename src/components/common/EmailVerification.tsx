import React, { useState, useEffect, useCallback } from 'react'
import { Input, Button, Space, message } from 'antd'
import { MailOutlined, SendOutlined } from '@ant-design/icons'
import { securityApi } from '@/api'

interface EmailVerificationProps {
  email: string
  recaptchaToken?: string
  onCodeChange: (code: string) => void
  disabled?: boolean
}

export const EmailVerification: React.FC<EmailVerificationProps> = ({
  email,
  recaptchaToken,
  onCodeChange,
  disabled = false,
}) => {
  const [code, setCode] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [countdown, setCountdown] = useState(0)

  // 倒计时效果
  useEffect(() => {
    if (countdown <= 0) return

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [countdown])

  // 发送验证码
  const handleSendCode = useCallback(async () => {
    if (!email) {
      message.warning('请先输入邮箱地址')
      return
    }

    // 简单的邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      message.warning('请输入有效的邮箱地址')
      return
    }

    setIsSending(true)
    try {
      const result = await securityApi.sendVerificationCode({
        email,
        recaptcha_token: recaptchaToken,
      })
      message.success(result.message || '验证码已发送到您的邮箱')
      setCountdown(60) // 60秒后可重新发送
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '发送验证码失败'
      message.error(errorMessage)
    } finally {
      setIsSending(false)
    }
  }, [email, recaptchaToken])

  // 处理验证码输入
  const handleCodeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\D/g, '').slice(0, 6) // 只允许数字，最多6位
      setCode(value)
      onCodeChange(value)
    },
    [onCodeChange]
  )

  return (
    <Space.Compact style={{ width: '100%' }}>
      <Input
        prefix={<MailOutlined />}
        placeholder="请输入6位验证码"
        value={code}
        onChange={handleCodeChange}
        maxLength={6}
        size="large"
        disabled={disabled}
        style={{ flex: 1 }}
      />
      <Button
        type="primary"
        icon={<SendOutlined />}
        onClick={handleSendCode}
        loading={isSending}
        disabled={disabled || countdown > 0 || !email}
        size="large"
        style={{ minWidth: 120 }}
      >
        {countdown > 0 ? `${countdown}s` : '发送验证码'}
      </Button>
    </Space.Compact>
  )
}
