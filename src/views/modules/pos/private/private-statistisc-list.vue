<!--访客记录-->
<template>
  <div class="visitorRecord mod-config">
    <el-form :inline="true"
             ref="dataForm"
             :model="dataForm"
             class="el-form-margin-bottom"
             @keyup.enter.native="getDataList()">
      <el-form-item label="作业申请单位"
                    prop="applyCompany">
        <el-input v-model.trim="dataForm.applyCompany"
                  size="mini"
                  clearable
                  placeholder="请输入作业申请单位"></el-input>
      </el-form-item>
      <el-form-item label="日期范围"
                    prop="dataRange">
        <el-date-picker v-model="dataForm.dataRange"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        clearable>
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   size="mini"
                   @click="getDataList()"
                   v-waves>
          <i class="el-icon-search"></i>
          查询</el-button>
        <el-button type="info"
                   size="mini"
                   icon="el-icon-refresh-right"
                   @click="
                   resetForm('dataForm')"
                   v-waves>重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList"
              border
              v-loading="dataListLoading"
              @selection-change="selectionChangeHandle"
              style="width: 100%;">

      <!-- <el-table-column type="selection"
                       width="40"></el-table-column> -->
      <!-- <el-table-column type="index"
                       label="序号"
                       width="62">
      </el-table-column> -->
      <el-table-column type="index"
                       width="60"
                       align="center"
                       :show-overflow-tooltip="true"
                       label="序号"></el-table-column>
      <el-table-column prop="operationCompany"
                       :show-overflow-tooltip="true"
                       label="作业单位">
      </el-table-column>
      <el-table-column prop="operationPlace"
                       :show-overflow-tooltip="true"
                       label=作业地点>
      </el-table-column>
      <el-table-column prop="operationApplicant"
                       label="申请人"
                       width="120">
      </el-table-column>
      <el-table-column prop="count"
                       label="违规次数"
                       width="150"
                       :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span v-if="scope.row.count">{{Number(scope.row.count).toFixed(0)}} 次</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="operationState"
                       label="状态"
                       :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.operationState === '0'"
                  size="small"> 已完成</el-tag>
          <el-tag v-else
                  size="small"
                  type="danger"> 未完成</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="beginTime"
                       label="作业开始时间"
                       :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="endTime"
                       label="作业结束时间"
                       :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="hour"
                       label="作业时长"
                       :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{Number(scope.row.hour).toFixed(1)}} h</span>
        </template>
      </el-table-column>

    </el-table>
    <el-pagination @size-change="sizeChangeHandle"
                   @current-change="currentChangeHandle"
                   :current-page="pageIndex"
                   :page-sizes="[10, 20, 50, 100]"
                   :page-size="pageSize"
                   background
                   :total="totalPage"
                   layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>

  </div>

</template>

<script>
import { privateStatic } from '@/api/pos/security'
import waves from '@/utils/waves'

// eslint-disable-next-line no-unused-vars
import { Format } from '@/utils/validate'

export default {
  directives: {
    waves
  },
  data () {
    return {
      dataForm: {
        applyCompany: '',

        dataRange: '' // 日期范围
      },

      typeList: [],
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      alermInfo: []// 报警具体信息

    }
  },
  components: {},
  activated () {
    this.getDataList() // 获取数据列表
    // this.getalearInfo()
  },
  methods: {
    // 展示地图
    showMap () {
      this.$message.info('程序猿正在建设。。。')
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      privateStatic({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'applyCompany': this.dataForm.applyCompany,
        'endTime': this.dataForm.dataRange[1] ? new Date(this.dataForm.dataRange[1]).Format('yyyy-MM-dd') : null,
        'startTime': this.dataForm.dataRange[0] ? new Date(this.dataForm.dataRange[0]).Format('yyyy-MM-dd') : null
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
          console.log(data.page.list)

          this.totalPage = data.page.count
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
        this.dataListLoading = false
      })
    },

    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 重置
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.getDataList()
    },
    // 查看详细信息
    addOrUpdateHandle () {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init()
      })
    }
    // 警信息弹框

  }
}
</script>
<style lang="scss">
.popoverStyle {
  background: #000 !important;
}
.popoverStyle[x-placement^="top"] .popper__arrow::after {
  border-top-color: #151414;
}
.popoverStyle[x-placement^="bottom"] .popper__arrow::after {
  border-bottom-color: #151414;
}
.alermTable {
  td {
    border-bottom: 1px solid transparent;
  }
  .el-table__body tr:hover > td {
    background-color: #ccc !important;
  }
}
</style>
<style lang="scss" scoped>
.visitorRecord {
  .alermicon {
    padding-left: 10px;
    color: red;
  }
  /deep/ .el-range-editor--medium.el-input__inner {
    height: 28px;
    // margin-top: 5px;
  }
  /deep/ .el-date-editor .el-range-separator {
    padding: 0px 0px;
  }

  /deep/ .el-range-editor.el-input__inner {
    padding: 0px 10px;
  }
}
</style>
