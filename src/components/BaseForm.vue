<template>
  <el-form :model="model" :rules="rules" label-width="120px" label-position="right" ref="innerForm" v-bind="$attrs">
    <slot />
  </el-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  model: { type: Object, required: true },
  rules: { type: Object, default: () => ({}) }
})

const innerForm = ref()

const validate = (callback: (valid: boolean) => void) => {
  return innerForm.value?.validate(callback)
}

const resetFields = () => {
  return innerForm.value?.resetFields()
}

defineExpose({
  validate,
  resetFields
})
</script>
