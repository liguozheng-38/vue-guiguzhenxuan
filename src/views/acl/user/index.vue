<template>
  <el-card style="height: 80px">
    <el-form :inline="true" class="form">
      <el-form-item label="用户名:">
        <el-input placeholder="请你输入搜索用户名" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          size="default"
          :disabled="keyword ? false : true"
          @click="search"
        >
          搜索
        </el-button>
        <el-button type="primary" size="default" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0px">
    <el-button type="primary" size="default" @click="addUser">
      添加用户
    </el-button>
    <el-button
      type="primary"
      size="default"
      :disabled="selectIdArr.length ? false : true"
      @click="deleteSelectUser"
    >
      批量删除
    </el-button>
    <!-- table展示用户信息 -->
    <el-table
      @selection-change="selectChange"
      style="margin: 10px 0px"
      border
      :data="userArr"
    >
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column label="#" align="center" type="index"></el-table-column>
      <el-table-column label="ID" align="center" prop="id"></el-table-column>
      <el-table-column
        label="用户名字"
        align="center"
        prop="username"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="用户名称"
        align="center"
        prop="name"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="用户角色"
        align="center"
        prop="roleName"
        show-overflow-tooltip
        :formatter="formatRoleName"
      ></el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="更新时间"
        align="center"
        prop="updateTime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="操作" width="300px" align="center">
        <template #="{ row }">
          <el-button
            type="primary"
            size="small"
            icon="User"
            @click="setRole(row)"
          >
            分配角色
          </el-button>
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="updateUser(row)"
          >
            编辑
          </el-button>
          <el-popconfirm
            :title="`你确定要删除${row.username}?`"
            width="260px"
            @confirm="deleteUser(row.id ?? row.ID)"
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
      :page-sizes="[5, 7, 9, 11]"
      :background="true"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
      @current-change="getHasUser"
      @size-change="handler"
    />
  </el-card>
  <!-- 抽屉结构:完成添加新的用户账号|更新已有的账号信息 -->
  <el-drawer v-model="drawer">
    <!-- 头部标题:将来文字内容应该动态的 -->
    <template #header>
      <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
    </template>
    <!-- 身体部分 -->
    <template #default>
      <el-form :model="userParams" :rules="rules" ref="formRef">
        <el-form-item label="用户姓名" prop="username">
          <el-input
            placeholder="请您输入用户姓名"
            v-model="userParams.username"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="name">
          <el-input
            placeholder="请您输入用户昵称"
            v-model="userParams.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
          <el-input
            placeholder="请您输入用户密码"
            v-model="userParams.password"
          ></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </template>
  </el-drawer>
  <!-- 抽屉结构:用户某一个已有的账号进行角色分配 -->
  <el-drawer v-model="drawer1">
    <template #header>
      <h4>分配角色</h4>
    </template>
    <template #default>
      <el-form>
        <el-form-item label="用户姓名">
          <el-input v-model="userParams.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="角色列表">
          <el-checkbox
            @change="handleCheckAllChange"
            v-model="checkAll"
            :indeterminate="isIndeterminate"
          >
            全选
          </el-checkbox>
          <!-- 显示角色的复选框 -->
          <el-checkbox-group
            v-model="userRoleIds"
            @change="handleCheckedCitiesChange"
          >
            <el-checkbox
              v-for="role in allRole"
              :key="role.id ?? role.ID"
              :value="role.id ?? role.ID"
            >
              {{ role.roleName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer1 = false">取消</el-button>
        <el-button type="primary" @click="confirmClick">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>
<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import {
  reqSelectUser,
  reqRemoveUser,
  reqUserInfo,
  reqAddOrUpdateUser,
  reqAllRole,
  reqSetUserRole,
} from '@/api/acl/user'
import type {
  SetRoleData,
  UserResponseData,
  Records,
  User,
  AllRoleResponseData,
  AllRole,
} from '@/api/acl/user/type'
import { ElMessage, ElForm } from 'element-plus'
import type { CheckboxValueType } from 'element-plus'

//默认页码
let pageNo = ref<number>(1)
//一页展示几条数据
let pageSize = ref<number>(5)
//用户总个数
let total = ref<number>(0)
//存储全部用户的数组
let userArr = ref<Records>([])
//定义响应式数据控制抽屉的显示与隐藏
let drawer = ref<boolean>(false)
//控制分配角色抽屉显示与隐藏
let drawer1 = ref<boolean>(false)
//存储全部角色的数据
let allRole = ref<AllRole>([])
//当前用户已有的角色ID列表
let userRoleIds = ref<number[]>([])
//收集用户信息的响应式数据
let userParams = reactive<User>({
  username: '',
  name: '',
  password: '',
})
//准备一个数组存储批量删除的用户的ID
let selectIdArr = ref<number[]>([])
//获取form组件实例
let formRef = ref<InstanceType<typeof ElForm>>()
//定义响应式数据:收集用户输入进来的关键字
let keyword = ref<string>('')

//格式化角色名称，空值显示'未分配角色'
const formatRoleName = (
  _row: { roleName: string },
  _column: Record<string, unknown>,
) => {
  return _row.roleName || '未分配角色'
}

//组件挂载完毕
onMounted(() => {
  getHasUser()
})

//获取全部已有的用户信息
const getHasUser = async (pager = 1) => {
  pageNo.value = pager
  let result: UserResponseData = await reqUserInfo(
    pageNo.value,
    pageSize.value,
    keyword.value,
  )
  if (result.code == 200) {
    total.value = result.data.total
    userArr.value = result.data.records
  }
}

//分页器下拉菜单的自定义事件的回调
const handler = () => {
  getHasUser()
}

//添加用户按钮的回调
const addUser = () => {
  drawer.value = true
  Object.assign(userParams, {
    id: undefined,
    username: '',
    name: '',
    password: '',
  })
  nextTick(() => {
    formRef.value?.clearValidate('username')
    formRef.value?.clearValidate('name')
    formRef.value?.clearValidate('password')
  })
}

//更新已有的用户按钮的回调
const updateUser = (row: User) => {
  drawer.value = true
  Object.assign(userParams, row)
  nextTick(() => {
    formRef.value?.clearValidate('username')
    formRef.value?.clearValidate('name')
  })
}

//保存按钮的回调
const save = async () => {
  try {
    if (!formRef.value) return
    await formRef.value.validate()
    let result = await reqAddOrUpdateUser(userParams)
    if (result.code == 200) {
      drawer.value = false
      ElMessage({
        type: 'success',
        message: userParams.id ? '更新成功' : '添加成功',
      })
      getHasUser(userParams.id ? pageNo.value : 1)
    } else {
      drawer.value = false
      ElMessage({
        type: 'error',
        message: userParams.id ? '更新失败' : '添加失败',
      })
    }
  } catch (error) {
    ElMessage({ type: 'error', message: '表单验证失败' })
  }
}

//取消按钮的回调
const cancel = () => {
  drawer.value = false
}

//校验用户名字回调函数
const validatorUsername = (
  _rule: unknown,
  value: string,
  callBack: (error?: Error) => void,
) => {
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户名字至少五位'))
  }
}

//校验用户昵称回调函数
const validatorName = (
  _rule: unknown,
  value: string,
  callBack: (error?: Error) => void,
) => {
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户昵称至少五位'))
  }
}

//校验密码回调函数
const validatorPassword = (
  _rule: unknown,
  value: string,
  callBack: (error?: Error) => void,
) => {
  if (value.trim().length >= 6) {
    callBack()
  } else {
    callBack(new Error('用户密码至少六位'))
  }
}

//表单校验的规则对象
const rules = {
  username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
  name: [{ required: true, trigger: 'blur', validator: validatorName }],
  password: [{ required: true, trigger: 'blur', validator: validatorPassword }],
}

//分配角色按钮的回调
const setRole = async (row: User) => {
  Object.assign(userParams, row)
  let result: AllRoleResponseData = await reqAllRole(
    row.id ?? (row.ID as number),
  )
  if (result.code == 200) {
    allRole.value = result.data.allRolesList
    userRoleIds.value = result.data.assignRoles.map(
      (r) => r.id ?? (r.ID as number),
    )
    drawer1.value = true
  }
}

//收集顶部复选框全选数据
const checkAll = ref<boolean>(false)
//控制顶部全选复选框不确定的样式
const isIndeterminate = ref<boolean>(true)

//顶部的全部复选框的change事件
const handleCheckAllChange = (val: CheckboxValueType) => {
  const checked = Boolean(val)
  userRoleIds.value = checked
    ? allRole.value.map((r) => r.id ?? (r.ID as number))
    : []
  isIndeterminate.value = false
}

//底部的全部复选框的change事件
const handleCheckedCitiesChange = (value: CheckboxValueType[]) => {
  const numValues = value.map((v) => Number(v))
  const checkedCount = numValues.length
  checkAll.value = checkedCount === allRole.value.length
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < allRole.value.length
}

//确定按钮的回调(分配角色)
const confirmClick = async () => {
  let data: SetRoleData = {
    userId: userParams.id ?? (userParams.ID as number),
    roleIdList: userRoleIds.value,
  }
  let result = await reqSetUserRole(data)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '分配角色成功' })
    drawer1.value = false
    getHasUser(pageNo.value)
  }
}

//删除某一个用户
const deleteUser = async (userId: number) => {
  let result = await reqRemoveUser(userId)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    getHasUser(
      userArr.value.length > 1 ? pageNo.value : Math.max(1, pageNo.value - 1),
    )
  }
}

//table复选框勾选的时候会触发的事件
const selectChange = (value: User[]) => {
  selectIdArr.value = value.map((item) => item.id ?? (item.ID as number))
}

//批量删除按钮的回调
const deleteSelectUser = async () => {
  let result = await reqSelectUser(selectIdArr.value)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '批量删除成功' })
    getHasUser(
      userArr.value.length > selectIdArr.value.length
        ? pageNo.value
        : Math.max(1, pageNo.value - 1),
    )
    selectIdArr.value = []
  }
}

//搜索按钮的回调
const search = () => {
  getHasUser(1)
}

//重置按钮
const reset = () => {
  keyword.value = ''
  getHasUser(1)
}
</script>

<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.role-cell {
  cursor: pointer;
  color: #000;
}
.role-cell:hover {
  text-decoration: none;
}
</style>
