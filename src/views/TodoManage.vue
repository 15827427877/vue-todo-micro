<template>
  <div>
    <div class="page-toolbar">
      <div>
        <el-button type="primary" icon="el-icon-plus" @click="openDialog('add')">新增待办</el-button>
        <el-button type="success" icon="el-icon-download" @click="handleExport">导出列表</el-button>
      </div>
      <div class="search-block">
        <el-input
          v-model="searchKeyword"
          placeholder="输入标题或负责人搜索"
          clearable
          style="width: 320px"
          @clear="handleSearch"
          @keyup.enter="handleSearch"
        />
      </div>
    </div>

    <base-table :data="todos" :loading="isLoading" @sort-change="handleSortChange">
      <el-table-column prop="id" label="ID" width="80" sortable />
      <el-table-column prop="title" label="待办标题" sortable />
      <el-table-column prop="assignee" label="分配给" width="150" sortable />
      <el-table-column prop="status" label="状态" width="120">
        <template #default="{ row }">
          <el-tag :type="statusTag(row.status)">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="deadline" label="截止日期" width="160" sortable />
      <el-table-column label="操作" width="320">
        <template #default="{ row }">
          <el-button link size="small" @click="viewDetail(row.id)">详情</el-button>
          <el-button link size="small" @click="openDialog('edit', row)">编辑</el-button>
          <el-button link size="small" @click="deleteTask(row)" style="color: #f56c6c">删除</el-button>
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">更多操作<i class="el-icon-arrow-down el-icon--right"></i></span>
            <template #dropdown>
              <el-dropdown-item @click="changeStatus(row, '处理中')">标记处理中</el-dropdown-item>
              <el-dropdown-item @click="changeStatus(row, '已完成')">标记完成</el-dropdown-item>
              <el-dropdown-item @click="transferTask(row)">转交</el-dropdown-item>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </base-table>

    <div class="pagination-wrap">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page-size="pageSize"
        :page-sizes="[10, 20, 50]"
        :current-page="currentPage"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      />
      <div class="pagination-info">
        当前第 {{ currentPage }} 页，共 {{ Math.ceil(total / pageSize) }} 页
      </div>
    </div>

    <el-dialog title="待办信息" v-model:visible="formVisible" width="520px">
      <base-form ref="taskFormRef" :model="taskForm" :rules="rules">
        <el-form-item label="标题" prop="title">
          <el-input v-model="taskForm.title" placeholder="请输入待办标题" />
        </el-form-item>
        <el-form-item label="负责人" prop="assignee">
          <el-input v-model="taskForm.assignee" placeholder="请输入负责人" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="taskForm.status" placeholder="请选择状态">
            <el-option label="待处理" value="待处理" />
            <el-option label="处理中" value="处理中" />
            <el-option label="已完成" value="已完成" />
          </el-select>
        </el-form-item>
        <el-form-item label="截止日期" prop="deadline">
          <el-date-picker v-model="taskForm.deadline" type="date" placeholder="选择截止日期" style="width: 100%" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input type="textarea" rows="3" v-model="taskForm.description" placeholder="任务描述" />
        </el-form-item>
      </base-form>
      <template #footer>
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="saveTask">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { exportCsv, fetchTodos, createTodo, updateTodo, deleteTodo, changeTodoStatus, transferTodo } from '@/api'
import BaseTable from '@/components/BaseTable.vue'
import BaseForm from '@/components/BaseForm.vue'

interface TodoItem {
  id: number
  title: string
  assignee: string
  status: string
  deadline: string
  description: string
}

const router = useRouter()
const searchKeyword = ref('')
const formVisible = ref(false)
const currentMode = ref<'add' | 'edit'>('add')
const editingTaskId = ref<number | null>(null)
const taskFormRef = ref()
const isLoading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const sortField = ref('')
const sortOrder = ref<'asc' | 'desc' | ''>('')

const taskForm = reactive<TodoItem>({
  id: 0,
  title: '',
  assignee: '',
  status: '待处理',
  deadline: '',
  description: ''
})

const todos = ref<TodoItem[]>([])

const rules = {
  title: [{ required: true, message: '请输入待办标题', trigger: 'blur' }],
  assignee: [{ required: true, message: '请选择负责人', trigger: 'blur' }],
  deadline: [{ required: true, message: '请选择截止日期', trigger: 'change' }]
}

const parseTodoResponse = (data: any) => {
  if (!data) return { list: [], total: 0 }

  // 处理标准分页响应格式
  if (data.list && typeof data.total === 'number') {
    return { list: data.list, total: data.total }
  }

  // 处理数组格式（无分页）
  if (Array.isArray(data)) {
    return { list: data, total: data.length }
  }

  // 默认返回空数据
  return { list: [], total: 0 }
}

const loadTodos = async () => {
  isLoading.value = true
  try {
    const response = await fetchTodos({
      page: currentPage.value,
      size: pageSize.value,
      keyword: searchKeyword.value,
      sortField: sortField.value,
      sortOrder: sortOrder.value
    })
    const result = parseTodoResponse(response)
    todos.value = result.list
    total.value = result.total
  } catch (error) {
    ElMessage.error('待办数据加载失败，请检查后端接口配置。')
  } finally {
    isLoading.value = false
  }
}

const openDialog = (mode: 'add' | 'edit', row?: TodoItem) => {
  currentMode.value = mode
  if (mode === 'add') {
    editingTaskId.value = null
    Object.assign(taskForm, {
      id: Date.now(),
      title: '',
      assignee: '',
      status: '待处理',
      deadline: '',
      description: ''
    })
  } else if (row) {
    editingTaskId.value = row.id
    Object.assign(taskForm, row)
  }
  formVisible.value = true
}

const closeDialog = () => {
  formVisible.value = false
}

const saveTask = () => {
  taskFormRef.value?.validate(async (valid: boolean) => {
    if (!valid) return
    try {
      if (currentMode.value === 'add') {
        await createTodo({ ...taskForm })
        ElMessage.success('待办已新增')
      } else {
        await updateTodo(editingTaskId.value ?? 0, { ...taskForm })
        ElMessage.success('待办已保存')
      }
      formVisible.value = false
      loadTodos()
    } catch (error) {
      ElMessage.error('保存待办失败，请稍后重试。')
    }
  })
}

const deleteTask = async (row: TodoItem) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除待办「${row.title}」吗？`,
      '删除待办',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    await deleteTodo(row.id)
    ElMessage.success('待办已删除')
    loadTodos()
  } catch (error) {
    // 取消或异常均忽略
  }
}

const changeStatus = async (row: TodoItem, status: string) => {
  try {
    await changeTodoStatus(row.id, status)
    row.status = status
    ElMessage.success('状态已更新')
  } catch (error) {
    ElMessage.error('更新状态失败')
  }
}

const transferTask = async (row: TodoItem) => {
  try {
    const { value } = await ElMessageBox.prompt('请输入新的负责人', '转交待办', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      inputPlaceholder: '负责人姓名',
      inputPattern: /\S+/, 
      inputErrorMessage: '请输入有效负责人'
    })
    if (value) {
      await transferTodo(row.id, value)
      row.assignee = value
      ElMessage.success('转交成功')
    }
  } catch (error) {
    // 取消或异常均忽略
  }
}

const handleExport = () => {
  const csv = ['ID,标题,负责人,状态,截止日期']
  todos.value.forEach((item) => csv.push(`${item.id},${item.title},${item.assignee},${item.status},${item.deadline}`))
  exportCsv(csv.join('\n'), 'todo-list.csv')
}

const handleSearch = () => {
  currentPage.value = 1
  loadTodos()
}

const viewDetail = (id: number) => {
  router.push({ name: 'TodoDetail', params: { id } })
}

const statusTag = (status: string) => {
  if (status === '已完成') return 'success'
  if (status === '处理中') return 'warning'
  return 'info'
}

const handleSortChange = ({ prop, order }: { prop: string; order: string }) => {
  sortField.value = prop
  sortOrder.value = order === 'ascending' ? 'asc' : order === 'descending' ? 'desc' : ''
  currentPage.value = 1
  loadTodos()
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  loadTodos()
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  loadTodos()
}

onMounted(() => {
  loadTodos()
})
</script>

<style scoped>
.page-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  flex-wrap: wrap;
  gap: 12px;
}

.page-toolbar .el-button {
  border-radius: 8px;
  font-weight: 600;
}

.search-block {
  display: flex;
  align-items: center;
}

.search-block .el-input {
  width: 320px;
}

.search-block .el-input__inner {
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.search-block .el-input__inner:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.pagination-wrap {
  margin-top: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.pagination-info {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}
</style>
