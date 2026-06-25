//商品分类全局组件的小仓库
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { reqC1, reqC2, reqC3 } from '@/api/product/attr'
import type { CategoryResponseData } from '@/api/product/attr/type'
import type { CategoryObj } from './types/type'
import { ElMessage } from 'element-plus'

const useCategoryStore = defineStore('Category', () => {
  // state
  const c1Arr = ref<CategoryObj[]>([])
  const c1Id = ref<string | null>(null)
  const c2Arr = ref<CategoryObj[]>([])
  const c2Id = ref<string | null>(null)
  const c3Arr = ref<CategoryObj[]>([])
  const c3Id = ref<string | null>(null)
  const spuId = ref<string | null>(null)

  // 获取一级分类
  const getC1 = async () => {
    try {
      const result: CategoryResponseData = await reqC1()
      if (result.code == 200) {
        c1Arr.value = result.data
      } else {
        ElMessage({
          type: 'error',
          message: result.message || '获取一级分类失败',
        })
      }
    } catch {
      ElMessage({ type: 'error', message: '获取一级分类异常，请检查网络' })
    }
  }

  // 获取二级分类
  const getC2 = async () => {
    if (c1Id.value == null) return
    try {
      const result: CategoryResponseData = await reqC2(c1Id.value)
      if (result.code == 200) {
        c2Arr.value = result.data
      } else {
        ElMessage({
          type: 'error',
          message: result.message || '获取二级分类失败',
        })
      }
    } catch {
      ElMessage({ type: 'error', message: '获取二级分类异常，请检查网络' })
    }
  }

  // 获取三级分类
  const getC3 = async () => {
    if (c2Id.value == null) return
    try {
      const result: CategoryResponseData = await reqC3(c2Id.value)
      if (result.code == 200) {
        c3Arr.value = result.data
      } else {
        ElMessage({
          type: 'error',
          message: result.message || '获取三级分类失败',
        })
      }
    } catch {
      ElMessage({ type: 'error', message: '获取三级分类异常，请检查网络' })
    }
  }

  // 组合式 store 需要手动实现 $reset
  const $reset = () => {
    c1Arr.value = []
    c1Id.value = null
    c2Arr.value = []
    c2Id.value = null
    c3Arr.value = []
    c3Id.value = null
    spuId.value = null
  }

  return {
    c1Arr,
    c1Id,
    c2Arr,
    c2Id,
    c3Arr,
    c3Id,
    spuId,
    getC1,
    getC2,
    getC3,
    $reset,
  }
})

export default useCategoryStore
