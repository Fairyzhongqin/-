<template>
  <div class='billboard-sou-alarm-container'>
    <border-card title="告警看板" subTitle="Alarm" tips="今日数据" :fun="()=>{$router.push({path:'/pos/person/stationWork'})}">
      <table-view :height="tableHeight"></table-view>
    </border-card>
  </div>
</template>

<script>
import borderCard from './components/borderCard'
import liquidBall from './components/liquidBall'
import dateSelect from './components/dateSelect'
import defaultSelect from './components/defaultSelect'
import radioSelect from './components/radioSelect'
import tableView from './components/table'
export default {
  components: {
    borderCard,
    liquidBall,
    dateSelect,
    defaultSelect,
    radioSelect,
    tableView
  },
  data () {
    return {
      tableHeight: window.innerHeight * 0.88 - 388
    }
  },
  created () {

  },
  mounted () {
    window.onresize = () => {
      this.tableHeight = window.innerHeight * 0.88 - 388
    }
  },
  computed: {},
  watch: {},
  methods: {
    getAlarmRecord () {

    }
  }
}
</script>

<style lang='scss'>
.billboard-sou-alarm-container {
  height: calc(100vh - 425px);
}
</style>
