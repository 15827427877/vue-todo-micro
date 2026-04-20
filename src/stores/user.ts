import { defineStore } from 'pinia'
import { loginRequest, getUserInfo } from '@/api'

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
    setToken(token: string, name: string = '', userId: string = '', roles: string[] = []) {
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
        
        // 后端返回格式可能是：
        // { token: "...", name: "...", userId: "...", roles: [...] }
        // 或者 { data: { token: "...", name: "...", ... } }
        let token = ''
        let name = username
        let userId = ''
        let roles: string[] = []
        
        if (typeof response === 'string') {
          // 如果直接返回token
          token = response
        } else if (response && typeof response === 'object') {
          token = response.token || response.accessToken || ''
          name = response.name || response.username || username
          userId = response.userId || response.id || ''
          roles = response.roles || response.authorities || []
        }
        
        if (!token) {
          throw new Error('登录响应中缺少 token')
        }
        
        this.setToken(token, name, userId, roles)
        return true
      } catch (error) {
        console.error('登录失败:', error)
        throw error
      }
    },
    async fetchUserInfo() {
      try {
        const response = await getUserInfo()
        if (response) {
          this.name = response.name || response.username || this.name
          this.userId = response.userId || response.id || this.userId
          this.roles = response.roles || response.authorities || this.roles
          this.setToken(this.token, this.name, this.userId, this.roles)
        }
      } catch (error) {
        console.error('获取用户信息失败:', error)
      }
    }
  }
})
