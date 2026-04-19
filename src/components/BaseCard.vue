<template>
  <el-card :shadow="shadow" class="base-card">
    <slot />
  </el-card>
</template>

<script setup lang="ts">
const props = defineProps({
  shadow: { type: String, default: 'always' }
})
</script>

<style scoped>
.base-card {
  min-height: 160px;
}
</style>
