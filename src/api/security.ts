import apiClient from './client'
import type {
  ApiResponse,
  RecaptchaConfig,
  RegistrationConfig,
  SendVerificationCodeRequest,
  SendVerificationCodeResponse,
  VerifyCodeRequest,
  PasswordResetSendRequest,
  PasswordResetConfirmRequest,
} from '@/types'

// 获取 reCAPTCHA 配置
export const getRecaptchaConfig = async (): Promise<RecaptchaConfig> => {
  const response = await apiClient.get<ApiResponse<RecaptchaConfig>>('/auth/recaptcha/config')
  return response.data.data!
}

// 获取注册安全配置
export const getRegistrationConfig = async (): Promise<RegistrationConfig> => {
  const response = await apiClient.get<ApiResponse<RegistrationConfig>>('/auth/registration/config')
  return response.data.data!
}

// 发送注册验证码
export const sendVerificationCode = async (
  data: SendVerificationCodeRequest
): Promise<SendVerificationCodeResponse> => {
  const response = await apiClient.post<ApiResponse<SendVerificationCodeResponse>>(
    '/auth/verification/send',
    data
  )
  return response.data.data!
}

// 验证验证码
export const verifyCode = async (data: VerifyCodeRequest): Promise<{ message: string }> => {
  const response = await apiClient.post<ApiResponse<{ message: string }>>(
    '/auth/verification/verify',
    data
  )
  return response.data.data!
}

// 发送密码重置验证码
export const sendPasswordResetCode = async (
  data: PasswordResetSendRequest
): Promise<SendVerificationCodeResponse> => {
  const response = await apiClient.post<ApiResponse<SendVerificationCodeResponse>>(
    '/auth/password-reset/send',
    data
  )
  return response.data.data!
}

// 确认密码重置
export const confirmPasswordReset = async (
  data: PasswordResetConfirmRequest
): Promise<{ message: string }> => {
  const response = await apiClient.post<ApiResponse<{ message: string }>>(
    '/auth/password-reset/confirm',
    data
  )
  return response.data.data!
}
