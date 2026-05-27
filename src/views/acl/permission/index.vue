<template>
  <!-- 菜单表格 -->
  <el-table :data="permissionArr" style="width: 100%; margin-bottom: 20px" row-key="id" border>
    <el-table-column label="名称" prop="name"></el-table-column>
    <el-table-column label="权限值" prop="code"></el-table-column>
    <el-table-column label="修改时间" prop="updateTime"></el-table-column>
    <el-table-column label="操作">
      <!-- row:即为已有的菜单对象|按钮的对象的数据 -->
      <template #="{ row }">
        <el-button type="primary" @click="addPermission(row)" size="small" :disabled="row.level == 4 ? true : false">{{ row.level == 3 ? '添加功能' : '添加菜单' }}</el-button>
        <el-button type="primary" @click="updatePermission(row)" size="small" :disabled="row.level == 1 ? true : false">编辑</el-button>
        <el-popconfirm :title="`你确定要删除${row.name}?`" width="260px" @confirm="removeMenu(row.id ?? row.ID)">
          <template #reference>
            <el-button type="primary" size="small" :disabled="row.level == 1 ? true : false">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>

  <!-- 对话框组件:添加或者更新已有的菜单的数据结构 -->
  <el-dialog v-model="dialogVisible" :title="menuData.id ? '更新菜单' : '添加菜单'">
    <!-- 表单组件:收集新增与已有的菜单的数据 -->
    <el-form :model="menuData">
      <el-form-item label="名称">
        <el-input placeholder="请你输入菜单名称" v-model="menuData.name"></el-input>
      </el-form-item>
      <el-form-item label="权限">
        <el-input placeholder="请你输入权限数值" v-model="menuData.code"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { ref, onMounted, reactive } from 'vue'
  //引入获取菜单请求API
  import { reqAllPermission, reqAddMenu, reqUpdateMenu, reqRemoveMenu } from '@/api/acl/menu'
  //引入ts类型
  import type { PermissionResponseData, PermissionList, Permission, AddMenuParams, UpdateMenuParams } from '@/api/acl/menu/type'
  import { ElMessage } from 'element-plus'

  //存储菜单的数据
  let permissionArr = ref<PermissionList>([])
  //控制对话框的显示与隐藏
  let dialogVisible = ref<boolean>(false)
  //携带的参数
  let menuData = reactive<AddMenuParams & { id?: number }>({
    code: '',
    level: 0,
    name: '',
    pid: 0,
    type: 0,
  })

  //组件挂载完毕
  onMounted(() => {
    getHasPermission()
  })

  //获取菜单数据的方法
  const getHasPermission = async () => {
    try {
      let result: PermissionResponseData = await reqAllPermission()
      // console.log('菜单数据响应:', result)
      if (result.code == 200) {
        // 兼容两种数据结构：data本身是数组 或 data包含children属性
        permissionArr.value = Array.isArray(result.data) ? result.data : result.data.children || []
      } else {
        console.log('接口返回失败:', result.message)
      }
    } catch (error) {
      // console.error('获取菜单数据失败:', error)
    }
  }

  //添加菜单按钮的回调
  const addPermission = (row: Permission) => {
    //清空数据
    Object.assign(menuData, {
      id: undefined,
      code: '',
      level: 0,
      name: '',
      pid: 0,
      type: row.level == 3 ? 2 : 1, // 3级菜单下添加按钮(type=2)，其他添加菜单(type=1)
    })
    //对话框显示出来
    dialogVisible.value = true
    //收集新增的菜单的level数值
    menuData.level = row.level + 1
    //给谁新增子菜单
    menuData.pid = row.id ?? row.ID ?? 0
  }

  //编辑已有的菜单
  const updatePermission = (row: Permission) => {
    dialogVisible.value = true
    //点击修改按钮:收集已有的菜单的数据进行更新
    Object.assign(menuData, {
      id: row.id,
      code: row.code,
      level: row.level,
      name: row.name,
      pid: row.pid,
      type: row.type,
    })
  }

  //确定按钮的回调
  const save = async () => {
    let result: any
    //发请求:新增子菜单|更新某一个已有的菜单的数据
    if (menuData.id) {
      result = await reqUpdateMenu(menuData as UpdateMenuParams)
    } else {
      result = await reqAddMenu(menuData)
    }

    if (result.code == 200) {
      //对话框隐藏
      dialogVisible.value = false
      //提示信息
      ElMessage({ type: 'success', message: menuData.id ? '更新成功' : '添加成功' })
      //再次获取全部最新的菜单的数据
      getHasPermission()
    }
  }

  //删除按钮回调
  const removeMenu = async (id: number | undefined) => {
    if (id === undefined) return
    let result = await reqRemoveMenu(id)
    if (result.code == 200) {
      ElMessage({ type: 'success', message: '删除成功' })
      getHasPermission()
    }
  }
</script>

<style scoped></style>
