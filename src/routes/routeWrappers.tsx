import React, { Suspense } from 'react'
import { LoadingSpinner } from '@/components'

/**
 * Suspense 包装组件
 *
 * 为懒加载的组件提供加载状态
 */
export const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
)
