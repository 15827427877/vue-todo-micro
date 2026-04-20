<template>
  <el-table :data="data" v-bind="$attrs" stripe border>
    <slot />
  </el-table>
</template>

<script setup lang="ts">
const props = defineProps({
  data: { type: Array, default: () => [] }
})
</script>
