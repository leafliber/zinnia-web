import { useCallback } from 'react'

/**
 * 重置 reCAPTCHA 的 hook
 *
 * @example
 * const resetReCaptcha = useReCaptchaReset()
 * resetReCaptcha(widgetId)
 */
export const useReCaptchaReset = () => {
  const reset = useCallback((widgetId?: number) => {
    if (window.grecaptcha) {
      try {
        window.grecaptcha.reset(widgetId)
      } catch {
        // 忽略错误
      }
    }
  }, [])

  return reset
}
