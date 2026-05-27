<template>
  <el-card>
    <!-- 角色搜索表单 -->
    <el-form :inline="true" class="form">
      <el-form-item label="角色搜索">
        <el-input placeholder="请输入搜索角色关键字" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default" :disabled="!keyword" @click="search">搜索</el-button>
        <el-button type="primary" size="default" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0px">
    <!-- 添加角色按钮 -->
    <el-button type="primary" size="default" icon="Plus" @click="addRole">添加角色</el-button>
    <!-- 角色表格 -->
    <el-table border style="margin: 10px 0px" :data="allRole">
      <el-table-column type="index" align="center" label="#"></el-table-column>
      <el-table-column label="ID" align="center" prop="id"></el-table-column>
      <el-table-column label="角色名称" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
      <el-table-column label="创建时间" align="center" show-overflow-tooltip prop="createTime"></el-table-column>
      <el-table-column label="更新时间" align="center" show-overflow-tooltip prop="updateTime"></el-table-column>
      <el-table-column label="操作" width="280px" align="center">
        <template #="{ row }">
          <el-button type="primary" size="small" icon="User" @click="setPermission(row)">分配权限</el-button>
          <el-button type="primary" size="small" icon="Edit" @click="updateRole(row)">编辑</el-button>
          <el-popconfirm :title="`你确定要删除${row.roleName}?`" width="260px" @confirm="removeRole(row.id ?? row.ID)">
            <template #reference>
              <el-button type="primary" size="small" icon="Delete">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]" :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total="total" @current-change="getHasRole" @size-change="sizeChange" />
  </el-card>

  <!-- 添加角色|更新角色对话框 -->
  <el-dialog v-model="dialogVisible" :title="RoleParams.id ? '更新角色' : '添加角色'">
    <el-form :model="RoleParams" :rules="rules" ref="form">
      <el-form-item label="角色名称" prop="roleName">
        <el-input placeholder="请输入角色名称" v-model="RoleParams.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色备注" prop="remark">
        <el-input placeholder="请输入角色备注" v-model="RoleParams.remark"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" size="default" @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" size="default" @click="save">确定</el-button>
    </template>
  </el-dialog>

  <!-- 抽屉组件:分配角色菜单权限 -->
  <el-drawer v-model="drawer">
    <template #header>
      <h4>分配菜单与按钮的权限</h4>
    </template>
    <template #default>
      <!-- 树形控件 -->
      <el-tree ref="tree" :key="treeKey" :data="menuArr" show-checkbox node-key="id" default-expand-all :checked-keys="selectArr" :props="defaultProps" @check="handleCheckChange" />
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer = false">取消</el-button>
        <el-button type="primary" @click="handler">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
  import { ref, onMounted, reactive, nextTick } from 'vue'
  // 请求方法
  import { reqRemoveRole, reqRoleList, reqAddOrUpdateRole, reqAllMenuList, reqSetPermission } from '@/api/acl/role'
  import type { RoleResponseData, Records, RoleData, MenuResponseData, MenuList } from '@/api/acl/role/type'
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
  let form = ref<any>()
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
  let tree = ref<any>()
  // 强制重建树节点，用于默认选中项更新
  let treeKey = ref<number>(0)

  // 组件挂载完毕
  onMounted(() => {
    // 获取角色列表
    getHasRole()
  })

  // 获取全部用户信息的方法|分页器当前页码发生变化的回调
  const getHasRole = async (pager = 1) => {
    // 修改当前页码
    pageNo.value = pager
    let result: RoleResponseData = await reqRoleList(pageNo.value, pageSize.value, keyword.value)
    if (result.code == 200) {
      total.value = result.data.total
      allRole.value = result.data.records
    }
  }

  // 分页器下拉菜单发生变化的回调
  const sizeChange = () => {
    getHasRole()
  }

  // 搜索按钮的回调
  const search = () => {
    getHasRole(1)
  }

  // 重置按钮的回调
  const reset = () => {
    keyword.value = ''
    getHasRole(1)
  }

  // 添加角色按钮的回调
  const addRole = () => {
    // 对话框显示出来
    dialogVisible.value = true
    // 清空数据
    Object.assign(RoleParams, {
      roleName: '',
      remark: '',
      id: undefined,
    })
    // 清空上一次表单校验错误结果
    nextTick(() => {
      form.value?.clearValidate('roleName')
      form.value?.clearValidate('remark')
    })
  }

  // 更新已有角色按钮的回调
  const updateRole = (row: RoleData) => {
    // 显示出对话框
    dialogVisible.value = true
    // 存储已有角色-带有ID
    Object.assign(RoleParams, row)
    // 清空上一次表单校验错误结果
    nextTick(() => {
      form.value?.clearValidate('roleName')
      form.value?.clearValidate('remark')
    })
  }

  // 自定义校验规则的回调
  const validatorRoleName = (_: any, value: any, callBack: any) => {
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
      // 表单校验结果,结果通过再发请求,结果没通过不再发生请求
      await form.value.validate()
      // 添加角色|更新角色的请求
      let result: any = await reqAddOrUpdateRole(RoleParams)
      if (result.code == 200) {
        // 提示信息
        ElMessage.success(RoleParams.id ? '更新成功' : '添加成功')
        // 对话框关闭
        dialogVisible.value = false
        // 再次获取全部已有的角色
        getHasRole(RoleParams.id ? pageNo.value : 1)
      }
    } catch (error) {
      console.log('表单校验失败:', error)
    }
  }

  // 分配权限按钮的回调
  const setPermission = async (row: RoleData) => {
    // 抽屉显示出来
    drawer.value = true
    // 收集当前要分配权限的角色数据
    Object.assign(RoleParams, row)
    // 根据角色获取权限数据
    let result: MenuResponseData = await reqAllMenuList(row.id as number)
    if (result.code == 200) {
      menuArr.value = result.data
      console.log(menuArr.value)
      selectArr.value = filterSelectArr(menuArr.value, [])
      treeKey.value += 1
      // 确保树组件渲染完成后，显式设置选中项，避免复用组件导致的不同步问题
      await nextTick()
      try {
        if (tree.value && typeof tree.value.setCheckedKeys === 'function') {
          tree.value.setCheckedKeys(selectArr.value)
        }
      } catch (e) {
        console.warn('tree.setCheckedKeys 调用失败:', e)
      }
    }
  }

  // 树形控件的配置
  const defaultProps = {
    children: 'children',
    label: 'name',
  }

  // 筛选已选中的节点ID（包括所有层级）
  // const filterSelectArr = (allData: any, initArr: any) => {
  //   allData.forEach((item: any) => {
  //     if (item.select && item.level === 4) {
  //       initArr.push(item.id)
  //     }
  //     if (item.children && item.children.length > 0) {
  //       filterSelectArr(item.children, initArr)
  //     }
  //   })
  //   return initArr
  // }
  const filterSelectArr = (allData: any, initArr: any) => {
    allData.forEach((item: any) => {
      item.select
      if (item.select) {
        initArr.push(item.id)
      }
      if (item.children && item.children.length > 0) {
        filterSelectArr(item.children, initArr)
      }
    })

    return initArr
  }

  // 树形控件勾选状态变化的回调
  const handleCheckChange = () => {
    // 获取当前选中的节点ID
    selectArr.value = tree.value.getCheckedKeys()
  }

  // 抽屉确定按钮的回调
  const handler = async () => {
    try {
      const roleId = RoleParams.id as number
      const checkedKeys = tree.value.getCheckedKeys()
      const halfCheckedKeys = tree.value.getHalfCheckedKeys()
      const permissionId = [...checkedKeys, ...halfCheckedKeys]

      const result: any = await reqSetPermission(roleId, permissionId)
      if (result.code == 200) {
        ElMessage.success('分配权限成功')
        drawer.value = false
        getHasRole(pageNo.value)
        // window.location.reload()
      }
    } catch (error) {
      console.error('分配权限失败:', error)
      ElMessage.error('分配权限失败，请检查网络或后端接口')
    }
  }

  // 删除已有的角色
  const removeRole = async (id: number | undefined) => {
    if (id === undefined) return
    let result: any = await reqRemoveRole(id)
    if (result.code == 200) {
      // 提示信息
      ElMessage.success('删除成功')
      // 获取剩余角色数据
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
