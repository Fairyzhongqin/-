<template>
  <el-dialog title="告知卡预览" :visible.sync="visible" width="900px" height="627px" append-to-body>
    <div class="preview">
      <div class="title">
        <div class="content1"><span class="text">风险区名称:</span><span>{{zoneName}}</span></div>
        <div class="content2">
          <span class="text">风险等级:</span>
          <div class="grade-list">

            <span :style="{color:riskLevel === '重大风险' && 'red' || riskLevel === '较大风险' && 'orange' || riskLevel === '一般风险' && 'yellow' || riskLevel === '低风险' && 'blue' }">
              {{riskLevel}}
            </span>
            <span class="grade-cube" :style="{backgroundColor:riskLevel === '重大风险' && 'red' || riskLevel === '较大风险' && 'orange' || riskLevel === '一般风险' && 'yellow' || riskLevel === '低风险' && 'blue'}"></span>
            <span class="grade-cube" :style="{backgroundColor:riskLevel === '重大风险' && 'red' || riskLevel === '较大风险' && 'orange' || riskLevel === '一般风险' && 'yellow' || riskLevel === '低风险' && 'rgba(236, 241, 246, 1)'}"></span>
            <span class="grade-cube" :style="{backgroundColor:riskLevel === '重大风险' && 'red' || riskLevel === '较大风险' && 'orange' || riskLevel === '一般风险' && 'rgba(236, 241, 246, 1)' || riskLevel === '低风险' && 'rgba(236, 241, 246, 1)'}"></span>
            <span class="grade-cube" :style="{backgroundColor:riskLevel === '重大风险' && 'red' || riskLevel === '较大风险' && 'rgba(236, 241, 246, 1)' || riskLevel === '一般风险' && 'rgba(236, 241, 246, 1)' || riskLevel === '低风险' && 'rgba(236, 241, 246, 1)'}"></span>
          </div>
        </div>

      </div>
      <div class="card">
        <table cellspacing="0" cellpadding="0">
          <tr>
            <td>
              <div class="content-title">安全标示</div>
              <div class="content" v-if="factorIcon.length>0">
                <icon-svg v-for="(item, index) in factorIcon" :key="index" :name="item" style="width: 70px;height: 108px"></icon-svg>
              </div>
              <div class="content" v-else>
                暂无
              </div>
            </td>
            <td>
              <div class="card-content">
                <div class="content-title">主要危害（事故）类型</div>
                <div class="content" v-if="dataList.factorMainName">
                  <div v-for="(item,index) in factorMainName" :key="index">
                    <p>{{item}}</p>
                  </div>
                </div>
                <div class="content" v-else>
                  暂无
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="card-content">
                <div class="content-title">主要危害（事故）因素</div>
                <div class="content">
                  {{dataList.factorDanger ? dataList.factorDanger :'暂无'}}
                </div>
              </div>
            </td>
            <td>
              <div class="card-content">
                <div class="content-title">主要风险控制措施</div>
                <div class="content">
                  {{dataList.factorControl ? dataList.factorControl : '暂无'}}
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <div class="card-content">
                <div class="content-title">应急处置措施</div>
                <div class="content">
                  发生事故后，应按照所对应预案以及日常培训要求进行应急处置，立即停止作业并救人，使伤者脱离危害区域，救援人员将伤员移至安全地点进行清洗、包扎、固定等急救，并在事故地点周围设置警示标志；查看伤者受伤情况，如有外伤先止血，包扎伤口；有骨折，先固定；立即报告相关责任人；受伤人员尽快运送到医院救治。
                </div>
              </div>
            </td>
          </tr>
        </table>

      </div>
      <div class="responsible-content">
        <div class="content1"><span class="text">责任部门:</span><span>{{dataList.deptName ? dataList.deptName : '暂无'}}</span></div>
        <div class="content2"><span class="text">责任人:</span><span>{{dataList.employeeName ? dataList.employeeName : '暂无'}}</span></div>
        <div class="content3"><span class="text">联系电话:</span><span>18546253201</span></div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { shouldknowInfo } from '@/api/risk/card.js'
import { getLabels } from '@/api/common/sys.js'

export default {
  data () {
    return {
      visible: false,
      data: 230,
      dataList: {},
      factorMainName: [],
      factorIcon: [],
      riskList: [],
      riskLevel: '',
      businessName: '',
      zoneName: ''
    }
  },
  created () {
  },
  methods: {
    // 在字典表里查询事故发生的可能性
    async initGetLabelRisk () {
      await getLabels({
        type: 'risk_level'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.riskList = data.list
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    async init (info) {
      this.factorIcon = []
      this.visible = true
      await this.initGetLabelRisk()
      this.riskLevel = this.riskMatch(info.riskLevel)
      this.zoneName = info.zoneName

      shouldknowInfo({
        zoneCode: info.code
      }).then(({ data }) => {
        if (data && data.code === 0) {
          if (data.data) {
            console.log(data.data)
            this.dataList = data.data

            this.handleFactorMainName(this.dataList.factorMainName)
            this.handleFactorIcon(this.dataList.factorIcon)
          } else {
            // this.$message.error('暂无数据')
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handleFactorMainName (val) {
      if (val) {
        this.$nextTick(() => {
          this.factorMainName = val.split(';').map((item, index) => {
            item = (index + 1) + '.' + item
            return item
          })
        })
      }
    },
    handleFactorIcon (val) {
      if (val) {
        // 此种方法才有用
        val.split(';').map(item => {
          if (item !== '') {
            if (this.factorIcon.indexOf(item) === -1) {
              this.factorIcon.push(item)
            }
          }
        })
        // 此种明明做了判断还是不行
        // this.factorIcon = val.split(';').map(item => {
        //   if (item === '123') {
        //     return item
        //   }
        // })
      }
      console.log(this.factorIcon)
    },
    riskMatch (val) {
      let riskName = ''
      this.riskList.map(value => {
        if (val === value.label) {
          riskName = value.value
        }
      })
      return riskName
    }
  }
}
</script>

<style lang="scss">
.preview {
  font-size: 12px;
  color: #222222;
  .title {
    display: flex;
    justify-content: space-between;
    line-height: 28px;
    .content1 {
      margin-left: 9px;
    }
    .content2 {
      margin-left: 200px;
      .grade-list {
        display: inline-block;
        vertical-align: top;
        .grade-cube {
          display: inline-block;
          vertical-align: middle;
          width: 24px;
          height: 12px;
          background-color: #ecf1f6;
          margin-left: 6px;
        }
        .selectcube {
          background-color: #f1dd00;
        }
      }
    }
    .content3 {
      margin-left: 43px;
    }
    .text {
      color: #222222;
      font-size: 12px;
      font-family: PingFang SC;
      font-weight: 500;
      opacity: 0.7;
      margin-right: 8px;
    }
  }

  .card {
    table {
      border: 1px solid #dcdfe6;
      border-collapse: collapse;
      tr {
        td {
          width: 50%;
          vertical-align: top;
          border: 1px solid #dcdfe6;
          .content-title {
            vertical-align: top;
            height: 28px;
            background-color: #eef0f7;
            padding-left: 11px;
            padding-top: 8px;
            font-size: 12px;
            font-family: PingFang SC;
            font-weight: 500;
          }
          .content {
            font-size: 12px;
            font-family: PingFang SC;
            font-weight: 500;
            line-height: 20px;
            padding: 10px 12px 20px 12px;
          }
          .svgContent {
            text-align: center;
          }
        }
      }
    }
  }
  .responsible-content {
    margin-top: 10px;
    display: flex;
    .content1 {
      flex: 1;
    }
    .content2 {
      flex: 1;
    }
    .content3 {
      flex: 1;
    }
  }
}
</style>
