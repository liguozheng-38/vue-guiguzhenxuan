<template>
  <div class="logo" :class="{ fold: LayOutSettingStore.fold }" v-if="setting.logoHidden">
    <img :src="setting.logo" alt="" />
    <p v-if="!LayOutSettingStore.fold">{{ setting.title }}</p>
  </div>
</template>

<script setup lang="ts">
  import setting from '@/setting'
  import useLayOutSettingStore from '@/store/modules/setting'
  const LayOutSettingStore = useLayOutSettingStore()
</script>

<script lang="ts">
  export default {
    name: 'Logo',
  }
</script>

<style scoped lang="scss">
  .logo {
    width: 100%;
    box-sizing: border-box;
    height: $base-menu-logo-height;
    color: white;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 10px;
    transition: all 0.3s;

    &.fold {
      justify-content: center;
      padding: 10px 0;
    }

    img {
      width: 40px;
      height: 40px;
      flex-shrink: 0;
    }

    p {
      font-size: $base-logo-title-fontSize;
      margin-left: 10px;
      color: white;
      white-space: nowrap;
    }
  }
</style>
