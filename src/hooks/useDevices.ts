import { useCallback, useState } from 'react'
import { message } from 'antd'
import { useDeviceStore } from '@/stores'
import { devicesApi } from '@/api'
import type { CreateDeviceRequest, UpdateDeviceRequest, CreateDeviceResponse } from '@/types'

/**
 * 设备管理相关 Hook
 */
export const useDevices = () => {
  const {
    devices,
    pagination,
    selectedDevice,
    isLoading,
    filters,
    setFilters,
    fetchDevices,
    fetchDevice,
    setSelectedDevice,
    addDevice,
    updateDevice: updateDeviceInStore,
    removeDevice,
  } = useDeviceStore()

  const [createLoading, setCreateLoading] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // 创建设备
  const createDevice = useCallback(
    async (data: CreateDeviceRequest): Promise<CreateDeviceResponse> => {
      setCreateLoading(true)
      try {
        const response = await devicesApi.createDevice(data)
        addDevice(response.device)
        message.success('设备创建成功')
        return response
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '创建设备失败'
        message.error(errorMessage)
        throw error
      } finally {
        setCreateLoading(false)
      }
    },
    [addDevice]
  )

  // 更新设备
  const updateDevice = useCallback(
    async (id: string, data: UpdateDeviceRequest) => {
      setUpdateLoading(true)
      try {
        const device = await devicesApi.updateDevice(id, data)
        updateDeviceInStore(device)
        message.success('设备更新成功')
        return device
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '更新设备失败'
        message.error(errorMessage)
        throw error
      } finally {
        setUpdateLoading(false)
      }
    },
    [updateDeviceInStore]
  )

  // 删除设备
  const deleteDevice = useCallback(
    async (id: string) => {
      setDeleteLoading(true)
      try {
        await devicesApi.deleteDevice(id)
        removeDevice(id)
        message.success('设备已删除')
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '删除设备失败'
        message.error(errorMessage)
        throw error
      } finally {
        setDeleteLoading(false)
      }
    },
    [removeDevice]
  )

  // 切换页码
  const changePage = useCallback(
    (page: number, pageSize?: number) => {
      setFilters({ page, page_size: pageSize })
      fetchDevices()
    },
    [setFilters, fetchDevices]
  )

  return {
    devices,
    pagination,
    selectedDevice,
    isLoading,
    createLoading,
    updateLoading,
    deleteLoading,
    filters,
    setFilters,
    fetchDevices,
    fetchDevice,
    setSelectedDevice,
    createDevice,
    updateDevice,
    deleteDevice,
    changePage,
  }
}
