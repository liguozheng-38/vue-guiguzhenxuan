<template>
  <el-card style="height: 80px">
    <el-form :inline="true" class="search-form">
      <el-form-item :label="label">
        <el-input
          :placeholder="placeholder"
          v-model="keyword"
          @keyup.enter="handleSearch"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          size="default"
          :disabled="!keyword"
          @click="handleSearch"
          icon="Search"
        >
          搜索
        </el-button>
        <el-button
          type="primary"
          size="default"
          @click="handleReset"
          icon="Refresh"
        >
          重置
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    label?: string
    placeholder?: string
  }>(),
  {
    modelValue: '',
    label: '搜索',
    placeholder: '请输入搜索关键词',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'search', value: string): void
  (e: 'reset'): void
}>()

const keyword = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newVal) => {
    keyword.value = newVal
  },
)

const handleSearch = () => {
  emit('update:modelValue', keyword.value)
  emit('search', keyword.value)
}

const handleReset = () => {
  keyword.value = ''
  emit('update:modelValue', '')
  emit('reset')
}
</script>

<style scoped>
.search-form {
  display: flex;
  gap: 16px;
  align-items: center;
}

.search-form .el-form-item {
  margin: 0;
}
</style>
