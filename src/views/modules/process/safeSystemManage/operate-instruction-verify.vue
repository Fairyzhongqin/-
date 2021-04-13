<template xmlns="">
  <div class='facility-container mod-config'>
    <el-form :inline="true" :model="dataForm" ref="dataForm">
      <el-form-item label="岗位名称" prop="sysStationName">
        <el-select v-model="dataForm.sysStationName" clearable size="mini" placeholder="请选择状态">
          <el-option v-for="item in stationList" :key="item.id" :label="item.stationName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="操作规程状态" prop="state">
        <el-select v-model="dataForm.state" clearable size="mini" placeholder="请选择状态">
          <el-option v-for="item in stateList" :key="item.label" :label="item.value" :value="item.label">
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" size="mini" @click="getDataList" icon="el-icon-search" v-waves>
          查询</el-button>
        <el-button type="info" size="mini" icon="el-icon-refresh-right" v-waves @click="
                   resetForm('dataForm')">重置</el-button>

      </el-form-item>
    </el-form>
    <el-table :data="dataList" border ref="multipleTable" @cell-click="cellClick" v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;" :cell-class-name="addClass">

      <el-table-column type="index" width="60" label="序号" header-align="center" align="center"></el-table-column>
      <el-table-column prop="sysStationName" :show-overflow-tooltip="true" label="岗位名称">
      </el-table-column>
      <el-table-column label="规程状态" :show-overflow-tooltip="true" prop="stateName" header-align="center" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.stateName === '编制'" type="info"> 编制</el-tag>
          <el-tag v-if="scope.row.stateName === '待审核'" type="warning">待审核</el-tag>
          <el-tag v-if="scope.row.stateName === '审核通过'" type="success">审核通过 </el-tag>
          <el-tag v-if="scope.row.stateName === '审核不通过'" type="danger">审核不通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="submitPerson" label="提交人" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="submitDate" label="提交时间" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="auditPerson" label="审核人" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="auditDate" label="审核时间" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="opinion" label="审核意见" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="submitDate" label="操作规程" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-popover placement="bottom" width="400" trigger="click">
            <div style="max-height:400px;overflow:auto;font-size:14px">{{scope.row.content}}</div>
            <a slot="reference" @click.prevent>查看操作规程</a>
          </el-popover>
        </template>
      </el-table-column>

      <!-- <el-table-column label="复评日期" width="100" prop="nextEvaluateDate">
        <template slot-scope="scope">
          {{scope.row.nextEvaluateDate ? scope.row.nextEvaluateDate.split(' ')[0] : '-'}}
          <el-tooltip v-if="(scope.row.warningStatus === '1' )" class="item" effect="dark" content=" 请尽快复评" placement="top-end">
            <i class="el-icon-info"></i>
          </el-tooltip>
        </template>
      </el-table-column> -->

      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="text" @click.stop="addOrUpdateHandle(scope.row.id)">
            审核
          </el-button>

        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    <operate-verify-add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></operate-verify-add-or-update>

  </div>
</template>

<script>
import waves from '@/utils/waves'
// import identificateOperation from './evaluation-identificate-operation'
import { getLabels } from '@/api/common/sys'
// eslint-disable-next-line no-unused-vars
import { queryZoneInfo } from '@/api/pos/region'
// eslint-disable-next-line no-unused-vars
import { facilitiesList, facilitiesDelete } from '@/api/risk/analysis'
import { operateList, operateListDelete, operateSub } from '@/api/process/safeSystemManage'
import { stationList } from '@/api/sys/station'
// import operateInstructionAddOrUpdate from './operate-instruction-add-or-update'
import operateVerifyAddOrUpdate from './operate-verify-add-or-update'
export default {
  directives: {
    waves
  },
  data () {
    return {
      riskZoneList: [], // 所有的风险分区
      dataForm: {
        state: '',
        sysStationName: ''
      },
      stateList: [],
      popoverVisible: false, // 菜单树是否可见
      defaultProps: {
        label: 'zoneName',
        children: 'subregion'
      },
      graphList: [],
      riskTypeList: [], // 风险分区数据
      dataList: [], // 列表数据
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      rangeTypeList: [], // 风险点类型
      stationList: []
    }
  },
  created () {
    this.getDataList() // 获取数据列表
    // this.getBaseData()// 获取字典表里的基础数据
    this.getRiskPoinType()
    this.getAllstationList()
    this.getState()
    // this.getgraphList()
  },
  mounted () { },
  activated () {
    this.getDataList() // 获取数据列表
  },
  components: {
    operateVerifyAddOrUpdate
  },
  methods: {
    // 从字典表获取规程状态类型
    getState () {
      getLabels({
        type: 'PROCEDURES_TYPE'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.stateList = data.list
        }
      })
    },
    // 规程提交
    handleSub (id) {
      this.$confirm('是否确认提交?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        operateSub({ id: id }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
          }
        })
      })
    },
    // 获取所有的岗位
    getAllstationList () {
      stationList().then(({ data }) => {
        if (data && data.code === 0) {
          if (data.page.list !== null) {
            this.stationList = data.page.list
          }
          console.log(this.stationList)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
      })
    },
    // 当前菜单树选中
    zoneSelectChange (data, node) {
      // 当前节点的数据，对象
      this.dataForm.zoneCode = data.id
      this.dataForm.zoneName = data.zoneName
      this.popoverVisible = false
    },
    // 给单元格添加颜色
    addClass ({ row, column, rowIndex, columnIndex }) {
      // return 'red-style'
      if (columnIndex === 8) {
        if (row.warningStatus === '1') {
          return 'red-style'
        }
      }
    },
    // 处理数据
    handle (val) {
      if (val.length > 0) {
        let factorMainNameList = []
        val.map(item => {
          if (factorMainNameList.indexOf(item.factorMainName) === -1) {
            factorMainNameList.push(item.factorMainName)
          }
        })
        return factorMainNameList.join(',')
      } else {
        return '暂无'
      }
    },
    handleDanger (val) {
      if (val.length > 0) {
        let factorDangerList = []
        val.map(item => {
          if (factorDangerList.indexOf(item.factorDangerList) === -1) {
            factorDangerList.push(item.factorDanger)
          }
        })
        factorDangerList = factorDangerList.map((item, index) => {
          item = (index + 1) + '.' + item
          return item
        })
        return factorDangerList.join(';')
      } else {
        return '暂无'
      }
    },
    // 点击一行选中
    cellClick (row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    // 从字典表获取风险点类型
    getRiskPoinType () {
      getLabels({
        type: 'RANGE_TYPE'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.rangeTypeList = data.list
        }
      })
    },

    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      operateList({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'sysStationName': this.dataForm.sysStationName,
        'pageSource': 'audit'
        // 'state': ('1' || '2' || '3')
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
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    deleteHandle (id, name) {
      let ids = id
        ? [id]
        : this.dataListSelections.map(item => {
          return item.id
        })
      let nameArr = name
        ? [name]
        : this.dataListSelections.map(item => {
          return item.name
        })
      this.$confirm(`确定对[岗位名称为=${nameArr.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          operateListDelete(ids)
            .then(({ data }) => {
              if (data && data.code === 0) {
                this.getDataList()
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => { }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
            .catch(err => {
              console.log(err)
              this.$message.error('未知异常！请联系管理员')
            })
        })
        .catch(() => { })
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
      this.dataForm.zoneCode = ''
      this.getDataList()
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
.facility-container {
  .el-scrollbar__wrap {
    height: 200px;
  }
  .red-style {
    /*background-color: #e63031;*/
    color: #e63031;
  }
}
</style>
