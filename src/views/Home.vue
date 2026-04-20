<template>
  <div class="home-container">
    <div class="welcome-section">
      <h1 class="welcome-title">欢迎使用政务管理系统</h1>
      <p class="welcome-subtitle">今日工作概览</p>
    </div>

    <div class="dashboard-grid">
      <base-card class="base-card stat-card stat-card-primary">
        <div class="stat-icon">
          <i class="el-icon-document-copy"></i>
        </div>
        <div class="stat-content">
          <div class="stat-number">128</div>
          <div class="stat-label">待办总数</div>
          <div class="stat-trend trend-up">
            <i class="el-icon-top"></i>
            <span>+12%</span>
          </div>
        </div>
      </base-card>

      <base-card class="base-card stat-card stat-card-success">
        <div class="stat-icon">
          <i class="el-icon-date"></i>
        </div>
        <div class="stat-content">
          <div class="stat-number">16</div>
          <div class="stat-label">今日新增</div>
          <div class="stat-trend trend-up">
            <i class="el-icon-top"></i>
            <span>+8%</span>
          </div>
        </div>
      </base-card>

      <base-card class="base-card stat-card stat-card-warning">
        <div class="stat-icon">
          <i class="el-icon-s-check"></i>
        </div>
        <div class="stat-content">
          <div class="stat-number">86%</div>
          <div class="stat-label">完成率</div>
          <div class="stat-trend trend-up">
            <i class="el-icon-top"></i>
            <span>+5%</span>
          </div>
        </div>
      </base-card>

      <base-card class="base-card stat-card stat-card-info">
        <div class="stat-icon">
          <i class="el-icon-bell"></i>
        </div>
        <div class="stat-content">
          <div class="stat-number">5</div>
          <div class="stat-label">待审批</div>
          <div class="stat-trend trend-neutral">
            <i class="el-icon-minus"></i>
            <span>0%</span>
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
          <div class="action-item" @click="handleQuickAction('export')">
            <div class="action-icon action-icon-success">
              <i class="el-icon-download"></i>
            </div>
            <div class="action-text">导出数据</div>
          </div>
          <div class="action-item" @click="handleQuickAction('search')">
            <div class="action-icon action-icon-info">
              <i class="el-icon-search"></i>
            </div>
            <div class="action-text">高级搜索</div>
          </div>
          <div class="action-item" @click="handleQuickAction('report')">
            <div class="action-icon action-icon-warning">
              <i class="el-icon-s-data"></i>
            </div>
            <div class="action-text">统计报表</div>
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
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import BaseCard from '@/components/BaseCard.vue'

interface Activity {
  id: number
  title: string
  time: string
  status: string
  statusType: string
  icon: string
}

const recentActivities = ref<Activity[]>([
  {
    id: 1,
    title: '完成了"系统优化"任务',
    time: '10分钟前',
    status: '已完成',
    statusType: 'success',
    icon: 'el-icon-check'
  },
  {
    id: 2,
    title: '创建了"新功能开发"任务',
    time: '1小时前',
    status: '进行中',
    statusType: 'primary',
    icon: 'el-icon-plus'
  },
  {
    id: 3,
    title: '审批了"请假申请"',
    time: '2小时前',
    status: '已审批',
    statusType: 'success',
    icon: 'el-icon-s-check'
  },
  {
    id: 4,
    title: '更新了"项目进度"',
    time: '3小时前',
    status: '已更新',
    statusType: 'info',
    icon: 'el-icon-edit'
  }
])

const handleQuickAction = (action: string) => {
  switch (action) {
    case 'add':
      ElMessage.info('跳转到新建待办页面')
      break
    case 'export':
      ElMessage.success('开始导出数据')
      break
    case 'search':
      ElMessage.info('打开高级搜索')
      break
    case 'report':
      ElMessage.info('查看统计报表')
      break
  }
}

onMounted(() => {
  // 可以在这里加载真实的统计数据
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
  background: linear-gradient(135deg, #6b7280, #9ca3af);
}

.action-icon-warning {
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
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
