<template>
  <div>
    <div class="page-toolbar">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索部门名称..."
        style="width: 200px; margin-right: 10px"
        clearable
        @input="handleSearch"
      >
        <template #prefix>
          <i class="el-icon-search"></i>
        </template>
      </el-input>
      <el-button type="primary" icon="el-icon-plus" @click="openDialog('add')">新增部门</el-button>
    </div>
    <base-table :data="paginatedDepartments" :loading="isLoading">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="部门名称" />
      <el-table-column prop="leader" label="负责人" />
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <div class="action-buttons">
            <el-button link size="small" class="action-btn-edit" @click="openDialog('edit', row)">编辑</el-button>
            <el-button link size="small" class="action-btn-delete" @click="removeDepartment(row.id)">删除</el-button>
          </div>
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

    <base-modal title="部门信息" :visible="dialogVisible" @update:visible="dialogVisible = $event" width="520px">
      <base-form ref="departmentFormRef" :model="formData" :rules="rules">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item label="负责人" prop="leader">
          <el-input v-model="formData.leader" placeholder="请输入负责人" />
        </el-form-item>
      </base-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveDepartment">保存</el-button>
      </template>
    </base-modal>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { fetchDepartments, createDepartment, updateDepartment, deleteDepartment } from '@/api'
import BaseTable from '@/components/BaseTable.vue'
import BaseModal from '@/components/BaseModal.vue'
import BaseForm from '@/components/BaseForm.vue'
import { ElMessage } from 'element-plus'

interface DepartmentItem {
  id: number
  name: string
  leader: string
}

const departments = ref<DepartmentItem[]>([])

const searchKeyword = ref('')
const isLoading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const filteredDepartments = computed(() => {
  if (!searchKeyword.value) {
    return departments.value
  }
  return departments.value.filter(dept =>
    dept.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
    dept.leader.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
})

const paginatedDepartments = computed(() => {
  const filtered = filteredDepartments.value
  total.value = filtered.length
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filtered.slice(start, end)
})

const handleSearch = () => {
  currentPage.value = 1
  // 搜索逻辑由computed属性自动处理
}

const handlePageChange = (page: number) => {
  currentPage.value = page
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}

const dialogVisible = ref(false)
const currentMode = ref<'add' | 'edit'>('add')
const editingId = ref<number | null>(null)
const departmentFormRef = ref()

const formData = reactive<DepartmentItem>({
  id: 0,
  name: '',
  leader: ''
})

const rules = {
  name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
  leader: [{ required: true, message: '请输入负责人', trigger: 'blur' }]
}

const openDialog = (mode: 'add' | 'edit', row?: DepartmentItem) => {
  currentMode.value = mode
  if (mode === 'add') {
    editingId.value = null
    Object.assign(formData, { id: Date.now(), name: '', leader: '' })
  } else if (row) {
    editingId.value = row.id
    Object.assign(formData, row)
  }
  dialogVisible.value = true
}

const saveDepartment = async () => {
  departmentFormRef.value?.validate(async (valid: boolean) => {
    if (!valid) return
    try {
      if (currentMode.value === 'add') {
        await createDepartment({ name: formData.name, leader: formData.leader })
        ElMessage.success('新增成功')
      } else {
        await updateDepartment(editingId.value as number, { name: formData.name, leader: formData.leader })
        ElMessage.success('更新成功')
      }
      await loadDepartments()
    } catch (error) {
      console.error('保存失败:', error)
    }
    dialogVisible.value = false
  })
}

const removeDepartment = async (id: number) => {
  try {
    await deleteDepartment(id)
    ElMessage.success('删除成功')
    await loadDepartments()
  } catch (error) {
    console.error('删除失败:', error)
  }
}

const loadDepartments = async () => {
  isLoading.value = true
  try {
    const data = await fetchDepartments()
    departments.value = Array.isArray(data) ? data : []
  } catch (error) {
    console.error('部门数据加载失败:', error)
    departments.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadDepartments()
})
</script>

<style scoped>
.page-toolbar {
  margin-bottom: 18px;
}

/* 确保表格单元格文本颜色为深黑色 */
:deep(.el-table .cell) {
  color: #0d0c0c !important;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 操作按钮颜色 */
.action-btn-edit {
  color: var(--gov-warning) !important;
}

.action-btn-edit:hover {
  color: #fbbf24 !important;
}

.action-btn-delete {
  color: var(--gov-danger) !important;
}

.action-btn-delete:hover {
  color: #f87171 !important;
}

.pagination-wrap {
  margin-top: 12px;
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