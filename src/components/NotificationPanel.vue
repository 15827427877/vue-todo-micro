<template>
  <div>
    <el-badge :value="notificationStore.unreadCount" class="notification-badge" :hidden="notificationStore.unreadCount === 0">
      <el-button class="notification-btn" @click="toggleNotificationPanel">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
      </el-button>
    </el-badge>

    <Transition name="slide-fade">
      <div v-if="showPanel" class="notification-panel" @click.self="showPanel = false">
        <div class="panel-header">
          <h3>通知中心</h3>
          <button class="mark-all-btn" @click="handleMarkAllRead">全部已读</button>
        </div>
        <div class="panel-content">
          <div v-if="loading" class="loading-state">
            <el-icon class="is-loading"><Loading /></el-icon>
            <p>加载中...</p>
          </div>
          <div v-else-if="notifications.length === 0" class="empty-state">
            <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M8 15s1.5-2 4-2 4 2 4 2"/>
              <path d="M9.5 9h5"/>
            </svg>
            <p>暂无通知</p>
          </div>
          <div v-else class="notification-list">
            <div 
              v-for="notification in notifications" 
              :key="notification.id"
              :class="['notification-item', { read: notification.read }]"
              @click="handleMarkAsRead(notification.id)"
            >
              <div class="notification-icon" :class="notification.type">
                <svg v-if="notification.type === 'approval'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                  <path d="M16 11l4 4-4 4"/>
                  <path d="M8 11l-4 4 4 4"/>
                </svg>
                <svg v-else-if="notification.type === 'todo'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M8 12h8"/>
                  <path d="M8 16h8"/>
                  <path d="M8 8h8"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M8 15s1.5-2 4-2 4 2 4 2"/>
                  <path d="M9.5 9h5"/>
                </svg>
              </div>
              <div class="notification-content">
                <div class="notification-title">{{ notification.title }}</div>
                <div class="notification-desc">{{ notification.description }}</div>
                <div class="notification-time">{{ formatTime(notification.createTime) }}</div>
              </div>
              <div v-if="!notification.read" class="unread-dot"></div>
            </div>
          </div>
        </div>
        <div v-if="notifications.length > 0" class="panel-footer">
          <a href="#" class="view-all" @click.prevent="viewAllNotifications">查看全部通知</a>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
import { 
  fetchNotificationList, 
  markNotificationAsRead, 
  markAllNotificationsAsRead
} from '@/api'
import { useNotificationStore } from '@/stores/notification'

const router = useRouter()
const notificationStore = useNotificationStore()
const showPanel = ref(false)
const loading = ref(false)

interface Notification {
  id: number
  type: 'approval' | 'todo' | 'system'
  title: string
  description: string
  createTime: string
  read: boolean
}

const notifications = ref<Notification[]>([])

const loadNotifications = async () => {
  loading.value = true
  try {
    const data = await fetchNotificationList({ size: 5 })
    notifications.value = data?.list || []
  } catch (error) {
    notifications.value = []
  } finally {
    loading.value = false
  }
}

const toggleNotificationPanel = () => {
  showPanel.value = !showPanel.value
  if (showPanel.value) {
    loadNotifications()
  }
}

const handleMarkAsRead = async (id: number) => {
  try {
    await markNotificationAsRead(id)
    const notification = notifications.value.find(n => n.id === id)
    if (notification && !notification.read) {
      notification.read = true
      notificationStore.decrementUnreadCount()
    }
  } catch (error) {
    // 静默处理
  }
}

const handleMarkAllRead = async () => {
  try {
    await markAllNotificationsAsRead()
    notifications.value.forEach(n => n.read = true)
    notificationStore.clearUnreadCount()
    ElMessage.success('全部已标记为已读')
  } catch (error) {
    ElMessage.error('操作失败，请稍后重试')
  }
}

const viewAllNotifications = () => {
  showPanel.value = false
  router.push('/notifications')
}

const formatTime = (time: string) => {
  const now = new Date()
  const createTime = new Date(time)
  const diff = now.getTime() - createTime.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  
  if (hours < 1) return '刚刚'
  if (hours < 24) return `${hours}小时前`
  if (hours < 48) return '昨天'
  return time.slice(5, 16)
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.notification-btn') && !target.closest('.notification-panel')) {
    showPanel.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  notificationStore.updateUnreadCount()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.notification-badge {
  margin-right: 8px;
}

.notification-btn {
  padding: 8px;
  color: #64748b;
  border: none;
  background: transparent;
  cursor: pointer;
}

.notification-btn:hover {
  color: #1e293b;
  background: #f1f5f9;
}

.icon {
  width: 18px;
  height: 18px;
}

.notification-panel {
  position: fixed;
  top: 72px;
  right: 24px;
  width: 360px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.mark-all-btn {
  font-size: 13px;
  color: #667eea;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}

.mark-all-btn:hover {
  background: #eef2ff;
}

.panel-content {
  max-height: 400px;
  overflow-y: auto;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #94a3b8;
}

.loading-state .el-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.loading-state p {
  margin: 0;
  font-size: 14px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #94a3b8;
}

.empty-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 12px;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

.notification-list {
  padding: 8px 0;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.notification-item:hover {
  background-color: #f8fafc;
}

.notification-item.read {
  opacity: 0.6;
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notification-icon.approval {
  background: #d1fae5;
  color: #065f46;
}

.notification-icon.todo {
  background: #fef3c7;
  color: #92400e;
}

.notification-icon.system {
  background: #dbeafe;
  color: #1e40af;
}

.notification-icon svg {
  width: 20px;
  height: 20px;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.notification-desc {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.notification-time {
  font-size: 12px;
  color: #94a3b8;
}

.unread-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ef4444;
  flex-shrink: 0;
  margin-top: 8px;
}

.panel-footer {
  padding: 12px 16px;
  border-top: 1px solid #e2e8f0;
  text-align: center;
}

.view-all {
  font-size: 13px;
  color: #667eea;
  text-decoration: none;
}

.view-all:hover {
  text-decoration: underline;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.2s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
