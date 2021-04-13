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
        <el-button type="primary" size="mini" @click="addOrUpdateHandle()" v-waves>
          <i class="el-icon-bell"></i>
          上报隐患</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border ref="multipleTable" tooltip-effect="dark" @cell-click="cellClick" v-loading="dataListLoading" class="lecTable" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column type="index" width="60" label="序号" header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="hiddenDangerName" width="120" :show-overflow-tooltip="true" label="隐患名称">
      </el-table-column>
      <el-table-column prop="zoneName" width="120" :show-overflow-tooltip="true" label="隐患地点">
      </el-table-column>
      <el-table-column width="90" :show-overflow-tooltip="true" label="现场图片">
        <template slot-scope="scope">
          <span v-if="scope.row.beforePictureId" @click="showImageDetail(scope.row.id, 'beforePictureId')" style="color:#5693c9">现场图片</span>
          <span v-else>暂无图片</span>
        </template>
      </el-table-column>
      <el-table-column prop="hiddenDangerSource" width="110" :show-overflow-tooltip="true" label="隐患来源">
        <template slot-scope="scope">
          <span>{{
            scope.row.hiddenDangerSource | matchType(dangerSournceList)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="hiddenDangerDescribe" min-width="120" :show-overflow-tooltip="true" label="隐患描述">
      </el-table-column>
      <el-table-column width="100" :show-overflow-tooltip="true" label="上报人">
        <template slot-scope="scope">
          {{scope.row.reportPerson ? scope.row.reportPerson : '-'}}
        </template>
      </el-table-column>
      <el-table-column prop="reportDate" width="110" :show-overflow-tooltip="true" label="上报时间">
        <template slot-scope="scope">
          {{scope.row.createBy.createDate ? scope.row.createBy.createDate.split(' ')[0] : '-'}}
        </template>
      </el-table-column>
      <el-table-column width="100" :show-overflow-tooltip="true" label="隐患状态" prop="hiddenDangerStatus" header-align="center" align="center">
        <template slot-scope="scope">
          <el-tag type="danger" v-if="scope.row.hiddenDangerStatus === '0'">未分析</el-tag>
          <el-tag type="success" v-if="scope.row.hiddenDangerStatus === '1'">已分析</el-tag>
          <el-tag type="info" v-if="scope.row.hiddenDangerStatus === '2'">已忽略</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="text" @click.stop="analysisHandle(scope.row.id)" :disabled="scope.row.hiddenDangerStatus !== '0'">
            隐患分析
          </el-button>
          <el-button type="text" @click.stop="ignoreHandle(scope.row.id)" :disabled="scope.row.hiddenDangerStatus !== '0'">
            忽略
          </el-button>
          <el-button type="text" @click.stop="addOrUpdateHandle(scope.row.id)" :disabled="scope.row.hiddenDangerStatus !== '0'">
            修改
          </el-button>
          <el-button type="text" @click.stop="deleteHandle(scope.row.id, scope.row.hiddenDangerName)" :style="{
              color: scope.row.hiddenDangerStatus !== '0' ? '' : '#E63031'
            }" :disabled="scope.row.hiddenDangerStatus !== '0'">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" background layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>

    <!-- 弹窗, 隐患上报操作 -->
    <report-add-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList" @closeReport="closeReport">
    </report-add-update>
    <!-- 隐患分析 -->
    <report-analysis v-if="reportAnalysisVisible" ref="reportAnalysisRef" @refreshDataList="getDataList"></report-analysis>
    <!-- 图片细节 -->
    <image-detail v-if="imageDetailVisile" ref="imageDetailRef" @closeImg="closeImg"></image-detail>
  </div>
</template>
<script>
import { queryZoneInfo } from '@/api/pos/region'
import {
  hiddenDangerList,
  hiddenDangerDelete,
  ignoreDanger
} from '@/api/risk/hiddenDanger'
import reportAnalysis from './report-analysis'
import reportAddUpdate from './report-add-update'
import waves from '@/utils/waves'
import { getLabels } from '@/api/common/sys.js'
import imageDetail from './components/image-detail'
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
      addOrUpdateVisible: false, // 弹框显示
      reportAnalysisVisible: false,
      imageDetailVisile: false, // 图片细节
      pageSize: 10,
      pageIndex: 1,
      totalPage: 0,
      dataListSelections: [], // 多选数据
      graphList: [], // 所属区域
      dangerSournceList: [],
      defaultProps: {
        label: 'zoneName',
        children: 'subregion'
      },
      popoverVisible: false // 菜单树是否可见
    }
  },
  components: {
    reportAddUpdate,
    reportAnalysis,
    imageDetail
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
    // 关闭图片回显
    closeImg () {
      this.imageDetailVisile = false
    },
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
      queryZoneInfo()
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.graphList = [data.data] || []
          } else {
            this.graphList = []
          }
          this.dataListLoading = false
        })
        .catch(err => {
          console.log(err)
          this.$message.error('未知异常！请联系管理员')
          this.dataListLoading = false
        })
    },
    ignoreHandle (id) {
      this.$confirm('是否确认忽略?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ignoreDanger({ id: id, hiddenDangerStatus: '3' })
          .then(({ data }) => {
            if (data && data.code === 0) {
              this.$message.success('忽略成功')
              this.getDataList()
            } else {
              this.$message.error(data.msg)
            }
          })
          .catch(err => {
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
        page: this.pageIndex,
        limit: this.pageSize,
        hiddenDangerName: this.dataForm.hiddenDangerName,
        zoneCode: this.dataForm.zoneCode
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.dataListLoading = false
            this.dataList = data.page.list
            this.totalPage = data.page.count
          }
        })
        .catch(err => {
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
    // 展示图片
    showImageDetail (id, type) {
      this.imageDetailVisile = true
      this.$nextTick(() => {
        this.$refs.imageDetailRef.init(id, type)
      })
    },
    analysisHandle (id) {
      this.reportAnalysisVisible = true
      this.$nextTick(() => {
        this.$refs.reportAnalysisRef.init(id)
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
      this.$confirm(
        `确定对[隐患名称为=${nameArr.join(',')}]进行[${
        id ? '删除' : '批量删除'
        }]操作?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
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
