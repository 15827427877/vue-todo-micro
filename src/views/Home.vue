<template>
  <div>
    <div class="dashboard-grid">
      <base-card class="base-card">
        <div class="dashboard-header">待办总数</div>
        <div class="dashboard-number">128</div>
      </base-card>
      <base-card class="base-card">
        <div class="dashboard-header">今日新增</div>
        <div class="dashboard-number">16</div>
      </base-card>
      <base-card class="base-card">
        <div class="dashboard-header">待办完成率</div>
        <div class="dashboard-number">86%</div>
      </base-card>
      <base-card class="base-card">
        <div class="dashboard-header">审批通知</div>
        <div class="dashboard-number">5</div>
      </base-card>
    </div>
    <el-card class="mt-24">
      <div class="card-header">快速操作</div>
      <div class="action-list">
        <base-button type="primary" class="mr-12">新建待办</base-button>
        <base-button>导出数据</base-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import BaseCard from '@/components/BaseCard.vue'
</script>

<style scoped>
.dashboard-header {
  color: #909399;
  margin-bottom: 16px;
}

.dashboard-number {
  font-size: 32px;
  font-weight: 600;
}

.mt-24 {
  margin-top: 24px;
}

.card-header {
  font-size: 16px;
  margin-bottom: 16px;
}

.action-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.mr-12 {
  margin-right: 12px;
}
</style>
