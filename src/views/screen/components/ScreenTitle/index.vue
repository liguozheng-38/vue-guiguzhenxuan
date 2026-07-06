<template>
  <div class="screen-title">
    <p>{{ title }}</p>
    <img src="../../images/dataScreen-title.png" alt="" />
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<style scoped lang="scss">
.screen-title {
  p {
    color: white;
    font-size: 18px;
  }
}
</style>
