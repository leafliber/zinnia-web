// 通用 API 响应类型
export interface ApiResponse<T> {
  code: number
  message: string
  data: T | null
  timestamp: string
  request_id?: string
}

// 分页信息
export interface Pagination {
  page: number
  page_size: number
  total_items: number
  total_pages: number
}

// 分页响应
export interface PaginatedResponse<T> {
  items: T[]
  pagination: Pagination
}

// 分页请求参数
export interface PaginationParams {
  page?: number
  page_size?: number
}
