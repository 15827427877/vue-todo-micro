import axios, { type AxiosError, type AxiosResponse } from 'axios'
import { useUserStore } from '@/stores/user'
import router from '@/router'
import { ElMessage } from 'element-plus'

// API基础路径（使用空字符串，通过vite代理转发）
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// todo-service API基础路径（使用空字符串，通过vite代理转发）
const todoService = axios.create({
  baseURL: '',
  timeout: 10000,
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

todoService.interceptors.request.use(
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
  (response: AxiosResponse) => {
    if (response.data && response.data.code === 200) {
      return response.data.data
    }
    if (response.data && response.data.code !== 200) {
      return Promise.reject(new Error(response.data.message || '请求失败'))
    }
    return response.data
  },
  (error: AxiosError<{ message?: string; code?: number }>) => {
    const status = error.response?.status
    const data = error.response?.data

    if (status === 401) {
      ElMessage.error('登录已过期，请重新登录')
      const userStore = useUserStore()
      userStore.logout()
      router.push('/login')
    } else if (status === 403) {
      ElMessage.error(data?.message || '您没有权限执行此操作')
    } else if (status === 500) {
      ElMessage.error('服务器错误，请稍后重试')
    } else if (error.message) {
      ElMessage.error(error.message)
    }
    return Promise.reject(error)
  }
)

todoService.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.data && response.data.code === 200) {
      return response.data.data
    }
    if (response.data && response.data.code !== 200) {
      return Promise.reject(new Error(response.data.message || '请求失败'))
    }
    return response.data
  },
  (error: AxiosError<{ message?: string; code?: number }>) => {
    const status = error.response?.status
    const data = error.response?.data

    if (status === 401) {
      ElMessage.error('登录已过期，请重新登录')
      const userStore = useUserStore()
      userStore.logout()
      router.push('/login')
    } else if (status === 403) {
      ElMessage.error(data?.message || '您没有权限执行此操作')
    } else if (status === 500) {
      ElMessage.error('服务器错误，请稍后重试')
    } else if (error.message) {
      ElMessage.error(error.message)
    }
    return Promise.reject(error)
  }
)

export interface LoginPayload {
  username: string
  password: string
}

export const loginRequest = (payload: LoginPayload) =>
  service.post('/api/system/api/user/login', payload)

export const registerUser = (payload: {
  username: string
  password: string
  email?: string
  departmentId?: number
}) =>
  service.post('/api/system/api/user/register', payload)

export const getUserInfo = () =>
  service.get('/api/system/api/user/info')

export interface TodoQueryParams {
  page?: number
  size?: number
  keyword?: string
  sortField?: string
  sortOrder?: 'asc' | 'desc' | ''
}

export const fetchTodos = (params?: TodoQueryParams) =>
  todoService.get('/api/todo/list', { params })

export const fetchTodoDetail = (id: number | string) =>
  todoService.get(`/api/todo/${id}`)

export const createTodo = (payload: Record<string, any>) =>
  todoService.post('/api/todo', payload)

export const updateTodo = (id: number | string, payload: Record<string, any>) =>
  todoService.put(`/api/todo/${id}`, payload)

export const deleteTodo = (id: number | string) =>
  todoService.delete(`/api/todo/${id}`)

export const changeTodoStatus = (id: number | string, status: string) =>
  todoService.patch(`/api/todo/${id}/status`, { status })

export const transferTodo = (id: number | string, assignee: string) =>
  todoService.patch(`/api/todo/${id}/transfer`, { assignee })

export const fetchUsers = () =>
  service.get('/api/system/api/users')

export const fetchRoles = () =>
  service.get('/api/system/api/roles')

export const fetchDepartments = () =>
  service.get('/api/system/api/departments')

export const fetchPermissions = (params?: Record<string, any>) =>
  service.get('/api/system/api/permissions', { params })

export const createPermission = (payload: Record<string, any>) =>
  service.post('/api/system/api/permissions', payload)

export const updatePermission = (id: number | string, payload: Record<string, any>) =>
  service.put(`/api/system/api/permissions/${id}`, payload)

export const deletePermission = (id: number | string) =>
  service.delete(`/api/system/api/permissions/${id}`)

export const fetchModules = () =>
  service.get('/api/system/api/modules')

export const assignRolePermissions = (roleId: number | string, permissionIds: number[]) =>
  service.post(`/api/system/api/roles/${roleId}/permissions`, { permissionIds })

export const getRolePermissions = (roleId: number | string) =>
  service.get(`/api/system/api/roles/${roleId}/permissions`)

export const fetchTodoStatistics = (params?: Record<string, any>) =>
  todoService.get('/api/todo/statistics', { params })

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
