/// <reference lib="webworker" />

const CACHE_NAME = 'zinnia-v1'
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/manifest.json',
]

// 安装事件
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting()
})

// 激活事件
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    })
  )
  self.clients.claim()
})

// 请求拦截
self.addEventListener('fetch', (event) => {
  const { request } = event

  // 跳过非 GET 请求
  if (request.method !== 'GET') {
    return
  }

  // 跳过 API 请求（不缓存）
  if (request.url.includes('/api/')) {
    return
  }

  // 跳过 Chrome 扩展等非 http(s) 请求
  if (!request.url.startsWith('http')) {
    return
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // 返回缓存，同时后台更新
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          // 有效响应才缓存
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return networkResponse
        })
        .catch(() => cachedResponse)

      return cachedResponse || fetchPromise
    })
  )
})

// 推送通知
self.addEventListener('push', (event) => {
  if (!event.data) return

  const data = event.data.json()
  const options = {
    body: data.body || '您有新的预警通知',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    tag: data.tag || 'zinnia-notification',
    data: data.url || '/',
    vibrate: [100, 50, 100],
    actions: [
      { action: 'view', title: '查看详情' },
      { action: 'dismiss', title: '忽略' },
    ],
  }

  event.waitUntil(
    self.registration.showNotification(data.title || 'Zinnia 预警', options)
  )
})

// 通知点击
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'dismiss') {
    return
  }

  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientList) => {
      // 如果已有窗口打开，聚焦它
      for (const client of clientList) {
        if (client.url.includes(self.registration.scope) && 'focus' in client) {
          client.focus()
          client.navigate(event.notification.data)
          return
        }
      }
      // 否则打开新窗口
      if (self.clients.openWindow) {
        return self.clients.openWindow(event.notification.data)
      }
    })
  )
})
