<template>
  <div>
    <div class="page-toolbar">
      <el-button type="primary" icon="el-icon-plus" @click="openDialog('add')">新增用户</el-button>
    </div>
    <base-table :data="users">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="用户名" />
      <el-table-column prop="role" label="角色" />
      <el-table-column prop="department" label="部门" />
      <el-table-column label="操作" width="220">
        <template #default="{ row }">
          <el-button type="text" size="small" @click="openDialog('edit', row)">编辑</el-button>
          <el-button type="text" size="small" @click="removeUser(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </base-table>

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
import { reactive, ref } from 'vue'
import BaseTable from '@/components/BaseTable.vue'
import BaseModal from '@/components/BaseModal.vue'
import BaseForm from '@/components/BaseForm.vue'

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
</style>
