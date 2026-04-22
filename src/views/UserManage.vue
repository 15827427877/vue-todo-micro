<template>
  <div>
    <div class="page-toolbar">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索用户名..."
        style="width: 200px; margin-right: 10px"
        clearable
        @input="handleSearch"
      >
        <template #prefix>
          <i class="el-icon-search"></i>
        </template>
      </el-input>
      <el-button v-if="hasEditPermission" type="primary" icon="el-icon-plus" @click="openDialog('add')">新增用户</el-button>
    </div>
    <base-table :data="paginatedUsers" :loading="isLoading">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="用户名" />
      <el-table-column prop="role" label="角色" />
      <el-table-column prop="department" label="部门" />
      <el-table-column label="操作" width="220">
        <template #default="{ row }">
          <div class="action-buttons">
            <el-button v-if="hasEditPermission" link size="small" class="action-btn-edit" @click="openDialog('edit', row)">编辑</el-button>
            <el-button v-if="hasDeletePermission" link size="small" class="action-btn-delete" @click="removeUser(row.id)">删除</el-button>
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

    <base-modal title="用户信息" :visible="dialogVisible" @update:visible="dialogVisible = $event" width="520px">
      <base-form ref="userFormRef" :model="formData" :rules="rules">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="formData.name" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="formData.role" placeholder="请选择角色">
            <el-option label="管理员" value="管理员" />
            <el-option label="普通用户" value="普通用户" />
            <el-option label="审核员" value="审核员" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-input v-model="formData.department" placeholder="请输入部门" />
        </el-form-item>
      </base-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveUser">保存</el-button>
      </template>
    </base-modal>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import BaseTable from '@/components/BaseTable.vue'
import BaseModal from '@/components/BaseModal.vue'
import BaseForm from '@/components/BaseForm.vue'
import { useUserStore } from '@/stores/user'

interface UserItem {
  id: number
  name: string
  role: string
  department: string
}

const users = ref<UserItem[]>([
  { id: 1, name: '张三', role: '管理员', department: '研发部' },
  { id: 2, name: '李四', role: '普通用户', department: '测试部' },
  { id: 3, name: '王五', role: '审核员', department: '市场部' }
])

const userStore = useUserStore()
const searchKeyword = ref('')
const isLoading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 检查用户是否有编辑和删除权限
const hasEditPermission = computed(() => {
  const roles = userStore.roles
  return roles.includes('1') // 1: 超级管理员
})

const hasDeletePermission = computed(() => {
  const roles = userStore.roles
  return roles.includes('1') // 1: 超级管理员
})

const filteredUsers = computed(() => {
  if (!searchKeyword.value) {
    return users.value
  }
  return users.value.filter(user =>
    user.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
})

const paginatedUsers = computed(() => {
  const filtered = filteredUsers.value
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
const userFormRef = ref()

const formData = reactive<UserItem>({
  id: 0,
  name: '',
  role: '',
  department: ''
})

const rules = {
  name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
  department: [{ required: true, message: '请输入部门', trigger: 'blur' }]
}

const openDialog = (mode: 'add' | 'edit', row?: UserItem) => {
  currentMode.value = mode
  if (mode === 'add') {
    editingId.value = null
    Object.assign(formData, { id: Date.now(), name: '', role: '', department: '' })
  } else if (row) {
    editingId.value = row.id
    Object.assign(formData, row)
  }
  dialogVisible.value = true
}

const saveUser = () => {
  userFormRef.value?.validate((valid: boolean) => {
    if (!valid) return
    if (currentMode.value === 'add') {
      users.value.unshift({ ...formData })
    } else {
      const target = users.value.find((item) => item.id === editingId.value)
      if (target) {
        Object.assign(target, formData)
      }
    }
    dialogVisible.value = false
  })
}

const removeUser = (id: number) => {
  users.value = users.value.filter((item) => item.id !== id)
}
</script>

<style scoped>
.card-header,
.page-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

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