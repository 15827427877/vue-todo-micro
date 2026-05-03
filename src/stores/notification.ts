import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchNotificationCount } from '@/api'

export const useNotificationStore = defineStore('notification', () => {
  const unreadCount = ref(0)
  const lastFetchTime = ref(0)
  const CACHE_DURATION = 30000 // 30秒缓存

  const updateUnreadCount = async (force = false) => {
    const now = Date.now()
    
    // 如果30秒内已经获取过，且不是强制刷新，则跳过
    if (!force && now - lastFetchTime.value < CACHE_DURATION && unreadCount.value > 0) {
      return
    }

    try {
      const data = await fetchNotificationCount()
      unreadCount.value = data?.unreadCount || 0
      lastFetchTime.value = now
    } catch (error) {
      console.error('获取未读通知数量失败:', error)
    }
  }

  const decrementUnreadCount = () => {
    if (unreadCount.value > 0) {
      unreadCount.value--
    }
  }

  const clearUnreadCount = () => {
    unreadCount.value = 0
  }

  const setUnreadCount = (count: number) => {
    unreadCount.value = count
  }

  return {
    unreadCount,
    updateUnreadCount,
    decrementUnreadCount,
    clearUnreadCount,
    setUnreadCount
  }
})
