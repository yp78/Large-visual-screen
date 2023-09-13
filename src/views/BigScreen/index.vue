<script setup lang="ts">
import { getParkInfo } from '@/Api/ParkApi'
import { onMounted, ref } from 'vue'
import type { ParkResponseType } from '@/types/ParkType'
//1.引入echarts
import * as echarts from 'echarts'

//2.保存柱状图的dom节点
const pieChart = ref(null)
//保存环形图的dom节点
const annularChart = ref(null)

const parkInfo = ref<ParkResponseType>()
const getInfo = async () => {
  const res = await getParkInfo()
  console.log('res=>', res)
  parkInfo.value = res.data
}
getInfo()

const initBarChart = () => {
  // 获取园区年度收入分析数据
  const { parkIncome, parkIndustry } = parkInfo.value!
  console.log(parkIncome)

  // 3. 初始化echarts并指定渲染的容器
  const myPieChart = echarts.init(pieChart.value)
  //环形图
  const myAnnularChart = echarts.init(annularChart.value)
  // 4. 设置配置项

  const pieOption = {
    tooltip: {
      show: true,
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      top: '10px',
      left: '0px',
      right: '0px',
      bottom: '0px',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: parkIncome.xMonth,
      axisTick: {
        show: false,
        alignWithLabel: true
      }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        show: false
      }
    },
    textStyle: {
      color: '#b4c0cc'
    },
    series: [
      {
        data: parkIncome.yIncome.map((item, index) => {
          const color =
            index % 2 === 0
              ? {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: '#74c0f8' // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: 'rgba(116,192,248,0)' // 100% 处的颜色
                    }
                  ],
                  global: false // 缺省为 false
                }
              : {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: '#ff7152' // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: 'rgba(255,113,82,0)' // 100% 处的颜色
                    }
                  ],
                  global: false // 缺省为 false
                }
          return { value: item, itemStyle: { color } }
        }),
        type: 'bar',
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)'
        },
        barWidth: '10px'
      }
    ]
  }

  //环形图
  const annularoption = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      bottom: '-6%',
      left: 'center'
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['65%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: parkIndustry
      }
    ]
  }

  // 5. 渲染图表
  myPieChart && myPieChart.setOption(pieOption)
  myAnnularChart && myAnnularChart.setOption(annularoption)
  // 6. 设置图表自适应
  // window.addEventListener('resize', () => {
  //   myPieChart.resize()
  // })
}
onMounted(async () => {
  await getInfo()
  initBarChart()
})
</script>

<template>
  <div class="big-screen-page">
    <div class="left-div">
      <img
        class="img-header"
        src="https://yjy-teach-oss.oss-cn-beijing.aliyuncs.com/smartPark/%E5%A4%A7%E5%B1%8F%E5%88%87%E5%9B%BE/%E5%9B%AD%E5%8C%BA%E6%A6%82%E5%86%B5%402x.png"
        alt="logo"
      />
      <div class="icons-container">
        <div class="item">
          <div class="icons-item building">
            <span class="number">{{ parkInfo?.base.buildingTotal }}</span>
          </div>
          <span class="title">楼宇总数</span>
          <span class="unity">(栋)</span>
        </div>
        <div class="item">
          <div class="icons-item enterprise">
            <span class="number">{{ parkInfo?.base.enterpriseTotal }}</span>
          </div>
          <span class="title">入驻企业总数</span>
          <span class="unity">(家)</span>
        </div>
        <div class="item">
          <div class="icons-item rod">
            <span class="number">{{ parkInfo?.base.parkingTotal }}</span>
          </div>
          <span class="title">车位总数</span>
          <span class="unity">(个)</span>
        </div>
        <div class="item">
          <div class="icons-item car">
            <span class="number">{{ parkInfo?.base.chargePoleTotal }}</span>
          </div>
          <span class="title">一体杆总数</span>
          <span class="unity">(个)</span>
        </div>
      </div>
    </div>
    <div class="screen-two">
      <img
        class="img-header"
        src="https://yjy-teach-oss.oss-cn-beijing.aliyuncs.com/smartPark/%E5%A4%A7%E5%B1%8F%E5%88%87%E5%9B%BE/%E5%9B%AD%E5%8C%BA%E5%B9%B4%E5%BA%A6%E6%94%B6%E5%85%A5%E5%88%86%E6%9E%90%402x.png"
        alt="logo"
      />
      <div class="bar-chart-title">
        <span>单位:元</span>
        <div>
          <span class="bar-icon blue-bar-icon"></span>
          <span class="bar-icon red-bar-icon"></span>
          收入情况
        </div>
      </div>
      <div class="bar-chart" ref="pieChart"></div>
    </div>
    <div class="screen-three">
      <img
        class="img-header"
        src="https://yjy-teach-oss.oss-cn-beijing.aliyuncs.com/smartPark/%E5%A4%A7%E5%B1%8F%E5%88%87%E5%9B%BE/%E5%9B%AD%E5%8C%BA%E4%BA%A7%E4%B8%9A%E5%88%86%E5%B8%83%402x.png"
        alt="logo"
      />
      <div class="bom-chart" ref="annularChart"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.img-header {
  height: 30px;
}
.big-screen-page {
  position: absolute;
  left: 0;
  top: 0;
  width: 480px;
  padding: 10px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(
    to left,
    rgba(0, 6, 15, 0) 0%,
    rgba(0, 6, 15, 0) 20%,
    rgba(0, 0, 0, 0.4) 30%,
    rgba(0, 0, 0, 0.6) 40%,
    rgba(1, 4, 11, 1) 70%,
    #04070d 100%
  );
  .left-div {
    flex-basis: 25%;
    .icons-container {
      display: flex;
      justify-content: space-between;
      padding: 20px 0;
      .item {
        display: flex;
        flex: 1;
        flex-direction: column;
        text-align: center;
        .icons-item {
          height: 80px;
          position: relative;
          .number {
            color: #fff;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            font-size: 18px;
          }
        }
        .building {
          background: url('@/assets/building-icon.png') no-repeat 50% 0 / contain;
        }
        .enterprise {
          background: url('@/assets/enterprise-icon.png') no-repeat 50% 0 / contain;
        }
        .rod {
          background: url('@/assets/rod-icon.png') no-repeat 50% 0 / contain;
        }
        .car {
          background: url('@/assets/car-icon.png') no-repeat 50% 0 / contain;
        }
        .title {
          margin-top: 8px;
        }
        .title,
        .unity {
          font-size: 14px;
          color: #cdd7e1;
        }
      }
    }
  }
}
.screen-two {
  flex-basis: 35%;
  margin-top: 10px;
  .bar-chart-title {
    display: flex;
    color: #c6d1db;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    margin-top: 20px;
    // height: 40px;

    .bar-icon {
      display: inline-block;
      width: 12px;
      height: 4px;
    }

    .blue-bar-icon {
      background: linear-gradient(90deg, #74c0f8, rgba(116, 192, 248, 0));
    }
    .red-bar-icon {
      background: linear-gradient(90deg, #ff7152, rgba(255, 113, 82, 0));
    }
  }

  .bar-chart {
    width: 100%;
    height: calc(100% - 70px);
  }
}
.screen-three {
  flex-basis: 30%;
  .bom-chart {
    height: calc(100% - 15px);
  }
}
</style>
