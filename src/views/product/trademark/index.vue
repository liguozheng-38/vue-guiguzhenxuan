<template>
  <el-card>
    <el-form :inline="true" class="form">
      <el-form-item label="品牌搜索">
        <el-input
          placeholder="请输入搜索品牌关键字"
          v-model="keyword"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          size="default"
          :disabled="!keyword"
          @click="search"
        >
          搜索
        </el-button>
        <el-button type="primary" size="default" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0px">
    <el-button type="primary" size="default" icon="Plus" @click="addTrademark">
      添加品牌
    </el-button>
    <el-table border style="margin: 10px 0px" :data="records">
      <template #empty>
        <el-empty description="暂无数据"></el-empty>
      </template>
      <el-table-column type="index" align="center" label="#"></el-table-column>
      <el-table-column
        label="品牌名称"
        align="center"
        prop="tmName"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="品牌LOGO" align="center">
        <template #="{ row }">
          <img
            :src="normalizeImageUrl(row.logoUrl)"
            style="width: 100px; height: 100px"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280px" align="center">
        <template #="{ row }">
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="updateTrademark(row)"
          >
            编辑
          </el-button>
          <el-popconfirm
            :title="`你确定要删除${row.tmName}?`"
            width="260px"
            @confirm="removeTrademark(row.id ?? row.ID)"
          >
            <template #reference>
              <el-button type="primary" size="small" icon="Delete">
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :background="true"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
      @current-change="getHasTrademark"
      @size-change="sizeChange"
    />
  </el-card>

  <!-- 添加品牌|更新品牌对话框 -->
  <el-dialog
    v-model="dialogVisible"
    :title="trademarkParams.id ? '更新品牌' : '添加品牌'"
  >
    <el-form :model="trademarkParams" :rules="rules" ref="formRef">
      <el-form-item label="品牌名称" prop="tmName">
        <el-input
          placeholder="请你输入品牌名称"
          v-model="trademarkParams.tmName"
        ></el-input>
      </el-form-item>
      <el-form-item label="品牌LOGO" prop="logoUrl">
        <el-upload
          class="avatar-uploader"
          action="/dev-api/admin/product/fileUpload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :http-request="handleHttpRequest"
        >
          <img
            v-if="trademarkParams.logoUrl"
            :src="normalizeImageUrl(trademarkParams.logoUrl)"
            class="avatar"
          />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import request from '@/utils/request'
import { normalizeImageUrl } from '@/utils/imageUrl'
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'
import type {
  TradeMark,
  TradeMarkPageResponseData,
  ResponseData,
  TradeMarkListResponseData,
} from '@/api/product/trademark/type'
import {
  reqHasTrademark,
  reqTrademarkList,
  reqAddOrUpdateTrademark,
  reqDeleteTrademark,
} from '@/api/product/trademark'

// 当前页码
let pageNo = ref<number>(1)
// 一页展示几条数据
let pageSize = ref<number>(10)
// 搜索品牌关键字
let keyword = ref<string>('')
// 品牌总个数
let total = ref<number>(0)
// 存储已有品牌的数组
let records = ref<TradeMark[]>([])
// 对话框显示与隐藏
let dialogVisible = ref<boolean>(false)
// 收集品牌新增|修改的数据
let trademarkParams = reactive<TradeMark>({
  tmName: '',
  logoUrl: '',
})
// 获取form组件实例
let formRef = ref()
const loading = ref<boolean>(true)

// 组件挂载完毕
onMounted(() => {
  getHasTrademark()
})

// 获取品牌数据的方法|分页器当前页码发生变化
const getHasTrademark = async (pager = 1) => {
  pageNo.value = pager

  const kw = keyword.value && keyword.value.trim()
  if (kw) {
    const allRes: TradeMarkListResponseData = await reqTrademarkList()
    if (allRes && allRes.code === 200) {
      const list: TradeMark[] = allRes.data || []
      const filtered = list.filter((t) =>
        (t.tmName || '').toLowerCase().includes(kw.toLowerCase()),
      )
      total.value = filtered.length
      const start = (pageNo.value - 1) * pageSize.value
      records.value = filtered.slice(start, start + pageSize.value)
      loading.value = false
      return
    }
  }

  let result: TradeMarkPageResponseData = await reqHasTrademark(
    pageNo.value,
    pageSize.value,
  )
  if (result.code == 200) {
    total.value = result.data.total
    records.value = result.data.records || []
    loading.value = false
  }
}

// 分页器下拉菜单发生变化的回调
const sizeChange = () => {
  getHasTrademark()
}

// 搜索按钮的回调
const search = () => {
  getHasTrademark(1)
}

// 重置按钮的回调
const reset = () => {
  keyword.value = ''
  getHasTrademark(1)
}

// 添加品牌按钮的回调
const addTrademark = () => {
  dialogVisible.value = true
  Object.assign(trademarkParams, { tmName: '', logoUrl: '', id: undefined })
  nextTick(() => {
    formRef.value?.clearValidate('tmName')
    formRef.value?.clearValidate('logoUrl')
  })
}

// 更新已有品牌按钮的回调
const updateTrademark = (row: TradeMark) => {
  dialogVisible.value = true
  Object.assign(trademarkParams, row)
  nextTick(() => {
    formRef.value?.clearValidate('tmName')
    formRef.value?.clearValidate('logoUrl')
  })
}

// 保存按钮的回调
const save = async () => {
  try {
    await formRef.value.validate()
    // 构建提交数据
    const submitData: TradeMark = {
      tmName: trademarkParams.tmName,
      logoUrl: trademarkParams.logoUrl,
    }
    loading.value = false
    if (trademarkParams.id) {
      submitData.id = trademarkParams.id
    }
    let result: ResponseData = await reqAddOrUpdateTrademark(submitData)
    if (result.code == 200) {
      ElMessage({
        type: 'success',
        message: trademarkParams.id ? '修改品牌成功' : '添加品牌成功',
      })
      dialogVisible.value = false
      getHasTrademark(trademarkParams.id ? pageNo.value : 1)
    } else {
      loading.value = false
      ElMessage({
        type: 'error',
        message:
          result.message ||
          (trademarkParams.id ? '修改品牌失败' : '添加品牌失败'),
      })
    }
  } catch (e: unknown) {
    const error = e as Error
    console.error('操作失败:', error)
    ElMessage({
      type: 'error',
      message: error.message || '操作失败，请重试',
    })
  }
}

//上传图片组件->上传图片之前触发的钩子函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (
    rawFile.type !== 'image/png' &&
    rawFile.type !== 'image/jpeg' &&
    rawFile.type !== 'image/gif'
  ) {
    ElMessage.error('上传图片必须是png、jpg、gif格式！')
    return false
  } else if (rawFile.size / 1024 / 1024 > 4) {
    ElMessage.error('上传图片大小不能超过4MB！')
    return false
  }
  return true
}

// 自定义上传请求
const handleHttpRequest = async (options: { file: File }) => {
  const formData = new FormData()
  formData.append('file', options.file)
  const response = await request.post<unknown, { code: number; data: string }>(
    '/admin/product/fileUpload',
    formData,
  )
  if (response.code == 200) {
    trademarkParams.logoUrl = response.data
    ElMessage.success('上传成功')
  } else {
    ElMessage.error('上传失败')
  }
}

// 图片上传成功
const handleAvatarSuccess = () => {
  formRef.value?.clearValidate('logoUrl')
}

// 自定义校验规则
const validatorTmName = (
  _rule: unknown,
  value: string,
  callBack: (error?: Error) => void,
) => {
  if (value && value.trim().length >= 2) {
    callBack()
  } else {
    callBack(new Error('品牌名称至少两位'))
  }
}

const validatorLogoUrl = (
  _rule: unknown,
  value: string,
  callBack: (error?: Error) => void,
) => {
  if (value) {
    callBack()
  } else {
    callBack(new Error('请上传品牌LOGO'))
  }
}

// 表单校验规则
const rules = {
  tmName: [{ required: true, trigger: 'blur', validator: validatorTmName }],
  logoUrl: [{ required: true, trigger: 'change', validator: validatorLogoUrl }],
}

// 删除已有的品牌
const removeTrademark = async (id: number | undefined) => {
  if (id === undefined) return
  let result: ResponseData = await reqDeleteTrademark(id)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除品牌成功' })
    getHasTrademark(records.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({ type: 'error', message: result.message || '删除品牌失败' })
  }
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
}
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
