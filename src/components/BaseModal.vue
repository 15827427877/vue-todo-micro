<template>
  <el-dialog
    :title="title"
    :model-value="visible"
    :width="width"
    :close-on-click-modal="closeOnClickModal"
    @close="handleClose"
    v-bind="$attrs"
  >
    <slot />
    <template #footer>
      <slot name="footer" />
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
const props = defineProps({
  title: { type: String, default: '' },
  visible: { type: Boolean, required: true },
  width: { type: String, default: '600px' },
  closeOnClickModal: { type: Boolean, default: false }
})

const emit = defineEmits(['update:visible'])

const handleClose = () => {
  emit('update:visible', false)
}
</script>
