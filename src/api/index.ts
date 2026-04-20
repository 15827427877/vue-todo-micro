import axios, { type AxiosError } from 'axios'
import { useUserStore } from '@/stores/user'
import router from '@/router'

// 后端API基础路径
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json'
  }
})

service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

service.interceptors.response.use(
  (response) => {
    // 适配后端统一返回格式
    if (response.data && response.data.code === 200) {
      return response.data.data
    }
    return response.data
  },
  (error: AxiosError) => {
    const status = error.response?.status
    if (status === 401) {
      const userStore = useUserStore()
      userStore.logout()
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export interface LoginPayload {
  username: string
  password: string
}

export const loginRequest = (payload: LoginPayload) =>
  service.post('/auth/login', payload)

export interface TodoQueryParams {
  page?: number
  size?: number
  keyword?: string
  sortField?: string
  sortOrder?: 'asc' | 'desc' | ''
}

export const fetchTodos = (params?: TodoQueryParams) =>
  service.get('/todos', { params })

export const fetchTodoDetail = (id: number | string) =>
  service.get(`/todos/${id}`)

export const createTodo = (payload: Record<string, any>) =>
  service.post('/todos', payload)

export const updateTodo = (id: number | string, payload: Record<string, any>) =>
  service.put(`/todos/${id}`, payload)

export const deleteTodo = (id: number | string) =>
  service.delete(`/todos/${id}`)

export const changeTodoStatus = (id: number | string, status: string) =>
  service.patch(`/todos/${id}/status`, { status })

export const transferTodo = (id: number | string, assignee: string) =>
  service.patch(`/todos/${id}/transfer`, { assignee })

export const fetchUsers = () =>
  service.get('/system/users')

export const fetchRoles = () =>
  service.get('/system/roles')

export const fetchDepartments = () =>
  service.get('/system/departments')

export const fetchTodoStatistics = (params?: Record<string, any>) =>
  service.get('/todos/statistics', { params })

export const exportCsv = (data: string, filename = 'export.csv') => {
  const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export default service
