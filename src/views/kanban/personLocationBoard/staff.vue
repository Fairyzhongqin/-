<template>
  <div class='staff-container'>
    <border-card title="实时园区人数" minHeight="465" :fun="()=>{$router.push({path:'/pos/person/person'})}">

      <count-num :rollDigits="personNum" class="count-num-info"></count-num>
      <e-chart style="height: calc(25% - 21px);width: 100%;margin-top:10px;border-bottom:1px solid #6b6b6b82;" name="chart1" ref="chart1" type="bar" :chartData="chartData"></e-chart>

      <!-- 人次累计start -->
      <div class="leiji-number-bar" style="height: calc(50% - 42px);width: 100%;margin-top:10px;border-bottom:1px solid #6b6b6b82;">
        <div class="flex flex-row justify-content-space-between">
          <div class="leiji-title">
            区域热度
          </div>
          <radio-select :radioData="['昨日', '周', '月']" defaultVal="昨日" @change="getLeijiNumber" v-show="false">
          </radio-select>
          <date-select v-model="date" :timeSlot="timeSlot" v-show="false" @search="getLeijiNumber"></date-select>
          <div style="font-size:12px;color:#999ca563;line-height:24px;">近30天数据</div>
        </div>
        <div style="height: calc(100% - 24px);padding-top:12px;">
          <div style="height:100%;">
            <radio-select :radioData="['层级二', '层级三']" @change="handleCengjiChange"></radio-select>
            <!-- <div style="width:120px;height:100%;">
            <radio-select :radioData="['层级二', '层级三']"
                          @change="handleCengjiChange"></radio-select>
            <div class="mini-table-bar">
              <div v-for="(data, index) in tableData"
                   :key="index">
                <div class="flex flex-row mini-item">
                  <div class="item-name">{{index+1+'、'+data.name}}</div>
                  <div class="item-value">{{data.value}}</div>
                </div>
              </div>
            </div>
          </div> -->
            <div style="width:calc(100%);height:calc(100% - 22px);">
              <e-chart style="height: 100%;width: 100%;" name="chartljrc" ref="chartljrc" type="bar2"></e-chart>
            </div>
          </div>
        </div>
      </div>

      <!-- 访客统计start -->
      <div class="fangke-bar" style="height: calc(25% - 21px);width: 100%;margin-top:10px;">
        <div class="fangke-control">
          <div class="fangke-title" @click="()=>{$router.push({path:'/pos/visitor/visitorRecord'})}">访客统计</div>
          <radio-select :radioData="['7天', '14天', '30天']" :defaultVal="dateSelected" @change="handleChange" v-show="false">
          </radio-select>
          <div style="font-size:12px;color:#999ca563;line-height:24px;">近30天数据</div>
        </div>
        <e-chart style="height: calc(100% - 24px);width: 100%;" name="chart2" ref="chart2" type="line" :chartData="chartDataVister"></e-chart>
      </div>

    </border-card>
  </div>
</template>

<script>
import borderCard from './components/borderCard'
import countNum from './components/countNum'
import dateSelect from './components/dateSelect'
import eChart from './components/charts'
import radioSelect from './components/radioSelect'
import { getpersoncount, getvisitorcount, getzoneperson } from '@/api/kanban/per'
import { dateFormater } from '@/utils/commond'
export default {
  components: {
    borderCard,
    countNum,
    dateSelect,
    eChart,
    radioSelect
  },
  data () {
    return {
      personNum: '00000',
      interval: null,
      chartData: [],
      areaLevel: '2', // 区域层级
      date: [], // 人次累计 时间
      tableData: [], // 各厂房人数列表
      timeSlot: 30, // 累计人次默认日期天数
      chartDataVister: [],
      dateSelected: '30天' // 访客选择的日期段
    }
  },
  created () {
    this.getPerson()
    this.getVister()
    this.interval = setInterval(() => {
      this.getPerson()
    }, 5000)
  },
  mounted () {
    this.getLeijiNumber()
  },
  beforeDestroy () {
    clearInterval(this.interval)
  },
  computed: {
    dateArray () {
      let date = []
      let dateNow = new Date()
      switch (this.dateSelected) {
        case '7天':
          let date7 = new Date(dateNow.getTime() - 6 * 24 * 60 * 60 * 1000)
          date.push(dateFormater('yyyy-MM-DD', date7))
          break
        case '14天':
          let date14 = new Date(dateNow.getTime() - 13 * 24 * 60 * 60 * 1000)
          date.push(dateFormater('yyyy-MM-DD', date14))
          break
        case '30天':
          let date30 = new Date(dateNow.getTime() - 29 * 24 * 60 * 60 * 1000)
          date.push(dateFormater('yyyy-MM-DD', date30))
          break
      }
      date.push(dateFormater('yyyy-MM-DD', dateNow))
      return date
    }
  },
  watch: {},
  methods: {
    getPerson () {
      getpersoncount({}).then(res => {
        if (res.data.code === 0) {
          this.personNum = res.data.personMap['onLine'].toString().padStart(5, '0')
          this.chartData = []
          for (let i in res.data.personMap) {
            if (i !== 'onLine' && i !== 'leave') {
              var name
              switch (i) {
                case 'contractor':
                  name = '承包商'
                  this.chartData.push({
                    name,
                    value: res.data.personMap[i]
                  })
                  break
                case 'interbal':
                  name = '内部员工'
                  this.chartData.push({
                    name,
                    value: res.data.personMap[i]
                  })
                  break
                case 'visitor':
                  name = '访客'
                  this.chartData.push({
                    name,
                    value: res.data.personMap[i]
                  })
                  break
              }
            }
          }
          console.log(this.chartData)
          this.$refs.chart1.refreshChart(this.chartData)
        }
      })
    },
    handleCengjiChange (val) { // 层级切换
      if (val === '层级二') {
        this.areaLevel = '2'
      } else if (val === '层级三') {
        this.areaLevel = '3'
      }
      this.getLeijiNumber()
    },
    getLeijiNumber (type) { // 人次累计
      if (type) {
        type === 0 ? this.timeSlot = 1 : type === 1 ? this.timeSlot = 7 : this.timeSlot = 30
      }
      getzoneperson({
        startTime: this.date[0],
        endTime: this.date[1],
        level: this.areaLevel
      }).then(res => {
        if (res.data.code === 0) {
          this.tableData = res.data.list.map(r => {
            return {
              name: r.zoneName,
              value: r.zoneNum
            }
          })
          this.$refs.chartljrc.refreshChart(JSON.parse(JSON.stringify(this.tableData)).reverse())
        }
      })
    },
    getVister () {
      getvisitorcount({
        startTime: this.dateArray[0],
        endTime: this.dateArray[1]
      }).then(res => {
        if (res.data.code === 0) {
          let cacheData = []
          for (let i in res.data.personMap) {
            cacheData.push({
              name: i.split('-')[2],
              value: res.data.personMap[i]
            })
          }
          this.chartDataVister = cacheData.reverse()
          this.$refs.chart2.refreshChart(cacheData)
        }
      })
    },
    handleChange (val) {
      this.dateSelected = val
      this.getVister()
    }
  }
}
</script>

<style lang='scss' scoped>
.staff-container {
  height: 100%;
  /deep/ .border-content {
    height: calc(100% - 27px);
    .count-num-info {
      width: 200px;
    }
    .leiji-number-bar {
      .leiji-title {
        font-size: 14px;
        line-height: 24px;
        font-weight: bold;
      }
      /deep/ .el-radio-button__inner {
        padding: 5px 12px !important;
      }
      .mini-table-bar {
        color: #a0a3ab;
        font-size: 12px;
        line-height: 18px;
        height: calc(100% - 38px);
        overflow-y: auto;
        margin-top: 8px;
        margin-bottom: 8px;
        .mini-item {
          .item-name {
            overflow: hidden;
            width: 50%;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .item-value {
            overflow: hidden;
            width: 50%;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding-left: 10px;
          }
        }
      }
    }
    .fangke-bar {
      &:hover {
        .fangke-title {
          cursor: pointer;
          text-decoration: underline;
        }
      }
      .fangke-control {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        font-size: 10px;
        .fangke-title {
          font-size: 14px;
          line-height: 24px;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
