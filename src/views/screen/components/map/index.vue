<template>
  <div class="box4" ref="map">我是地图组件</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
//引入中国地图的JSON数据
import chinaJSON from './china.json'
//获取DOM元素
const map = ref()
//注册中国地图
echarts.registerMap(
  'china',
  chinaJSON as Parameters<typeof echarts.registerMap>[1],
)
onMounted(() => {
  const mychart = echarts.init(map.value)
  //设置配置项
  mychart.setOption({
    //地图组件
    geo: {
      map: 'china', //中国地图
      roam: true, //鼠标缩放的效果
      //地图的位置调试
      left: 150,
      top: 150,
      right: 150,
      zoom: 1.2,
      bottom: 0,
      //地图上的文字的设置
      label: {
        show: true, //文字显示出来
        color: 'white',
        fontSize: 14,
      },
      itemStyle: {
        //每一个多边形的样式：蓝色渐变背景
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: '#2b5c8a', // 顶部中蓝
            },
            {
              offset: 1,
              color: '#1a3a5c', // 底部深蓝
            },
          ],
          global: false,
        },
        //省份边框线
        borderColor: '#4a90d9',
        borderWidth: 1,
        opacity: 0.9,
      },
      //地图高亮的效果
      emphasis: {
        itemStyle: {
          color: '#3a7bb8',
          borderColor: '#7fb8e8',
          borderWidth: 2,
        },
        label: {
          fontSize: 40,
          color: 'white',
        },
      },
    },
    //布局位置
    grid: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    },
    series: [
      {
        type: 'lines', //航线的系列
        coordinateSystem: 'geo',
        data: [
          {
            coords: [
              [116.405285, 39.904989], // 北京
              [119.306239, 26.075302], // 福州
            ],
          },
          {
            coords: [
              [116.405285, 39.904989], // 北京
              [114.298572, 30.584355], // 武汉
            ],
          },
          {
            coords: [
              [102.712251, 25.040609], // 昆明
              [119.596441, 39.949093], // 秦皇岛
            ],
          },
          {
            coords: [
              [102.712251, 25.040609], // 昆明
              [87.617733, 43.792818], // 乌鲁木齐（新疆）
            ],
          },
          {
            coords: [
              [102.712251, 25.040609], // 昆明
              [120.155151, 30.274084], // 杭州
            ],
          },
          {
            coords: [
              [102.712251, 25.040609], // 昆明
              [91.132212, 29.654877], // 拉萨（西藏）
            ],
          },
          {
            coords: [
              [91.132212, 29.654877], // 拉萨（西藏）
              [122.116394, 37.509691], //威海
            ],
          },
        ],
        //统一线条样式：白色细曲线
        lineStyle: {
          color: 'white',
          width: 1,
          opacity: 0.6,
          curveness: 0.3, //曲度，0为直线，越大越弯
        },
        effect: {
          show: true,
          symbol:
            'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0-70.302-23.221-130.593-51.452-130.593c-28.231,0-51.452,60.291-51.452,130.593l0.073,208.063l-319.9,221.799v89.254l319.9-110.646l-0.073,158.94l-89.254,73.845v56.878l140.301-44.526l140.301,44.526v-56.878l-89.254-73.845l-0.073-158.94L1705.06,1318.313z',
          symbolSize: 15,
          color: '#ffd700',
        },
      },
    ],
  })
})
</script>

<style scoped>
.box4 {
  width: 100%;
  height: 100%;
  position: relative;
}

.box4 > div:last-child {
  width: 100%;
  height: 100%;
}
</style>
