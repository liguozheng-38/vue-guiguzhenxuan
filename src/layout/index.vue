<script setup lang="ts">
  import Logo from './logo/index.vue'
  import Menu from './menu/index.vue'
  import Main from './main/index.vue'
  import Tabbar from './tabbar/index.vue'
  import useUserStore from '@/store/modules/user'
  import useLayOutSettingStore from '@/store/modules/setting'
  import { useRoute } from 'vue-router'

  const userStore = useUserStore()
  const $route = useRoute()
  const LayOutSettingStore = useLayOutSettingStore()
</script>

<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <div class="layout_slider" :class="{ fold: LayOutSettingStore.fold ? true : false }">
      <Logo />
      <!-- 展示菜单
            滚动组件 -->
      <el-scrollbar class="scrollbar">
        <!-- 菜单组件-->

        <el-menu :default-active="$route.path" background-color="#001529" text-color="white" :collapse="LayOutSettingStore.fold ? true : false">
          <!--根据路由动态生成菜单-->
          <Menu :menuList="userStore.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部导航 -->
    <div class="layout_tabbar" :class="{ fold: LayOutSettingStore.fold ? true : false }">
      <Tabbar></Tabbar>
    </div>
    <!-- 内容展示区域 -->
    <div class="layout_main" :class="{ fold: LayOutSettingStore.fold ? true : false }">
      <Main></Main>
    </div>
  </div>
</template>
<style scoped lang="scss">
  .layout_container {
    width: 100%;
    height: 100vh;

    .layout_slider {
      // color: white;
      width: $base-menu-width;
      height: 100vh;
      background: $base-menu-background;
      transition: all 0.3s;

      &.fold {
        width: $base-menu-min-width;
      }

      .scrollbar {
        width: 100%;
        height: calc(100vh - $base-menu-logo-height);

        .el-menu {
          border-right: none;
        }
      }
    }

    .layout_tabbar {
      position: fixed;
      width: calc(100% - $base-menu-width);
      height: $base-tabbar-height;
      top: 0px;
      left: $base-menu-width;
      transition: all 0.3s;
      &.fold {
        width: calc(100vw - $base-menu-min-width);
        left: $base-menu-min-width;
      }
    }

    .layout_main {
      position: absolute;
      width: calc(100% - $base-menu-width);
      height: calc(100vh - $base-tabbar-height);
      left: $base-menu-width;
      top: $base-tabbar-height;
      padding: 20px;
      overflow: auto;
      transition: all 0.3s;

      &.fold {
        width: calc(100vw - $base-menu-min-width);
        left: $base-menu-min-width;
      }
    }
  }
</style>
<style lang="scss">
  // 暗黑模式下的main区域背景色
  .dark .layout_main {
    background-color: #1a1a2e;
  }
</style>
