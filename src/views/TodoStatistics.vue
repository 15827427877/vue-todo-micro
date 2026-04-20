<template>
  <div>
    <el-card>
      <div class="card-header">查询统计</div>
      <el-form :model="filterForm" inline label-width="100px" class="query-form">
        <el-form-item label="状态">
          <el-select v-model="filterForm.status" placeholder="请选择状态" style="width: 180px">
            <el-option label="全部" value="" />
            <el-option label="待处理" value="待处理" />
            <el-option label="处理中" value="处理中" />
            <el-option label="已完成" value="已完成" />
          </el-select>
        </el-form-item>
        <el-form-item label="负责人">
          <el-input v-model="filterForm.assignee" placeholder="负责人" style="width: 180px" />
        </el-form-item>
        <el-form-item label="时间区间">
          <el-date-picker v-model="filterForm.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 320px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" :loading="isSearching">查询</el-button>
          <el-button @click="reset">重置</el-button>
          <el-button type="success" @click="handleExport">导出</el-button>
        </el-form-item>
      </el-form>

      <div class="chart-grid">
        <div class="chart-panel">
          <div class="chart-title">状态分布</div>
          <div class="chart-list">
            <div class="chart-item" v-for="item in statusStats" :key="item.label">
              <div class="chart-label">{{ item.label }}</div>
              <div class="chart-value">{{ item.value }}</div>
              <div class="chart-bar"><span :style="{ width: item.percent + '%' }"></span></div>
            </div>
          </div>
        </div>
        <div class="chart-panel">
          <div class="chart-title">待办类型占比</div>
          <div class="pie-chart">
            <div v-for="item in categoryStats" :key="item.label" class="pie-row">
              <span class="pie-color" :style="{ background: item.color }"></span>
              <span>{{ item.label }}</span>
              <span>{{ item.value }} 项</span>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <el-card class="mt-20">
      <div class="card-header">查询结果</div>
      <base-table :data="filteredTodos" :loading="isLoading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="待办标题" />
        <el-table-column prop="assignee" label="负责人" width="140" />
        <el-table-column prop="status" label="状态" width="120" />
        <el-table-column prop="deadline" label="截止日期" width="140" />
      </base-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import BaseTable from '@/components/BaseTable.vue'
import { exportCsv, fetchTodoStatistics } from '@/api'

interface TodoItem {
  id: number
  title: string
  assignee: string
  status: string
  deadline: string
  category: string
}

interface StatisticsData {
  statusStats: Array<{ label: string; value: number; percent: number }>
  categoryStats: Array<{ label: string; value: number; color: string }>
  todos: TodoItem[]
}

const filterForm = reactive({
  status: '',
  assignee: '',
  dateRange: [] as string[]
})

const filteredTodos = ref<TodoItem[]>([])
const statusStats = ref<Array<{ label: string; value: number; percent: number }>>([])
const categoryStats = ref<Array<{ label: string; value: number; color: string }>>([])
const isSearching = ref(false)
const isLoading = ref(false)

const loadStatistics = async () => {
  isSearching.value = true
  isLoading.value = true
  try {
    const params = {
      status: filterForm.status || undefined,
      assignee: filterForm.assignee || undefined,
      startDate: filterForm.dateRange[0] || undefined,
      endDate: filterForm.dateRange[1] || undefined
    }

    const response = await fetchTodoStatistics(params)
    const data = response.data?.data ?? response.data ?? {}

    // 解析后端返回的统计数据
    statusStats.value = data.statusStats || [
      { label: '待处理', value: 0, percent: 0 },
      { label: '处理中', value: 0, percent: 0 },
      { label: '已完成', value: 0, percent: 0 }
    ]

    categoryStats.value = data.categoryStats || []
    filteredTodos.value = data.todos || []
  } catch (error) {
    ElMessage.error('统计数据加载失败，请检查后端接口配置。')
    // 回退到本地模拟数据
    statusStats.value = [
      { label: '待处理', value: 2, percent: 50 },
      { label: '处理中', value: 1, percent: 25 },
      { label: '已完成', value: 1, percent: 25 }
    ]
    categoryStats.value = [
      { label: '审批', value: 2, color: '#409EFF' },
      { label: '会议', value: 1, color: '#67C23A' },
      { label: '运维', value: 1, color: '#E6A23C' }
    ]
    filteredTodos.value = [
      { id: 1, title: '完成周报', assignee: '张三', status: '待处理', deadline: '2026-04-24', category: '审批' },
      { id: 2, title: '审批请假流程', assignee: '李四', status: '处理中', deadline: '2026-04-26', category: '审批' },
      { id: 3, title: '整理需求评审', assignee: '王五', status: '已完成', deadline: '2026-04-20', category: '会议' },
      { id: 4, title: '验证系统配置', assignee: '赵六', status: '待处理', deadline: '2026-04-28', category: '运维' }
    ]
  } finally {
    isSearching.value = false
    isLoading.value = false
  }
}

const search = () => {
  loadStatistics()
}

const reset = () => {
  filterForm.status = ''
  filterForm.assignee = ''
  filterForm.dateRange = []
  loadStatistics()
}

const handleExport = () => {
  const csvRows = ['ID,标题,负责人,状态,截止日期,类型']
  filteredTodos.value.forEach((item) => {
    csvRows.push(`${item.id},${item.title},${item.assignee},${item.status},${item.deadline},${item.category}`)
  })
  exportCsv(csvRows.join('\n'), 'statistic-result.csv')
}

onMounted(() => {
  loadStatistics()
})
</script>

<style scoped>
.card-header {
  font-size: 16px;
  margin-bottom: 16px;
  font-weight: 600;
}

.query-form {
  margin-bottom: 20px;
}

.chart-grid {
  display: grid;
  gap: 18px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.chart-panel {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.chart-title {
  font-weight: 600;
  margin-bottom: 16px;
}

.chart-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chart-item {
  display: grid;
  grid-template-columns: 80px 60px 1fr;
  align-items: center;
  gap: 12px;
}

.chart-label {
  color: #606266;
}

.chart-value {
  font-weight: 600;
}

.chart-bar {
  height: 10px;
  background: #ebeef5;
  border-radius: 999px;
  overflow: hidden;
}

.chart-bar span {
  display: block;
  height: 100%;
  background: #409eff;
}

.pie-chart {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pie-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pie-color {
  width: 14px;
  height: 14px;
  border-radius: 2px;
}

.mt-20 {
  margin-top: 20px;
}
</style>
