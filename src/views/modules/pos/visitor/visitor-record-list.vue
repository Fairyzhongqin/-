<!--访客记录-->
<template>
  <div class="visitorRecord mod-config">
    <el-form :inline="true" ref="dataForm" :model="dataForm" class="el-form-margin-bottom" @keyup.enter.native="getDataList()">
      <el-form-item label="访客证件号/姓名" prop="conditions">
        <el-input v-model.trim="dataForm.conditions" size="mini" clearable placeholder="请输入访客证件号/姓名"></el-input>
      </el-form-item>
      <el-form-item label="日期范围" prop="dataRange">
        <el-date-picker v-model="dataForm.dataRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" clearable>
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="getDataList()" v-waves>
          <i class="el-icon-search"></i>
          查询</el-button>
        <el-button type="info" size="mini" icon="el-icon-refresh-right" @click="
                   resetForm('dataForm')" v-waves>重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">

      <!-- <el-table-column type="selection"
                       width="40"></el-table-column> -->
      <el-table-column type="index" label="序号" width="62">
      </el-table-column>
      <!-- <el-table-column prop="id"
                       :show-overflow-tooltip="true"
                       label="记录id"></el-table-column> -->
      <el-table-column prop="name" width="150" label="访客姓名" align="center">
      </el-table-column>
      <el-table-column prop="visitorId" width="200" :show-overflow-tooltip="true" label=访客证件号>
      </el-table-column>
      <el-table-column prop="alermNum" label="触发报警次数" width="200" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.alermNum || 0}}</span>
          <el-popover placement="bottom" trigger="click" popper-class="popoverStyle" @show="getalearInfo(scope.row.visitDate,scope.row.visitorId)">
            <el-table :data="alermInfo" v-loading="dataListLoading" width="30%" max-height="500" class="alermTable" :header-cell-style="{background:'#000',color:'#fff'}" :row-style="{background:'#000',color:'#fff'}">
              <el-table-column property="type" label="报警类型">
                <template slot-scope="scope">
                  <span v-if="scope.row.type === '0'">超员报警</span>
                  <span v-else-if="scope.row.type === '1'">缺员报警</span>
                  <span v-else>SOS报警</span>
                </template>
              </el-table-column>
              <el-table-column property="alermTime" min-width="150" :show-overflow-tooltip="true" label="触发报警时间"></el-table-column>
              <el-table-column property="replyInfo" min-width="100" :show-overflow-tooltip="true" label="报警处理结果"></el-table-column>
              <el-table-column property="status" min-width="100" :show-overflow-tooltip="true" label="报警处理状态">
                <template slot-scope="scope">
                  <span v-if="scope.row.status === '0'">报警中</span>
                  <span v-else>已处理</span>
                </template></el-table-column>
            </el-table>

            <i class="el-icon-warning alermicon" slot="reference" v-if="scope.row.alermNum"></i>

          </el-popover>

        </template>
      </el-table-column>
      <el-table-column prop="visitDate" label="来访时间" :show-overflow-tooltip="true" min-width="92"></el-table-column>
      <el-table-column prop="leaveDate" label="离开时间" :show-overflow-tooltip="true" min-width="92"></el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" background :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 访客详情记录 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>

  </div>

</template>

<script>
// eslint-disable-next-line no-unused-vars
import { visitorRecord, alearInfomation } from '@/api/pos/person'
import AddOrUpdate from './visitors-add-or-update'
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
        id: '', // 访客证件号
        conditions: '', // 访客姓名
        status: '', // 访客状态
        dataRange: []// 日期范围
      },
      statusList: [{
        value: '0',
        label: '离开'
      }, {
        value: '1',
        label: '未离开'
      }],
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
  components: { AddOrUpdate },
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
      var endTime
      var startTime
      // console.log(this.dataForm.dataRange)

      if (this.dataForm.dataRange && this.dataForm.dataRange.length > 0) {
        endTime = new Date(this.dataForm.dataRange[1]).Format('yyyy-MM-dd')
        startTime = this.dataForm.dataRange[0] = new Date(this.dataForm.dataRange[0]).Format('yyyy-MM-dd')
      } else {
        endTime = null
        startTime = null
      }
      visitorRecord({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'conditions': this.dataForm.conditions,
        'endTime': endTime,
        'startTime': startTime
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
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
    // 获取报警具体信息
    getalearInfo (visitDate, visitorId) {
      this.dataListLoading = true
      alearInfomation({
        'dateString': new Date(visitDate).Format('yyyy-MM-dd'),
        'gh': visitorId
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.alermInfo = data.list
          console.log(data.list)
        } else {
          this.alermInfo = []
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
.popoverStyle[x-placement^='top'] .popper__arrow::after {
  border-top-color: #151414;
}
.popoverStyle[x-placement^='bottom'] .popper__arrow::after {
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
