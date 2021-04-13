<template>
  <el-dialog title="历史记录" :close-on-click-modal="false" width="540px" :visible.sync="visible" class="ls-history-table">
    <p class="title">{{businessName }}</p>
    <el-divider></el-divider>
    <div class="body-bottom">
      <el-scrollbar style="height:100%">
        <el-timeline>

          <el-timeline-item :timestamp="item.updateDate" placement="top" v-for="(item,index) in dataList" :key="item.id" :class="index === 0 ? 'blue-special' : ''">
            <el-card>
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
                <el-col :span="8">
                  <span class="tag-style">S</span>
                  <span>后果严重性：</span>
                  <span>{{item.content ? Math.ceil(item.content.split('/')[1]) : '暂无'}}</span>

                </el-col>
                <el-col :span="8">
                  <span class="tag-style">R</span>
                  <span>风险：</span>
                  <span>{{item.content ? Math.ceil(item.content.split('/')[2]) : '暂无'}}</span>

                </el-col>
              </el-row>

            </el-card>
          </el-timeline-item>

        </el-timeline>
      </el-scrollbar>
    </div>
    <!-- <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
    </span> -->
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
      rangeTypeList: [],
      visible: false,
      businessName: ''
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
          this.dataList = data.page.list
          console.log(this.dataList)
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
.ls-history-table {
  .body-bottom {
    // max-height: calc(60vh - 120px);
    height: 370px;
    // overflow-y: auto;
  }
  .el-dialog {
    max-height: 500px;
  }
  .el-dialog__header {
    padding-bottom: 0;
  }
  .el-dialog__body {
    padding-top: 0px;
    padding-bottom: 18px;
    .el-divider {
      margin: 10px 0;
    }
  }
  .title {
    text-align: center;
    font-size: 15px;
    font-family: PingFang SC;
    font-weight: bold;
    color: rgba(34, 34, 34, 1);
  }
  .el-timeline {
    padding-left: 3px;
    // max-height: 450px;
    .el-card__body {
      padding: 0 !important;
    }
    .el-row {
      margin-bottom: 9px;
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
    }
    .el-timeline-item__timestamp.is-top {
      font-size: 12px;
      color: (34, 34, 34, 1, 0.7);
    }
    .blue-special {
      .el-timeline-item__timestamp.is-top {
        color: #2c78bb;
      }
      .el-timeline-item__node--normal {
        border-color: #2c78bb;
      }
    }
    .el-timeline-item__wrapper {
      padding-left: 15px;
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
</style>
