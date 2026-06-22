<template>
  <el-form label-width="100px">
    <el-form-item label="SKU名称">
      <el-input placeholder="SKU名称" v-model="skuParams.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input
        placeholder="价格(元)"
        type="number"
        v-model="skuParams.price"
      ></el-input>
    </el-form-item>
    <el-form-item label="重量(g)">
      <el-input
        placeholder="重量(g)"
        type="number"
        v-model="skuParams.weight"
      ></el-input>
    </el-form-item>
    <el-form-item label="SKU描述">
      <el-input
        placeholder="SKU描述"
        type="textarea"
        v-model="skuParams.skuDesc"
      ></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <div class="sku-form-attr-grid">
        <el-form-item
          v-for="item in attrArr"
          :key="item.id"
          :label="item.attrName"
          style="min-width: 260px; flex: 1 1 260px"
        >
          <el-select v-model="item.attrIdAndValueId" style="width: 100%">
            <el-option
              :value="`${item.id}:${attrValue.id}`"
              v-for="attrValue in item.attrValueList"
              :key="attrValue.id"
              :label="attrValue.valueName"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
    </el-form-item>
    <el-form-item label="销售属性">
      <div class="sku-form-attr-grid">
        <el-form-item
          :label="item.saleAttrName"
          v-for="item in saleArr"
          :key="item.id"
          style="min-width: 260px; flex: 1 1 260px"
        >
          <el-select v-model="item.saleIdAndValueId" style="width: 100%">
            <el-option
              :value="`${item.id}:${saleAttrValue.id}`"
              v-for="saleAttrValue in item.spuSaleAttrValueList"
              :key="saleAttrValue.id"
              :label="saleAttrValue.saleAttrValueName"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table
        border
        :data="imgArr"
        ref="table"
        @selection-change="onSelectionChange"
      >
        <el-table-column
          type="selection"
          width="80px"
          align="center"
        ></el-table-column>
        <el-table-column label="图片">
          <template #="{ row }">
            <img
              :src="row.displayUrl"
              alt=""
              style="width: 100px; height: 100px"
            />
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作">
          <template #="{ row }">
            <el-button type="primary" size="small" @click="handler(row)">
              设置默认
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="default" @click="save">保存</el-button>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
//引入请求API
import { reqAttr } from '@/api/product/attr'
import type { AttrResponseData, Attr } from '@/api/product/attr/type'
import {
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAddSku,
} from '@/api/product/spu'
import { ElTable } from 'element-plus'
import type {
  SkuData,
  SpuHasImg,
  SaleAttrResponseData,
  SpuImg,
  SaleAttr,
  saleArr as SaleArrType,
  ResponseData,
} from '@/api/product/spu/type'
import type { SpuData } from '@/api/product/spu/type'
import { ElMessage } from 'element-plus'
import { ref, reactive } from 'vue'
import { normalizeImageUrl } from '@/utils/imageUrl'
//扩展类型：额外的临时字段用于模板交互
type AttrWithExtra = Attr & { attrIdAndValueId?: string }
type SaleAttrWithExtra = SaleAttr & { saleIdAndValueId?: string }
type SpuImgWithDisplay = SpuImg & { displayUrl: string } // 添加显示URL字段

//平台属性
let attrArr = ref<AttrWithExtra[]>([])
//销售属性
let saleArr = ref<SaleAttrWithExtra[]>([])
//照片的数据
let imgArr = ref<SpuImgWithDisplay[]>([])
//获取table组件实例
let table = ref<InstanceType<typeof ElTable>>()
//收集SKU的参数
let skuParams = reactive<SkuData>({
  //父组件传递过来的数据
  category3Id: '', //三级分类的ID
  spuId: '', //已有的SPU的ID
  tmId: '', //SPU品牌的ID
  //v-model收集
  skuName: '', //sku名字
  price: '', //sku价格
  weight: '', //sku重量
  skuDesc: '', //sku的描述

  skuAttrValueList: [
    //平台属性的收集
  ],
  skuSaleAttrValueList: [
    //销售属性
  ],
  skuDefaultImg: '', //sku图片地址
})
//当前子组件的方法对外暴露
type SpuReference = Pick<SpuData, 'id' | 'category3Id' | 'tmId'>

const initSkuData = async (
  c1Id: number | string,
  c2Id: number | string,
  spu: SpuReference,
) => {
  if (spu.id == null) return
  //收集数据
  skuParams.category3Id = spu.category3Id
  skuParams.spuId = spu.id
  skuParams.tmId = spu.tmId
  //获取平台属性
  let result: AttrResponseData = await reqAttr(c1Id, c2Id, spu.category3Id)
  //获取对应的销售属性
  let result1: SaleAttrResponseData = await reqSpuHasSaleAttr(spu.id)
  //获取照片墙的数据
  let result2: SpuHasImg = await reqSpuImageList(spu.id)
  //平台属性（接口可能返回 null）
  attrArr.value = result?.data || []
  //销售属性
  saleArr.value = result1?.data
  //图片：保留原始URL用于保存，添加displayUrl用于显示
  imgArr.value = (result2?.data || []).map((item) => ({
    ...item,
    imgUrl: item.imgUrl || item.url || '', // 保留原始URL用于保存
    displayUrl: normalizeImageUrl(item.imgUrl || item.url || ''), // 处理后的URL用于显示
  }))
}
//取消按钮的回调
const cancel = () => {
  $emit('changeScene', { flag: 0, params: '' })
}

//设置默认图片的方法回调
const handler = (row: SpuImgWithDisplay) => {
  imgArr.value.forEach((item) => {
    table.value?.toggleRowSelection(item, false)
  })
  table.value?.toggleRowSelection(row, true)
  skuParams.skuDefaultImg = (row.imgUrl as string) || ''
}

// 勾选 checkbox 时自动设为默认图
const onSelectionChange = (rows: SpuImgWithDisplay[]) => {
  if (rows.length > 0) {
    skuParams.skuDefaultImg = (rows[rows.length - 1].imgUrl as string) || ''
  }
}
//对外暴露方法
defineExpose({
  initSkuData,
})

//保存按钮的方法
const save = async () => {
  //整理参数
  //平台属性
  skuParams.skuAttrValueList = attrArr.value.reduce<
    { attrId: string; valueId: string }[]
  >((prev, next) => {
    const t = next.attrIdAndValueId
    if (t) {
      let [attrId, valueId] = t.split(':')
      prev.push({
        attrId,
        valueId,
      })
    }
    return prev
  }, [])
  //销售属性
  skuParams.skuSaleAttrValueList = saleArr.value.reduce<SaleArrType[]>(
    (prev, next) => {
      const t = next.saleIdAndValueId
      if (t) {
        let [saleAttrId, saleAttrValueId] = t.split(':')
        prev.push({
          saleAttrId,
          saleAttrValueId,
        })
      }
      return prev
    },
    [],
  )

  //添加SKU的请求
  let result: ResponseData = await reqAddSku(skuParams)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '添加SKU成功',
    })
    //通知父组件切换场景为零
    $emit('changeScene', { flag: 0, params: '' })
  } else {
    ElMessage({
      type: 'error',
      message: '添加SKU失败',
    })
  }
}
//自定义事件的方法
let $emit = defineEmits(['changeScene'])
</script>

<style scoped>
.sku-form-attr-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
