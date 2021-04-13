<template>
  <div class="region-rate-container">
    <border-card title="各区域风险点个数"
                 subTitle="Risk Points"
                 :minHeight="120"
                 :fun="()=>{$router.push({path:'/pos/person/stationWork'})}">
      <radio-select :radioData="['层级二', '层级三']"
                    @change="handleCengjiChange"></radio-select>
    <!--  <div style="width:calc(100%);height:calc(100% - 22px);">
        <e-chart style="height: 100%;width: 100%;"
                 name="chartljrc"
                 ref="chartljrc"
                 type="bar2"></e-chart>
      </div> -->
      <el-row>
        <el-col :span="12" class="container-title-item">
          <img src="~@/assets/img/riskBoard/risk_board_add.png" alt="add">本月新增风险<span>3个</span>
        </el-col>
        <el-col :span="12" class="container-title-item item-right">
          <img src="~@/assets/img/riskBoard/risk_board_up.png" alt="add">本月升级风险<span>1个</span>
        </el-col>
      </el-row>
      <div style="height: calc(50vh - 150px);width: 100%;">
        <e-chart style="height: 100%;width: 100%;"
                 name="chartwar"
                 ref="chartwar"
                 :chartData="chartData"
                 type="warning"></e-chart>
      </div>
    </border-card>
  </div>
</template>

<script>
  import eChart from './components/charts'
  import borderCard from './components/borderCard'
  import radioSelect from './components/radioSelect'
  // import { earlyWarningRate } from '@/api/kanban/souBoard'
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
        falseData: [{'rate': '42', 'name': '乙苯脱氢-一期/南'}, {'rate': '38', 'name': '苯乙烯精馏-一期'}, {'rate': '37', 'name': '成品一库（乙类）'}, {'rate': '26', 'name': '成品二库（乙类）'}, {'rate': '22', 'name': '成品三库（乙类）'}, {'rate': '19', 'name': '成品四库（乙类）'}, {'rate': '19', 'name': '反应一车间（甲类）'}, {'rate': '14', 'name': '反应二车间（甲类）'}, {'rate': '10', 'name': '反应三车间（甲类）'}, {'rate': '6', 'name': '筛析一车间（乙类）'}],
        falseData2: [{'rate': '39', 'name': '总变配电所'}, {'rate': '33', 'name': '1#罐组'}, {'rate': '31', 'name': '3#罐组'}, {'rate': '26', 'name': '成品二库（乙类）'}, {'rate': '22', 'name': '成品三库（乙类）'}, {'rate': '19', 'name': '危废品仓库（乙类）'}, {'rate': '15', 'name': '反应一车间（甲类）'}, {'rate': '14', 'name': '辅料仓库（丙类）'}, {'rate': '10', 'name': '反应三车间（甲类）'}, {'rate': '6', 'name': '苯罐区'}],
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
        let dataArr = []
        if (this.areaLevel === '2') {
          dataArr = this.falseData
        } else {
          dataArr = this.falseData2
        }
        this.chartData = dataArr.map(r => {
          return {
            name: r.name,
            value: r.rate
          }
        })
        this.$nextTick(() => {
          this.$refs.chartwar.refreshChart(this.chartData)
        })
        // earlyWarningRate({
        //   zoneLevel: this.areaLevel
        // }).then(res => {
        //   if (res.data.code === 0) {
        //     this.chartData = res.data.list.map(r => {
        //       return {
        //         name: r.name,
        //         value: r.rate
        //       }
        //     })
        //     this.$nextTick(() => {
        //       this.$refs.chartwar.refreshChart(this.chartData)
        //     })
        //   }
        // })
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
  .region-rate-container{
    .container-title-item{
      font-size: 14px;
      color: #ffffff;
      margin-top: 8px;
      img{
        width: 8px;
        height: auto;
        margin-right: 8px;
        margin-bottom: 3px;
      }
      span{
        font-size: 26px;
        display: inline-block;
        vertical-align: middle;
        margin-left: 8px;
      }
    }
    .item-right{
      text-align: right;
    }
  }
</style>
