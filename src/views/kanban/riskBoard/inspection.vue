<template>
  <div class='inspection-container'>
    <border-card title="告警看板"
                 subTitle="Alarm"
                 tips="今日数据"
                 :fun="()=>{$router.push({path:'/pos/person/stationWork'})}">
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

<style lang='scss' scoped>
.inspection-container {
  /deep/ .board-card-container {
    height: calc(68vh - 168px);
  }
  .control-bar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .liquid-bar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 17px;
    .liquid-item {
      display: flex;
      flex-direction: row;
      width: 50%;
      .text-bar {
        margin-left: 8px;
        font-size: 12px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .text-title {
          margin-bottom: 8px;
        }
        .text-val {
          color: #999ca5;
          line-height: 18px;
        }
      }
    }
  }
  .ins-sort-button {
    margin-top: 28px;
  }
  .liquid-route {
    width: 80px;
    height: 80px;
  }
}
</style>
