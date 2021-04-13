<!--点位、告警、近一周-->
<template>
  <div class="point-position-container">
    <el-row>
      <el-col :span="13">
        <h3>点位分类</h3>
        <e-chart style="height: 136px;width: 100%;"
                 name="classificationChart"
                 ref="classificationChart"
                 type="annular"
                 :chartData="classificationChartData"></e-chart>
      </el-col>
      <el-col :span="11">
        <h3>告警点位</h3>
        <el-row class="alarm-items">
          <template v-for="item in alarmData">
            <el-col :span="8">
              <p><number-grow :value="Number(item.value)" :fontc="item.value > 0 ? '#FF2829' : '#FFFFFF'"></number-grow></p>
              <p>{{item.name}}</p>
            </el-col>
          </template>
        </el-row>
      </el-col>
    </el-row>
    <div>
      <h3>近一周告警</h3>
      <e-chart style="height: calc(40vh - 187px);width: 100%;"
               name="sosChart"
               ref="sosChart"
               type="sosLine"
               :chartData="sosChartData"></e-chart>
    </div>
  </div>
</template>

<script>
  import eChart from './components/charts'
  import numberGrow from '@/components/NumberGrow'
  import { alarmNearlyWeek, parameter } from '@/api/kanban/souBoard'

  export default {
    components: {
      eChart,
      numberGrow
    },
    data () {
      return {
        classificationChartData: [], // 点位分类Charts数据
        sosChartData: [], // 近一周告警Charts数据
        alarmData: [{
          name: '生产工艺',
          value: 2,
          fun: () => {
            // this.$router.push({ path: '/pos/person/stationWork' })
          }
        }, {
          name: '仓库罐区',
          value: 0,
          fun: () => {
            // this.$router.push({ path: '/pos/person/stationWork' })
          }
        }, {
          name: '气体点位',
          value: 1,
          fun: () => {
            // this.$router.push({ path: '/pos/person/stationWork' })
          }
        }, {
          name: '电气点位',
          value: 2,
          fun: () => {
            // this.$router.push({ path: '/pos/person/stationWork' })
          }
        }, {
          name: '消防点位',
          value: 6,
          fun: () => {
            // this.$router.push({ path: '/pos/person/stationWork' })
          }
        }, {
          name: '关键设备',
          value: 0,
          fun: () => {
            // this.$router.push({ path: '/pos/person/stationWork' })
          }
        }]
      }
    },
    created () {
      this.getChartInfo()
    },
    mounted () {
    },
    computed: {},
    watch: {},
    methods: {
      getChartInfo () {
        // 点位分类及告警
        parameter().then(({ data }) => {
          if (data && data.code === 0) {
            this.classificationChartData = data.list.map(r => {
              return {
                name: r.name,
                value: r.num
              }
            })
            this.$nextTick(() => {
              this.$refs.classificationChart.refreshChart(this.classificationChartData)
            })
          } else {
            this.$message.error(data.msg)
          }
        }).catch((err) => {
          console.log(err)
          this.$message.error('未知异常！请联系管理员')
        })
        // 近一周告警
        alarmNearlyWeek().then(({ data }) => {
          if (data && data.code === 0) {
            this.sosChartData = data.list.map(r => {
              return {
                name: r.name,
                value: r.num
              }
            })
            this.$nextTick(() => {
              this.$refs.sosChart.refreshChart(this.sosChartData)
            })
          } else {
            this.$message.error(data.msg)
          }
        }).catch((err) => {
          console.log(err)
          this.$message.error('未知异常！请联系管理员')
        })
      }
    }
  }
</script>

<style lang="scss">
.point-position-container {
  background: rgba(3, 9, 35, 0.14);
  padding: 16px;
  box-shadow:0px 2px 4px 0px rgba(6,12,24,0.4);
  h3{
    font-size:14px;
    font-weight:500;
    margin: 0 0 16px 0;
  }
  .alarm-items{
    .el-col{
      margin-bottom: 27px;
    }
    p{
      text-align: center;
      margin: 0;
      font-size: 12px;
    }
    p:nth-child(1) {
      font-size: 18px;
      margin-bottom: 8px;
    }
  }
}
</style>
