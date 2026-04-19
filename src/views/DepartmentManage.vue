<template>
  <div>
    <el-card>
      <div class="card-header">部门管理</div>
      <el-table :data="departments" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="部门名称" />
        <el-table-column prop="leader" label="负责人" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
const departments = [
  { id: 1, name: '研发部', leader: '赵六' },
  { id: 2, name: '测试部', leader: '孙七' },
  { id: 3, name: '市场部', leader: '钱八' }
]
</script>

<style scoped>
.card-header {
  font-size: 16px;
  margin-bottom: 18px;
}
</style>
