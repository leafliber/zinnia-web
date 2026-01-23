# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Zinnia Web is a React 19 + TypeScript frontend for device battery monitoring and alerting. Uses Ant Design 5 for UI, Zustand for state management, and React Router 7 for routing.

## Common Commands

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build (outputs to dist/)
npm run build:github # Build for GitHub Pages
npm run lint         # Run ESLint
npm run preview      # Preview production build locally
npm run deploy       # Deploy via scripts/deploy.sh
```

## Architecture

### Data Flow

```
Pages → Custom Hooks → Zustand Stores / API Layer → Axios Client → Backend API
```

Pages delegate business logic to hooks (e.g., `useAuth`, `useDevices`). Hooks interact with Zustand stores for state and API modules for server communication.

### Routing (`src/routes/index.tsx`)

- React Router 7 with `createBrowserRouter` and code splitting via `React.lazy()`
- **ProtectedRoute**: Redirects unauthenticated users to `/login`
- **PublicRoute**: Redirects authenticated users away from login/register pages
- All protected routes use `AppLayout` as parent component with `Header` and `Sidebar`

### State Management

**AuthStore** (`src/stores/authStore.ts`):
- Zustand with `persist` middleware (localStorage)
- Manages user session, tokens, and auth state
- Integrates with token refresh queue for concurrent requests

**DeviceStore** (`src/stores/deviceStore.ts`):
- Manages device list, pagination, filters, and selected device
- No persistence - fetched from API on mount
- Supports optimistic CRUD updates

### API Layer (`src/api/`)

- Axios instance with base URL from `VITE_API_BASE_URL` env var
- Barrel export pattern: `import { authApi, devicesApi, batteryApi, alertsApi, securityApi } from '@/api'`

**Request interceptor**: Adds `Authorization: Bearer <token>` header

**Response interceptor**:
- Handles 401 errors with automatic token refresh
- Queues concurrent requests during refresh (prevents token storms)
- Extracts user-friendly error messages from response body

**Token storage keys**: `zinnia_access_token`, `zinnia_refresh_token` in localStorage

### Custom Hooks

| Hook | Purpose |
|------|---------|
| `useAuth` | Login/register/logout with navigation/toast handling |
| `useDevices` | Device CRUD, pagination, filters |
| `useRefreshToken` | Periodic token refresh (default 12min via `VITE_TOKEN_REFRESH_INTERVAL`) |

### Path Aliases

`@/` resolves to `/src` (configured in `tsconfig.json` and `vite.config.ts`)

### Component Patterns

- **Barrel exports**: Each component folder has `index.ts` for clean public APIs
- **Layout composition**: `AppLayout` wraps protected routes with `Header` and `Sidebar`
- **Mobile responsive**: Sidebar collapses to drawer on mobile breakpoints
- **Charts**: ECharts-based components in `src/components/charts/`

## Important Files

| File | Purpose |
|------|---------|
| `src/routes/index.tsx` | Route definitions with lazy loading and guards |
| `src/api/client.ts` | Axios config, interceptors, token refresh logic |
| `src/stores/authStore.ts` | Auth state and persistence (persist middleware) |
| `src/hooks/useAuth.ts` | Auth business logic with antd message + navigation |
| `src/stores/deviceStore.ts` | Device state, optimistic updates |
| `vite.config.ts` | Build config with path aliases and dev proxy |
| `.env.example` | Environment variables reference |
| `docs/API_FRONTEND.md` | Complete frontend API reference (45 endpoints) |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `/api/v1` | Backend API base URL |
| `VITE_APP_TITLE` | `Zinnia 设备监控平台` | App title |
| `VITE_TOKEN_REFRESH_INTERVAL` | `720000` | Token refresh interval (ms, default 12min) |
| `VITE_APP_NAME` | `Zinnia` | App name |
| `VITE_RECAPTCHA_SITE_KEY` | - | reCAPTCHA site key (optional) |
| `VITE_GA_TRACKING_ID` | - | Google Analytics ID (optional) |
| `VITE_SENTRY_DSN` | - | Sentry DSN (optional) |

## PWA Assets Missing

The following PWA icons need to be generated and placed in `public/icons/`:
- icon-72x72.png, icon-96x96.png, icon-128x128.png
- icon-144x144.png, icon-152x152.png, icon-192x192.png
- icon-384x384.png, icon-512x512.png

Use https://realfavicongenerator.net/ from `public/favicon.svg`
