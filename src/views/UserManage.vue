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
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="roleName" label="角色" />
      <el-table-column prop="departmentName" label="部门" />
      <el-table-column prop="email" label="邮箱" />
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
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formData.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select v-model="formData.roleId" placeholder="请选择角色" style="width: 100%">
            <el-option v-for="role in allRoles" :key="role.id" :label="role.roleName" :value="role.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="departmentId">
          <el-select v-model="formData.departmentId" placeholder="请选择部门" style="width: 100%">
            <el-option v-for="dept in allDepartments" :key="dept.id" :label="dept.name" :value="dept.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入邮箱（选填）" />
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
import { reactive, ref, computed, onMounted } from 'vue'
import BaseTable from '@/components/BaseTable.vue'
import BaseModal from '@/components/BaseModal.vue'
import BaseForm from '@/components/BaseForm.vue'
import { useUserStore } from '@/stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetchUsers, createUser, updateUser, deleteUser, fetchRoles, fetchDepartments } from '@/api'

interface UserItem {
  id: number
  username: string
  name: string
  role: string
  roleId?: number
  roleName?: string
  department: string
  departmentId?: number
  departmentName?: string
  email?: string
}

const users = ref<UserItem[]>([])
const allRoles = ref<{ id: number; roleName: string }[]>([])
const allDepartments = ref<{ id: number; name: string }[]>([])

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
  const keyword = searchKeyword.value.toLowerCase()
  return users.value.filter(user =>
    (user.username && user.username.toLowerCase().includes(keyword)) ||
    (user.name && user.name.toLowerCase().includes(keyword)) ||
    (user.roleName && user.roleName.toLowerCase().includes(keyword)) ||
    (user.departmentName && user.departmentName.toLowerCase().includes(keyword))
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
  username: '',
  name: '',
  role: '',
  roleId: undefined,
  department: '',
  departmentId: undefined,
  email: ''
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  roleId: [{ required: true, message: '请选择角色', trigger: 'change' }],
  departmentId: [{ required: true, message: '请选择部门', trigger: 'change' }]
}

const loadUsers = async () => {
  isLoading.value = true
  try {
    const [usersRes, rolesRes, deptsRes] = await Promise.all([
      fetchUsers(),
      fetchRoles(),
      fetchDepartments()
    ])
    users.value = usersRes || []
    allRoles.value = rolesRes || []
    allDepartments.value = deptsRes || []
    total.value = users.value.length
  } catch (error) {
    ElMessage.error('加载用户列表失败')
  } finally {
    isLoading.value = false
  }
}

const openDialog = (mode: 'add' | 'edit', row?: UserItem) => {
  currentMode.value = mode
  if (mode === 'add') {
    editingId.value = null
    Object.assign(formData, { id: 0, username: '', name: '', role: '', roleId: undefined, department: '', departmentId: undefined, email: '' })
  } else if (row) {
    editingId.value = row.id
    Object.assign(formData, row)
  }
  dialogVisible.value = true
}

const saveUser = () => {
  userFormRef.value?.validate(async (valid: boolean) => {
    if (!valid) return
    try {
      const payload = {
        username: formData.username,
        name: formData.name,
        roleId: formData.roleId,
        departmentId: formData.departmentId,
        email: formData.email
      }
      if (currentMode.value === 'add') {
        await createUser(payload)
        ElMessage.success('用户创建成功')
      } else {
        await updateUser(editingId.value!, payload)
        ElMessage.success('用户更新成功')
      }
      dialogVisible.value = false
      loadUsers()
    } catch (error) {
      ElMessage.error('保存用户失败')
    }
  })
}

const removeUser = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除该用户吗？', '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteUser(id)
    ElMessage.success('用户删除成功')
    loadUsers()
  } catch (error) {
    // 取消或异常均忽略
  }
}

onMounted(() => {
  loadUsers()
})
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