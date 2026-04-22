<template>
  <div>
    <div class="page-toolbar">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索角色名称..."
        style="width: 200px; margin-right: 10px"
        clearable
        @input="handleSearch"
      >
        <template #prefix>
          <i class="el-icon-search"></i>
        </template>
      </el-input>
      <el-button v-if="hasEditPermission" type="primary" icon="el-icon-plus" @click="openDialog('add')">新增角色</el-button>
    </div>
    <el-table :data="paginatedRoles" :loading="isLoading" stripe border row-key="id">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="roleName" label="角色名称" />
      <el-table-column prop="description" label="描述" />
      <el-table-column label="操作" width="240">
        <template #default="{ row }">
          <div class="action-buttons">
            <el-button v-if="hasEditPermission" link size="small" class="action-btn-edit" @click="openDialog('edit', row)">编辑</el-button>
            <el-button v-if="hasAssignPermission" link size="small" class="action-btn-view" @click="assignPermissions(row)">分配权限</el-button>
            <el-button v-if="hasDeletePermission" link size="small" class="action-btn-delete" @click="removeRole(row.id)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

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

    <base-modal title="角色信息" :visible="dialogVisible" @update:visible="dialogVisible = $event" width="520px">
      <base-form ref="roleFormRef" :model="formData" :rules="rules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="formData.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input type="textarea" rows="3" v-model="formData.description" placeholder="请输入角色描述" />
        </el-form-item>
      </base-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveRole">保存</el-button>
      </template>
    </base-modal>

    <base-modal title="分配权限" :visible="permissionDialogVisible" @update:visible="permissionDialogVisible = $event" width="600px">
      <div class="permission-assignment">
        <h4>{{ currentRole?.roleName }} 的权限分配</h4>
        <el-tree
          ref="permissionTreeRef"
          :data="permissions"
          node-key="id"
          show-checkbox
          default-expand-all
          :default-checked-keys="selectedPermissions"
          :props="{
            label: 'name',
            children: 'children'
          }"
        >
          <template #default="{ node, data }">
            <span class="permission-node">
              <span class="permission-name">{{ node.label }}</span>
              <span class="permission-code">({{ data.code }})</span>
            </span>
          </template>
        </el-tree>
      </div>
      <template #footer>
        <el-button @click="permissionDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="savePermissions">保存权限</el-button>
      </template>
    </base-modal>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { fetchRoles, fetchPermissions, fetchPermissionsTree, getRolePermissions, assignRolePermissions } from '@/api'
import BaseTable from '@/components/BaseTable.vue'
import BaseModal from '@/components/BaseModal.vue'
import BaseForm from '@/components/BaseForm.vue'
import { useUserStore } from '@/stores/user'

interface RoleItem {
  id: number
  roleName: string
  description: string
  permissions?: number[]
}

interface PermissionItem {
  id: number
  parentId: number
  name: string
  code: string
  description: string
  children?: PermissionItem[]
}

const userStore = useUserStore()
const roles = ref<RoleItem[]>([])
const permissions = ref<PermissionItem[]>([])
const searchKeyword = ref('')
const isLoading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 检查用户是否有编辑、删除和分配权限的权限
const hasEditPermission = computed(() => {
  const roles = userStore.roles
  return roles.includes('1') // 1: 超级管理员
})

const hasDeletePermission = computed(() => {
  const roles = userStore.roles
  return roles.includes('1') // 1: 超级管理员
})

const hasAssignPermission = computed(() => {
  const roles = userStore.roles
  return roles.includes('1') || roles.includes('2') // 1: 超级管理员, 2: 管理员
})

const filteredRoles = computed(() => {
  if (!searchKeyword.value) {
    return roles.value
  }
  return roles.value.filter(role =>
    role.roleName.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
    role.description.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
})

const paginatedRoles = computed(() => {
  const filtered = filteredRoles.value
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
const permissionDialogVisible = ref(false)
const currentMode = ref<'add' | 'edit'>('add')
const editingId = ref<number | null>(null)
const roleFormRef = ref()
const currentRole = ref<RoleItem | null>(null)
const selectedPermissions = ref<number[]>([])
const permissionTreeRef = ref()

const formData = reactive<RoleItem>({
  id: 0,
  roleName: '',
  description: ''
})

const rules = {
  roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入角色描述', trigger: 'blur' }]
}

const loadRoles = async () => {
  isLoading.value = true
  try {
    const data = await fetchRoles()
    roles.value = Array.isArray(data) ? data : []
  } catch (error) {
    console.error('角色数据加载失败:', error)
    roles.value = []
  } finally {
    isLoading.value = false
  }
}

const loadPermissions = async () => {
  try {
    const data = await fetchPermissionsTree()
    permissions.value = Array.isArray(data) ? data : []
  } catch (error) {
    console.error('权限数据加载失败:', error)
    permissions.value = []
  }
}

const openDialog = (mode: 'add' | 'edit', row?: RoleItem) => {
  currentMode.value = mode
  if (mode === 'add') {
    editingId.value = null
    Object.assign(formData, { id: Date.now(), roleName: '', description: '' })
  } else if (row) {
    editingId.value = row.id
    Object.assign(formData, row)
  }
  dialogVisible.value = true
}

const saveRole = () => {
  roleFormRef.value?.validate((valid: boolean) => {
    if (!valid) return
    if (currentMode.value === 'add') {
      roles.value.unshift({ ...formData })
      ElMessage.success('角色已新增')
    } else {
      const target = roles.value.find((item) => item.id === editingId.value)
      if (target) {
        Object.assign(target, formData)
        ElMessage.success('角色已更新')
      }
    }
    dialogVisible.value = false
  })
}

const removeRole = (id: number) => {
  roles.value = roles.value.filter((item) => item.id !== id)
  ElMessage.success('角色已删除')
}

const assignPermissions = async (role: RoleItem) => {
  currentRole.value = role
  try {
    const data = await getRolePermissions(role.id)
    selectedPermissions.value = Array.isArray(data) ? data : role.permissions || []
  } catch (error) {
    ElMessage.error('获取角色权限失败')
    selectedPermissions.value = role.permissions || []
  }
  permissionDialogVisible.value = true
}

const handleTreeCheckChange = (data: PermissionItem, checked: boolean, indeterminate: boolean) => {
  // 这里可以处理单个节点的选择变化
  // 但实际上我们不需要在这里处理，因为el-tree会自动维护选中状态
  // 当用户点击保存时，我们会从树中获取所有选中的节点
}

// 从树形结构中获取所有选中的权限ID
const getAllCheckedPermissions = (tree: PermissionItem[]): number[] => {
  const checkedIds: number[] = []
  
  const traverse = (node: PermissionItem) => {
    if (selectedPermissions.value.includes(node.id)) {
      checkedIds.push(node.id)
    }
    if (node.children && node.children.length > 0) {
      node.children.forEach(child => traverse(child))
    }
  }
  
  tree.forEach(node => traverse(node))
  return checkedIds
}

const savePermissions = async () => {
  if (currentRole.value && permissionTreeRef.value) {
    try {
      // 使用el-tree的getCheckedKeys方法获取所有选中的节点
      const checkedPermissions = permissionTreeRef.value.getCheckedKeys()
      await assignRolePermissions(currentRole.value.id, checkedPermissions)
      currentRole.value.permissions = checkedPermissions
      ElMessage.success('权限分配成功')
      permissionDialogVisible.value = false
    } catch (error) {
      ElMessage.error('权限分配失败，请稍后重试')
    }
  }
}

onMounted(() => {
  loadRoles()
  loadPermissions()
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
}

.page-toolbar .el-button {
  border-radius: 8px;
  font-weight: 600;
}

.permission-assignment {
  max-height: 400px;
  overflow-y: auto;
}

.permission-assignment h4 {
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.permission-assignment .el-checkbox {
  display: block;
  margin-bottom: 12px;
  font-size: 14px;
}

.permission-assignment .el-checkbox__label {
  margin-left: 8px;
  color: #666;
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
.action-btn-view {
  color: var(--gov-primary) !important;
}

.action-btn-view:hover {
  color: var(--gov-primary-light) !important;
}

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