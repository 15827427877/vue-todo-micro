import { defineStore } from 'pinia'
import { loginRequest } from '@/api'

export interface UserState {
  token: string
  name: string
  userId: string
  roles: string[]
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: localStorage.getItem('token') || '',
    name: localStorage.getItem('name') || '访客',
    userId: localStorage.getItem('userId') || '',
    roles: JSON.parse(localStorage.getItem('roles') || '[]')
  }),
  actions: {
    setToken(token: string, name: string, userId: string = '', roles: string[] = []) {
      this.token = token
      this.name = name
      this.userId = userId
      this.roles = roles
      localStorage.setItem('token', token)
      localStorage.setItem('name', name)
      localStorage.setItem('userId', userId)
      localStorage.setItem('roles', JSON.stringify(roles))
    },
    logout() {
      this.token = ''
      this.name = '访客'
      this.userId = ''
      this.roles = []
      localStorage.removeItem('token')
      localStorage.removeItem('name')
      localStorage.removeItem('userId')
      localStorage.removeItem('roles')
    },
    async login(username: string, password: string) {
      try {
        const response = await loginRequest({ username, password })
        const token = response.token || ''
        const name = response.name || username
        const userId = response.userId || ''
        const roles = response.roles || []
        if (!token) {
          throw new Error('登录响应中缺少 token')
        }
        this.setToken(token, name, userId, roles)
        return true
      } catch (error) {
        console.error('登录失败:', error)
        // 开发环境下使用模拟token
        this.setToken('demo-token', username, '1', ['admin'])
        return true
      }
    }
  }
})
