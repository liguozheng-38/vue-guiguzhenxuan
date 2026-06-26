<template>
  <div class="box8">
    <div class="title">
      <p>数据统计</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'
//获取DOM节点
const charts = ref()
//组件挂载完毕
onMounted(() => {
  //一个容器可以同时展示多种类型的图形图标
  const mychart = echarts.init(charts.value)
  const option = {
    title: {
      text: '游客消费统计',
      textStyle: {
        color: 'white',
      },
    },
    radar: {
      // shape: 'circle',
      indicator: [
        { name: '消费', max: 100 },
        { name: '好感', max: 100 },
        { name: '出行', max: 100 },
        { name: '小吃', max: 100 },
        { name: '爱好', max: 100 },
        { name: '景点', max: 100 },
      ],
      // 设置刻度数量以提高可读性
      splitNumber: 5,
    },
    series: [
      {
        name: 'Budget vs spending',
        type: 'radar',
        data: [
          {
            value: [65, 19, 67, 92, 96, 72],
            name: '购物',
          },
          {
            value: [77, 88, 93, 68, 81, 84],
            name: '吃饭',
          },
        ],
      },
    ],
  }
  //设置配置项
  mychart.setOption(option)
})
</script>

<style scoped lang="scss">
.box8 {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin-top: 20px;

  .title {
    p {
      color: white;
      font-size: 18px;
    }
  }

  .charts {
    height: calc(100% - 30px);
  }
}
</style>
