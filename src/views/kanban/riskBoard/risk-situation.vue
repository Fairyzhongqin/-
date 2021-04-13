<template>
  <div class="billboard-risk-situation-container">
    <el-scrollbar style="width:100%;height:100%;" :native="true" :ref="'elScroll'+index">
      <div style="width:100%;overflow-x:auto;height:100%;">
        <div class="cards flex flex-row" ref="cards">
          <template v-for="(item, index) in itemData">
            <div class="risk-situation-item">
              <div class="item-lef">
                {{item.name}}风险情况
              </div>
              <div class="item-rig">
                <div>
                  <risk-situation-chart :name="'riskSituationEchart' + index"
                                        style="height: 70px;width: 100%;"
                                        :ref="'riskSituationEchart' + index"
                                        type="riskSituationEchart"
                                        :chartData="item"></risk-situation-chart>
                </div>
                <p v-for="itemC in item.list">
                  {{itemC.fxd}}
                  <span :class="getColor(itemC.level)">{{itemC.level | forterColor}}</span>
                </p>
              </div>
            </div>
          </template>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import eventBus from '@/bus/index'
import numCard from './components/numCard'
import NumHorn from './components/NumHorn'
import riskSituationChart from './risk-situation-chart'
import numberGrow from '@/components/NumberGrow'
import { staticData } from '@/api/kanban/souBoard'
import { WheelDirective } from '@/utils/wheelDirective'

export default {
  components: {
    numCard,
    NumHorn,
    numberGrow,
    riskSituationChart
  },
  data () {
    return {
      isShow: false,
      itemData: [
        {
          name: '烷基化区',
          flag: '0',
          bfb: '38',
          list: [
            {fxd: '容器爆炸',
              level: '1'
            },
            {fxd: '中毒和窒息',
              level: '1'
            }, {
              fxd: '触电',
              level: '2'
            },
            {fxd: '火灾',
              level: '2'
            },
            {fxd: '机械伤害',
              level: '3'
            }
          ]
        },
        {
          name: '苯乙烯罐区',
          flag: '1',
          bfb: '47',
          list: [
            {fxd: '容器爆炸',
              level: '1'
            },
            {fxd: '锅炉爆炸',
              level: '1'
            },
            {fxd: '中毒和窒息',
              level: '1'
            },
            {fxd: '起重伤害',
              level: '3'
            },
            {fxd: '机械伤害',
              level: '3'
            },
            {fxd: '物体打击',
              level: '3'
            }
          ]
        },
        {
          name: 'eps生产区',
          flag: '0',
          bfb: '58',
          list: [
            {fxd: '容器爆炸',
              level: '1'
            },
            {fxd: '中毒和窒息',
              level: '1'
            },
            {
              fxd: '触电',
              level: '2'},
            {fxd: '火灾',
              level: '2'
            },
            {fxd: '机械伤害',
              level: '3'
            },
            {fxd: '高处坠落',
              level: '3'
            },
            {fxd: '坍塌',
              level: '4'
            }
          ]
        },
        {
          name: 'eps生产罐区',
          flag: '1',
          bfb: '44',
          list: [
            {fxd: '容器爆炸',
              level: '1'
            },
            {fxd: '中毒和窒息',
              level: '1'
            },
            {
              fxd: '触电',
              level: '2'
            },
            {fxd: '火灾',
              level: '2'
            },
            {fxd: '机械伤害',
              level: '3'
            },
            {fxd: '起重伤害',
              level: '3'
            },
            {fxd: '高处坠落',
              level: '3'
            },
            {fxd: '坍塌',
              level: '4'
            }
          ]
        },
        {
          name: '辅料仓库',
          flag: '1',
          bfb: '29',
          list: [
            {fxd: '容器爆炸',
              level: '1'
            },
            {fxd: '中毒和窒息',
              level: '1'
            },
            {fxd: '其他爆炸',
              level: '2'
            },
            {fxd: '机械伤害',
              level: '3'
            },
            {fxd: '起重伤害',
              level: '3'
            },
            {fxd: '高处坠落',
              level: '3'
            },
            {fxd: '车辆伤害',
              level: '4'
            },
            {fxd: '坍塌',
              level: '4'
            }
          ]
        }
      ]
    }
  },
  created () {
    eventBus.$on('refreshWorkNum', val => {
      this.itemData[1].value = val
    })
    // this.getStaticData()
  },
  updated () {
    this.$nextTick(() => {
      this.$refs['cards'] && this.$refs['cards'].map(r => {
        // eslint-disable-next-line no-new
        new WheelDirective(r.parentElement)
      })
    })
  },
  mounted () { },
  computed: {},
  watch: {},
  methods: {
    getStaticData () {
      staticData().then(({ data }) => {
        if (data && data.code === 0) {
          this.itemData[0].value = data.todayAlarm
          this.itemData[1].value = data.runProcess
          this.itemData[2].value = data.dangerSourceNum
          this.itemData[3].value = data.allProcess
        } else {
          this.$message.error('未知异常！请联系管理员')
          console.log(data.msg)
        }
      }).catch(err => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
      })
    },
    getColor (level) {
      let colorName = ''
      if (level === '1') {
        colorName = 'item-red'
      } else if (level === '2') {
        colorName = 'item-yed'
      } else if (level === '3') {
        colorName = 'item-blue'
      } else if (level === '4') {
        colorName = 'item-ora'
      }
      console.log(colorName)
      return colorName
    }
  },
  filters: {
    forterColor (val, map) {
      let colorName = ''
      if (val === '1') {
        colorName = '红'
      } else if (val === '2') {
        colorName = '黄'
      } else if (val === '3') {
        colorName = '蓝'
      } else if (val === '4') {
        colorName = '橙'
      }
      return colorName
    }
  }
}
</script>

<style lang='scss'>
.billboard-risk-situation-container {
  text-align: center;
  position: relative;
  padding: 12px;
  width: 100%;
  height: calc(50vh - 52px);
  background: rgba(3, 9, 35, 0.14);
  background-image: url('~@/assets/img/bg_little_title.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  overflow-y: auto;
  .el-scrollbar__view {
    height: 100%;
  }
  .cards {
    height: 100%;
    .risk-situation-item {
      position: relative;
      text-align: left;
      width: 252px;
      height: 100%;
      display: inline-block;
      border-right: 1px solid rgba(255, 255, 255, 0.15);
      margin-right: 12px;
      text-align: center;
      > div {
        text-align: center;
        display: inline-block;
      }
      .item-lef {
        position: absolute;
        left: 0;
        width: 20px;
        height: 150px;
        padding-top: 7px;
        font-size: 12px;
        background-image: url('~@/assets/img/riskBoard/risk_board_tit_bg.png');
        background-size: 100% auto;
        background-repeat: no-repeat;
      }
      .item-rig {
        width: 100%;
        padding: 0 12px 0 32px;
        p{
          font-size: 12px;
          span{
            display: inline-block;
            padding: 2px;
            color: #ffffff;
          }
        }
      }
      .item-red{
        background-color: #E63031;
      }
      .item-yed{
        background-color: #F1DD00;
      }
      .item-blue{
        background-color: #00B0F0;
      }
      .item-ora{
        background-color: #F48400;
      }
    }
  }
}
</style>
