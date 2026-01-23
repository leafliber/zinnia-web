// reCAPTCHA 配置响应
export interface RecaptchaConfig {
  enabled: boolean
  site_key: string | null
}

// 注册安全配置响应
export interface RegistrationConfig {
  require_email_verification: boolean
  require_recaptcha: boolean
  recaptcha_site_key: string | null
}

// 发送验证码请求
export interface SendVerificationCodeRequest {
  email: string
  purpose: 'registration' | 'password_reset'
  recaptcha_token?: string
}

// 发送验证码响应
export interface SendVerificationCodeResponse {
  message: string
  expires_in_minutes: number
}

// 验证验证码请求
export interface VerifyCodeRequest {
  email: string
  code: string
}

// 密码重置发送请求
export interface PasswordResetSendRequest {
  email: string
  recaptcha_token?: string
}

// 密码重置确认请求
export interface PasswordResetConfirmRequest {
  email: string
  code: string
  new_password: string
  confirm_password: string
}

// 增强的注册请求（包含验证码和 reCAPTCHA）
export interface EnhancedRegisterRequest {
  email: string
  username: string
  password: string
  recaptcha_token?: string
  verification_code?: string
}
