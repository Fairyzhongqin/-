<template>
  <div class="mod-config">
    <el-table :data="dataList" border ref="multipleTable" tooltip-effect="dark" @cell-click="cellClick" v-loading="dataListLoading" class="lecTable" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column type="index" width="60" label="序号" header-align="center" align="center">

      </el-table-column>
      <el-table-column prop="businessName" :show-overflow-tooltip="true" label="风险点名称" width="100">
      </el-table-column>
      <el-table-column prop="rangeType" width="120" :show-overflow-tooltip="true" label="风险点类型">
        <template slot-scope="scope">{{scope.row.rangeType | matchType(rangeTypeList)}}</template>
      </el-table-column>
      <el-table-column prop="zoneName" width="120" :show-overflow-tooltip="true" label="所属区域">
      </el-table-column>
      <el-table-column width="130" :show-overflow-tooltip="true" label="可能发生的风险类型" prop="probableType">
        <template slot-scope="scope">
          <span>{{handle(scope.row.factorList)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="mainFactor" width="200" :show-overflow-tooltip="true" label="主要风险危害因素">
        <template slot-scope="scope">{{handleDanger(scope.row.factorList) }}</template>
      </el-table-column>
      <el-table-column label="MES风险评价" header-align="center">
        <el-table-column header-align="center" label="M" width="45" align="center">
          <template slot-scope="scope">
            {{scope.row.content ? Math.ceil(scope.row.content.split('/')[0]): '暂无'}}</template>
        </el-table-column>
        <el-table-column header-align="center" label="E" width="45" align="center">
          <template slot-scope="scope">
            {{scope.row.content ? Math.ceil(scope.row.content.split('/')[1]) : '暂无'}}</template>
        </el-table-column>
        <el-table-column header-align="center" label="S" width="45" align="center">
          <template slot-scope="scope">
            {{scope.row.content ? Math.ceil(scope.row.content.split('/')[2]): '暂无'}}</template>
        </el-table-column>
        <el-table-column header-align="center" label="R" width="45" align="center">
          <template slot-scope="scope">
            {{scope.row.content ? Math.ceil(scope.row.content.split('/')[3]) : '暂无'}}</template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="riskDegree" width="100" header-align="center" align="center" :show-overflow-tooltip="true" label="固有风险等级">

        <template slot-scope="scope">
          <el-tag size="small" style="color:#fff" color="#E63031" v-if="scope.row.riskDegree === 'A'">{{scope.row.riskDegree}}</el-tag>
          <el-tag size="small" style="color:#fff" color="#E6A23C" v-if="scope.row.riskDegree === 'B'">{{scope.row.riskDegree}}</el-tag>
          <el-tag size="small" style="color:#fff" color="#E9ED06" v-if="scope.row.riskDegree === 'C'">{{scope.row.riskDegree}}</el-tag>
          <el-tag size="small" style="color:#fff" color="#2C78BB" v-if="scope.row.riskDegree === 'D'">{{scope.row.riskDegree}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="辨识日期" prop="evaluateDate" width="135">
      </el-table-column>
      <el-table-column label="辨识人" prop="appraiser" width="80" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click.stop="addOrUpdateHandle(scope.row.id,'LEC')">
            历史查看
          </el-button>
        </template>
      </el-table-column>

    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" background layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>

    <!-- 弹窗, 历史查看 -->
    <mes-history-view v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList">
    </mes-history-view>
  </div>
</template>
<script>
import { getLabels } from '@/api/common/sys'
import mesHistoryView from './mes-history-view'
import { facilitiesList } from '@/api/risk/analysis'

export default {
  data () {
    return {
      colorIndex: '0',
      dataList: [],
      rangeTypeList: [],
      dataListLoading: false,
      pageSize: 10,
      pageIndex: 1,
      totalPage: 0,
      addOrUpdateVisible: false, // 弹框显示
      degreeColor: ['#E63031', '#E6A23C', '#2C78BB', '#E6D23C']
    }
  },
  components: {
    // indentificationLecOperation
    mesHistoryView
  },
  props: {
    queryConditions: {
      type: Object
    }
  },
  created () {
    this.getDataList()
    this.getRiskPoinType()
  },
  methods: {
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
    },
    //  :cell-class-name="addClass"
    //   addClass ({ row, column, rowIndex, columnIndex }) {
    //     if (columnIndex === 11) {
    //       if (row.riskDegree === 'A') {
    //         return 'red-grey'
    //       } else if (row.riskDegree === 'B') {
    //         return 'blue-grey'
    //       } else if (row.riskDegree === 'C') {
    //         return 'yellow-gery'
    //       }
    //     }
    //   },

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
    // 获取表格内容
    getDataList () {
      this.dataListLoading = true
      facilitiesList({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'businessName': this.queryConditions.businessName,
        'zoneCode': this.queryConditions.zoneCode,
        'evaluationType': '3', // lec是1
        'status': '1',
        'sortName': '1',
        'evaluateStatus': '1'

      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log('===================', data.page.list)
          this.dataListLoading = false
          this.dataList = data.page.list
          this.totalPage = data.page.count
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
        this.dataListLoading = false
      })
    },
    cellClass ({ row, column, rowIndex, columnIndex }) {
      console.log({ row, column, rowIndex, columnIndex })
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 点击一行选中
    cellClick (row) {
      this.$refs.multipleTable.toggleRowSelection(row)
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
.identification {
  .el-tabs,
  .el-tabs__content {
    height: calc(100% - 40px);
  }
  .el-tab-pane {
    height: 100%;
  }
  .lecTable {
  }
  .el-table {
    height: calc(100% - 56px);
    overflow: auto;
  }
  .el-table thead.is-group th {
    background: linear-gradient(0deg, #ced1d6, #e4e7ea);
  }

  // .red-grey {
  //   background-color: red;
  // }
  // .blue-grey {
  //   background-color: blue;
  // }
  // .yellow-gery {
  //   background-color: yellow;
  // }
}
</style>
