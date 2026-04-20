<template>
  <el-card v-if="todo">
    <div class="detail-header">待办详情</div>
    <el-descriptions title="任务信息" column="2" border>
      <el-descriptions-item label="ID">{{ todo.id }}</el-descriptions-item>
      <el-descriptions-item label="标题">{{ todo.title }}</el-descriptions-item>
      <el-descriptions-item label="负责人">{{ todo.assignee }}</el-descriptions-item>
      <el-descriptions-item label="状态">
        <el-tag :type="statusTag(todo.status)">{{ todo.status }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="截止日期">{{ todo.deadline }}</el-descriptions-item>
      <el-descriptions-item label="描述" :span="2">{{ todo.description }}</el-descriptions-item>
    </el-descriptions>
    <el-button type="primary" @click="goBack">返回列表</el-button>
  </el-card>
  <el-card v-else>
    <div class="detail-loading">正在加载待办详情...</div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchTodoDetail } from '@/api'
import { ElMessage } from 'element-plus'

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
    const payload = response.data?.data ?? response.data
    todo.value = payload
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
.detail-header {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
}

.detail-loading {
  padding: 32px 0;
  text-align: center;
  color: #606266;
}
</style>
