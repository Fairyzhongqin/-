<template>
  <div class="region-rate-container">
    <border-card title="各区域预警率" subTitle="Early warning rate" :minHeight="120" :fun="()=>{$router.push({path:'/pos/person/stationWork'})}">
      <radio-select :radioData="['层级二', '层级三']" @change="handleCengjiChange"></radio-select>
      <div style="height: calc(100% - 22px);width: 100%;">
        <e-chart style="height: 100%;width: 100%;" name="chartwar" ref="chartwar" :chartData="chartData" type="warning"></e-chart>
      </div>
    </border-card>
  </div>
</template>

<script>
import eChart from './components/charts'
import borderCard from './components/borderCard'
import radioSelect from './components/radioSelect'
import { earlyWarningRate } from '@/api/kanban/souBoard'
export default {
  components: {
    eChart,
    borderCard,
    radioSelect
  },
  data () {
    return {
      date: [],
      chartData: [],
      areaLevel: '2'
    }
  },
  created () {
    this.getLeijiNumber()
  },
  mounted () {
  },
  computed: {},
  watch: {},
  methods: {
    getLeijiNumber () {
      earlyWarningRate({
        zoneLevel: this.areaLevel
      }).then(res => {
        if (res.data.code === 0) {
          this.chartData = res.data.list.map(r => {
            return {
              name: r.name,
              value: r.rate
            }
          })
          this.$nextTick(() => {
            this.$refs.chartwar.refreshChart(this.chartData.reverse())
          })
        }
      })
    },
    // 层级切换
    handleCengjiChange (val) {
      if (val === '层级二') {
        this.areaLevel = '2'
      } else if (val === '层级三') {
        this.areaLevel = '3'
      }
      this.getLeijiNumber()
    }
  }
}
</script>

<style lang="scss">
.region-rate-container {
  height: calc(40% - 3.2px);
  .board-card-container {
    padding-bottom: 0px;
    .border-content {
      height: calc(100% - 37px);
    }
  }
}
</style>
