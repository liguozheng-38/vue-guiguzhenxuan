<template>
  <el-pagination
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :page-sizes="pageSizes"
    :background="background"
    :layout="layout"
    :total="total"
    @current-change="handleCurrentChange"
    @size-change="handleSizeChange"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: number
    pageSize?: number
    pageSizes?: number[]
    total?: number
    background?: boolean
    layout?: string
  }>(),
  {
    modelValue: 1,
    pageSize: 10,
    pageSizes: () => [5, 10, 20, 30],
    total: 0,
    background: true,
    layout: 'prev, pager, next, jumper,->,sizes,total',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
  (e: 'update:pageSize', value: number): void
  (e: 'change', page: number, size: number): void
}>()

const currentPage = ref(props.modelValue)
const pageSize = ref(props.pageSize)

watch(
  () => props.modelValue,
  (newVal) => {
    currentPage.value = newVal
  },
)

watch(
  () => props.pageSize,
  (newVal) => {
    pageSize.value = newVal
  },
)

const handleCurrentChange = (page: number) => {
  currentPage.value = page
  emit('update:modelValue', page)
  emit('change', page, pageSize.value)
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  emit('update:pageSize', size)
  emit('change', currentPage.value, size)
}
</script>
