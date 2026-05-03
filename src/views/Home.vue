<template>
  <div class="home-container">
    <div class="welcome-section">
      <h1 class="welcome-title">{{ greeting }}，{{ username }}</h1>
      <p class="welcome-subtitle">今日工作概览 · {{ todayDate }}</p>
    </div>

    <div class="dashboard-grid">
      <base-card class="base-card stat-card stat-card-primary">
        <div class="stat-icon">
          <i class="el-icon-document-copy"></i>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ statistics.total || 0 }}</div>
          <div class="stat-label">待办总数</div>
          <div class="stat-trend" :class="statistics.totalTrend > 0 ? 'trend-up' : statistics.totalTrend < 0 ? 'trend-down' : 'trend-neutral'">
            <i :class="statistics.totalTrend > 0 ? 'el-icon-top' : statistics.totalTrend < 0 ? 'el-icon-bottom' : 'el-icon-minus'"></i>
            <span>{{ statistics.totalTrend > 0 ? '+' : '' }}{{ statistics.totalTrend }}%</span>
          </div>
        </div>
      </base-card>

      <base-card class="base-card stat-card stat-card-success">
        <div class="stat-icon">
          <i class="el-icon-date"></i>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ statistics.todayAdded || 0 }}</div>
          <div class="stat-label">今日新增</div>
          <div class="stat-trend" :class="statistics.addedTrend > 0 ? 'trend-up' : statistics.addedTrend < 0 ? 'trend-down' : 'trend-neutral'">
            <i :class="statistics.addedTrend > 0 ? 'el-icon-top' : statistics.addedTrend < 0 ? 'el-icon-bottom' : 'el-icon-minus'"></i>
            <span>{{ statistics.addedTrend > 0 ? '+' : '' }}{{ statistics.addedTrend }}%</span>
          </div>
        </div>
      </base-card>

      <base-card class="base-card stat-card stat-card-warning">
        <div class="stat-icon">
          <i class="el-icon-s-check"></i>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ statistics.completionRate || 0 }}%</div>
          <div class="stat-label">完成率</div>
          <div class="stat-trend" :class="statistics.rateTrend > 0 ? 'trend-up' : statistics.rateTrend < 0 ? 'trend-down' : 'trend-neutral'">
            <i :class="statistics.rateTrend > 0 ? 'el-icon-top' : statistics.rateTrend < 0 ? 'el-icon-bottom' : 'el-icon-minus'"></i>
            <span>{{ statistics.rateTrend > 0 ? '+' : '' }}{{ statistics.rateTrend }}%</span>
          </div>
        </div>
      </base-card>

      <base-card class="base-card stat-card stat-card-info">
        <div class="stat-icon">
          <i class="el-icon-bell"></i>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ statistics.pendingApproval || 0 }}</div>
          <div class="stat-label">待审批</div>
          <div class="stat-trend" :class="statistics.approvalTrend > 0 ? 'trend-up' : statistics.approvalTrend < 0 ? 'trend-down' : 'trend-neutral'">
            <i :class="statistics.approvalTrend > 0 ? 'el-icon-top' : statistics.approvalTrend < 0 ? 'el-icon-bottom' : 'el-icon-minus'"></i>
            <span>{{ statistics.approvalTrend > 0 ? '+' : '' }}{{ statistics.approvalTrend }}%</span>
          </div>
        </div>
      </base-card>
    </div>

    <div class="quick-actions-section">
      <el-card class="quick-actions-card" shadow="hover">
        <div class="card-header">
          <i class="el-icon-s-grid"></i>
          <span>快速操作</span>
        </div>
        <div class="action-grid">
          <div class="action-item" @click="handleQuickAction('add')">
            <div class="action-icon action-icon-primary">
              <i class="el-icon-plus"></i>
            </div>
            <div class="action-text">新建待办</div>
          </div>
          <div class="action-item" @click="handleQuickAction('approval')">
            <div class="action-icon action-icon-success">
              <i class="el-icon-s-check"></i>
            </div>
            <div class="action-text">审批中心</div>
          </div>
          <div class="action-item" @click="handleQuickAction('transfer')">
            <div class="action-icon action-icon-info">
              <i class="el-icon-user"></i>
            </div>
            <div class="action-text">任务转交</div>
          </div>
          <div class="action-item" @click="handleQuickAction('search')">
            <div class="action-icon action-icon-warning">
              <i class="el-icon-search"></i>
            </div>
            <div class="action-text">高级搜索</div>
          </div>
          <div class="action-item" @click="handleQuickAction('export')">
            <div class="action-icon action-icon-danger">
              <i class="el-icon-download"></i>
            </div>
            <div class="action-text">导出数据</div>
          </div>
          <div class="action-item" @click="handleQuickAction('report')">
            <div class="action-icon action-icon-purple">
              <i class="el-icon-s-data"></i>
            </div>
            <div class="action-text">统计报表</div>
          </div>
          <div class="action-item" @click="handleQuickAction('settings')">
            <div class="action-icon action-icon-gray">
              <i class="el-icon-setting"></i>
            </div>
            <div class="action-text">系统设置</div>
          </div>
          <div class="action-item" @click="handleQuickAction('help')">
            <div class="action-icon action-icon-cyan">
              <i class="el-icon-help"></i>
            </div>
            <div class="action-text">帮助文档</div>
          </div>
        </div>
      </el-card>
    </div>

    <div class="recent-activity-section">
      <el-card class="recent-activity-card" shadow="hover">
        <div class="card-header">
          <i class="el-icon-time"></i>
          <span>最近活动</span>
        </div>
        <div class="activity-list">
          <div class="activity-item" v-for="activity in recentActivities" :key="activity.id">
            <div class="activity-avatar">
              <i :class="activity.icon"></i>
            </div>
            <div class="activity-content">
              <div class="activity-title">{{ activity.title }}</div>
              <div class="activity-time">{{ activity.time }}</div>
            </div>
            <div class="activity-status">
              <el-tag :type="activity.statusType" size="small">{{ activity.status }}</el-tag>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage, ElLoading } from 'element-plus'
import BaseCard from '@/components/BaseCard.vue'
import { fetchTodoStatistics, fetchRecentActivities } from '@/api'

const router = useRouter()
const userStore = useUserStore()

interface Activity {
  id: number
  title: string
  time: string
  status: string
  statusType: string
  icon: string
}

interface Statistics {
  total: number
  todayAdded: number
  completionRate: number
  pendingApproval: number
  totalTrend: number
  addedTrend: number
  rateTrend: number
  approvalTrend: number
}

const recentActivities = ref<Activity[]>([])
const statistics = ref<Statistics>({
  total: 0,
  todayAdded: 0,
  completionRate: 0,
  pendingApproval: 0,
  totalTrend: 0,
  addedTrend: 0,
  rateTrend: 0,
  approvalTrend: 0
})

const username = computed(() => userStore.userInfo?.username || '用户')

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '夜深了'
  if (hour < 12) return '早上好'
  if (hour < 14) return '中午好'
  if (hour < 18) return '下午好'
  return '晚上好'
})

const todayDate = computed(() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const weekDay = weekDays[now.getDay()]
  return `${year}年${month}月${day}日 ${weekDay}`
})

const handleQuickAction = (action: string) => {
  switch (action) {
    case 'add':
      router.push('/todo/add')
      break
    case 'export':
      ElMessage.success('开始导出数据')
      break
    case 'search':
      router.push('/todo')
      break
    case 'report':
      router.push('/statistics')
      break
    case 'approval':
      router.push('/approval')
      break
    case 'transfer':
      ElMessage.info('跳转到任务转交页面')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'help':
      router.push('/help')
      break
  }
}

const loadData = async () => {
  const loading = ElLoading.service({ text: '加载中...' })
  try {
    const stats = await fetchTodoStatistics()
    statistics.value = {
      total: stats.total || 0,
      todayAdded: stats.todayAdded || 0,
      completionRate: stats.completionRate || 0,
      pendingApproval: stats.pendingApproval || 0,
      totalTrend: stats.totalTrend || 0,
      addedTrend: stats.addedTrend || 0,
      rateTrend: stats.rateTrend || 0,
      approvalTrend: stats.approvalTrend || 0
    }

    const activities = await fetchRecentActivities()
    recentActivities.value = activities.map((item: any) => ({
      id: item.id,
      title: item.title,
      time: item.time,
      status: item.status,
      statusType: item.statusType,
      icon: item.icon
    }))
  } catch (error) {
    console.error('加载数据失败:', error)
    ElMessage.error('加载数据失败')
  } finally {
    loading.close()
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.home-container {
  padding: 0;
}

.welcome-section {
  margin-bottom: 32px;
  text-align: center;
}

.welcome-title {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.welcome-subtitle {
  font-size: 16px;
  color: #64748b;
  margin: 0;
}

.dashboard-grid {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  margin-bottom: 32px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.1;
  transform: translate(20px, -20px);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.stat-card-primary {
  --card-color: #667eea;
}

.stat-card-success {
  --card-color: #10b981;
}

.stat-card-warning {
  --card-color: #f59e0b;
}

.stat-card-info {
  --card-color: #6b7280;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: var(--card-color);
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 36px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 8px;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
}

.trend-up {
  color: #10b981;
}

.trend-down {
  color: #ef4444;
}

.trend-neutral {
  color: #6b7280;
}

.quick-actions-section,
.recent-activity-section {
  margin-bottom: 32px;
}

.quick-actions-card,
.recent-activity-card {
  border-radius: 16px;
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 24px;
}

.card-header i {
  font-size: 20px;
  color: #667eea;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  cursor: pointer;
}

.action-item:hover {
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
}

.action-icon-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.action-icon-success {
  background: linear-gradient(135deg, #10b981, #34d399);
}

.action-icon-info {
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
}

.action-icon-warning {
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
}

.action-icon-danger {
  background: linear-gradient(135deg, #ef4444, #f87171);
}

.action-icon-purple {
  background: linear-gradient(135deg, #8b5cf6, #a78bfa);
}

.action-icon-gray {
  background: linear-gradient(135deg, #6b7280, #9ca3af);
}

.action-icon-cyan {
  background: linear-gradient(135deg, #06b6d4, #22d3ee);
}

.action-text {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  text-align: center;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.activity-item:hover {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.activity-avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.activity-time {
  font-size: 12px;
  color: #64748b;
}

.activity-status {
  flex-shrink: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .welcome-title {
    font-size: 24px;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .stat-card {
    padding: 20px;
    gap: 16px;
  }

  .stat-number {
    font-size: 28px;
  }

  .action-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .activity-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-card {
  animation: fadeInUp 0.6s ease-out;
}

.stat-card:nth-child(1) { animation-delay: 0.1s; }
.stat-card:nth-child(2) { animation-delay: 0.2s; }
.stat-card:nth-child(3) { animation-delay: 0.3s; }
.stat-card:nth-child(4) { animation-delay: 0.4s; }

.quick-actions-card,
.recent-activity-card {
  animation: fadeInUp 0.6s ease-out;
  animation-delay: 0.5s;
}
</style>
