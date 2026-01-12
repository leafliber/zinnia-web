import { create } from 'zustand'
import type { Device, DeviceListParams, PaginatedResponse } from '@/types'
import { devicesApi } from '@/api'

interface DeviceState {
  // 状态
  devices: Device[]
  pagination: {
    page: number
    page_size: number
    total_items: number
    total_pages: number
  }
  selectedDevice: Device | null
  isLoading: boolean
  error: string | null

  // 筛选条件
  filters: DeviceListParams

  // 动作
  setFilters: (filters: DeviceListParams) => void
  fetchDevices: () => Promise<void>
  fetchDevice: (id: string) => Promise<Device>
  setSelectedDevice: (device: Device | null) => void
  addDevice: (device: Device) => void
  updateDevice: (device: Device) => void
  removeDevice: (id: string) => void
  refreshDevices: () => Promise<void>
}

export const useDeviceStore = create<DeviceState>((set, get) => ({
  devices: [],
  pagination: {
    page: 1,
    page_size: 20,
    total_items: 0,
    total_pages: 0,
  },
  selectedDevice: null,
  isLoading: false,
  error: null,
  filters: {
    page: 1,
    page_size: 20,
  },

  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } })
  },

  fetchDevices: async () => {
    set({ isLoading: true, error: null })
    try {
      const { filters } = get()
      const response: PaginatedResponse<Device> = await devicesApi.getDevices(filters)
      set({
        devices: response.items,
        pagination: response.pagination,
        isLoading: false,
      })
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : '获取设备列表失败',
      })
    }
  },

  fetchDevice: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const device = await devicesApi.getDevice(id)
      set({ selectedDevice: device, isLoading: false })
      return device
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : '获取设备详情失败',
      })
      throw error
    }
  },

  setSelectedDevice: (device) => {
    set({ selectedDevice: device })
  },

  addDevice: (device) => {
    set((state) => ({
      devices: [device, ...state.devices],
      pagination: {
        ...state.pagination,
        total_items: state.pagination.total_items + 1,
      },
    }))
  },

  updateDevice: (updatedDevice) => {
    set((state) => ({
      devices: state.devices.map((d) => (d.id === updatedDevice.id ? updatedDevice : d)),
      selectedDevice:
        state.selectedDevice?.id === updatedDevice.id ? updatedDevice : state.selectedDevice,
    }))
  },

  removeDevice: (id) => {
    set((state) => ({
      devices: state.devices.filter((d) => d.id !== id),
      selectedDevice: state.selectedDevice?.id === id ? null : state.selectedDevice,
      pagination: {
        ...state.pagination,
        total_items: Math.max(0, state.pagination.total_items - 1),
      },
    }))
  },

  refreshDevices: async () => {
    await get().fetchDevices()
  },
}))
