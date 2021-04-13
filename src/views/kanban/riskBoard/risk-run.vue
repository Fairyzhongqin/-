<template>
  <div class="tank-board-container">
    <border-card title="风险治理"
                 subTitle="Risk Government"
                 :fun="()=>{$router.push({path:'/pos/person/stationWork'})}">
      <e-chart style="height: calc(33vh - 85px);width: 100%;"
               name="governmentChart"
               ref="governmentChart"
               type="government"
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
              this.$refs.governmentChart.refreshChart(this.chartData)
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
