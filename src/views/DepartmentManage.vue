<template>
  <div>
    <div class="page-toolbar">
      <el-button type="primary" icon="el-icon-plus" @click="openDialog('add')">新增部门</el-button>
    </div>
    <base-table :data="departments">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="部门名称" />
      <el-table-column prop="leader" label="负责人" />
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button link size="small" @click="openDialog('edit', row)">编辑</el-button>
          <el-button link size="small" @click="removeDepartment(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </base-table>

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
import { reactive, ref } from 'vue'
import BaseTable from '@/components/BaseTable.vue'
import BaseModal from '@/components/BaseModal.vue'
import BaseForm from '@/components/BaseForm.vue'

interface DepartmentItem {
  id: number
  name: string
  leader: string
}

const departments = ref<DepartmentItem[]>([
  { id: 1, name: '研发部', leader: '赵六' },
  { id: 2, name: '测试部', leader: '孙七' },
  { id: 3, name: '市场部', leader: '钱八' }
])

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

const saveDepartment = () => {
  departmentFormRef.value?.validate((valid: boolean) => {
    if (!valid) return
    if (currentMode.value === 'add') {
      departments.value.unshift({ ...formData })
    } else {
      const target = departments.value.find((item) => item.id === editingId.value)
      if (target) {
        Object.assign(target, formData)
      }
    }
    dialogVisible.value = false
  })
}

const removeDepartment = (id: number) => {
  departments.value = departments.value.filter((item) => item.id !== id)
}
</script>

<style scoped>
.page-toolbar {
  margin-bottom: 18px;
}
</style>
