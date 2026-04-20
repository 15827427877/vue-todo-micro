<template>
  <div>
    <div class="page-toolbar">
      <div>
        <el-button type="primary" icon="el-icon-plus" @click="openDialog('add')">新增权限</el-button>
      </div>
      <div class="search-block">
        <el-select v-model="selectedModule" placeholder="按模块筛选" clearable @change="handleModuleChange">
          <el-option label="全部模块" value="" />
          <el-option v-for="module in modules" :key="module" :label="module" :value="module" />
        </el-select>
        <el-input
          v-model="searchKeyword"
          placeholder="搜索权限名称或编码"
          clearable
          style="width: 300px; margin-left: 12px"
          @clear="handleSearch"
          @keyup.enter="handleSearch"
        />
      </div>
    </div>

    <div class="permission-container">
      <div v-for="module in groupedPermissions" :key="module.name" class="permission-module">
        <div class="module-header">
          <h3>{{ module.name }}</h3>
          <span class="module-count">{{ module.permissions.length }} 个权限</span>
        </div>
        <base-table :data="module.permissions" :loading="isLoading">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="权限名称" />
          <el-table-column prop="code" label="权限编码" />
          <el-table-column prop="description" label="描述" />
          <el-table-column label="操作" width="180">
            <template #default="{ row }">
              <el-button link size="small" @click="openDialog('edit', row)">编辑</el-button>
              <el-button link size="small" @click="removePermission(row.id)" style="color: #f56c6c">删除</el-button>
            </template>
          </el-table-column>
        </base-table>
      </div>
    </div>

    <base-modal title="权限信息" :visible="dialogVisible" @update:visible="dialogVisible = $event" width="520px">
      <base-form ref="permissionFormRef" :model="formData" :rules="rules">
        <el-form-item label="所属模块" prop="module">
          <el-select v-model="formData.module" placeholder="请选择模块">
            <el-option v-for="module in modules" :key="module" :label="module" :value="module" />
          </el-select>
        </el-form-item>
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入权限名称" />
        </el-form-item>
        <el-form-item label="权限编码" prop="code">
          <el-input v-model="formData.code" placeholder="请输入权限编码" />
        </el-form-item>
        <el-form-item label="接口路径" prop="apiPath">
          <el-input v-model="formData.apiPath" placeholder="请输入接口路径" />
        </el-form-item>
        <el-form-item label="请求方法" prop="method">
          <el-select v-model="formData.method" placeholder="请选择请求方法">
            <el-option label="GET" value="GET" />
            <el-option label="POST" value="POST" />
            <el-option label="PUT" value="PUT" />
            <el-option label="DELETE" value="DELETE" />
            <el-option label="PATCH" value="PATCH" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input type="textarea" rows="3" v-model="formData.description" placeholder="请输入权限描述" />
        </el-form-item>
      </base-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="savePermission">保存</el-button>
      </template>
    </base-modal>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { fetchPermissions, createPermission, updatePermission, deletePermission, fetchModules } from '@/api'
import BaseTable from '@/components/BaseTable.vue'
import BaseModal from '@/components/BaseModal.vue'
import BaseForm from '@/components/BaseForm.vue'

interface PermissionItem {
  id: number
  name: string
  code: string
  module: string
  apiPath: string
  method: string
  description: string
}

const permissions = ref<PermissionItem[]>([])
const dialogVisible = ref(false)
const currentMode = ref<'add' | 'edit'>('add')
const editingId = ref<number | null>(null)
const permissionFormRef = ref()
const isLoading = ref(false)
const searchKeyword = ref('')
const selectedModule = ref('')

const modules = ref<string[]>([])

const formData = reactive<PermissionItem>({
  id: 0,
  name: '',
  code: '',
  module: '',
  apiPath: '',
  method: 'GET',
  description: ''
})

const rules = {
  module: [{ required: true, message: '请选择所属模块', trigger: 'blur' }],
  name: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入权限编码', trigger: 'blur' }],
  apiPath: [{ required: true, message: '请输入接口路径', trigger: 'blur' }],
  method: [{ required: true, message: '请选择请求方法', trigger: 'blur' }],
  description: [{ required: true, message: '请输入权限描述', trigger: 'blur' }]
}

const filteredPermissions = computed(() => {
  let result = [...permissions.value]
  
  // 按模块筛选
  if (selectedModule.value) {
    result = result.filter(perm => perm.module === selectedModule.value)
  }
  
  // 按关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(perm => 
      perm.name.toLowerCase().includes(keyword) || 
      perm.code.toLowerCase().includes(keyword)
    )
  }
  
  return result
})

const groupedPermissions = computed(() => {
  const groups: { name: string; permissions: PermissionItem[] }[] = []
  const moduleMap = new Map<string, PermissionItem[]>()
  
  // 按模块分组
  filteredPermissions.value.forEach(perm => {
    if (!moduleMap.has(perm.module)) {
      moduleMap.set(perm.module, [])
    }
    moduleMap.get(perm.module)?.push(perm)
  })
  
  // 转换为数组
  moduleMap.forEach((permissions, module) => {
    groups.push({ name: module, permissions })
  })
  
  // 按模块名称排序
  return groups.sort((a, b) => a.name.localeCompare(b.name))
})

const loadPermissions = async () => {
  isLoading.value = true
  try {
    const response = await fetchPermissions()
    permissions.value = Array.isArray(response) ? response : []
  } catch (error) {
    ElMessage.error('权限数据加载失败')
    // 失败时使用模拟数据
    permissions.value = [
      { id: 1, name: '查看待办', code: 'todo:view', module: '待办管理', apiPath: '/api/todos', method: 'GET', description: '查看待办事项列表' },
      { id: 2, name: '新增待办', code: 'todo:create', module: '待办管理', apiPath: '/api/todos', method: 'POST', description: '新增待办事项' },
      { id: 3, name: '编辑待办', code: 'todo:edit', module: '待办管理', apiPath: '/api/todos/{id}', method: 'PUT', description: '编辑待办事项' },
      { id: 4, name: '删除待办', code: 'todo:delete', module: '待办管理', apiPath: '/api/todos/{id}', method: 'DELETE', description: '删除待办事项' },
      { id: 5, name: '管理用户', code: 'user:manage', module: '用户管理', apiPath: '/api/system/users', method: 'GET', description: '管理系统用户' },
      { id: 6, name: '管理角色', code: 'role:manage', module: '角色管理', apiPath: '/api/system/roles', method: 'GET', description: '管理系统角色' },
      { id: 7, name: '管理部门', code: 'department:manage', module: '部门管理', apiPath: '/api/system/departments', method: 'GET', description: '管理系统部门' }
    ]
  } finally {
    isLoading.value = false
  }
}

const openDialog = (mode: 'add' | 'edit', row?: PermissionItem) => {
  currentMode.value = mode
  if (mode === 'add') {
    editingId.value = null
    Object.assign(formData, { 
      id: Date.now(), 
      name: '', 
      code: '', 
      module: '', 
      apiPath: '', 
      method: 'GET', 
      description: '' 
    })
  } else if (row) {
    editingId.value = row.id
    Object.assign(formData, row)
  }
  dialogVisible.value = true
}

const savePermission = async () => {
  permissionFormRef.value?.validate(async (valid: boolean) => {
    if (!valid) return
    try {
      if (currentMode.value === 'add') {
        await createPermission({ ...formData })
        ElMessage.success('权限已新增')
      } else {
        await updatePermission(editingId.value ?? 0, { ...formData })
        ElMessage.success('权限已更新')
      }
      dialogVisible.value = false
      loadPermissions()
    } catch (error) {
      ElMessage.error('保存权限失败，请稍后重试')
    }
  })
}

const removePermission = async (id: number) => {
  try {
    await deletePermission(id)
    ElMessage.success('权限已删除')
    loadPermissions()
  } catch (error) {
    ElMessage.error('删除权限失败，请稍后重试')
  }
}

const handleModuleChange = () => {
  // 模块选择变化时自动过滤
}

const handleSearch = () => {
  // 搜索时自动过滤
}

const loadModules = async () => {
  try {
    const response = await fetchModules()
    modules.value = Array.isArray(response) ? response : [
      '待办管理',
      '用户管理',
      '角色管理',
      '部门管理',
      '系统设置'
    ]
  } catch (error) {
    ElMessage.error('模块数据加载失败')
    modules.value = [
      '待办管理',
      '用户管理',
      '角色管理',
      '部门管理',
      '系统设置'
    ]
  }
}

onMounted(() => {
  loadModules()
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
  gap: 12px;
}

.permission-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.permission-module {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #e2e8f0;
}

.module-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.module-count {
  font-size: 14px;
  color: #666;
  background: #e9ecef;
  padding: 4px 12px;
  border-radius: 12px;
}

.permission-module :deep(.el-table) {
  border: none;
}

.permission-module :deep(.el-table__header-wrapper) {
  background: #f8f9fa;
}

.permission-module :deep(.el-table th) {
  border-bottom: 1px solid #e2e8f0;
  font-weight: 600;
}

.permission-module :deep(.el-table td) {
  border-bottom: 1px solid #f0f0f0;
}

@media (max-width: 768px) {
  .page-toolbar {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .search-block {
    width: 100%;
  }
  
  .search-block .el-select,
  .search-block .el-input {
    flex: 1;
  }
}
</style>