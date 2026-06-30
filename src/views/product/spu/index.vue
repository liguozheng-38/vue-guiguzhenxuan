<template>
  <div>
    <!-- 三级分类 -->
    <Category :scene="scene"></Category>
    <el-card style="margin: 10px 0px">
      <!-- v-if|v-show:都可以实现显示与隐藏 -->
      <div v-show="scene == 0">
        <el-button
          @click="addSpu"
          type="primary"
          size="default"
          icon="Plus"
          :disabled="categoryStore.c3Id ? false : true"
          v-has="`btn.Spu.add`"
        >
          添加SPU
        </el-button>
        <!-- 展示已有SPU数据 -->
        <el-table style="margin: 10px 0px" border :data="records">
          <template #empty>
            <el-empty description="暂无数据"></el-empty>
          </template>
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80px"
          ></el-table-column>
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <el-table-column
            label="SPU描述"
            prop="description"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="SPU操作">
            <!-- row:即为已有的SPU对象 -->
            <template #="{ row }">
              <el-button
                type="primary"
                size="small"
                icon="Plus"
                title="添加SKU"
                @click="addSku(row)"
                v-has="`btn.Spu.addsku`"
              ></el-button>
              <el-button
                type="primary"
                size="small"
                icon="Edit"
                title="修改SPU"
                @click="updateSpu(row)"
                v-has="`btn.Spu.update`"
              ></el-button>
              <el-button
                type="primary"
                size="small"
                icon="View"
                title="查看SKU列表"
                @click="findSku(row)"
                v-has="`btn.Spu.skus`"
              ></el-button>
              <el-popconfirm
                :title="`你确定删除${row.spuName}?`"
                width="200px"
                @confirm="deleteSpu(row)"
              >
                <template #reference>
                  <el-button
                    type="primary"
                    size="small"
                    icon="Delete"
                    title="删除SPU"
                    v-has="`btn.Spu.delete`"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <Pageinator
          v-model="pageNo"
          v-model:pageSize="pageSize"
          :page-sizes="[3, 5, 7, 9]"
          :total="total"
          @change="handlePageChange"
        />
      </div>
      <!-- 添加SPU|修改SPU子组件 -->
      <SpuForm
        ref="spu"
        v-show="scene == 1"
        @changeScene="changeScene"
      ></SpuForm>
      <!-- 添加SKU的子组件 -->
      <SkuForm
        ref="sku"
        v-show="scene == 2"
        @changeScene="changeScene"
      ></SkuForm>
      <!-- dialog对话框:展示已有的SKU数据 -->
      <el-dialog v-model="show" title="SKU列表">
        <el-table border :data="skuArr">
          <el-table-column label="SKU名字" prop="skuName"></el-table-column>
          <el-table-column label="SKU价格" prop="price"></el-table-column>
          <el-table-column label="SKU重量" prop="weight"></el-table-column>
          <el-table-column label="SKU图片">
            <template #="{ row }">
              <img
                :src="normalizeImageUrl(row.skuDefaultImg)"
                style="width: 100px; height: 100px"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import type {
  HasSpuResponseData,
  Records,
  SkuInfoData,
  SkuData,
  ResponseData,
} from '@/api/product/spu/type'
import { ref, watch, onBeforeUnmount } from 'vue'
import { normalizeImageUrl } from '@/utils/imageUrl'
import { reqHasSpu, reqSkuList, reqRemoveSpu } from '@/api/product/spu'
//引入分类的仓库
import useCategoryStore from '@/store/modules/category'
import type { SpuData } from '@/api/product/spu/type'
import SpuForm from './spuForm.vue'
import SkuForm from './skuForm.vue'
import { ElMessage } from 'element-plus'
const categoryStore = useCategoryStore()
// 进入页面时重置分类状态，避免继承其他页面的筛选条件
// categoryStore.c1Id = null
// categoryStore.c2Id = null
// categoryStore.c3Id = null
//场景的数据
const scene = ref<number>(0) //0:显示已有SPU  1:添加或者修改已有SPU 2:添加SKU的结构
const loading = ref<boolean>(true)
//分页器默认页码
const pageNo = ref<number>(1)
//每一页展示几条数据
const pageSize = ref<number>(3)
//存储已有的SPU的数据
const records = ref<Records>([])
//存储已有SPU总个数
const total = ref<number>(0)
//获取子组件实例SpuForm
type SpuFormExpose = {
  initAddSpu: (c3Id: number | string) => Promise<void>
  initHasSpuData: (spu: SpuData) => Promise<void>
}
type SkuFormExpose = {
  initSkuData: (
    c1Id: number | string,
    c2Id: number | string,
    spu: Pick<SpuData, 'id' | 'category3Id' | 'tmId'>,
  ) => Promise<void>
}

const spu = ref<SpuFormExpose | null>(null)
//获取子组件实例SkuForm
const sku = ref<SkuFormExpose | null>(null)
//存储全部的SKU数据
const skuArr = ref<SkuData[]>([])
const show = ref<boolean>(false)

//此方法执行:可以获取某一个三级分类下全部的已有的SPU
const getHasSpu = async (pager = 1) => {
  loading.value = true
  pageNo.value = pager
  const result: HasSpuResponseData = await reqHasSpu(
    pageNo.value,
    pageSize.value,
    categoryStore.c3Id || 0,
  )
  if (result.code == 200) {
    total.value = result.data.total
    records.value = result.data.records
  }
  loading.value = false
}

//监听三级分类ID变化
watch(
  () => categoryStore.c3Id,
  () => {
    //当三级分类发生变化的时候清空对应的数据
    records.value = []
    //务必保证有三级分类ID
    if (!categoryStore.c3Id) return
    // if (categoryStore.c3Id == null) return
    getHasSpu()
  },
  { immediate: true },
)
// 分页器变化的回调
const handlePageChange = (page: number) => {
  getHasSpu(page)
}

//添加新的SPU按钮的回调
const addSpu = () => {
  //切换为场景1:添加与修改已有SPU结构->SpuForm
  scene.value = 1
  //点击添加SPU按钮,调用子组件的方法初始化数据
  spu.value?.initAddSpu(categoryStore.c3Id as number | string)
}
//修改已有的SPU的按钮的回调
const updateSpu = (row: SpuData) => {
  //切换为场景1:添加与修改已有SPU结构->SpuForm
  scene.value = 1
  //调用子组件实例方法获取完整已有的SPU的数据
  spu.value?.initHasSpuData(row)
}

//子组件SpuForm绑定自定义事件:目前是让子组件通知父组件切换场景为0
const changeScene = (obj: { flag: number; params?: string }) => {
  //子组件Spuform点击取消变为场景0:展示已有的SPU
  scene.value = obj.flag
  if (obj.params == 'update') {
    //更新留在当前页
    getHasSpu(pageNo.value)
  } else {
    //添加留在第一页
    getHasSpu()
  }
}

//添加SKU按钮的回调
const addSku = (row: SpuData) => {
  //点击添加SKU按钮切换场景为2
  scene.value = 2
  if (categoryStore.c1Id == null || categoryStore.c2Id == null) {
    return
  }
  //调用子组件的方法初始化添加SKU的数据
  sku.value?.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
}

//查看SKU列表的数据
const findSku = async (row: SpuData) => {
  const result: SkuInfoData = await reqSkuList(row.id as number)
  if (result.code == 200) {
    skuArr.value = result.data
    //对话框显示出来
    show.value = true
  }
}

//删除已有的SPU按钮的回调
const deleteSpu = async (row: SpuData) => {
  const result: ResponseData = await reqRemoveSpu(row.id as number)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    //获取剩余SPU数据
    getHasSpu(records.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}

//路由组件销毁前，情况仓库关于分类的数据
// onBeforeUnmount(() => {
//   categoryStore.$reset()
// })
</script>

<style scoped></style>
