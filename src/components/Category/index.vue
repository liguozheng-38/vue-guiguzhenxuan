<template>
  <el-card>
    <el-form :inline="true" class="category-form">
      <el-form-item label="一级分类">
        <!-- change:选中值发生变化时触发 -->
        <el-select
          :disabled="scene == 0 ? false : true"
          v-model="categoryStore.c1Id"
          @change="handler"
        >
          <!-- label:即为展示数据 value:即为select下拉菜单收集的数据 -->
          <el-option
            v-for="c1 in categoryStore.c1Arr"
            :key="c1.id"
            :label="c1.name"
            :value="String(c1.id)"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          :disabled="scene == 0 ? false : true"
          v-model="categoryStore.c2Id"
          @change="handler1"
        >
          <el-option
            v-for="c2 in categoryStore.c2Arr"
            :key="c2.id"
            :label="c2.name"
            :value="String(c2.id)"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          :disabled="scene == 0 ? false : true"
          v-model="categoryStore.c3Id"
          @change="handler2"
        >
          <el-option
            v-for="c3 in categoryStore.c3Arr"
            :key="c3.id"
            :label="c3.name"
            :value="String(c3.id)"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, toRef } from 'vue'
import useCategoryStore from '@/store/modules/category'
import { ElMessage } from 'element-plus'

const props = defineProps<{ scene: number }>()
const scene = toRef(props, 'scene')
const categoryStore = useCategoryStore()

const loadC1 = async () => {
  try {
    await categoryStore.getC1()
    if (categoryStore.c1Arr.length === 0) {
      ElMessage({ type: 'warning', message: '未获取到一级分类数据' })
    }
    if (categoryStore.c1Id !== null && categoryStore.c1Id !== undefined) {
      await loadC2()
    }
  } catch (error) {
    ElMessage({ type: 'error', message: '获取一级分类失败' })
  }
}

const loadC2 = async () => {
  try {
    await categoryStore.getC2()
    if (
      categoryStore.c2Arr.length === 0 &&
      categoryStore.c1Id !== null &&
      categoryStore.c1Id !== undefined
    ) {
      ElMessage({ type: 'warning', message: '该一级分类下暂无二级分类' })
    }
    if (categoryStore.c2Id !== null && categoryStore.c2Id !== undefined) {
      await loadC3()
    }
  } catch (error) {
    ElMessage({ type: 'error', message: '获取二级分类失败' })
  }
}

const loadC3 = async () => {
  try {
    await categoryStore.getC3()
    if (
      categoryStore.c3Arr.length === 0 &&
      categoryStore.c2Id !== null &&
      categoryStore.c2Id !== undefined
    ) {
      ElMessage({ type: 'warning', message: '该二级分类下暂无三级分类' })
    }
  } catch (error) {
    ElMessage({ type: 'error', message: '获取三级分类失败' })
  }
}

onMounted(() => {
  if (categoryStore.c1Id !== null && categoryStore.c1Id !== undefined) {
    categoryStore.c1Id = String(categoryStore.c1Id)
  }
  if (categoryStore.c2Id !== null && categoryStore.c2Id !== undefined) {
    categoryStore.c2Id = String(categoryStore.c2Id)
  }
  if (categoryStore.c3Id !== null && categoryStore.c3Id !== undefined) {
    categoryStore.c3Id = String(categoryStore.c3Id)
  }
  loadC1()
})

const handler = async () => {
  categoryStore.c2Id = null
  categoryStore.c2Arr = []
  categoryStore.c3Id = null
  categoryStore.c3Arr = []
  if (categoryStore.c1Id !== null && categoryStore.c1Id !== undefined) {
    await loadC2()
  }
}

const handler1 = async () => {
  categoryStore.c3Id = null
  categoryStore.c3Arr = []
  if (categoryStore.c2Id !== null && categoryStore.c2Id !== undefined) {
    await loadC3()
  }
}

const handler2 = async () => {
  if (categoryStore.c3Id === null || categoryStore.c3Id === undefined) {
    categoryStore.c3Arr = []
  }
}
</script>

<style scoped>
.category-form {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}
.category-form .el-form-item {
  display: flex;
  align-items: center;
  margin: 0;
}
.category-form .el-form-item .el-form-item__label {
  min-width: 90px;
  padding-right: 8px;
}
.category-form .el-form-item .el-select {
  min-width: 220px;
  width: 260px;
}
@media (max-width: 768px) {
  .category-form .el-form-item .el-select {
    width: 180px;
    min-width: 140px;
  }
}
</style>
