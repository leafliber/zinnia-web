// 本地存储封装

const PREFIX = 'zinnia_'

// 设置存储
export const setStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch (error) {
    console.error('Failed to save to localStorage:', error)
  }
}

// 获取存储
export const getStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(PREFIX + key)
    if (item === null) return defaultValue
    return JSON.parse(item) as T
  } catch {
    return defaultValue
  }
}

// 移除存储
export const removeStorage = (key: string): void => {
  localStorage.removeItem(PREFIX + key)
}

// 清除所有 zinnia 相关存储
export const clearAllStorage = (): void => {
  const keysToRemove: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith(PREFIX)) {
      keysToRemove.push(key)
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key))
}

// Session 存储封装
export const setSessionStorage = <T>(key: string, value: T): void => {
  try {
    sessionStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch (error) {
    console.error('Failed to save to sessionStorage:', error)
  }
}

export const getSessionStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = sessionStorage.getItem(PREFIX + key)
    if (item === null) return defaultValue
    return JSON.parse(item) as T
  } catch {
    return defaultValue
  }
}

export const removeSessionStorage = (key: string): void => {
  sessionStorage.removeItem(PREFIX + key)
}
