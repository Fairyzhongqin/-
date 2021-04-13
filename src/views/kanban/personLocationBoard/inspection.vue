<template>
  <div class='inspection-container'>
    <border-card title="巡检看板"
                 subTitle="Inspection"
                 :fun="()=>{$router.push({path:'/pos/person/stationWork'})}">
      <div class="control-bar">
        <radio-select :radioData="['昨日', '周', '月']"></radio-select>
        <date-select v-model="date"
                     @search="getAlarmRecord"></date-select>
      </div>
      <div class="liquid-bar">
        <div class="liquid-item">
          <liquid-ball size="80"
                       :value="liquidData1"
                       name="liquid1"></liquid-ball>
          <div class="text-bar">
            <div class="text-title">路线</div>
            <div class="text-val">达标数：720</div>
            <div class="text-val">异常数：1280</div>
          </div>
        </div>
        <div class="liquid-item">
          <liquid-ball size="80"
                       :value="liquidData2"
                       name="liquid2"></liquid-ball>
          <div class="text-bar">
            <div class="text-title">区域</div>
            <div class="text-val">达标数：1800</div>
            <div class="text-val">异常数：600</div>
          </div>
        </div>
      </div>
      <radio-select mode="divide"
                    class="ins-sort-button"
                    :radioData="['巡检路线情况表', '巡检区域情况表', '巡检班组情况表']"></radio-select>
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
      liquidData1: { '达标率': 0.36 },
      liquidData2: { '达标率': 0.75 },
      date: [],
      tableHeight: window.innerHeight * 0.88 - 448
    }
  },
  created () {

  },
  mounted () {
    window.onresize = () => {
      this.tableHeight = window.innerHeight * 0.88 - 448
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
    height: calc(88vh - 198px);
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
