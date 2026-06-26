<template>
  <el-card>
    <el-table border style="margin: 10px 0px" :data="skuArr">
      <template #empty>
        <el-empty description="暂无数据"></el-empty>
      </template>
      <el-table-column
        label="序号"
        type="index"
        align="center"
        width="80px"
      ></el-table-column>
      <el-table-column
        label="名称"
        show-overflow-tooltip
        width="150px"
        prop="skuName"
      ></el-table-column>
      <el-table-column
        label="描述"
        show-overflow-tooltip
        width="150px"
        prop="skuDesc"
      ></el-table-column>
      <el-table-column label="图片" width="150px">
        <template #="{ row }">
          <img
            :src="normalizeImageUrl(row.skuDefaultImg || '')"
            alt=""
            style="width: 100px; height: 100px"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="重量"
        width="150px"
        prop="weight"
      ></el-table-column>
      <el-table-column
        label="价格"
        width="150px"
        prop="price"
      ></el-table-column>
      <el-table-column label="操作" width="250px" fixed="right">
        <template #="{ row }">
          <el-button
            type="primary"
            size="small"
            :icon="row.isSale == 1 ? 'Bottom' : 'Top'"
            @click="updateSale(row)"
            v-has="`btn.Sku.updown`"
          ></el-button>
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="updateSku"
            v-has="`btn.Sku.update`"
          ></el-button>
          <el-button
            type="primary"
            size="small"
            icon="InfoFilled"
            @click="findSku(row)"
            v-has="`btn.Sku.detail`"
          ></el-button>
          <el-popconfirm
            :title="`你确定要删除${row.skuName}?`"
            width="200px"
            @confirm="removeSku(row.id ?? row.ID)"
          >
            <template #reference>
              <el-button
                type="primary"
                size="small"
                icon="Delete"
                v-has="`btn.Sku.remove`"
              ></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <Pageinator
      v-model="pageNo"
      v-model:pageSize="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :total="total"
      @change="handlePageChange"
    />
    <!-- 抽屉组件:展示商品详情 -->
    <el-drawer v-model="drawer">
      <template #header>
        <h4>查看商品的详情</h4>
      </template>
      <template #default>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">名称</el-col>
          <el-col :span="18">{{ skuInfo.skuName }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">描述</el-col>
          <el-col :span="18">{{ skuInfo.skuDesc }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">价格</el-col>
          <el-col :span="18">{{ skuInfo.price }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">平台属性</el-col>
          <el-col :span="18">
            <el-tag
              style="margin: 5px"
              v-for="item in skuInfo.skuAttrValueList"
              :key="item.id ?? item.ID"
            >
              {{ item.valueName }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">销售属性</el-col>
          <el-col :span="18">
            <el-tag
              style="margin: 5px"
              v-for="item in skuInfo.skuSaleAttrValueList"
              :key="item.id ?? item.ID"
            >
              {{ item.saleAttrValueName }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">商品图片</el-col>
          <el-col :span="18">
            <el-carousel :interval="4000" type="card" height="200px">
              <el-carousel-item
                v-for="item in skuInfo.skuImageList"
                :key="item.id ?? item.ID"
              >
                <img
                  :src="normalizeImageUrl(item.imgUrl || '')"
                  alt=""
                  style="width: 100%; height: 100%"
                />
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </template>
    </el-drawer>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { normalizeImageUrl } from '@/utils/imageUrl'
import {
  reqSkuList,
  reqSaleSku,
  reqCancelSale,
  reqSkuInfo,
  reqRemoveSku,
} from '@/api/product/sku'
import type {
  SkuResponseData,
  SkuData,
  SkuInfoData,
  ResponseData,
} from '@/api/product/sku/type'
import { ElMessage } from 'element-plus'

const pageNo = ref<number>(1)
const pageSize = ref<number>(10)
const loading = ref<boolean>(true)
const total = ref<number>(0)
const skuArr = ref<SkuData[]>([])
const drawer = ref<boolean>(false)
const skuInfo = ref<SkuData>({})

onMounted(() => {
  getHasSku()
})

const getHasSku = async (pager = 1) => {
  loading.value = true
  pageNo.value = pager
  const result: SkuResponseData = await reqSkuList(pageNo.value, pageSize.value)
  if (result.code == 200) {
    total.value = result.data.total
    skuArr.value = result.data.records
    loading.value = false
  }
}

// 分页器变化的回调
const handlePageChange = (page: number) => {
  getHasSku(page)
}

const updateSale = async (row: SkuData) => {
  const skuId = row.id ?? row.ID
  if (skuId == null) return

  try {
    const isOnSale = Number(row.isSale) === 1
    const result: ResponseData = isOnSale
      ? await reqCancelSale(skuId as number)
      : await reqSaleSku(skuId as number)

    if (result && result.code === 200) {
      row.isSale = isOnSale ? 0 : 1
      ElMessage({
        type: 'success',
        message: isOnSale ? '下架成功' : '上架成功',
      })
      await getHasSku(pageNo.value)
    } else {
      ElMessage({
        type: 'error',
        message: result?.message || '操作失败，请稍后再试',
      })
    }
  } catch (err) {
    const msg =
      err && (err as Error).message
        ? (err as Error).message
        : '网络异常，请稍后重试'
    ElMessage({ type: 'error', message: msg })
  }
}

const updateSku = () => {
  ElMessage({ type: 'success', message: '码农努力更新中....' })
}

const findSku = async (row: SkuData) => {
  drawer.value = true
  const result: SkuInfoData = await reqSkuInfo(row.id as number)
  skuInfo.value = result.data
}

const removeSku = async (id: number | undefined) => {
  if (id === undefined) return
  const result: ResponseData = await reqRemoveSku(id)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    getHasSku(skuArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({ type: 'error', message: '系统数据不能删除' })
  }
}
</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
