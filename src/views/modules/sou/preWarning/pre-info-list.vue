 <!-- 预警信息 -->
<template>
  <div class="station-work mod-config">
    <el-form :inline="true" ref='dataForm' :model="dataForm" @submit.native.prevent @keyup.enter.native="getDataList()">
      <el-form-item label="预警状态" prop="alarmStatus">
        <el-select v-model="dataForm.alarmStatus" placeholder="请选择" size="mini">
          <el-option v-for="item in alarmStatus" :key="item.label" :label="item.value" :value="item.label">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="getDataList()" v-waves>
          <i class="
                   el-icon-search"></i>
          查询</el-button>
        <el-button type="info" size="mini" icon="el-icon-refresh-right" @click="
                   resetForm('dataForm')" v-waves>重置</el-button>
        <!-- <el-button type="danger"
                   size="mini"
                   icon="el-icon-delete"
                   :disabled="dataListSelections.length<=0"
                   @click="deleteHandle()"
                   v-waves>批量处理</el-button> -->
      </el-form-item>

    </el-form>
    <!-- 巡管任务列表 -->
    <el-table :data="dataList" border v-loading='dataListLoading' ref="multipleTable"  @cell-click="cellClick" @selection-change="handleSelectionChange" style="width: 100%;">
      <el-table-column type="selection" width="40">
      </el-table-column>

      <el-table-column type="index" label="序号" width="62">
      </el-table-column>
      <el-table-column label="预警信息" prop="alarmInfo" min-width="200">
        <template slot-scope="scope">
          <span class="typebg">{{scope.row.alarmInfo}}</span>
        </template>
      </el-table-column>
      <el-table-column label="仪表位号" prop="code">

      </el-table-column>
      <el-table-column label="状态" prop="alarmStatus">
        <template slot-scope="scope">
          <el-tag size="mini" style="color:#fff" :color="statusColorList[scope.row.alarmStatus]">{{scope.row.alarmStatus | formatType(alarmStatus)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="预警时间" prop="createDate">

      </el-table-column>
      <el-table-column min-width="180" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.stop="handleDetail()">
            查看详情
          </el-button>
          <el-button v-if="scope.row.alarmStatus==='0'" type="text" size="small" @click.stop="handleAlarm(scope.row)">
            处理
          </el-button>
          <el-button v-if="scope.row.alarmStatus==='0'" type="text" size="small" @click.stop="ignoreAlarm(scope.row)">
            忽略
          </el-button>
        </template>

      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" background layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpate" @refreshData="getStationWorkList"></add-or-update>
  </div>
</template>
<script>
import { preWarningInfoList, handleOrIngore } from '@/api/sou/preWarning'
import waves from '@/utils/waves'
import { getLabels } from '@/api/common/sys'
export default {
  directives: {
    waves
  },
  components: {
  },
  data () {
    return {
      dataForm: {
        alarmStatus: ''
      },
      tableInfo: [],
      dataList: [],
      dataListSelections: [], // 多选的数据
      addOrUpdateVisible: false, // 信息页的显示
      dataListLoading: false,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      alarmStatus: [], // 预警状态
      statusColorList: ['#e63031', '#67c23a', '#909399']
    }
  },
  created () {
    this.getDataList()
    this.getBaseData() // 加载基础数据
  },
  methods: {
    handleSelectionChange (val) {
      this.tableInfo = val
      let ids = val.map(item => {
        return item.id
      })
      console.log(ids)
    },
    // 点击一行选中
    cellClick (row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      preWarningInfoList({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'alarmStatus': this.dataForm.alarmStatus
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
          this.totalPage = data.page.count
          console.log(data)
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
      this.$http({
        url: this.$http.adornUrl('/spring-sysweb/sys/dict/list'),
        method: 'get',
        params: this.$http.adornParams({
          'type': 'WISDOM_PATROL_STATUS'
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.optionsType = data.page.list
          // console.log(this.optionsType)
        }
      })
    },
    // 加载基础数据
    getBaseData () {
      // 预警状态
      getLabels({
        'type': 'alarm_status'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.alarmStatus = data.list
          console.log(this.alarmStatus)
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 处理预警信息
    handleAlarm (info) {
      this.$prompt('处理结果', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '请输入处理结果'
      }).then((value) => {
        console.log(value)
        handleOrIngore({
          id: info.id,
          alarmStatus: '1',
          remarks: value.value
        }).then(({ data }) => {
          if (data && data.code === 0) {
            // console.log('data')
            this.$message.success('操作成功')
            this.getDataList()
          } else {
            this.$message.error('未知异常!请联系管理员')
          }
        })
      })
    },
    // 忽略预警信息
    ignoreAlarm (info) {
      this.$confirm(`确定对[仪表位号=${info.code}]进行忽略？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        handleOrIngore({
          id: info.id,
          alarmStatus: '2'
        }).then(({ data }) => {
          if (data && data.code === 0) {
            // console.log('data')
            this.$message.success('操作成功')
            this.getDataList()
          } else {
            this.$message.error('未知异常!请联系管理员')
          }
        })
      })
    },
    // 新增或修改预警信息
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
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
    // 重置
    resetForm (formName) {
      // this.dataForm.name = ''
      this.$refs[formName].resetFields()
      this.getDataList()
    }
  },
  filters: {
    formatType (value, map) {
      let optionName = ''
      map.map((val) => {
        if (value === val.label) {
          optionName = val.value
        }
      })
      return optionName
    }
  }
}
</script>
<style lang="scss">
.station-work {
  .enable {
    color: #e63031;
  }
  .typebg {
    background-color: #2d334ed4;
    color: #fff;
    padding: 4px 5px;
    border-radius: 3px;
  }
}
</style>
