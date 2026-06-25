<template>
  <el-card>
    <!-- 角色搜索表单 -->
    <SearchForm
      v-model="keyword"
      label="角色搜索"
      placeholder="请输入搜索角色关键字"
      @search="onSearch"
      @reset="onReset"
    />
  </el-card>
  <el-card style="margin: 10px 0px">
    <!-- 添加角色按钮 -->
    <el-button
      type="primary"
      size="default"
      icon="Plus"
      @click="addRole"
      v-has="`btn.Role.add`"
    >
      添加角色
    </el-button>
    <!-- 角色表格 -->
    <el-table border style="margin: 10px 0px" :data="allRole">
      <el-table-column type="index" align="center" label="#"></el-table-column>
      <el-table-column label="ID" align="center" prop="id"></el-table-column>
      <el-table-column
        label="角色名称"
        align="center"
        prop="roleName"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        show-overflow-tooltip
        prop="createTime"
      ></el-table-column>
      <el-table-column
        label="更新时间"
        align="center"
        show-overflow-tooltip
        prop="updateTime"
      ></el-table-column>
      <el-table-column label="操作" width="280px" align="center">
        <template #="{ row }">
          <el-button
            type="primary"
            size="small"
            icon="User"
            @click="setPermission(row)"
            v-has="`btn.Role.assgin`"
          >
            分配权限
          </el-button>
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="updateRole(row)"
            v-has="`btn.Role.update`"
          >
            编辑
          </el-button>
          <el-popconfirm
            :title="`你确定要删除${row.roleName}?`"
            width="260px"
            @confirm="removeRole(row.id ?? row.ID)"
          >
            <template #reference>
              <el-button
                type="primary"
                size="small"
                icon="Delete"
                v-has="`btn.Role.remove`"
              >
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <Pageinator
      v-model="pageNo"
      v-model:pageSize="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :total="total"
      @change="handlePageChange"
    />
  </el-card>

  <!-- 添加角色|更新角色对话框 -->
  <BaseDialog
    v-model="dialogVisible"
    :title="RoleParams.id ? '更新角色' : '添加角色'"
    @confirm="save"
  >
    <el-form :model="RoleParams" :rules="rules" ref="form">
      <el-form-item label="角色名称" prop="roleName">
        <el-input
          placeholder="请输入角色名称"
          v-model="RoleParams.roleName"
        ></el-input>
      </el-form-item>
      <el-form-item label="角色备注" prop="remark">
        <el-input
          placeholder="请输入角色备注"
          v-model="RoleParams.remark"
        ></el-input>
      </el-form-item>
    </el-form>
  </BaseDialog>

  <!-- 抽屉组件:分配角色菜单权限 -->
  <BaseDrawer v-model="drawer" title="分配菜单与按钮的权限" @confirm="handler">
    <el-tree
      ref="tree"
      :key="treeKey"
      :data="menuArr"
      show-checkbox
      node-key="id"
      default-expand-all
      :default-checked-keys="selectArr"
      :props="defaultProps"
    />
  </BaseDrawer>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import {
  reqRemoveRole,
  reqRoleList,
  reqAddOrUpdateRole,
  reqAllMenuList,
  reqSetPermission,
} from '@/api/acl/role'
import type {
  RoleResponseData,
  Records,
  RoleData,
  MenuResponseData,
  MenuList,
  MenuData,
  ResponseData,
} from '@/api/acl/role/type'
import { ElMessage } from 'element-plus'

// 当前页码
let pageNo = ref<number>(1)
// 一页展示几条数据
let pageSize = ref<number>(10)
// 搜索角色关键字
let keyword = ref<string>('')
// 存储全部已有的角色
let allRole = ref<Records>([])
// 角色总个数
let total = ref<number>(0)
// 控制对话框的显示与隐藏
let dialogVisible = ref<boolean>(false)
// 获取form组件实例
let form = ref()
// 控制抽屉显示与隐藏
let drawer = ref<boolean>(false)

// 收集新增角色数据
let RoleParams = reactive<RoleData>({
  roleName: '',
  remark: '',
})

// 准备一个数组:数组用于存储勾选的节点ID(四级)
let selectArr = ref<number[]>([])
// 定义数组存储用户权限数据
let menuArr = ref<MenuList>([])
// 获取tree组件实例
let tree = ref()
// 强制重建树节点，用于默认选中项更新
let treeKey = ref<number>(0)

// 组件挂载完毕
onMounted(() => {
  getHasRole()
})

// 获取全部用户信息的方法|分页器当前页码发生变化的回调
const getHasRole = async (pager = 1) => {
  pageNo.value = pager
  let result: RoleResponseData = await reqRoleList(
    pageNo.value,
    pageSize.value,
    keyword.value,
  )
  if (result.code == 200) {
    total.value = result.data.total
    allRole.value = result.data.records
  }
}

// 分页器变化的回调
const handlePageChange = (page: number) => {
  getHasRole(page)
}

// 搜索按钮的回调
const onSearch = () => {
  getHasRole(1)
}

// 重置按钮的回调
const onReset = () => {
  getHasRole(1)
}

// 添加角色按钮的回调
const addRole = () => {
  dialogVisible.value = true
  Object.assign(RoleParams, {
    roleName: '',
    remark: '',
    id: undefined,
  })
  nextTick(() => {
    form.value?.clearValidate('roleName')
    form.value?.clearValidate('remark')
  })
}

// 更新已有角色按钮的回调
const updateRole = (row: RoleData) => {
  dialogVisible.value = true
  Object.assign(RoleParams, row)
  nextTick(() => {
    form.value?.clearValidate('roleName')
    form.value?.clearValidate('remark')
  })
}

// 自定义校验规则的回调
const validatorRoleName = (
  _rule: unknown,
  value: string,
  callBack: (error?: Error) => void,
) => {
  if (value && value.trim().length >= 2) {
    callBack()
  } else {
    callBack(new Error('角色名称至少两位'))
  }
}

// 角色校验规则
const rules = {
  roleName: [{ required: true, trigger: 'blur', validator: validatorRoleName }],
}

// 保存按钮的回调
const save = async () => {
  try {
    await form.value?.validate()
    let result: ResponseData = await reqAddOrUpdateRole(RoleParams)
    if (result.code == 200) {
      ElMessage.success(RoleParams.id ? '更新成功' : '添加成功')
      dialogVisible.value = false
      getHasRole(RoleParams.id ? pageNo.value : 1)
    }
  } catch (_error) {
    ElMessage.error('表单校验失败，请检查角色名称是否至少两位')
  }
}

// 分配权限按钮的回调
const setPermission = async (row: RoleData) => {
  drawer.value = true
  Object.assign(RoleParams, row)
  let result: MenuResponseData = await reqAllMenuList(row.id as number)
  if (result.code == 200) {
    menuArr.value = result.data
    selectArr.value = filterSelectArr(menuArr.value, [])
    // 强制重建树组件，使 :default-checked-keys 正确生效
    treeKey.value += 1
  }
}

// 树形控件的配置
const defaultProps = {
  children: 'children',
  label: 'name',
}

// 只收集叶子节点（树在 check-strictly:false 下会自动向上推导父节点勾选状态）
const filterSelectArr = (allData: MenuList, initArr: number[]) => {
  allData.forEach((item: MenuData) => {
    if (item.children && item.children.length > 0) {
      filterSelectArr(item.children, initArr)
    } else if (item.select) {
      initArr.push(item.id)
    }
  })
  return initArr
}

// 抽屉确定按钮的回调
const handler = async () => {
  try {
    const roleId = RoleParams.id as number
    if (!tree.value) {
      ElMessage.error('树组件未就绪，请重新打开抽屉')
      return
    }
    const checkedKeys = tree.value.getCheckedKeys()
    const halfCheckedKeys = tree.value.getHalfCheckedKeys()
    // 合并：全选节点 + 半选节点 = 完整的权限分配（1-3级菜单→routes[]，4级按钮→buttons[]）
    const permissionId = [...checkedKeys, ...halfCheckedKeys]

    const result: ResponseData = await reqSetPermission(roleId, permissionId)
    if (result.code == 200) {
      ElMessage.success('分配权限成功')
      drawer.value = false
      getHasRole(pageNo.value)
    }
  } catch (error) {
    console.error('分配权限失败:', error)
    ElMessage.error('分配权限失败，请检查网络或后端接口')
  }
}

// 删除已有的角色
const removeRole = async (id: number | undefined) => {
  if (id === undefined) return
  let result: ResponseData = await reqRemoveRole(id)
  if (result.code == 200) {
    ElMessage.success('删除成功')
    getHasRole(allRole.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}
</script>

<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
}
</style>
