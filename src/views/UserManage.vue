<template>
  <div>
    <el-card>
      <div class="card-header">用户管理</div>
      <el-table :data="users" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="用户名" />
        <el-table-column prop="role" label="角色" />
        <el-table-column prop="department" label="部门" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
const users = [
  { id: 1, name: '张三', role: '管理员', department: '研发部' },
  { id: 2, name: '李四', role: '用户', department: '测试部' },
  { id: 3, name: '王五', role: '运营', department: '市场部' }
]
</script>

<style scoped>
.card-header {
  font-size: 16px;
  margin-bottom: 18px;
}
</style>
