import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'
import { authApi, getRefreshToken, clearTokens } from '@/api'

interface AuthState {
  // 状态
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean

  // 动作
  setUser: (user: User | null) => void
  login: (login: string, password: string) => Promise<void>
  register: (email: string, username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  fetchCurrentUser: () => Promise<void>
  updateUser: (data: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => {
        set({ user, isAuthenticated: !!user })
      },

      login: async (login, password) => {
        set({ isLoading: true })
        try {
          const response = await authApi.login({ login, password })
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      register: async (email, username, password) => {
        set({ isLoading: true })
        try {
          await authApi.register({
            email,
            username,
            password,
            confirm_password: password,
          })
          set({ isLoading: false })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: async () => {
        const refreshToken = getRefreshToken()
        try {
          if (refreshToken) {
            await authApi.logout(refreshToken)
          }
        } catch {
          // 忽略登出错误
        } finally {
          clearTokens()
          set({ user: null, isAuthenticated: false })
        }
      },

      fetchCurrentUser: async () => {
        const { isAuthenticated } = get()
        if (!isAuthenticated) return

        set({ isLoading: true })
        try {
          const user = await authApi.getCurrentUser()
          set({ user, isLoading: false })
        } catch {
          // 如果获取用户失败，清除认证状态
          clearTokens()
          set({ user: null, isAuthenticated: false, isLoading: false })
        }
      },

      updateUser: (data) => {
        const { user } = get()
        if (user) {
          set({ user: { ...user, ...data } })
        }
      },
    }),
    {
      name: 'zinnia-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
