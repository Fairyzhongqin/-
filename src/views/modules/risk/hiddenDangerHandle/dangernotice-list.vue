<!--风险管控清单-->
<template>
  <div class="control-list-style mod-config">
    <el-form :inline="true" class="el-form-margin-bottom" ref="dataForm" :model="dataForm">
      <el-form-item label="隐患名称" prop="hiddenDangerName">
        <el-input v-model="dataForm.hiddenDangerName" size="mini" clearable placeholder="请输入隐患名称"></el-input>
      </el-form-item>

      <el-form-item label="隐患地点" prop="zoneName">
        <el-popover v-model="popoverVisible" popper-class="high" placement="bottom-start" ref="zonePopover" trigger="click">
          <el-tree :data="graphList" :props="defaultProps" node-key="id" ref="zoneTree" @current-change="zoneSelectChange" default-expand-all :highlight-current="true" :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.zoneName" v-popover:zonePopover size="mini" placeholder="请选择隐患地点" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="getDataList()" v-waves>
          <i class="el-icon-search"></i>
          查询</el-button>
        <el-button type="info" size="mini" icon="el-icon-refresh-right" @click="resetForm('dataForm')" v-waves>重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border ref="multipleTable" tooltip-effect="dark" @cell-click="cellClick" v-loading="dataListLoading" class="lecTable" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column type="index" width="60" label="序号" header-align="center" align="center"></el-table-column>
      <el-table-column prop="hiddenDangerName" width="100" :show-overflow-tooltip="true" label="隐患名称"></el-table-column>
      <el-table-column prop="zoneName" width="100" :show-overflow-tooltip="true" label="隐患地点">
      </el-table-column>
      <el-table-column prop="hiddenDangerLevel" width="100" :show-overflow-tooltip="true" label="隐患级别" header-align="center" align="center">
        <template slot-scope="scope">
          <el-tag type="danger" v-if="scope.row.hiddenDangerLevel === '2'"> {{scope.row.hiddenDangerLevel | matchType(hiddenDangerLevelList)}}</el-tag>
          <el-tag type="warning" v-if="scope.row.hiddenDangerLevel === '1'"> {{scope.row.hiddenDangerLevel | matchType(hiddenDangerLevelList)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="rectificationType" width="80" :show-overflow-tooltip="true" label="整改方式">
        <template slot-scope="scope">
          {{scope.row.rectificationType | matchType(rectificationTypeList)}}
        </template>
      </el-table-column>
      <el-table-column prop="rectificationDate" width="90" :show-overflow-tooltip="true" label="整改时间">
        <template slot-scope="scope">
          <span>{{scope.row.rectificationDate ? scope.row.rectificationDate.split(' ')[0] : '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="rectificationPeriod" width="90" :show-overflow-tooltip="true" label="整改期限">
        <template slot-scope="scope">
          <span>{{scope.row.rectificationPeriod ? scope.row.rectificationPeriod.split(' ')[0] : '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="rectificationMeasure" min-width="100" :show-overflow-tooltip="true" label="整改措施">

      </el-table-column>
      <el-table-column prop="rectificationCapital" width="70" :show-overflow-tooltip="true" label="整改资金">
      </el-table-column>
      <el-table-column prop="rectificationDepartment" width="80" :show-overflow-tooltip="true" label="整改部门">
      </el-table-column>
      <el-table-column prop="rectificationPerson" width="90" :show-overflow-tooltip="true" label="整改责任人">
      </el-table-column>

      <el-table-column prop="rectificationStatus" width="90" header-align="center" align="center" :show-overflow-tooltip="true" label="整改状态">
        <template slot-scope="scope">
          <el-tag type="danger" v-if="scope.row.rectificationStatus === '1'">未整改</el-tag>
          <el-tag type="info" v-if="scope.row.rectificationStatus === '2'">整改中</el-tag>
          <el-tag type="success" v-if="scope.row.rectificationStatus === '3'">已整改</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="text" @click.stop="addOrUpdateHandle(scope.row.id)" v-if="scope.row.rectificationStatus == '1'">
            整改
          </el-button>
          <el-button type="text" @click.stop="confirm(scope.row.id)" v-if="scope.row.rectificationStatus === '2'">
            完成整改
          </el-button>
          <el-button type="text" @click.stop="view(scope.row.id)" v-if="scope.row.rectificationStatus !== '1'">
            查看已整改
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" background layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>

    <!-- 弹窗, 整改操作 -->
    <dangernotice-add-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList">
    </dangernotice-add-update>
    <!-- 弹窗, 查看操作 -->
    <dangernotice-view v-if="viewViible" ref="viewNoticeRef" @refreshDataList="getDataList">
    </dangernotice-view>
  </div>
</template>
<script>
import { queryZoneInfo } from '@/api/pos/region'
import { hiddenDangerList, hiddenDangerDelete, ignoreDanger, hiddendangerOperate } from '@/api/risk/hiddenDanger'
import waves from '@/utils/waves'
import { getLabels } from '@/api/common/sys.js'
import dangernoticeAddUpdate from './dangernotice-add-update'
import dangernoticeView from './dangernotice-view'

export default {
  directives: {
    waves
  },
  data () {
    return {
      dataForm: {
        zoneCode: '',
        zoneName: '',
        hiddenDangerName: ''
      },
      dataList: [],
      dataListLoading: false,
      viewViible: true,
      addOrUpdateVisible: false, // 弹框显示
      reportAnalysisVisible: false,
      pageSize: 10,
      pageIndex: 1,
      totalPage: 0,
      dataListSelections: [], // 多选数据
      rangeTypeList: [],
      graphList: [], // 所属区域
      dangerSournceList: [],
      defaultProps: {
        label: 'zoneName',
        children: 'subregion'
      },
      popoverVisible: false, // 菜单树是否可见
      hiddenDangerLevelList: [{
        label: '1',
        value: '一般隐患'
      }, {
        label: '2',
        value: '重大隐患'
      }],
      rectificationTypeList: [{
        label: '1',
        value: '立即整改'
      }, {
        label: '2',
        value: '期限整改'
      }, {
        label: '3',
        value: '停业停产整顿'
      }]
    }
  },
  components: {
    dangernoticeAddUpdate,
    dangernoticeView
  },
  activated () {
    this.getDataList()
  },
  created () {
    this.getAllZoneList()
    this.getDataList()
    this.getDangerSource()
  },
  methods: {
    // 字典表查隐患来源
    getDangerSource () {
      getLabels({ type: 'DANGER_SOURCE' }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dangerSournceList = data.list
        }
      })
    },
    // 当前菜单树选中
    zoneSelectChange (data, node) {
      // 当前节点数据，对象
      this.dataForm.zoneCode = data.id
      this.dataForm.zoneName = data.zoneName
      this.popoverVisible = false
    },
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
    ignoreHandle (id) {
      this.$prompt('请输入忽略原因', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        ignoreDanger({ id: id }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message.success('忽略成功')
            this.getDataList()
          } else {
            this.$message.error(data.msg)
          }
        }).catch(err => {
          console.log(err)
          this.$message.error('未知异常！请联系管理员')
          this.dataListLoading = false
        })
      })
    },
    // 获取表格内容
    getDataList () {
      this.dataListLoading = true
      hiddenDangerList({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'hiddenDangerName': this.dataForm.hiddenDangerName,
        'zoneCode': this.dataForm.zoneCode,
        'hiddenDangerStatus': '1'
      }).then(({ data }) => {
        if (data && data.code === 0) {
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
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    confirm (id) {
      this.$confirm('确认整改?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(({ data }) => {
        hiddendangerOperate({
          id: id,
          rectificationStatus: '3'
        }).then(({ data }) => {
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
      })
    },
    // 查看整改
    view (id) {
      this.viewViible = true
      this.$nextTick(() => {
        this.$refs.viewNoticeRef.init(id)
      })
    },
    analysisHandle () {
      this.reportAnalysisVisible = true
      this.$nextTick(() => {
        this.$refs.reportAnalysisRef.init()
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
      this.$confirm(`确定对[隐患名称为=${nameArr.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          hiddenDangerDelete(ids)
            .then(({ data }) => {
              if (data && data.code === 0) {
                console.log(data)
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
    },
    // 重置
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.dataForm.zoneCode = ''
      this.getDataList()
    },
    // 关闭弹框
    closeReport () {
      this.addOrUpdateVisible = false
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
.table-style {
  border-color: #ccc;
  .first-cell {
    height: 50px;
    width: 96px;
    padding-left: 10px;
    background-color: #eef0f7;
    color: #222;
  }
  .second-cell {
    width: 500px;
  }
  .noSpecialStyle {
    .el-textarea__inner {
      color: #ccc !important;
    }
  }
}
.control-list-style {
  .el-table thead.is-group th {
    background: linear-gradient(0deg, #ced1d6, #e4e7ea);
  }
}
</style>
