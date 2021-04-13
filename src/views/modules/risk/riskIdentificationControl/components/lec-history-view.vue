<template>
  <el-dialog title="历史记录" :close-on-click-modal="false" width="540px" :visible.sync="visible" class="lec-history-table">
    <p class="title">{{businessName}}</p>
    <el-divider></el-divider>
    <div class="timeline-content">
      <el-scrollbar style="height:100%">

        <el-timeline>
          <el-timeline-item :timestamp="item.updateDate" placement="top" v-for="(item,index) in dataList" :key="item.id" :class="index === 0 ? 'blue-special' : ''">
            <el-row>
              <el-col v-if="item.riskDegree === 'A'">
                <span class="red-style"></span>
                <span class="red-style"></span>
                <span class="red-style"></span>
                <span class="red-style"></span>
                <span>A/1级 极其危险</span>
              </el-col>
              <el-col v-if="item.riskDegree === 'B'">
                <span class="orange-style"></span>
                <span class="orange-style"></span>
                <span class="orange-style"></span>
                <span class="white-style"></span>
                <span>B/2级 高度危险</span>
              </el-col>
              <el-col v-if="item.riskDegree === 'C'">
                <span class="yellow-style"></span>
                <span class="yellow-style"></span>
                <span class="white-style"></span>
                <span class="white-style"></span>
                <span> C/3级 显著危险</span>
              </el-col>
              <el-col v-if="item.riskDegree === 'D'">
                <span class="blue-style"></span>
                <span class="white-style"></span>
                <span class="white-style"></span>
                <span class="white-style"></span>
                <span> D/4级 轻度危险</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">

                <span class="tag-style">L</span>
                <span>事故可能性：</span>
                <span>{{item.content ? Math.ceil(item.content.split('/')[0]) : '暂无'}}</span>
              </el-col>
              <el-col :span="12">
                <span class="tag-style">E</span>
                <span>暴露于危险环境的频繁程度:</span>
                <span>{{item.content ? Math.ceil(item.content.split('/')[1]) : '暂无'}}</span>

              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <span class="tag-style">C</span>
                <span>后果严重性:</span>
                <span>{{item.content ? Math.ceil(item.content.split('/')[2]) : '暂无'}}</span>

              </el-col>
              <el-col :span="12">
                <span class="tag-style">D</span>
                <span>风险值：</span>
                <span>{{item.content ? Math.ceil(item.content.split('/')[3]) : '暂无'}}</span>

              </el-col>
            </el-row>

          </el-timeline-item>
        </el-timeline>
      </el-scrollbar>
    </div>
  </el-dialog>
</template>
<script>
import { identificationList } from '@/api/risk/inventory'
import { getLabels } from '@/api/common/sys'
export default {
  data () {
    return {
      dataListLoading: true,
      dataList: [],
      businessName: '',
      rangeTypeList: [],
      visible: false
    }
  },
  created () {
    this.getRiskPoinType()
  },
  methods: {

    init (id) {
      identificationList({ id }).then(({ data }) => {
        if (data && data.code === 0) {
          this.visible = true
          this.dataListLoading = false
          console.log(data)
          this.dataList = data.page.list
          this.businessName = this.dataList[0].businessName
        }
      })
    },
    // 从字典表获取风险点类型
    getRiskPoinType () {
      getLabels({
        type: 'RANGE_TYPE'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log('lec', data.list)
          this.rangeTypeList = data.list
        }
      })
    }
  },
  filters: {
    matchType (type, value) {
      let typeName = ''
      value.map(item => {
        if (item.label === type) {
          typeName = item.value
        }
      })
      return typeName
    }
  }
}
</script>
<style lang="scss">
.lec-history-table {
  .el-dialog {
    height: 500px;
    .el-dialog__body {
      padding-top: 0px !important;
      padding-bottom: 18px;
      .el-divider--horizontal {
        margin: 16px 0;
      }
      .title {
        margin: 0;
        text-align: center;
        font-size: 15px;
        font-family: PingFang SC;
        font-weight: bold;
        color: rgba(34, 34, 34, 1);
      }
      .timeline-content {
        height: 370px;
        .el-timeline {
          padding-left: 3px;
          .el-timeline-item__wrapper {
            padding-left: 15px;
          }
          .blue-special {
            .el-timeline-item__timestamp.is-top {
              color: #2c78bb;
            }
            .el-timeline-item__node--normal {
              border-color: #2c78bb;
            }
          }
          .el-timeline-item__node--normal {
            width: 7px;
            height: 7px;
            background: rgba(255, 255, 255, 1);
            border: 1px solid rgba(220, 223, 230, 1);
            border-radius: 50%;
          }
          .el-timeline-item__tail {
            position: absolute;
            left: 2px;
            height: 100%;
            display: block;
            border-left: 1px solid #e4e7ed;
          }
          .el-row {
            margin: 7px;
            .tag-style {
              display: inline-block;
              width: 20px;
              height: 20px;
              font-weight: bold;
              color: rgba(44, 120, 187, 1);
              text-align: center;
              background: rgba(44, 120, 187, 0.1);
              border: 1px solid rgba(44, 120, 187, 0.5);
              border-radius: 4px;
            }
            .red-style,
            .orange-style,
            .white-style,
            .yellow-style,
            .blue-style {
              display: inline-block;
              width: 24px;
              height: 12px;
              margin-right: 6px;
              background: rgba(230, 48, 49, 1);
            }
            .orange-style {
              background-color: #f48400;
            }
            .white-style {
              background: rgba(236, 241, 246, 1);
            }
            .yellow-style {
              background-color: #f1dd00;
            }
            .blue-style {
              background-color: #00b0f0;
            }
          }
        }
      }
    }
  }
}
</style>
