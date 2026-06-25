<template>
  <el-drawer
    :model-value="modelValue"
    :title="title"
    :direction="direction"
    :size="size"
    @update:model-value="handleUpdate"
    @close="handleClose"
  >
    <slot></slot>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    direction?: 'ltr' | 'rtl' | 'ttb' | 'btt'
    size?: string | number
  }>(),
  {
    title: '',
    direction: 'rtl',
    size: '50%',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
  (e: 'cancel'): void
  (e: 'confirm'): void
}>()

const handleUpdate = (val: boolean) => {
  emit('update:modelValue', val)
}

const handleClose = () => {
  emit('close')
}

const handleCancel = () => {
  emit('update:modelValue', false)
  emit('cancel')
}

const handleConfirm = () => {
  emit('confirm')
}
</script>
