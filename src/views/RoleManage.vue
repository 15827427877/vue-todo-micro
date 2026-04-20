<template>
  <div>
    <div class="page-toolbar">
      <el-button type="primary" icon="el-icon-plus" @click="openDialog('add')">新增角色</el-button>
    </div>
    <base-table :data="roles">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="角色名称" />
      <el-table-column prop="description" label="描述" />
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button type="text" size="small" @click="openDialog('edit', row)">编辑</el-button>
          <el-button type="text" size="small" @click="removeRole(row.id)">删除</el-button>
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
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import BaseTable from '@/components/BaseTable.vue'
import BaseModal from '@/components/BaseModal.vue'
import BaseForm from '@/components/BaseForm.vue'

interface RoleItem {
  id: number
  name: string
  description: string
}

const roles = ref<RoleItem[]>([
  { id: 1, name: '管理员', description: '系统权限最多，可管理所有模块' },
  { id: 2, name: '普通用户', description: '可查看待办及个人任务' },
  { id: 3, name: '审核员', description: '可处理待办审批及转交' }
])

const dialogVisible = ref(false)
const currentMode = ref<'add' | 'edit'>('add')
const editingId = ref<number | null>(null)
const roleFormRef = ref()

const formData = reactive<RoleItem>({
  id: 0,
  name: '',
  description: ''
})

const rules = {
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入角色描述', trigger: 'blur' }]
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
    } else {
      const target = roles.value.find((item) => item.id === editingId.value)
      if (target) {
        Object.assign(target, formData)
      }
    }
    dialogVisible.value = false
  })
}

const removeRole = (id: number) => {
  roles.value = roles.value.filter((item) => item.id !== id)
}
</script>

<style scoped>
.page-toolbar {
  margin-bottom: 18px;
}
</style>
