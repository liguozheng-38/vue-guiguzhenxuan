<template>
  <div class="box2">
    <ScreenTitle title="年龄比例" />
    <!-- 图形图标的容器 -->
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import ScreenTitle from '../ScreenTitle/index.vue'
import { ref, onMounted } from 'vue'
//引入echarts
import * as echarts from 'echarts'
const charts = ref()
//组件挂载完毕初始化图形图标
onMounted(() => {
  const mychart = echarts.init(charts.value)
  //设置配置项
  const option = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      right: 30,
      top: 40,
      orient: 'vertical', //图例组件方向的设置
      textStyle: {
        color: 'white',
        fontSize: 14,
      },
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          position: 'inside',
          color: 'white',
        },

        labelLine: {
          show: false,
        },
        data: [
          { value: 1048, name: '20~30岁' },
          { value: 735, name: '30~40岁' },
          { value: 580, name: '40~50岁' },
          { value: 484, name: '50~60岁' },
          { value: 300, name: '60岁以上' },
        ],
      },
    ],
  }
  mychart.setOption(option)
})
</script>

<style scoped lang="scss">
.box2 {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;

  .charts {
    height: 260px;
  }
}
</style>
