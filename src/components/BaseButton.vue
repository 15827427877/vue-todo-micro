<template>
  <el-button :type="type" :plain="plain" :size="size" v-bind="$attrs">
    <slot />
  </el-button>
</template>

<script setup lang="ts">
const props = defineProps({
  type: { type: String, default: 'primary' },
  plain: { type: Boolean, default: false },
  size: { type: String, default: 'medium' }
})
</script>
