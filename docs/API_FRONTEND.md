# Zinnia Frontend API Reference

> 前端代码中使用的所有 API 接口完整文档
>
> 版本：v1.0 | 基础路径：`/api/v1`

---

## 目录

1. [通用规范](#通用规范)
2. [认证安全 API](#认证安全-api)
3. [用户管理 API](#用户管理-api)
4. [设备管理 API](#设备管理-api)
5. [电量数据 API](#电量数据-api)
6. [预警管理 API](#预警管理-api)
7. [错误码参考](#错误码参考)
8. [TypeScript 调用示例](#typescript-调用示例)

---

## 通用规范

### 请求格式

- **Content-Type**: `application/json`
- **字符编码**: UTF-8
- **时间格式**: ISO 8601（如 `2026-01-12T10:30:00Z`）

### 响应结构

所有 API 响应遵循统一格式：

```json
{
  "code": 200,
  "message": "success",
  "data": { ... },
  "timestamp": "2026-01-12T10:30:00.000Z",
  "request_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `code` | number | HTTP 状态码 |
| `message` | string | 响应消息 |
| `data` | object/array/null | 响应数据 |
| `timestamp` | string | 服务器时间戳 |
| `request_id` | string | 请求追踪 ID（可选） |

### 分页响应

列表类接口返回分页结构：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "items": [ ... ],
    "pagination": {
      "page": 1,
      "page_size": 20,
      "total_items": 150,
      "total_pages": 8
    }
  }
}
```

### 认证方式

所有 API（除公开接口外）需要在请求头中携带 Token：

```
Authorization: Bearer <access_token>
```

---

## 认证安全 API

> 文件：`src/api/security.ts`
>
> 导入：`import { securityApi } from '@/api'`

### 获取 reCAPTCHA 配置

```typescript
// GET /api/v1/auth/recaptcha/config
const config = await securityApi.getRecaptchaConfig()
// 返回: { enabled: boolean, site_key: string | null }
```

**响应示例**：
```json
{
  "code": 200,
  "data": { "enabled": true, "site_key": "6LcXXX..." }
}
```

---

### 获取注册配置

```typescript
// GET /api/v1/auth/registration/config
const config = await securityApi.getRegistrationConfig()
// 返回: { require_email_verification: boolean, require_recaptcha: boolean, recaptcha_site_key: string | null }
```

---

### 发送验证码

```typescript
// POST /api/v1/auth/verification/send
interface SendVerificationCodeRequest {
  email: string
  purpose: 'registration' | 'password_reset'
  recaptcha_token?: string
}

const result = await securityApi.sendVerificationCode({
  email: 'user@example.com',
  purpose: 'registration',
  recaptcha_token: '...'
})
// 返回: { message: string, expires_in_minutes: number }
```

---

### 验证验证码

```typescript
// POST /api/v1/auth/verification/verify
interface VerifyCodeRequest {
  email: string
  code: string
  purpose: string
}

const result = await securityApi.verifyCode({
  email: 'user@example.com',
  code: '123456',
  purpose: 'registration'
})
// 返回: { message: string }
```

---

### 发送密码重置验证码

```typescript
// POST /api/v1/auth/password-reset/send
const result = await securityApi.sendPasswordResetCode({
  email: 'user@example.com',
  recaptcha_token: '...'
})
// 返回: { message: string, expires_in_minutes: number }
```

---

### 确认密码重置

```typescript
// POST /api/v1/auth/password-reset/confirm
interface PasswordResetConfirmRequest {
  email: string
  code: string
  new_password: string
  confirm_password: string
}

await securityApi.confirmPasswordReset({
  email: 'user@example.com',
  code: '123456',
  new_password: 'NewSecure123!',
  confirm_password: 'NewSecure123!'
})
```

---

## 用户管理 API

> 文件：`src/api/auth.ts`
>
> 导入：`import { authApi } from '@/api'`

### 用户注册

```typescript
// POST /api/v1/users/register
interface RegisterRequest {
  email: string
  username: string
  password: string
  confirm_password: string
  recaptcha_token?: string
  verification_code?: string
}

const user = await authApi.register({
  email: 'user@example.com',
  username: 'johndoe',
  password: 'SecurePass123!',
  confirm_password: 'SecurePass123!'
})
```

**响应**：`User` 对象

---

### 用户登录

```typescript
// POST /api/v1/users/login
interface LoginRequest {
  login: string  // 邮箱或用户名
  password: string
  device_info?: string
}

interface LoginResponse {
  user: User
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

const response = await authApi.login({
  login: 'user@example.com',
  password: 'SecurePass123!',
  device_info: 'Chrome on macOS'
})
```

---

### 刷新令牌

```typescript
// POST /api/v1/users/refresh
interface RefreshTokenRequest {
  refresh_token: string
}

const response = await authApi.refreshToken({
  refresh_token: '...'
})
// 返回新的 LoginResponse，自动更新本地 token
```

---

### 用户登出

```typescript
// POST /api/v1/users/logout
await authApi.logout(refreshToken)
// 清除本地 token
```

---

### 获取当前用户

```typescript
// GET /api/v1/users/me
const user = await authApi.getCurrentUser()
```

---

### 更新当前用户

```typescript
// PUT /api/v1/users/me
interface UpdateUserRequest {
  username?: string
  metadata?: Record<string, unknown>
}

const user = await authApi.updateCurrentUser({
  username: 'newusername',
  metadata: { theme: 'dark' }
})
```

---

### 修改密码

```typescript
// PUT /api/v1/users/me/password
interface ChangePasswordRequest {
  current_password: string
  new_password: string
  confirm_password: string
}

await authApi.changePassword({
  current_password: 'OldPass123!',
  new_password: 'NewSecure456!',
  confirm_password: 'NewSecure456!'
})
```

---

### 登出所有设备

```typescript
// POST /api/v1/users/logout-all
interface LogoutAllResponse {
  message: string
  sessions_revoked: number
}

const result = await authApi.logoutAll()
```

---

### 共享设备给用户

```typescript
// POST /api/v1/users/devices/{device_id}/share
interface ShareDeviceRequest {
  user_identifier: string  // 邮箱或用户名
  permission?: 'read' | 'write' | 'admin'
}

await authApi.shareDevice(deviceId, {
  user_identifier: 'friend@example.com',
  permission: 'read'
})
```

---

### 获取设备共享列表

```typescript
// GET /api/v1/users/devices/{device_id}/shares
interface DeviceShare {
  id: string
  device_id: string
  user_id: string
  username: string
  email: string
  permission: 'read' | 'write' | 'admin'
  created_at: string
}

const shares = await authApi.getDeviceShares(deviceId)
```

---

### 取消设备共享

```typescript
// DELETE /api/v1/users/devices/{device_id}/share/{user_id}
await authApi.removeDeviceShare(deviceId, userId)
```

---

### 管理员：获取用户列表

```typescript
// GET /api/v1/users
interface PaginationParams {
  page?: number
  page_size?: number
}

interface UserListParams extends PaginationParams {
  role?: string
  is_active?: boolean
  search?: string
}

interface PaginatedResponse<T> {
  items: T[]
  pagination: {
    page: number
    page_size: number
    total_items: number
    total_pages: number
  }
}

const response = await authApi.getUsers({
  page: 1,
  page_size: 20,
  search: 'example'
})
```

---

### 管理员：获取用户详情

```typescript
// GET /api/v1/users/{user_id}
const user = await authApi.getUserById(userId)
```

---

### 管理员：删除用户

```typescript
// DELETE /api/v1/users/{user_id}
await authApi.deleteUser(userId)
```

---

## 设备管理 API

> 文件：`src/api/devices.ts`
>
> 导入：`import { devicesApi } from '@/api'`

### 创建设备

```typescript
// POST /api/v1/devices
interface CreateDeviceRequest {
  name: string
  device_type: string
  metadata?: Record<string, unknown>
}

interface CreateDeviceResponse {
  device: Device
  api_key: string  // 仅返回一次，请妥善保存！
  config: DeviceConfig
}

const response = await devicesApi.createDevice({
  name: '客厅传感器',
  device_type: 'battery_sensor',
  metadata: { location: 'living_room' }
})
```

---

### 获取设备列表

```typescript
// GET /api/v1/devices
interface DeviceListParams {
  page?: number
  page_size?: number
  status?: 'online' | 'offline' | 'maintenance' | 'disabled'
  device_type?: string
}

interface Device {
  id: string
  owner_id: string | null
  name: string
  device_type: string
  status: DeviceStatus
  api_key_prefix: string
  created_at: string
  updated_at: string
  last_seen_at: string | null
  metadata?: Record<string, unknown>
}

const response = await devicesApi.getDevices({ page: 1, page_size: 20 })
```

---

### 获取设备详情

```typescript
// GET /api/v1/devices/{id}
const device = await devicesApi.getDevice(deviceId)
```

---

### 更新设备

```typescript
// PUT /api/v1/devices/{id}
interface UpdateDeviceRequest {
  name?: string
  status?: DeviceStatus
  metadata?: Record<string, unknown>
}

const device = await devicesApi.updateDevice(deviceId, {
  name: '新名称',
  status: 'maintenance'
})
```

---

### 删除设备

```typescript
// DELETE /api/v1/devices/{id}
await devicesApi.deleteDevice(deviceId)
```

---

### 获取设备配置

```typescript
// GET /api/v1/devices/{id}/config
interface DeviceConfig {
  device_id: string
  low_battery_threshold: number
  critical_battery_threshold: number
  report_interval_seconds: number
  high_temperature_threshold: number
  updated_at?: string
}

const config = await devicesApi.getDeviceConfig(deviceId)
```

---

### 更新设备配置

```typescript
// PUT /api/v1/devices/{id}/config
interface UpdateDeviceConfigRequest {
  low_battery_threshold?: number
  critical_battery_threshold?: number
  report_interval_seconds?: number
  high_temperature_threshold?: number
}

const config = await devicesApi.updateDeviceConfig(deviceId, {
  low_battery_threshold: 25,
  high_temperature_threshold: 45.0
})
```

---

### 轮换设备 API Key

```typescript
// POST /api/v1/devices/{id}/rotate-key
interface RotateKeyResponse {
  api_key: string
  api_key_prefix: string
}

const result = await devicesApi.rotateDeviceKey(deviceId)
```

---

### 创建设备访问令牌

```typescript
// POST /api/v1/devices/{id}/tokens
interface CreateDeviceTokenRequest {
  name: string
  permission: 'read' | 'write' | 'all'
  expires_in_hours?: number
  allowed_ips?: string[]
  rate_limit_per_minute?: number
}

interface DeviceToken {
  id: string
  device_id: string
  name: string
  token?: string  // 仅创建时返回
  token_prefix: string
  permission: 'read' | 'write' | 'all'
  is_revoked: boolean
  expires_at: string | null
  last_used_at: string | null
  use_count: number
  created_at: string
}

const token = await devicesApi.createDeviceToken(deviceId, {
  name: 'IoT 传感器令牌',
  permission: 'write',
  expires_in_hours: 720
})
```

---

### 获取设备令牌列表

```typescript
// GET /api/v1/devices/{id}/tokens
interface TokenListParams {
  include_revoked?: boolean
  include_expired?: boolean
}

const tokens = await devicesApi.getDeviceTokens(deviceId, {
  include_revoked: false
})
```

---

### 吊销单个令牌

```typescript
// DELETE /api/v1/devices/{device_id}/tokens/{token_id}
await devicesApi.revokeDeviceToken(deviceId, tokenId)
```

---

### 吊销设备所有令牌

```typescript
// DELETE /api/v1/devices/{id}/tokens
interface RevokeAllResponse {
  revoked_count: number
  message: string
}

const result = await devicesApi.revokeAllDeviceTokens(deviceId)
```

---

## 电量数据 API

> 文件：`src/api/battery.ts`
>
> 导入：`import { batteryApi } from '@/api'`

### 获取最新电量

```typescript
// GET /api/v1/battery/latest/{device_id}
interface LatestBattery {
  device_id: string
  battery_level: number
  is_charging: boolean
  power_saving_mode: string
  recorded_at: string
  is_low_battery: boolean
  is_critical: boolean
  temperature?: number
  voltage?: number
}

const battery = await batteryApi.getLatestBattery(deviceId)
```

---

### 查询历史数据

```typescript
// GET /api/v1/battery/history/{device_id}
interface BatteryHistoryParams {
  start_time: string  // ISO 8601
  end_time: string    // ISO 8601
  limit?: number
  offset?: number
}

interface BatteryData {
  id: string
  device_id: string
  battery_level: number
  is_charging: boolean
  power_saving_mode: 'off' | 'low' | 'medium' | 'high' | 'extreme'
  temperature?: number
  voltage?: number
  recorded_at: string
  created_at: string
}

const history = await batteryApi.getBatteryHistory(deviceId, {
  start_time: '2026-01-11T00:00:00Z',
  end_time: '2026-01-12T00:00:00Z',
  limit: 100
})
```

---

### 获取聚合统计

```typescript
// GET /api/v1/battery/aggregated/{device_id}
type AggregationInterval = 'minute' | 'hour' | 'day'

interface BatteryAggregatedParams {
  start_time: string
  end_time: string
  interval?: AggregationInterval
}

interface AggregatedBatteryData {
  bucket: string
  avg_level: number
  min_level: number
  max_level: number
  count: number
}

const aggregated = await batteryApi.getAggregatedBattery(deviceId, {
  start_time: '2026-01-11T00:00:00Z',
  end_time: '2026-01-12T00:00:00Z',
  interval: 'hour'
})
```

---

### 获取统计摘要

```typescript
// GET /api/v1/battery/stats/{device_id}
interface BatteryStatsParams {
  start_time: string
  end_time: string
}

interface BatteryStats {
  device_id: string
  period_start: string
  period_end: string
  avg_battery_level: number
  min_battery_level: number
  max_battery_level: number
  total_records: number
  charging_duration_minutes: number
  low_battery_count: number
}

const stats = await batteryApi.getBatteryStats(deviceId, {
  start_time: '2026-01-11T00:00:00Z',
  end_time: '2026-01-12T00:00:00Z'
})
```

---

## 预警管理 API

> 文件：`src/api/alerts.ts`
>
> 导入：`import { alertsApi } from '@/api'`

### 创建预警规则

```typescript
// POST /api/v1/alerts/rules
type AlertType = 'low_battery' | 'critical_battery' | 'high_temperature' | 'device_offline' | 'rapid_drain'
type AlertLevel = 'info' | 'warning' | 'critical'

interface CreateAlertRuleRequest {
  name: string
  alert_type: AlertType
  level: AlertLevel
  cooldown_minutes?: number
  enabled?: boolean
}

interface AlertRule {
  id: string
  user_id?: string
  name: string
  alert_type: AlertType
  level: AlertLevel
  cooldown_minutes: number
  enabled: boolean
  created_at: string
  updated_at: string
}

const rule = await alertsApi.createAlertRule({
  name: '低电量预警',
  alert_type: 'low_battery',
  level: 'warning',
  cooldown_minutes: 30
})
```

---

### 获取预警规则列表

```typescript
// GET /api/v1/alerts/rules
const rules = await alertsApi.getAlertRules()
```

---

### 更新预警规则

```typescript
// PUT /api/v1/alerts/rules/{id}
interface UpdateAlertRuleRequest {
  name?: string
  alert_type?: AlertType
  level?: AlertLevel
  cooldown_minutes?: number
  enabled?: boolean
}

const rule = await alertsApi.updateAlertRule(ruleId, {
  name: '新名称',
  enabled: false
})
```

---

### 删除预警规则

```typescript
// DELETE /api/v1/alerts/rules/{id}
await alertsApi.deleteAlertRule(ruleId)
```

---

### 获取预警事件列表

```typescript
// GET /api/v1/alerts/events
type AlertStatus = 'active' | 'acknowledged' | 'resolved'

interface AlertEventParams {
  device_id?: string
  level?: AlertLevel
  status?: AlertStatus
  alert_type?: AlertType
  page?: number
  page_size?: number
}

interface AlertEvent {
  id: string
  device_id: string
  rule_id: string
  alert_type: AlertType
  level: AlertLevel
  status: AlertStatus
  message: string
  value: number
  threshold: number
  triggered_at: string
  acknowledged_at: string | null
  resolved_at: string | null
}

const response = await alertsApi.getAlertEvents({ device_id: deviceId })
```

---

### 确认预警

```typescript
// POST /api/v1/alerts/events/{id}/acknowledge
await alertsApi.acknowledgeAlert(eventId)
```

---

### 解决预警

```typescript
// POST /api/v1/alerts/events/{id}/resolve
await alertsApi.resolveAlert(eventId)
```

---

### 更新预警状态

```typescript
// PUT /api/v1/alerts/events/{id}/status
await alertsApi.updateAlertStatus(eventId, 'resolved')
```

---

### 获取设备活跃预警数

```typescript
// GET /api/v1/alerts/devices/{device_id}/count
interface ActiveAlertCount {
  active_count: number
}

const count = await alertsApi.getDeviceActiveAlertCount(deviceId)
```

---

## 错误码参考

### HTTP 状态码

| 状态码 | 说明 | 场景 |
|--------|------|------|
| 200 | OK | 请求成功 |
| 201 | Created | 资源创建成功 |
| 204 | No Content | 删除成功 |
| 400 | Bad Request | 请求参数无效 |
| 401 | Unauthorized | 未认证或令牌无效 |
| 403 | Forbidden | 无权限访问 |
| 404 | Not Found | 资源不存在 |
| 409 | Conflict | 资源冲突 |
| 429 | Too Many Requests | 请求频率过高 |
| 500 | Internal Server Error | 服务器内部错误 |

### 错误响应格式

```json
{
  "code": 401,
  "message": "认证失败：令牌已过期",
  "request_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

## TypeScript 调用示例

### 完整登录流程

```typescript
import { authApi } from '@/api'

async function login() {
  const response = await authApi.login({
    login: 'user@example.com',
    password: 'SecurePass123!'
  })

  console.log('User:', response.user)
  console.log('Token expires in:', response.expires_in, 'seconds')

  // Token 已自动保存到 localStorage
}
```

### 带错误处理的设备列表

```typescript
import { devicesApi } from '@/api'
import { message } from 'antd'

async function fetchDevices() {
  try {
    const response = await devicesApi.getDevices({
      page: 1,
      page_size: 20,
      status: 'online'
    })

    console.log('Total devices:', response.pagination.total_items)
    return response.items
  } catch (error) {
    if (error instanceof Error) {
      message.error(error.message)
    }
    return []
  }
}
```

### 设备电量历史查询

```typescript
import { batteryApi } from '@/api'

async function getBatteryHistory(deviceId: string) {
  const endTime = new Date()
  const startTime = new Date(endTime.getTime() - 24 * 60 * 60 * 1000) // 24小时前

  const history = await batteryApi.getBatteryHistory(deviceId, {
    start_time: startTime.toISOString(),
    end_time: endTime.toISOString(),
    limit: 100
  })

  return history
}
```

### 预警规则 CRUD

```typescript
import { alertsApi } from '@/api'

// 创建规则
const rule = await alertsApi.createAlertRule({
  name: '高温预警',
  alert_type: 'high_temperature',
  level: 'critical',
  cooldown_minutes: 60
})

// 更新规则
await alertsApi.updateAlertRule(rule.id, {
  cooldown_minutes: 30,
  enabled: true
})

// 删除规则
await alertsApi.deleteAlertRule(rule.id)
```

---

## API 汇总

| 模块 | 文件 | 端点数量 |
|------|------|----------|
| 认证安全 | `security.ts` | 6 |
| 用户管理 | `auth.ts` | 14 |
| 设备管理 | `devices.ts` | 12 |
| 电量数据 | `battery.ts` | 4 |
| 预警管理 | `alerts.ts` | 9 |
| **总计** | - | **45** |

---

**文档版本**：1.0
**最后更新**：2026-01-22
