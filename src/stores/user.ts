import { defineStore } from 'pinia'
import { loginRequest, getUserInfo } from '@/api'

export interface UserState {
  token: string
  name: string
  userId: string
  roles: string[]
}

export const useUserStore = defineStore('user', {
  state: (): UserState => {
    let roles: string[] = ['1'] // 默认角色：超级管理员
    try {
      const storedRoles = localStorage.getItem('roles')
      if (storedRoles) {
        const parsedRoles = JSON.parse(storedRoles)
        if (Array.isArray(parsedRoles) && parsedRoles.length > 0) {
          roles = parsedRoles
        }
      }
    } catch (e) {
      console.error('解析角色数据失败，使用默认角色:', e)
    }
    return {
      token: localStorage.getItem('token') || '',
      name: localStorage.getItem('name') || '访客',
      userId: localStorage.getItem('userId') || '',
      roles: roles
    }
  },
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
          // 检查是否有data字段
          if (response.data) {
            if (typeof response.data === 'string') {
              // 如果data是字符串，直接作为token
              token = response.data
            } else if (typeof response.data === 'object') {
              // 如果data是对象，从对象中获取token
              token = response.data.token || response.data.accessToken || ''
              name = response.data.name || response.data.username || username
              userId = response.data.userId || response.data.id || ''
              // 处理角色，确保返回数组
              const rawRoles = response.data.roles || response.data.authorities
              if (Array.isArray(rawRoles)) {
                roles = rawRoles
              } else if (rawRoles) {
                // 如果是单个角色字符串，转换为数组
                roles = [rawRoles]
              }
            }
          } else {
            // 直接从响应对象中获取token
            token = response.token || response.accessToken || ''
            name = response.name || response.username || username
            userId = response.userId || response.id || ''
            // 处理角色，确保返回数组
            const rawRoles = response.roles || response.authorities
            if (Array.isArray(rawRoles)) {
              roles = rawRoles
            } else if (rawRoles) {
              // 如果是单个角色字符串，转换为数组
              roles = [rawRoles]
            }
          }
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
          // 处理角色，确保返回数组
          const rawRoles = response.roles || response.authorities
          if (Array.isArray(rawRoles)) {
            this.roles = rawRoles
          } else if (rawRoles) {
            // 如果是单个角色字符串，转换为数组
            this.roles = [rawRoles]
          } else {
            this.roles = this.roles
          }
          this.setToken(this.token, this.name, this.userId, this.roles)
        }
      } catch (error) {
        console.error('获取用户信息失败:', error)
      }
    }
  }
})
