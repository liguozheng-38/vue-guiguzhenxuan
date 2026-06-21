<template>
  <div class="box4" ref="map">我是地图组件</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
//引入中国地图的JSON数据
import chinaJSON from './china.json'
//获取DOM元素
let map = ref()
//注册中国地图
echarts.registerMap(
  'china',
  chinaJSON as Parameters<typeof echarts.registerMap>[1],
)
onMounted(() => {
  let mychart = echarts.init(map.value)
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
        //每一个多边形的样式
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'red', // 0% 处的颜色
            },
            {
              offset: 1,
              color: 'blue', // 100% 处的颜色
            },
          ],
          global: false, // 缺省为 false
        },
        opacity: 0.8,
      },
      //地图高亮的效果
      emphasis: {
        itemStyle: {
          color: 'red',
        },
        label: {
          fontSize: 40,
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
        data: [
          {
            coords: [
              [116.405285, 39.904989], // 北京
              [119.306239, 26.075302], // 福州
            ],
            lineStyle: {
              color: 'orange',
              width: 5,
            },
          },
          {
            coords: [
              [116.405285, 39.904989], // 北京
              [114.298572, 30.584355], // 武汉
            ],
            lineStyle: {
              color: 'yellow',
              width: 5,
            },
          },
          {
            coords: [
              [102.712251, 25.040609], // 昆明
              [119.596441, 39.949093], // 秦皇岛
            ],
            lineStyle: {
              color: 'red',
              width: 5,
            },
          },
          {
            coords: [
              [102.712251, 25.040609], // 昆明
              [87.617733, 43.792818], // 乌鲁木齐（新疆）
            ],
            lineStyle: {
              color: 'green',
              width: 5,
            },
          },
          {
            coords: [
              [102.712251, 25.040609], // 昆明
              [120.155151, 30.274084], // 杭州
            ],
            lineStyle: {
              color: 'purple',
              width: 5,
            },
          },
          {
            coords: [
              [102.712251, 25.040609], // 昆明
              [91.132212, 29.654877], // 拉萨（西藏）
            ],
            lineStyle: {
              color: 'cyan',
              width: 5,
            },
          },
        ],
        effect: {
          show: true,
          symbol: 'arrow',
          color: 'black',
          symbolSize: 10,
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

.title {
  position: absolute;
  top: 10px;
  left: 10px;
  color: white;
  font-size: 20px;
  z-index: 10;
}

.box4 > div:last-child {
  width: 100%;
  height: 100%;
}
</style>
