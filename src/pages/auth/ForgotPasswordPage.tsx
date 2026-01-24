import React, { useState, useCallback, useEffect } from 'react'
import { Form, Input, Button, Card, Typography, Steps, message, Result } from 'antd'
import { MailOutlined, LockOutlined, SafetyOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { securityApi } from '@/api'
import { ReCaptcha } from '@/components'
import type { RegistrationConfig } from '@/types'
import {
  VERIFICATION_CODE_LENGTH,
  VERIFICATION_CODE_COUNTDOWN,
  VERIFICATION_CODE_VALIDITY_DESC,
} from '@/utils/constants'

const { Title, Text } = Typography

// 步骤定义
const steps = [
  { title: '输入邮箱', icon: <MailOutlined /> },
  { title: '验证身份', icon: <SafetyOutlined /> },
  { title: '设置新密码', icon: <LockOutlined /> },
]

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [config, setConfig] = useState<RegistrationConfig | null>(null)

  // 表单数据
  const [email, setEmail] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [recaptchaToken, setRecaptchaToken] = useState<string | undefined>()
  const [countdown, setCountdown] = useState(0)

  // 获取配置
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const configData = await securityApi.getRegistrationConfig()
        setConfig(configData)
      } catch {
        setConfig({
          require_email_verification: false,
          require_recaptcha: false,
          recaptcha_site_key: null,
        })
      }
    }
    fetchConfig()
  }, [])

  // 倒计时
  useEffect(() => {
    if (countdown <= 0) return
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [countdown])

  // reCAPTCHA 回调
  const handleRecaptchaVerify = useCallback((token: string) => {
    setRecaptchaToken(token)
  }, [])

  const handleRecaptchaExpire = useCallback(() => {
    setRecaptchaToken(undefined)
    message.warning('人机验证已过期，请重新验证')
  }, [])

  // 步骤1：发送验证码
  const handleSendCode = async () => {
    if (!email) {
      message.error('请输入邮箱地址')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      message.error('请输入有效的邮箱地址')
      return
    }

    if (config?.require_recaptcha && !recaptchaToken) {
      message.error('请完成人机验证')
      return
    }

    setIsLoading(true)
    try {
      await securityApi.sendPasswordResetCode({
        email,
        recaptcha_token: recaptchaToken,
      })
      message.success('验证码已发送到您的邮箱')
      setCountdown(VERIFICATION_CODE_COUNTDOWN)
      setCurrentStep(1)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '发送验证码失败'
      message.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // 重新发送验证码
  const handleResendCode = async () => {
    if (countdown > 0) return

    setIsLoading(true)
    try {
      await securityApi.sendPasswordResetCode({
        email,
        recaptcha_token: recaptchaToken,
      })
      message.success('验证码已重新发送')
      setCountdown(VERIFICATION_CODE_COUNTDOWN)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '发送验证码失败'
      message.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // 步骤2：验证验证码并进入下一步
  const handleVerifyCode = () => {
    if (!verificationCode || verificationCode.length !== VERIFICATION_CODE_LENGTH) {
      message.error('请输入完整的6位验证码')
      return
    }
    setCurrentStep(2)
  }

  // 步骤3：重置密码
  const handleResetPassword = async (values: { password: string; confirm_password: string }) => {
    if (values.password !== values.confirm_password) {
      message.error('两次输入的密码不一致')
      return
    }

    setIsLoading(true)
    try {
      await securityApi.confirmPasswordReset({
        email,
        code: verificationCode,
        new_password: values.password,
        confirm_password: values.confirm_password,
      })
      message.success('密码重置成功')
      setCurrentStep(3) // 成功页面
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '密码重置失败'
      message.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // 渲染步骤内容
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div>
            <Form layout="vertical">
              <Form.Item label="邮箱地址" required>
                <Input
                  prefix={<MailOutlined />}
                  placeholder="请输入注册时使用的邮箱"
                  size="large"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Item>

              {config?.require_recaptcha && config.recaptcha_site_key && (
                <Form.Item label="人机验证" required>
                  <ReCaptcha
                    siteKey={config.recaptcha_site_key}
                    onVerify={handleRecaptchaVerify}
                    onExpire={handleRecaptchaExpire}
                  />
                </Form.Item>
              )}

              <Form.Item>
                <Button
                  type="primary"
                  size="large"
                  block
                  loading={isLoading}
                  onClick={handleSendCode}
                >
                  发送验证码
                </Button>
              </Form.Item>
            </Form>
          </div>
        )

      case 1:
        return (
          <div>
            <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
              验证码已发送至 <Text strong>{email}</Text>
            </Text>

            <Form layout="vertical">
              <Form.Item label="验证码" required extra={`验证码有效期为${VERIFICATION_CODE_VALIDITY_DESC}`}>
                <Input
                  prefix={<SafetyOutlined />}
                  placeholder="请输入6位验证码"
                  size="large"
                  maxLength={VERIFICATION_CODE_LENGTH}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  size="large"
                  block
                  onClick={handleVerifyCode}
                  disabled={verificationCode.length !== 6}
                >
                  下一步
                </Button>
              </Form.Item>

              <Form.Item>
                <Button
                  type="link"
                  block
                  disabled={countdown > 0}
                  loading={isLoading}
                  onClick={handleResendCode}
                >
                  {countdown > 0 ? `${countdown}秒后可重新发送` : '重新发送验证码'}
                </Button>
              </Form.Item>
            </Form>
          </div>
        )

      case 2:
        return (
          <Form layout="vertical" onFinish={handleResetPassword}>
            <Form.Item
              name="password"
              label="新密码"
              rules={[
                { required: true, message: '请输入新密码' },
                { min: 8, message: '密码至少 8 个字符' },
                {
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                  message: '密码必须包含大小写字母和数字',
                },
              ]}
              extra="密码需包含大小写字母和数字，至少8个字符"
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请输入新密码"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="confirm_password"
              label="确认新密码"
              dependencies={['password']}
              rules={[
                { required: true, message: '请确认新密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'))
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请再次输入新密码"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={isLoading}
              >
                重置密码
              </Button>
            </Form.Item>
          </Form>
        )

      case 3:
        return (
          <Result
            status="success"
            icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            title="密码重置成功"
            subTitle="您的密码已成功重置，请使用新密码登录"
            extra={
              <Button type="primary" onClick={() => navigate('/login')}>
                返回登录
              </Button>
            }
          />
        )

      default:
        return null
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '24px 16px',
      }}
    >
      <Card
        style={{
          width: 460,
          maxWidth: '100%',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          borderRadius: 12,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <img src="/favicon.svg" alt="Logo" style={{ height: 48, marginBottom: 16 }} />
          <Title level={3} style={{ margin: 0 }}>
            重置密码
          </Title>
          <Text type="secondary">找回您的 Zinnia 账户</Text>
        </div>

        {/* 步骤条 */}
        {currentStep < 3 && (
          <Steps
            current={currentStep}
            items={steps}
            size="small"
            style={{ marginBottom: 24 }}
          />
        )}

        {/* 步骤内容 */}
        {renderStepContent()}

        {/* 返回登录链接 */}
        {currentStep < 3 && (
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Link to="/login">
              <Button type="link">返回登录</Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  )
}
