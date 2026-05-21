<script setup lang="ts">
  import { getTime } from '@/utils/time'
  //引入用户相关的仓库,获取当前用户的头像、昵称
  import useUserStore from '@/store/modules/user'
  //获取存储用户信息的仓库对象
  const userStore = useUserStore()
</script>
<template>
  <h1>我是首页，“{{ userStore.username }}”</h1>
</template>
<style scoped lang="scss"></style>
