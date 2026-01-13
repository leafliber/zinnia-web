import React, { useState, useEffect, useCallback } from 'react'
import { Form, Input, Button, Card, Typography, Divider, message, Alert, Spin } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined, SafetyOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { securityApi, authApi } from '@/api'
import { ReCaptcha, EmailVerification } from '@/components'
import type { RegistrationConfig } from '@/types'

const { Title, Text } = Typography

interface RegisterFormValues {
  email: string
  username: string
  password: string
  confirm_password: string
}

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [isLoading, setIsLoading] = useState(false)
  const [isConfigLoading, setIsConfigLoading] = useState(true)
  const [config, setConfig] = useState<RegistrationConfig | null>(null)

  // reCAPTCHA 和验证码状态
  const [recaptchaToken, setRecaptchaToken] = useState<string | undefined>()
  const [verificationCode, setVerificationCode] = useState('')
  const [emailValue, setEmailValue] = useState('')

  // 获取注册配置
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const configData = await securityApi.getRegistrationConfig()
        setConfig(configData)
      } catch (error) {
        // 如果获取配置失败，使用默认配置（不需要验证）
        console.error('获取注册配置失败:', error)
        setConfig({
          require_email_verification: false,
          require_recaptcha: false,
          recaptcha_site_key: null,
        })
      } finally {
        setIsConfigLoading(false)
      }
    }
    fetchConfig()
  }, [])

  // 监听邮箱字段变化
  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailValue(e.target.value)
  }, [])

  // reCAPTCHA 验证回调
  const handleRecaptchaVerify = useCallback((token: string) => {
    setRecaptchaToken(token)
  }, [])

  // reCAPTCHA 过期回调
  const handleRecaptchaExpire = useCallback(() => {
    setRecaptchaToken(undefined)
    message.warning('人机验证已过期，请重新验证')
  }, [])

  // 提交注册
  const handleSubmit = async (values: RegisterFormValues) => {
    // 验证 reCAPTCHA
    if (config?.require_recaptcha && !recaptchaToken) {
      message.error('请完成人机验证')
      return
    }

    // 验证邮箱验证码
    if (config?.require_email_verification && !verificationCode) {
      message.error('请输入邮箱验证码')
      return
    }

    if (verificationCode && verificationCode.length !== 6) {
      message.error('请输入完整的6位验证码')
      return
    }

    setIsLoading(true)
    try {
      await authApi.register({
        email: values.email,
        username: values.username,
        password: values.password,
        recaptcha_token: recaptchaToken,
        verification_code: verificationCode || undefined,
      })
      message.success('注册成功，请登录')
      navigate('/login')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '注册失败，请稍后重试'
      message.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // 加载中显示
  if (isConfigLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <Spin size="large" />
      </div>
    )
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
          width: 420,
          maxWidth: '100%',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          borderRadius: 12,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <img src="/favicon.svg" alt="Logo" style={{ height: 48, marginBottom: 16 }} />
          <Title level={3} style={{ margin: 0 }}>
            创建账户
          </Title>
          <Text type="secondary">加入 Zinnia 设备监控平台</Text>
        </div>

        {/* 安全提示 */}
        {(config?.require_email_verification || config?.require_recaptcha) && (
          <Alert
            message="安全验证"
            description={
              <>
                {config.require_email_verification && <div>• 需要邮箱验证码确认您的身份</div>}
                {config.require_recaptcha && <div>• 需要完成人机验证</div>}
              </>
            }
            type="info"
            showIcon
            icon={<SafetyOutlined />}
            style={{ marginBottom: 16 }}
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="邮箱"
              size="large"
              onChange={handleEmailChange}
            />
          </Form.Item>

          {/* reCAPTCHA - 放在邮箱后面，验证码前面 */}
          {config?.require_recaptcha && config.recaptcha_site_key && (
            <Form.Item label="人机验证" required>
              <ReCaptcha
                siteKey={config.recaptcha_site_key}
                onVerify={handleRecaptchaVerify}
                onExpire={handleRecaptchaExpire}
              />
            </Form.Item>
          )}

          {/* 邮箱验证码 */}
          {config?.require_email_verification && (
            <Form.Item
              label="邮箱验证码"
              required
              extra="验证码有效期为10分钟"
            >
              <EmailVerification
                email={emailValue}
                recaptchaToken={recaptchaToken}
                onCodeChange={setVerificationCode}
                disabled={isLoading}
              />
            </Form.Item>
          )}

          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名至少 3 个字符' },
              { max: 50, message: '用户名最多 50 个字符' },
              {
                pattern: /^[a-zA-Z0-9_]+$/,
                message: '用户名只能包含字母、数字和下划线',
              },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
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
              placeholder="密码"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirm_password"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码' },
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
              placeholder="确认密码"
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
              注册
            </Button>
          </Form.Item>
        </Form>

        <Divider>
          <Text type="secondary">已有账户？</Text>
        </Divider>

        <div style={{ textAlign: 'center' }}>
          <Link to="/login">
            <Button type="link">返回登录</Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
