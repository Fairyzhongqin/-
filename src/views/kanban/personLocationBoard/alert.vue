<template>
  <div class='board-alert-container'>
    <border-card title="报警看板" subTitle="Alert" :fun="()=>{$router.push({path:'/pos/alerm/alermRecord'})}">
      <div class="control-bar">
        <radio-select :radioData="['7天', '14天', '30天']" defaultVal="30天" @change="handleDateButtonChange"></radio-select>
        <date-select v-model="date" :timeSlot="timeSlot" @search="getAlarmRecord"></date-select>
      </div>
      <e-chart style="height: calc(100% - 24px);width: 100%;" name="chart3" ref="chart3" type="pie" :chartData="chartData"></e-chart>
    </border-card>
  </div>
</template>

<script>
import borderCard from './components/borderCard'
import radioSelect from './components/radioSelect'
import dateSelect from './components/dateSelect'
import eChart from './components/charts'
import { alarmRecord } from '@/api/kanban/per'
export default {
  components: {
    borderCard,
    radioSelect,
    dateSelect,
    eChart
  },
  data () {
    return {
      date: [],
      timeSlot: 30,
      chartData: []
    }
  },
  created () {
  },
  mounted () {
    this.getAlarmRecord()
  },
  computed: {},
  watch: {},
  methods: {
    getAlarmRecord () {
      alarmRecord({
        startTime: this.date.length !== 0 ? this.date[0] : '',
        endTime: this.date.length !== 0 ? this.date[1] : ''
      }).then(res => {
        if (res.data.code === 0) {
          this.chartData = res.data.list.map(r => {
            return {
              name: r.alarmTypeName,
              value: r.count
            }
          })
          this.$refs.chart3.refreshChart(this.chartData)
        }
      }).catch()
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
    }
  }
}
</script>

<style lang='scss' scoped>
.board-alert-container {
  .control-bar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>
