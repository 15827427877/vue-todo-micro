<template>
  <div>
    <el-card>
      <div class="card-header">角色管理</div>
      <el-table :data="roles" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="角色名称" />
        <el-table-column prop="description" label="描述" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
const roles = [
  { id: 1, name: '管理员', description: '系统权限最多，可管理所有模块' },
  { id: 2, name: '普通用户', description: '可查看待办及个人任务' },
  { id: 3, name: '审核员', description: '可处理待办审批及转交' }
]
</script>

<style scoped>
.card-header {
  font-size: 16px;
  margin-bottom: 18px;
}
</style>
