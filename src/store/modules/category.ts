//商品分类全局组件的小仓库
import { defineStore } from 'pinia'
import { reqC1, reqC2, reqC3 } from '@/api/product/attr'
import type { CategoryResponseData } from '@/api/product/attr/type'
import type { CategoryState } from './types/type'
import { ElMessage } from 'element-plus'

let useCategoryStore = defineStore('Category', {
  state: (): CategoryState => {
    return {
      //存储一级分类的数据
      c1Arr: [],
      //存储一级分类的ID
      c1Id: null as null | string,
      //存储对应一级分类下二级分类的数据
      c2Arr: [],
      //收集二级分类的ID
      c2Id: null as null | string,
      //存储三级分类的数据
      c3Arr: [],
      //存储三级分类的ID
      c3Id: null as null | string,
      //存储SPU的ID
      spuId: null as null | string,
    }
  },
  actions: {
    //获取一级分类的方法
    async getC1() {
      try {
        //发请求获取一级分类的数据
        let result: CategoryResponseData = await reqC1()
        console.log('获取一级分类结果:', result)
        if (result.code == 200) {
          this.c1Arr = result.data
        } else {
          ElMessage({ type: 'error', message: result.message || '获取一级分类失败' })
        }
      } catch (error) {
        console.error('获取一级分类异常:', error)
        ElMessage({ type: 'error', message: '获取一级分类异常，请检查网络' })
      }
    },
    //获取二级分类的数据
    async getC2() {
      if (this.c1Id == null) return
      try {
        //获取对应一级分类的下二级分类的数据
        let result: CategoryResponseData = await reqC2(this.c1Id)
        console.log('获取二级分类结果:', result)
        if (result.code == 200) {
          this.c2Arr = result.data
        } else {
          ElMessage({ type: 'error', message: result.message || '获取二级分类失败' })
        }
      } catch (error) {
        console.error('获取二级分类异常:', error)
        ElMessage({ type: 'error', message: '获取二级分类异常，请检查网络' })
      }
    },
    //获取三级分类的数据
    async getC3() {
      if (this.c2Id == null) return
      try {
        let result: CategoryResponseData = await reqC3(this.c2Id)
        console.log('获取三级分类结果:', result)
        if (result.code == 200) {
          this.c3Arr = result.data
        } else {
          ElMessage({ type: 'error', message: result.message || '获取三级分类失败' })
        }
      } catch (error) {
        console.error('获取三级分类异常:', error)
        ElMessage({ type: 'error', message: '获取三级分类异常，请检查网络' })
      }
    },
  },
  getters: {},
})

export default useCategoryStore
