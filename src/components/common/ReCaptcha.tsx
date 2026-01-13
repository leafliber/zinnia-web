import React, { useEffect, useRef, useCallback } from 'react'

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void
      render: (
        container: HTMLElement,
        options: {
          sitekey: string
          callback: (token: string) => void
          'expired-callback'?: () => void
          'error-callback'?: () => void
          theme?: 'light' | 'dark'
          size?: 'normal' | 'compact'
        }
      ) => number
      reset: (widgetId?: number) => void
      getResponse: (widgetId?: number) => string
    }
    onRecaptchaLoad?: () => void
  }
}

interface ReCaptchaProps {
  siteKey: string
  onVerify: (token: string) => void
  onExpire?: () => void
  onError?: () => void
  theme?: 'light' | 'dark'
  size?: 'normal' | 'compact'
}

let isScriptLoaded = false
let isScriptLoading = false
const loadCallbacks: (() => void)[] = []

const loadReCaptchaScript = (callback: () => void) => {
  if (isScriptLoaded) {
    callback()
    return
  }

  loadCallbacks.push(callback)

  if (isScriptLoading) {
    return
  }

  isScriptLoading = true

  window.onRecaptchaLoad = () => {
    isScriptLoaded = true
    isScriptLoading = false
    loadCallbacks.forEach((cb) => cb())
    loadCallbacks.length = 0
  }

  const script = document.createElement('script')
  script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit'
  script.async = true
  script.defer = true
  document.head.appendChild(script)
}

export const ReCaptcha: React.FC<ReCaptchaProps> = ({
  siteKey,
  onVerify,
  onExpire,
  onError,
  theme = 'light',
  size = 'normal',
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<number | null>(null)

  const renderReCaptcha = useCallback(() => {
    if (!containerRef.current || widgetIdRef.current !== null) return

    window.grecaptcha.ready(() => {
      if (!containerRef.current) return

      widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
        sitekey: siteKey,
        callback: onVerify,
        'expired-callback': onExpire,
        'error-callback': onError,
        theme,
        size,
      })
    })
  }, [siteKey, onVerify, onExpire, onError, theme, size])

  useEffect(() => {
    loadReCaptchaScript(renderReCaptcha)

    return () => {
      // 清理时重置 widget
      if (widgetIdRef.current !== null && window.grecaptcha) {
        try {
          window.grecaptcha.reset(widgetIdRef.current)
        } catch {
          // 忽略重置错误
        }
      }
      widgetIdRef.current = null
    }
  }, [renderReCaptcha])

  return <div ref={containerRef} style={{ display: 'flex', justifyContent: 'center' }} />
}

// 重置 reCAPTCHA 的 hook
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
