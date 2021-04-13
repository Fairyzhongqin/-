<template>
  <div class="tank-board-container">
    <border-card title="储罐看板"
                 subTitle="Storage tank"
                 tips="单位：个"
                 :fun="()=>{$router.push({path:'/pos/person/stationWork'})}">
      <e-chart style="height: calc(40vh - 87px);width: 100%;"
               name="tankChart"
               ref="tankChart"
               type="tankPie"
               :chartData="chartData"></e-chart>
    </border-card>
  </div>
</template>

<script>
  import borderCard from './components/borderCard'
  import eChart from './components/charts'
  import { storageTank } from '@/api/kanban/souBoard'

  export default {
    components: {
      borderCard,
      eChart
    },
    data () {
      return {
        date: [],
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
        storageTank().then(({data}) => {
          if (data.code === 0) {
            this.chartData = data.list.map(r => {
              return {
                name: r.name,
                value: r.num
              }
            })
            this.$nextTick(() => {
              this.$refs.tankChart.refreshChart(this.chartData)
            })
          }
        }).catch()
      }
    }
  }
</script>

<style lang="scss">
  .tank-board-container{

  }
</style>
