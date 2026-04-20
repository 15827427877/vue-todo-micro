<template>
  <div>
    <div class="page-toolbar">
      <el-button type="primary" icon="el-icon-plus" @click="openDialog('add')">新增角色</el-button>
    </div>
    <base-table :data="roles" :loading="isLoading">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="角色名称" />
      <el-table-column prop="description" label="描述" />
      <el-table-column label="操作" width="240">
        <template #default="{ row }">
          <el-button link size="small" @click="openDialog('edit', row)">编辑</el-button>
          <el-button link size="small" @click="assignPermissions(row)">分配权限</el-button>
          <el-button link size="small" @click="removeRole(row.id)" style="color: #f56c6c">删除</el-button>
        </template>
      </el-table-column>
    </base-table>

    <base-modal title="角色信息" :visible="dialogVisible" @update:visible="dialogVisible = $event" width="520px">
      <base-form ref="roleFormRef" :model="formData" :rules="rules">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入角色名称" />
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
        <h4>{{ currentRole?.name }} 的权限分配</h4>
        <el-checkbox-group v-model="selectedPermissions" @change="handlePermissionChange">
          <el-checkbox v-for="permission in permissions" :key="permission.id" :label="permission.id">
            {{ permission.name }} ({{ permission.code }})
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <template #footer>
        <el-button @click="permissionDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="savePermissions">保存权限</el-button>
      </template>
    </base-modal>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { fetchRoles, fetchPermissions, getRolePermissions, assignRolePermissions } from '@/api'
import BaseTable from '@/components/BaseTable.vue'
import BaseModal from '@/components/BaseModal.vue'
import BaseForm from '@/components/BaseForm.vue'

interface RoleItem {
  id: number
  name: string
  description: string
  permissions?: number[]
}

interface PermissionItem {
  id: number
  name: string
  code: string
  description: string
}

const roles = ref<RoleItem[]>([])
const permissions = ref<PermissionItem[]>([])
const dialogVisible = ref(false)
const permissionDialogVisible = ref(false)
const currentMode = ref<'add' | 'edit'>('add')
const editingId = ref<number | null>(null)
const roleFormRef = ref()
const isLoading = ref(false)
const currentRole = ref<RoleItem | null>(null)
const selectedPermissions = ref<number[]>([])

const formData = reactive<RoleItem>({
  id: 0,
  name: '',
  description: ''
})

const rules = {
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入角色描述', trigger: 'blur' }]
}

const loadRoles = async () => {
  isLoading.value = true
  try {
    const response = await fetchRoles()
    roles.value = Array.isArray(response) ? response : [
      { id: 1, name: '管理员', description: '系统权限最多，可管理所有模块' },
      { id: 2, name: '普通用户', description: '可查看待办及个人任务' },
      { id: 3, name: '审核员', description: '可处理待办审批及转交' }
    ]
  } catch (error) {
    ElMessage.error('角色数据加载失败')
    roles.value = [
      { id: 1, name: '管理员', description: '系统权限最多，可管理所有模块' },
      { id: 2, name: '普通用户', description: '可查看待办及个人任务' },
      { id: 3, name: '审核员', description: '可处理待办审批及转交' }
    ]
  } finally {
    isLoading.value = false
  }
}

const loadPermissions = async () => {
  try {
    const response = await fetchPermissions()
    permissions.value = Array.isArray(response) ? response : [
      { id: 1, name: '查看待办', code: 'todo:view', description: '查看待办事项列表' },
      { id: 2, name: '新增待办', code: 'todo:create', description: '新增待办事项' },
      { id: 3, name: '编辑待办', code: 'todo:edit', description: '编辑待办事项' },
      { id: 4, name: '删除待办', code: 'todo:delete', description: '删除待办事项' },
      { id: 5, name: '管理用户', code: 'user:manage', description: '管理系统用户' },
      { id: 6, name: '管理角色', code: 'role:manage', description: '管理系统角色' },
      { id: 7, name: '管理部门', code: 'department:manage', description: '管理系统部门' }
    ]
  } catch (error) {
    ElMessage.error('权限数据加载失败')
    permissions.value = [
      { id: 1, name: '查看待办', code: 'todo:view', description: '查看待办事项列表' },
      { id: 2, name: '新增待办', code: 'todo:create', description: '新增待办事项' },
      { id: 3, name: '编辑待办', code: 'todo:edit', description: '编辑待办事项' },
      { id: 4, name: '删除待办', code: 'todo:delete', description: '删除待办事项' },
      { id: 5, name: '管理用户', code: 'user:manage', description: '管理系统用户' },
      { id: 6, name: '管理角色', code: 'role:manage', description: '管理系统角色' },
      { id: 7, name: '管理部门', code: 'department:manage', description: '管理系统部门' }
    ]
  }
}

const openDialog = (mode: 'add' | 'edit', row?: RoleItem) => {
  currentMode.value = mode
  if (mode === 'add') {
    editingId.value = null
    Object.assign(formData, { id: Date.now(), name: '', description: '' })
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
    const response = await getRolePermissions(role.id)
    selectedPermissions.value = Array.isArray(response) ? response : role.permissions || []
  } catch (error) {
    ElMessage.error('获取角色权限失败')
    selectedPermissions.value = role.permissions || []
  }
  permissionDialogVisible.value = true
}

const handlePermissionChange = (values: number[]) => {
  selectedPermissions.value = values
}

const savePermissions = async () => {
  if (currentRole.value) {
    try {
      await assignRolePermissions(currentRole.value.id, selectedPermissions.value)
      currentRole.value.permissions = selectedPermissions.value
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
</style>
