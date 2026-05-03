<template>
  <div class="notification-list-page">
    <div class="page-header">
      <h2 class="page-title">通知中心</h2>
      <div class="page-actions">
        <el-button v-if="hasUnread" type="primary" @click="handleMarkAllRead">全部已读</el-button>
        <el-button type="danger" @click="handleClearAllRead">清空已读</el-button>
      </div>
    </div>

    <div class="tab-filter">
      <div 
        v-for="tab in tabs" 
        :key="tab.value" 
        :class="['tab-item', { active: activeTab === tab.value }]"
        @click="switchTab(tab.value)"
      >
        <span>{{ tab.label }}</span>
        <el-tag v-if="tab.value === 'unread'" size="small" type="danger">{{ unreadCount }}</el-tag>
      </div>
    </div>

    <div class="notification-container">
      <div v-if="loading" class="loading-state">
        <el-icon class="is-loading"><Loading /></el-icon>
        <p>加载中...</p>
      </div>
      <el-empty v-else-if="filteredNotifications.length === 0" description="暂无通知" />
      
      <div v-else class="notification-list">
        <div 
          v-for="notification in filteredNotifications" 
          :key="notification.id"
          :class="['notification-card', { read: notification.read }]"
          @click="handleToggleRead(notification.id)"
        >
          <div class="notification-header">
            <div class="notification-type" :class="notification.type">
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
            <div class="notification-meta">
              <span class="notification-type-label">{{ getTypeLabel(notification.type) }}</span>
              <span class="notification-time">{{ formatTime(notification.createTime) }}</span>
            </div>
          </div>
          
          <div class="notification-body">
            <h3 class="notification-title">{{ notification.title }}</h3>
            <p class="notification-desc">{{ notification.description }}</p>
          </div>

          <div class="notification-footer">
            <el-button v-if="!notification.read" type="primary" size="small" link @click.stop="handleMarkSingleRead(notification.id)">
              标记已读
            </el-button>
            <el-button type="danger" size="small" link @click.stop="handleDeleteNotification(notification.id)">
              删除
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="pagination-container" v-if="total > pageSize">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
import { 
  fetchNotificationList, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  deleteNotification 
} from '@/api'
import { useNotificationStore } from '@/stores/notification'

const notificationStore = useNotificationStore()

const activeTab = ref<'all' | 'unread'>('all')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
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

const tabs = [
  { label: '全部', value: 'all' },
  { label: '未读', value: 'unread' }
]

const filteredNotifications = computed(() => {
  if (activeTab.value === 'unread') {
    return notifications.value.filter(n => !n.read)
  }
  return notifications.value
})

const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length
})

const hasUnread = computed(() => {
  return unreadCount.value > 0
})

const loadNotifications = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      size: pageSize.value
    }
    const data = await fetchNotificationList(params)
    notifications.value = data?.list || []
    total.value = data?.total || 0
  } catch (error) {
    notifications.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

const switchTab = (tab: 'all' | 'unread') => {
  activeTab.value = tab
  currentPage.value = 1
  loadNotifications()
}

const handleToggleRead = async (id: number) => {
  const notification = notifications.value.find(n => n.id === id)
  if (notification && !notification.read) {
    try {
      await markNotificationAsRead(id)
      notification.read = true
      notificationStore.decrementUnreadCount()
    } catch (error) {
      // 静默处理
    }
  }
}

const handleMarkSingleRead = async (id: number) => {
  try {
    await markNotificationAsRead(id)
    const notification = notifications.value.find(n => n.id === id)
    if (notification && !notification.read) {
      notification.read = true
      notificationStore.decrementUnreadCount()
    }
    ElMessage.success('已标记为已读')
  } catch (error) {
    ElMessage.error('操作失败，请稍后重试')
  }
}

const handleMarkAllRead = async () => {
  try {
    await markAllNotificationsAsRead()
    notifications.value.forEach(n => n.read = true)
    notificationStore.clearUnreadCount()
    ElMessage.success('全部已标为已读')
  } catch (error) {
    ElMessage.error('操作失败，请稍后重试')
  }
}

const handleDeleteNotification = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这条通知吗？', '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    const notification = notifications.value.find(n => n.id === id)
    await deleteNotification(id)
    if (notification && !notification.read) {
      notificationStore.decrementUnreadCount()
    }
    notifications.value = notifications.value.filter(n => n.id !== id)
    total.value = Math.max(0, total.value - 1)
    ElMessage.success('删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败，请稍后重试')
    }
  }
}

const handleClearAllRead = async () => {
  const readNotifications = notifications.value.filter(n => n.read)
  if (readNotifications.length === 0) {
    ElMessage.warning('没有已读通知可清空')
    return
  }
  
  try {
    await ElMessageBox.confirm('确定要清空所有已读通知吗？', '清空确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    notifications.value = notifications.value.filter(n => !n.read)
    total.value = notifications.value.length
    ElMessage.success('已清空所有已读通知')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败，请稍后重试')
    }
  }
}

const formatTime = (time: string) => {
  const now = new Date()
  const createTime = new Date(time)
  const diff = now.getTime() - createTime.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return time.slice(0, 16)
}

const getTypeLabel = (type: string) => {
  const typeMap: Record<string, string> = {
    approval: '审批通知',
    todo: '待办提醒',
    system: '系统公告'
  }
  return typeMap[type] || '通知'
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  loadNotifications()
}

onMounted(() => {
  loadNotifications()
})
</script>

<style scoped>
.notification-list-page {
  padding: 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 24px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.page-title {
  font-size: 22px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.page-actions {
  display: flex;
  gap: 12px;
}

.tab-filter {
  display: flex;
  gap: 4px;
  background: #fff;
  padding: 4px;
  border-radius: 8px;
  margin-bottom: 24px;
  border: 1px solid #e2e8f0;
}

.tab-item {
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.tab-item:hover {
  background: #f8fafc;
}

.tab-item.active {
  background: #667eea;
  color: #fff;
}

.tab-item.active .el-tag {
  background: rgba(255, 255, 255, 0.3);
  border-color: transparent;
}

.notification-container {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 24px;
  min-height: 400px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #94a3b8;
}

.loading-state .el-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.loading-state p {
  margin: 0;
  font-size: 14px;
}

.notification-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.notification-card {
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s;
}

.notification-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.notification-card.read {
  opacity: 0.6;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.notification-type {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notification-type.approval {
  background: #d1fae5;
  color: #065f46;
}

.notification-type.todo {
  background: #fef3c7;
  color: #92400e;
}

.notification-type.system {
  background: #dbeafe;
  color: #1e40af;
}

.notification-type svg {
  width: 20px;
  height: 20px;
}

.notification-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.notification-type-label {
  font-size: 13px;
  color: #64748b;
  background: #f8fafc;
  padding: 4px 10px;
  border-radius: 4px;
}

.notification-time {
  font-size: 12px;
  color: #94a3b8;
}

.notification-body {
  margin-bottom: 12px;
}

.notification-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.notification-desc {
  font-size: 14px;
  color: #64748b;
  margin: 0;
  line-height: 1.6;
}

.notification-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}
</style>
