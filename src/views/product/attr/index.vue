<template>
  <div>
    <!-- 三级分类全局组件 -->
    <Category :scene="scene" />
    <el-card style="margin: 10px 0px">
      <div v-show="scene == 0">
        <el-button
          @click="addAttr"
          type="primary"
          size="default"
          icon="Plus"
          :disabled="categoryStore.c3Id ? false : true"
          v-has="`btn.Attr.add`"
        >
          添加属性
        </el-button>
        <el-table border style="margin: 10px 0px" :data="attrArr">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80px"
          ></el-table-column>
          <el-table-column
            label="属性名称"
            width="120px"
            prop="attrName"
          ></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row }">
              <el-tag
                style="margin: 5px"
                v-for="item in row.attrValueList"
                :key="item.id"
              >
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px">
            <!-- row：已有的属性对象 -->
            <template #="{ row }">
              <!-- 修改已有属性的按钮 -->
              <el-button
                type="primary"
                size="small"
                icon="Edit"
                @click="updateAttr(row)"
                v-has="`btn.Attr.update`"
              ></el-button>
              <el-popconfirm
                :title="`你确定删除${row.attrName}?`"
                width="200px"
                @confirm="deleteAttr(row.id ?? row.ID)"
              >
                <template #reference>
                  <el-button
                    type="primary"
                    size="small"
                    icon="Delete"
                    v-has="`btn.Attr.remove`"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="scene == 1">
        <!-- 展示添加属性与修改数据的结构 -->
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input
              placeholder="请你输入属性名称"
              v-model="attrParams.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          @click="addAttrValue"
          :disabled="attrParams.attrName ? false : true"
          type="primary"
          size="default"
          icon="Plus"
        >
          添加属性值
        </el-button>
        <el-button type="primary" size="default" @click="cancel">
          取消
        </el-button>
        <el-table
          border
          style="margin: 10px 0px"
          :data="attrParams.attrValueList"
        >
          <el-table-column
            label="序号"
            width="80px"
            type="index"
            align="center"
          ></el-table-column>
          <el-table-column label="属性值名称">
            <!-- row:即为当前属性值对象 -->
            <template #="{ row, $index }">
              <el-input
                :ref="
                  (vc) =>
                    (inputArr[$index] = vc as
                      | InstanceType<typeof ElInput>
                      | undefined)
                "
                v-if="row.flag"
                @blur="toLook(row, $index)"
                size="small"
                placeholder="请你输入属性值名称"
                v-model="row.valueName"
              ></el-input>
              <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="属性值操作">
            <template #="{ index }">
              <el-button
                type="primary"
                size="small"
                icon="Delete"
                @click="attrParams.attrValueList.splice(index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          size="default"
          @click="save"
          :disabled="attrParams.attrValueList.length > 0 ? false : true"
        >
          保存
        </el-button>
        <el-button type="primary" size="default" @click="cancel">
          取消
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
//组合式API函数watch
import { watch, ref, reactive, nextTick } from 'vue'
//引入获取已有属性与属性值接口
import { reqAttr, reqAddOrUpdateAttr, reqRemoveAttr } from '@/api/product/attr'
import type { AttrResponseData, Attr, AttrValue } from '@/api/product/attr/type'
import type { ResponseData } from '@/api/user/type'
//获取分类的仓库
import useCategoryStore from '@/store/modules/category'
import { ElMessage, ElInput } from 'element-plus'
const categoryStore = useCategoryStore()
// 进入页面时重置分类状态，避免继承其他页面的筛选条件
categoryStore.c1Id = null
categoryStore.c2Id = null
categoryStore.c3Id = null
//存储已有的属性与属性值
const attrArr = ref<Attr[]>([])
const loading = ref<boolean>(true)
//定义card组件内容切换变量
const scene = ref<number>(0) //scene=0,显示table,scene=1,展示添加与修改属性结构
//收集新增的属性的数据
const attrParams = reactive<Attr>({
  attrName: '', //新增的属性的名字
  attrValueList: [
    //新增的属性值数组
  ],
  categoryId: '', //三级分类的ID
  categoryLevel: 3, //代表的是三级分类
})
//准备一个数组:将来存储对应的组件实例el-input
const inputArr = ref<(InstanceType<typeof ElInput> | undefined)[]>([])

const getAttr = async () => {
  loading.value = true
  const { c1Id, c2Id, c3Id } = categoryStore
  if (c1Id == null || c2Id == null || c3Id == null) {
    loading.value = false
    return
  }
  try {
    const result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
    if (result.code == 200) {
      const mappedData = (result.data || []).map((item: Attr) => {
        return {
          ...item,
          attrName: item.name || item.attrName || '',
          attrValueList: (item.children || item.attrValueList || []).map(
            (child: AttrValue | string) => {
              if (typeof child === 'string') {
                return { valueName: child, flag: false }
              }
              return {
                ...child,
                valueName: child.valueName || child.name || '',
                flag: false,
              }
            },
          ),
        }
      })
      attrArr.value = mappedData
    } else {
      attrArr.value = []
      ElMessage({ type: 'error', message: result.message || '获取属性失败' })
    }
  } catch (_error) {
    attrArr.value = []
    ElMessage({ type: 'error', message: '获取属性失败，请检查网络或后端接口' })
  } finally {
    loading.value = false
  }
}

//监听仓库三级分类ID变化
watch(
  () => categoryStore.c3Id,
  async () => {
    attrArr.value = []
    if (categoryStore.c3Id == null) return
    await getAttr()
  },
  { immediate: true },
)

watch(
  () => categoryStore.c2Id,
  () => {
    attrArr.value = []
  },
)

watch(
  () => categoryStore.c1Id,
  () => {
    attrArr.value = []
  },
)
//添加属性按钮的回调
const addAttr = () => {
  //每一次点击的时候,先清空一下数据再收集数据
  Object.assign(attrParams, {
    attrName: '', //新增的属性的名字
    attrValueList: [
      //新增的属性值数组
    ],
    categoryId: categoryStore.c3Id, //三级分类的ID
    categoryLevel: 3, //代表的是三级分类
  })
  //切换为添加与修改属性的结构
  scene.value = 1
}
//table表格修改已有属性按钮的回调
const updateAttr = (row: Attr) => {
  //切换为添加与修改属性的结构
  scene.value = 1
  //将已有的属性对象赋值给attrParams对象即为
  //ES6->Object.assign进行对象的合并
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}
//取消按钮的回调
const cancel = () => {
  scene.value = 0
}
//添加属性值按钮的回调
const addAttrValue = () => {
  //点击添加属性值按钮的时候,向数组添加一个属性值对象
  attrParams.attrValueList.push({
    valueName: '',
    flag: true, //控制每一个属性值编辑模式与切换模式的切换
  })
  //获取最后el-input组件聚焦
  nextTick(() => {
    const lastInput = inputArr.value[attrParams.attrValueList.length - 1]
    lastInput?.focus()
  })
}
//保存按钮的回调
const save = async () => {
  // 清洗数据：去掉前端专用字段 flag，确保 categoryId 为数字
  const payload = {
    ...attrParams,
    categoryId: Number(attrParams.categoryId),
    attrValueList: attrParams.attrValueList.map((v) => ({
      id: v.id,
      attrId: v.attrId,
      valueName: v.valueName,
    })),
  }
  const result: ResponseData = await reqAddOrUpdateAttr(payload)
  //添加属性|修改已有的属性已经成功
  if (result.code == 200) {
    //切换场景
    scene.value = 0
    //提示信息
    ElMessage({
      type: 'success',
      message: attrParams.id ? '修改成功' : '添加成功',
    })
    //获取全部已有的属性与属性值
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: attrParams.id ? '修改失败' : '添加失败',
    })
  }
}

//属性值表单元素失却焦点事件回调
const toLook = (row: AttrValue, $index: number) => {
  //非法情况判断1
  if (row.valueName.trim() == '') {
    //删除调用对应属性值为空的元素
    attrParams.attrValueList.splice($index, 1)
    //提示信息
    ElMessage({
      type: 'error',
      message: '属性值不能为空',
    })
    return
  }
  //非法情况2
  const repeat = attrParams.attrValueList.find((item) => {
    //切记把当前失却焦点属性值对象从当前数组扣除判断
    if (item != row) {
      return item.valueName === row.valueName
    }
  })

  if (repeat) {
    //将重复的属性值从数组当中干掉
    attrParams.attrValueList.splice($index, 1)
    //提示信息
    ElMessage({
      type: 'error',
      message: '属性值不能重复',
    })
    return
  }
  //相应的属性值对象flag:变为false,展示div
  row.flag = false
}

//属性值div点击事件
const toEdit = (row: AttrValue, $index: number) => {
  //相应的属性值对象flag:变为true,展示input
  row.flag = true
  //nextTick:响应式数据发生变化,获取更新的DOM(组件实例)
  nextTick(() => {
    const input = inputArr.value[$index]
    input?.focus()
  })
}

//删除某一个已有的属性方法回调
const deleteAttr = async (attrId?: number) => {
  if (!attrId) return
  //发相应的删除已有的属性的请求
  const result: ResponseData = await reqRemoveAttr(attrId)
  //删除成功
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    //获取一次已有的属性与属性值
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}

//路由组件销毁的时候，不再清空全局分类仓库，保留已选择的分类信息
// onBeforeUnmount(() => {
//   categoryStore.$reset()
// })
</script>

<style scoped></style>
