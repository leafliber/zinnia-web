# 前端 API 使用清单

> 本文档整理了前端代码中实际使用的所有 API 接口，并与后端 API 文档进行对比。
>
> 生成日期：2026-01-13

---

## 目录

1. [认证相关 API (auth.ts)](#认证相关-api)
2. [设备相关 API (devices.ts)](#设备相关-api)
3. [电量数据 API (battery.ts)](#电量数据-api)
4. [预警相关 API (alerts.ts)](#预警相关-api)
5. [安全相关 API (security.ts)](#安全相关-api)
6. [API 对比分析](#api-对比分析)

---

## 认证相关 API

> 文件：`src/api/auth.ts`

| 函数名 | HTTP 方法 | API 路径 | 文档状态 |
|--------|-----------|----------|----------|
| `register` | POST | `/users/register` | ✅ 已文档化 |
| `login` | POST | `/users/login` | ✅ 已文档化 |
| `refreshToken` | POST | `/users/refresh` | ✅ 已文档化 |
| `logout` | POST | `/users/logout` | ✅ 已文档化 |
| `getCurrentUser` | GET | `/users/me` | ✅ 已文档化 |
| `updateCurrentUser` | PUT | `/users/me` | ✅ 已文档化 |
| `changePassword` | PUT | `/users/me/password` | ✅ 已文档化 |
| `logoutAll` | POST | `/users/logout-all` | ✅ 已文档化 |
| `shareDevice` | POST | `/users/devices/{deviceId}/share` | ✅ 已文档化 |
| `getDeviceShares` | GET | `/users/devices/{deviceId}/shares` | ✅ 已文档化 |
| `removeDeviceShare` | DELETE | `/users/devices/{deviceId}/share/{userId}` | ✅ 已文档化 |
| `getUsers` | GET | `/users` | ✅ 已文档化（管理员） |
| `getUserById` | GET | `/users/{userId}` | ✅ 已文档化（管理员） |
| `deleteUser` | DELETE | `/users/{userId}` | ✅ 已文档化（管理员） |

---

## 设备相关 API

> 文件：`src/api/devices.ts`

| 函数名 | HTTP 方法 | API 路径 | 文档状态 |
|--------|-----------|----------|----------|
| `getDevices` | GET | `/devices` | ✅ 已文档化 |
| `createDevice` | POST | `/devices` | ✅ 已文档化 |
| `getDevice` | GET | `/devices/{id}` | ✅ 已文档化 |
| `updateDevice` | PUT | `/devices/{id}` | ✅ 已文档化 |
| `deleteDevice` | DELETE | `/devices/{id}` | ✅ 已文档化 |
| `getDeviceConfig` | GET | `/devices/{id}/config` | ✅ 已文档化 |
| `updateDeviceConfig` | PUT | `/devices/{id}/config` | ✅ 已文档化 |
| `rotateDeviceKey` | POST | `/devices/{id}/rotate-key` | ✅ 已文档化 |
| `createDeviceToken` | POST | `/devices/{deviceId}/tokens` | ✅ 已文档化 |
| `getDeviceTokens` | GET | `/devices/{deviceId}/tokens` | ✅ 已文档化 |
| `revokeDeviceToken` | DELETE | `/devices/{deviceId}/tokens/{tokenId}` | ✅ 已文档化 |
| `revokeAllDeviceTokens` | DELETE | `/devices/{deviceId}/tokens` | ✅ 已文档化 |

---

## 电量数据 API

> 文件：`src/api/battery.ts`

| 函数名 | HTTP 方法 | API 路径 | 文档状态 |
|--------|-----------|----------|----------|
| `getLatestBattery` | GET | `/battery/latest/{deviceId}` | ✅ 已文档化 |
| `getBatteryHistory` | GET | `/battery/history/{deviceId}` | ✅ 已文档化 |
| `getAggregatedBattery` | GET | `/battery/aggregated/{deviceId}` | ✅ 已文档化 |
| `getBatteryStats` | GET | `/battery/stats/{deviceId}` | ✅ 已文档化 |

---

## 预警相关 API

> 文件：`src/api/alerts.ts`

| 函数名 | HTTP 方法 | API 路径 | 文档状态 |
|--------|-----------|----------|----------|
| `getAlertRules` | GET | `/alerts/rules` | ✅ 已文档化 |
| `createAlertRule` | POST | `/alerts/rules` | ✅ 已文档化 |
| `updateAlertRule` | PUT | `/alerts/rules/{id}` | ⚠️ 文档中未详细说明 |
| `deleteAlertRule` | DELETE | `/alerts/rules/{id}` | ⚠️ 文档中未详细说明 |
| `getAlertEvents` | GET | `/alerts/events` | ✅ 已文档化 |
| `acknowledgeAlert` | POST | `/alerts/events/{id}/acknowledge` | ✅ 已文档化 |
| `resolveAlert` | POST | `/alerts/events/{id}/resolve` | ✅ 已文档化 |
| `updateAlertStatus` | PUT | `/alerts/events/{id}/status` | ✅ 已文档化 |
| `getDeviceActiveAlertCount` | GET | `/alerts/devices/{deviceId}/count` | ✅ 已文档化 |

---

## 安全相关 API

> 文件：`src/api/security.ts`

| 函数名 | HTTP 方法 | API 路径 | 文档状态 |
|--------|-----------|----------|----------|
| `getRecaptchaConfig` | GET | `/auth/recaptcha/config` | ❌ 未文档化 |
| `getRegistrationConfig` | GET | `/auth/registration/config` | ❌ 未文档化 |
| `sendVerificationCode` | POST | `/auth/verification/send` | ❌ 未文档化 |
| `verifyCode` | POST | `/auth/verification/verify` | ❌ 未文档化 |
| `sendPasswordResetCode` | POST | `/auth/password-reset/send` | ❌ 未文档化 |
| `confirmPasswordReset` | POST | `/auth/password-reset/confirm` | ❌ 未文档化 |

---

## API 对比分析

### 一、前端使用但文档缺失的 API

以下 API 在前端代码中使用，但在 `API_REFERENCE.md` 中没有详细文档：

#### 1. 安全/认证增强 API（6个）

| API 路径 | 用途 | 建议 |
|----------|------|------|
| `GET /auth/recaptcha/config` | 获取 reCAPTCHA 配置 | 需要添加文档 |
| `GET /auth/registration/config` | 获取注册安全配置 | 需要添加文档 |
| `POST /auth/verification/send` | 发送邮箱验证码 | 需要添加文档 |
| `POST /auth/verification/verify` | 验证验证码 | 需要添加文档 |
| `POST /auth/password-reset/send` | 发送密码重置验证码 | 需要添加文档 |
| `POST /auth/password-reset/confirm` | 确认密码重置 | 需要添加文档 |

#### 2. 预警规则管理 API（2个）

| API 路径 | 用途 | 建议 |
|----------|------|------|
| `PUT /alerts/rules/{id}` | 更新预警规则 | 文档中只有简要描述，需补充请求/响应详情 |
| `DELETE /alerts/rules/{id}` | 删除预警规则 | 文档中只有简要描述，需补充请求/响应详情 |

---

### 二、文档中有但前端未使用的 API

以下 API 在文档中有定义，但前端代码中未使用：

| API 路径 | 用途 | 说明 |
|----------|------|------|
| `POST /battery/report` | 设备上报电量 | 设备端 API，前端不需要 |
| `POST /battery/batch-report` | 设备批量上报 | 设备端 API，前端不需要 |
| `GET /compat/battery/report` | 兼容模式上报 | 设备端 API，前端不需要 |
| `GET /compat/battery/simple` | 极简上报 | 设备端 API，前端不需要 |
| `GET /compat/battery/latest` | 兼容模式获取电量 | 设备端 API，前端不需要 |
| `GET /compat/ping` | 兼容模式健康检查 | 设备端 API，前端不需要 |
| `GET /health` | 基础健康检查 | 运维接口，前端不需要 |
| `GET /health/detailed` | 详细健康检查 | 运维接口，前端不需要 |
| `GET /health/ready` | 就绪检查 | K8s 探针，前端不需要 |
| `GET /health/live` | 存活检查 | K8s 探针，前端不需要 |
| `PUT /users/{user_id}` | 管理员更新用户 | 管理员功能，前端未实现 |

---

### 三、建议的文档补充

#### 3.1 安全认证 API 文档补充

```markdown
## 安全认证接口

### 获取 reCAPTCHA 配置

获取前端 reCAPTCHA 初始化所需的配置。

\`\`\`
GET /api/v1/auth/recaptcha/config
\`\`\`

**成功响应** (200 OK)：

\`\`\`json
{
  "code": 200,
  "message": "success",
  "data": {
    "enabled": true,
    "site_key": "6LcXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
  }
}
\`\`\`

---

### 获取注册配置

获取注册页面的安全配置（是否需要邮箱验证等）。

\`\`\`
GET /api/v1/auth/registration/config
\`\`\`

**成功响应** (200 OK)：

\`\`\`json
{
  "code": 200,
  "message": "success",
  "data": {
    "email_verification_required": true,
    "recaptcha_enabled": true,
    "password_min_length": 8
  }
}
\`\`\`

---

### 发送邮箱验证码

发送邮箱验证码用于注册验证。

\`\`\`
POST /api/v1/auth/verification/send
\`\`\`

**请求体**：

\`\`\`json
{
  "email": "user@example.com",
  "purpose": "registration",
  "recaptcha_token": "..."
}
\`\`\`

---

### 验证验证码

验证用户输入的验证码。

\`\`\`
POST /api/v1/auth/verification/verify
\`\`\`

**请求体**：

\`\`\`json
{
  "email": "user@example.com",
  "code": "123456",
  "purpose": "registration"
}
\`\`\`

---

### 发送密码重置验证码

发送密码重置验证码到用户邮箱。

\`\`\`
POST /api/v1/auth/password-reset/send
\`\`\`

**请求体**：

\`\`\`json
{
  "email": "user@example.com",
  "recaptcha_token": "..."
}
\`\`\`

---

### 确认密码重置

使用验证码重置密码。

\`\`\`
POST /api/v1/auth/password-reset/confirm
\`\`\`

**请求体**：

\`\`\`json
{
  "email": "user@example.com",
  "code": "123456",
  "new_password": "NewSecure123!",
  "confirm_password": "NewSecure123!"
}
\`\`\`
```

---

### 四、类型定义对照

前端类型定义与后端 API 响应的对应关系：

| 前端类型 | 对应 API | 一致性 |
|----------|----------|--------|
| `User` | 用户相关接口 | ✅ 一致 |
| `LoginRequest` / `LoginResponse` | `/users/login` | ✅ 一致 |
| `Device` | 设备相关接口 | ✅ 一致 |
| `DeviceConfig` | `/devices/{id}/config` | ✅ 一致 |
| `DeviceToken` | `/devices/{id}/tokens` | ✅ 一致 |
| `BatteryData` / `LatestBattery` | 电量接口 | ✅ 一致 |
| `BatteryStats` | `/battery/stats` | ✅ 一致 |
| `AlertRule` | 预警规则接口 | ✅ 一致 |
| `AlertEvent` | 预警事件接口 | ✅ 一致 |
| `RecaptchaConfig` | `/auth/recaptcha/config` | ⚠️ 需验证 |
| `RegistrationConfig` | `/auth/registration/config` | ⚠️ 需验证 |

---

### 五、总结

| 类别 | 数量 | 状态 |
|------|------|------|
| 前端使用的 API 总数 | 35 | - |
| 已在文档中的 API | 27 | ✅ |
| 需要补充文档的 API | 8 | ⚠️ |
| 文档有但前端未用的 API | 11 | ℹ️ 正常（设备端/运维接口） |

**建议操作**：
1. 在 `API_REFERENCE.md` 中添加安全认证相关 API 的文档
2. 补充预警规则更新/删除 API 的详细说明
3. 确认 `RecaptchaConfig` 和 `RegistrationConfig` 类型与后端一致
