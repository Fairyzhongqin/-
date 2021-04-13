<template>
  <div class='board-work-container'>
    <border-card title="作业看板"
                 subTitle="Work"
                 minHeight="250"
                 :fun="()=>{$router.push({path:'/pos/private/private'})}">
      <div style="position: absolute;top:10px;right:10px;font-size:12px;color:#999ca563;line-height:24px;">近30天数据</div>
      <div class="control-bar">
        <radio-select :radioData="['7天', '14天', '30天']"
                      defaultVal="30天"
                      @change="handleDateButtonChange"
                      v-show="false"></radio-select>
        <date-select v-model="date"
                     :timeSlot="timeSlot"
                     @search="getWorkData"
                     v-show="false"></date-select>
      </div>

      <tabs-card class="daily-work-bar"
                 v-model="tabIndex"
                 :tabData="tabData"
                 @change="handleTabChange">
        <e-chart style="height: calc(100% - 59px);width: 100%;padding-top:10px;"
                 name="chartWork1"
                 ref="chartWork1"
                 type="lineMultiple"
                 v-show="tabIndex===0"
                 :chartData="[]"></e-chart>
        <e-chart style="height: calc(100% - 59px);width: 100%;"
                 name="chartWork2"
                 ref="chartWork2"
                 type="pie"
                 v-show="tabIndex===1"
                 :chartData="[]"></e-chart>
        <e-chart style="height: calc(100% - 59px);width: 100%;"
                 name="chartWork3"
                 ref="chartWork3"
                 type="line"
                 v-show="tabIndex===2"
                 :chartData="[]"></e-chart>
      </tabs-card>
    </border-card>
  </div>
</template>

<script>
import eventBus from '@/bus/index'
import borderCard from './components/borderCard'
import tabsCard from './components/tabsCard'
import eChart from './components/charts'
import radioSelect from './components/radioSelect'
import dateSelect from './components/dateSelect'
import { getOperationLcon, getOperationCount } from '@/api/kanban/per'
export default {
  components: {
    borderCard,
    tabsCard,
    eChart,
    radioSelect,
    dateSelect
  },
  data () {
    return {
      date: [],
      chartData1: [],
      chartData2: [],
      chartData3: [],
      timeSlot: 30,
      tabData: [{
        name: '作业次数',
        value: '0'
      }, {
        name: '违规次数',
        value: '0'
      }, {
        name: '作业时长',
        value: '0h'
      }],
      tabData2: [],
      tabIndex: 0,
      timer: null
    }
  },
  created () {
  },
  mounted () {
    this.getWorkData()
    this.timer = setInterval(() => {
      this.autoRefresh()
    }, 10000)
  },
  computed: {
  },
  watch: {},
  methods: {
    handleChange (val) {
      this.dateSelected = val
      this.getWorkData()
    },
    getWorkData () {
      getOperationLcon({
        startTime: this.date.length !== 0 ? this.date[0] : '',
        endTime: this.date.length !== 0 ? this.date[1] : '',
        workType: this.tabIndex
      }).then(res => {
        if (res.data.code === 0) {
          if (this.tabIndex === 0) {
            let cache = []
            for (let i in res.data.operationLconap) {
              if (i !== 'xAjax') {
                cache.push(res.data.operationLconap[i])
              }
            }
            this.$refs.chartWork1.refreshChart(cache, res.data.operationLconap['xAjax'])
          } else if (this.tabIndex === 1) {
            this.$refs.chartWork2.refreshChart(res.data.operationLconap.operationMap)
          } else if (this.tabIndex === 2) {
            let cache3 = []
            for (let j in res.data.operationLconap) {
              cache3.push({
                name: j.split('-')[2],
                value: res.data.operationLconap[j]
              })
            }
            this.$refs.chartWork3.refreshChart(cache3)
          }
        }
      })
      this.getTabsData()
    },
    getTabsData () { // 获取tab显示值
      getOperationCount({
        startTime: this.date.length !== 0 ? this.date[0] : '',
        endTime: this.date.length !== 0 ? this.date[1] : ''
      }).then(res => {
        if (res.data.code === 0) {
          this.tabData[0].value = res.data.operationMap.taskCount
          this.tabData[1].value = res.data.operationMap.violatCount
          this.tabData[2].value = res.data.operationMap.violationTime + 'h'
          eventBus.$emit('refreshWorkNum', res.data.operationMap.toDayCount)
        }
      })
    },
    handleDateButtonChange (val) {
      switch (val) {
        case '7天':
          this.timeSlot = 7
          break
        case '14天':
          this.timeSlot = 14
          break
        case '30天':
          this.timeSlot = 30
          break
      }
    },
    handleTabChange (val) { // tab切换
      this.tabIndex = val
      this.getWorkData()
      setTimeout(() => {
        this.$refs['chartWork' + (val + 1)].resizeChart()
      }, 10)
    },
    autoRefresh () { // 自动刷新数据
      this.$refs.chartWork1.refreshChart([], [])
      this.$refs.chartWork2.refreshChart([])
      this.$refs.chartWork3.refreshChart([])
      this.tabIndex === 2 ? this.tabIndex = 0 : this.tabIndex++
      setTimeout(() => {
        this.getWorkData()
      }, 500)
      setTimeout(() => {
        this.$refs['chartWork' + (this.tabIndex + 1)].resizeChart()
      }, 10)
    },
    clearTimer () {
      if (this.timer) {
        window.clearInterval(this.timer)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.board-work-container {
  position: relative;
  .control-bar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .daily-work-bar {
    height: 100%;
  }
}
</style>
