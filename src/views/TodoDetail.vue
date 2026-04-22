<template>
  <div class="todo-detail">
    <!-- 页面头部 -->
    <div class="detail-header">
      <h1 class="page-title">待办详情</h1>
      <el-button type="primary" @click="goBack" size="medium">
        <el-icon><ArrowLeft /></el-icon>
        返回列表
      </el-button>
    </div>

    <!-- 待办信息卡片 -->
    <el-card v-if="todo" class="todo-card">
      <!-- 基本信息 -->
      <div class="basic-info">
        <div class="info-row">
          <div class="info-item">
            <span class="info-label">任务标题</span>
            <h2 class="todo-title">{{ todo.title }}</h2>
          </div>
          <div class="info-item status-item">
            <span class="info-label">状态</span>
            <el-tag :type="statusTag(todo.status)" effect="dark" size="large">{{ todo.status }}</el-tag>
          </div>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">任务ID</span>
            <span class="info-value">{{ todo.id }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">负责人</span>
            <span class="info-value">{{ todo.assignee }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">截止日期</span>
            <span class="info-value">{{ todo.deadline }}</span>
          </div>
        </div>
      </div>

      <!-- 任务描述 -->
      <div class="description-section">
        <h3 class="section-title">任务描述</h3>
        <div class="description-content">
          {{ todo.description || '无描述' }}
        </div>
      </div>
    </el-card>

    <!-- 加载状态 -->
    <div v-else class="loading-container">
      <el-skeleton :rows="6" animated />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchTodoDetail } from '@/api'
import { ElMessage } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'

interface TodoItem {
  id: number
  title: string
  assignee: string
  status: string
  deadline: string
  description: string
}

const route = useRoute()
const router = useRouter()
const todo = ref<TodoItem | null>(null)

const loadDetail = async () => {
  try {
    const response = await fetchTodoDetail(route.params.id as string)
    todo.value = response
  } catch (error) {
    ElMessage.error('加载待办详情失败，请检查接口配置。')
  }
}

onMounted(loadDetail)

const goBack = () => {
  router.back()
}

const statusTag = (status: string) => {
  if (status === '已完成') return 'success'
  if (status === '处理中') return 'warning'
  return 'info'
}
</script>

<style scoped>
.todo-detail {
  max-width: 900px;
  margin: 0 auto;
  padding: 30px 20px;
}

/* 页面头部 */
.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin: 0;
}

/* 待办卡片 */
.todo-card {
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: none;
  overflow: hidden;
}

/* 基本信息 */
.basic-info {
  padding-bottom: 25px;
  border-bottom: 1px solid #f0f0f0;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 25px;
  gap: 20px;
}

.todo-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 8px 0 0 0;
  line-height: 1.3;
}

.status-item {
  text-align: right;
  flex-shrink: 0;
}

/* 信息网格 */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

/* 描述部分 */
.description-section {
  margin-top: 30px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 15px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.description-content {
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  min-height: 120px;
  white-space: pre-wrap;
  word-break: break-word;
}

/* 加载状态 */
.loading-container {
  margin-top: 30px;
  padding: 40px;
  background: #f9f9f9;
  border-radius: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .todo-detail {
    padding: 20px 16px;
  }
  
  .detail-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .info-row {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .status-item {
    text-align: left;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .todo-title {
    font-size: 20px;
  }
}
</style>
