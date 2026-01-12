import apiClient from './client'
import type {
  ApiResponse,
  BatteryData,
  LatestBattery,
  BatteryStats,
  AggregatedBatteryData,
  BatteryHistoryParams,
  BatteryAggregatedParams,
  BatteryStatsParams,
} from '@/types'

// 获取最新电量
export const getLatestBattery = async (deviceId: string): Promise<LatestBattery> => {
  const response = await apiClient.get<ApiResponse<LatestBattery>>(`/battery/latest/${deviceId}`)
  return response.data.data!
}

// 查询历史数据
export const getBatteryHistory = async (
  deviceId: string,
  params: BatteryHistoryParams
): Promise<BatteryData[]> => {
  const response = await apiClient.get<ApiResponse<BatteryData[]>>(
    `/battery/history/${deviceId}`,
    { params }
  )
  return response.data.data!
}

// 获取聚合统计
export const getAggregatedBattery = async (
  deviceId: string,
  params: BatteryAggregatedParams
): Promise<AggregatedBatteryData[]> => {
  const response = await apiClient.get<ApiResponse<AggregatedBatteryData[]>>(
    `/battery/aggregated/${deviceId}`,
    { params }
  )
  return response.data.data!
}

// 获取统计摘要
export const getBatteryStats = async (
  deviceId: string,
  params: BatteryStatsParams
): Promise<BatteryStats> => {
  const response = await apiClient.get<ApiResponse<BatteryStats>>(`/battery/stats/${deviceId}`, {
    params,
  })
  return response.data.data!
}
