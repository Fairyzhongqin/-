<template xmlns="">
  <div class='facility-container mod-config'>
    <el-form :inline="true" :model="dataForm" ref="dataForm">
      <el-form-item label="风险点名称" prop="businessName">
        <el-input v-model="dataForm.businessName" size="mini" placeholder="请输入风险点名称" clearable>
        </el-input>
      </el-form-item>
      <el-form-item label="风险点类型" prop="type">
        <el-select v-model="dataForm.type" clearable size="mini" placeholder="请选择风险点类型">
          <el-option v-for="item in rangeTypeList" :key="item.label" :label="item.value" :value="item.label">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属区域" prop="zoneName">
        <el-popover v-model="popoverVisible" popper-class="high" placement="bottom-start" ref="zonePopover" trigger="click">

          <el-tree :data="graphList" :props="defaultProps" node-key="id" ref="zoneTree" @current-change="zoneSelectChange" default-expand-all :highlight-current="true" :expand-on-click-node="false">

          </el-tree>

        </el-popover>
        <el-input v-model="dataForm.zoneName" v-popover:zonePopover size="mini" placeholder="请选择所属区域" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="getDataList" icon="el-icon-search" v-waves>
          查询</el-button>
        <el-button type="info" size="mini" icon="el-icon-refresh-right" v-waves @click="
                   resetForm('dataForm')">重置</el-button>

      </el-form-item>
    </el-form>
    <el-table :data="dataList" border ref="multipleTable" @cell-click="cellClick" v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;" :cell-class-name="addClass">

      <el-table-column type="index" width="60" label="序号" header-align="center" align="center"></el-table-column>
      <el-table-column prop="businessName" :show-overflow-tooltip="true" label="风险点名称" width="110">
      </el-table-column>
      <el-table-column prop="rangeType" :show-overflow-tooltip="true" label="风险点类型" min-width="140">
        <template slot-scope="scope">{{scope.row.rangeType | matchType(rangeTypeList)}}</template>
      </el-table-column>
      <el-table-column prop="zoneName" label="所属区域" :show-overflow-tooltip="true" width="130">
      </el-table-column>
      <el-table-column label="风险类型" :show-overflow-tooltip="true" min-width="120">
        <template slot-scope="scope">
          <span>{{handle(scope.row.factorList)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="辨识状态" :show-overflow-tooltip="true" prop="status" width="80" header-align="center" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.evaluateStatus === '1'" type="success"> 已辨识</el-tag>
          <el-tag v-else type="danger">未辨识</el-tag>

        </template>
      </el-table-column>
      <el-table-column label="辨识日期" prop="evaluateDate" width="135">
      </el-table-column>
      <el-table-column label="辨识人" prop="appraiser" width="90" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="复评日期" width="100" prop="nextEvaluateDate">
        <template slot-scope="scope">
          {{scope.row.nextEvaluateDate ? scope.row.nextEvaluateDate.split(' ')[0] : '-'}}
          <el-tooltip v-if="(scope.row.warningStatus === '1' )" class="item" effect="dark" content=" 请尽快复评" placement="top-end">
            <i class="el-icon-info"></i>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="text" @click.stop="addOrUpdateHandle(scope.row)" :disabled="scope.row.evaluateStatus !== '1'">
            复评
          </el-button>
          <el-button type="text" @click.stop="addOrUpdateHandle(scope.row)" :disabled="scope.row.evaluateStatus === '1'">
            辨识
          </el-button>

        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    <identificate-operation v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></identificate-operation>

  </div>
</template>

<script>
import waves from '@/utils/waves'
import identificateOperation from './evaluation-identificate-operation'
import { getLabels } from '@/api/common/sys'
import { queryZoneInfo } from '@/api/pos/region'
import { facilitiesList, facilitiesDelete } from '@/api/risk/analysis'
export default {
  directives: {
    waves
  },
  data () {
    return {
      riskZoneList: [], // 所有的风险分区
      dataForm: {
        businessName: '',
        zoneName: '',
        type: ''// 风险分区
      },
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
      rangeTypeList: [] // 风险点类型
    }
  },
  created () {
    this.getDataList() // 获取数据列表
    // this.getBaseData()// 获取字典表里的基础数据
    this.getRiskPoinType()
    this.getAllZoneList()
    // this.getgraphList()
  },
  mounted () { },
  // activated () {
  //   this.getDataList() // 获取数据列表
  // },
  components: {
    identificateOperation
  },
  methods: {
    // 获取所有的区域
    getAllZoneList () {
      this.dataListLoading = true
      queryZoneInfo().then(({ data }) => {
        if (data && data.code === 0) {
          this.graphList = [data.data] || []
        } else {
          this.graphList = []
        }
        this.dataListLoading = false
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
        this.dataListLoading = false
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
      facilitiesList({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'businessName': this.dataForm.businessName,
        'rangeType': this.dataForm.type,
        'zoneCode': this.dataForm.zoneCode,
        'entryStatus': '1'
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
    addOrUpdateHandle (info) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(info)
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
      this.$confirm(`确定对[风险因素名称为=${nameArr.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          facilitiesDelete(ids)
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
