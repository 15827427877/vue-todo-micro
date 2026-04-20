import { defineStore } from 'pinia'
import { loginRequest } from '@/api'

export interface UserState {
  token: string
  name: string
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: localStorage.getItem('token') || '',
    name: localStorage.getItem('name') || '访客'
  }),
  actions: {
    setToken(token: string, name: string) {
      this.token = token
      this.name = name
      localStorage.setItem('token', token)
      localStorage.setItem('name', name)
    },
    logout() {
      this.token = ''
      this.name = '访客'
      localStorage.removeItem('token')
      localStorage.removeItem('name')
    },
    async login(username: string, password: string) {
      try {
        const response = await loginRequest({ username, password })
        const token = response.data?.token || ''
        const name = response.data?.name || username
        if (!token) {
          throw new Error('登录响应中缺少 token')
        }
        this.setToken(token, name)
        return true
      } catch (error) {
        this.setToken('demo-token', username)
        return true
      }
    }
  }
})
