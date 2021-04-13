
<template>
  <div class="fileback-list-style mod-config">
    <el-form :inline="true" class="el-form-margin-bottom" ref="dataForm" :model="dataForm">
      <el-form-item label="隐患名称" prop="hiddenDangerName">
        <el-input v-model="dataForm.hiddenDangerName" size="mini" clearable placeholder="请输入隐患名称"></el-input>
      </el-form-item>

      <el-form-item label="所属区域" prop="zoneName">
        <el-popover v-model="popoverVisible" popper-class="high" placement="bottom-start" ref="zonePopover" trigger="click">
          <el-tree :data="graphList" :props="defaultProps" node-key="id" ref="zoneTree" @current-change="zoneSelectChange" default-expand-all :highlight-current="true" :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.zoneName" v-popover:zonePopover size="mini" placeholder="请选择所属区域" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="getDataList()" v-waves>
          <i class="el-icon-search"></i>
          查询</el-button>
        <el-button type="info" size="mini" icon="el-icon-refresh-right" @click="resetForm('dataForm')" v-waves>重置</el-button>
        <el-button type="info" size="mini" icon="el-icon-refresh-right" @click="addOrUpdateHandle('dataForm')" v-waves>上报隐患</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border ref="multipleTable" tooltip-effect="dark" @cell-click="cellClick" v-loading="dataListLoading" class="lecTable" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column type="index" width="60" label="序号" header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="hiddenDangerName" :show-overflow-tooltip="true" label="隐患名称">
      </el-table-column>
      <el-table-column prop="zoneName" :show-overflow-tooltip="true" label="隐患地点">
      </el-table-column>
      <el-table-column prop="hiddenDangerLevel" :show-overflow-tooltip="true" label="隐患级别" width="100" header-align="center" align="center">
        <template slot-scope="scope">
          <el-tag type="danger" v-if="scope.row.hiddenDangerLevel === '2'"> {{scope.row.hiddenDangerLevel | matchType(hiddenDangerLevelList)}}</el-tag>
          <el-tag type="warning" v-if="scope.row.hiddenDangerLevel === '1'"> {{scope.row.hiddenDangerLevel | matchType(hiddenDangerLevelList)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="reportPerson" width="100" :show-overflow-tooltip="true" label="上报人">

      </el-table-column>
      <el-table-column prop="reportDate" width="110" :show-overflow-tooltip="true" label="上报时间">
        <template slot-scope="scope">
          {{scope.row.createBy.createDate ? scope.row.createBy.createDate.split(' ')[0] : '-'}}
        </template>
      </el-table-column>
      <el-table-column prop="reportDate" width="100" :show-overflow-tooltip="true" label="现场情况">
        <template slot-scope="scope">
          <span v-if="scope.row.beforePictureId" @click="showImageDetail(scope.row.id, 'beforePictureId')" style="color:#5693c9">现场图片</span>
          <span v-else>暂无图片</span>
        </template>
      </el-table-column>
      <el-table-column label="验收情况" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.afterPictureId" @click="showImageDetail(scope.row.id, 'afterPictureId')" style="color:#5693c9">验收图片</span>
          <span v-else>暂无图片</span>
        </template>
      </el-table-column>
      <el-table-column label="隐患的治理情况" header-align="center" align="center" width="120">
        <template slot-scope="scope">
          <el-popover placement="bottom" width="400" trigger="hover" popper-class="popover-imgstyle">
            <div>
              <el-row>
                <el-col :span="12"><span class="title">整改责任部门: </span>{{scope.row.rectificationDepartment ? scope.row.rectificationDepartment : '暂无'}}</el-col>
                <el-col :span="12"><span class="title">整改责任人: </span>{{scope.row.rectificationPerson  ? scope.row.rectificationPerson : '暂无'}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="12"><span class="title">整改期限:</span>{{scope.row.rectificationPeriod ? scope.row.rectificationPeriod.split(' ')[0] : '暂无'}}</el-col>
                <el-col :span="12"><span class="title">整改资金:</span>{{scope.row.rectificationCapital ? scope.row.rectificationCapital : '暂无'}}</el-col>
              </el-row>
              <el-row>
                <el-col><span class="title">整改措施:</span>{{scope.row.rectificationMeasure ? scope.row.rectificationMeasure : '暂无'}}</el-col>
              </el-row>
            </div>

            <span slot="reference" style="color:#5693c9">查看详情</span>
          </el-popover>

        </template>
      </el-table-column>
      <el-table-column label="隐患的验收情况" width="120" header-align="center" align="center">
        <template slot-scope="scope">
          <el-popover placement="bottom" width="400" trigger="hover" popper-class="popover-imgstyle">
            <div>
              <el-row>
                <el-col :span="12"><span class="title">验收部门: </span>{{scope.row.checkUnit ? scope.row.checkUnit : '暂无'}}</el-col>
                <el-col :span="12"><span class="title">验收人: </span>{{scope.row.checkPerson ? scope.row.checkPerson : '暂无'}}</el-col>
              </el-row>
              <el-row>
                <el-col><span class="title">验收人意见:</span>{{scope.row.checkPersonOpinion ? scope.row.checkPersonOpinion : '暂无'}}</el-col>
              </el-row>
              <el-row>
                <el-col><span class="title">验收时间：</span>{{scope.row.checkDate ? scope.row.checkDate.split(' ')[0] : '暂无'}}</el-col>
              </el-row>
            </div>

            <span slot="reference" style="color:#5693c9">查看详情</span>
          </el-popover>

        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" background layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <image-detail v-if="imageDetailVisile" ref="imageDetailRef" @closeImg="closeImg"></image-detail>

    <!-- 弹窗, 管控操作 -->
    <dangerreport-add-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList">
    </dangerreport-add-update>
  </div>
</template>
<script>
import { queryZoneInfo } from '@/api/pos/region'

import { hiddenDangerList } from '@/api/risk/hiddenDanger'
import imageDetail from './components/image-detail'

import dangerreportAddUpdate from './report-add-update'
import waves from '@/utils/waves'
import { getLabels } from '@/api/common/sys.js'
export default {
  directives: {
    waves
  },
  data () {
    return {
      activeName: 'first',
      riskZoneList: [], // 所有的风险分区
      dataForm: {
        hiddenDangerName: '', // 风险分区，
        zoneCode: '',
        zoneName: ''
      },
      dataList: [],
      dataListLoading: false,
      addOrUpdateVisible: false, // 弹框显示
      pageSize: 10,
      pageIndex: 1,
      totalPage: 0,
      dataListSelections: [], // 多选数据
      rangeTypeList: [],
      imageDetailVisile: false,
      hiddenDangerLevelList: [
        { label: '1', value: '一般隐患' },
        { label: '2', value: '重大隐患' }
      ],
      graphList: [], // 所属区域
      defaultProps: {
        label: 'zoneName',
        children: 'subregion'
      },
      popoverVisible: false // 菜单树是否可见
    }
  },
  components: {
    dangerreportAddUpdate,
    imageDetail
  },
  activated () {
    this.getDataList()
  },
  created () {
    this.getAllZoneList()
    this.getRiskPoinType()
  },
  methods: {
    // 关闭图片回显
    closeImg () {
      this.imageDetailVisile = false
    },
    // 展示图片
    showImageDetail (id, type) {
      this.imageDetailVisile = true
      this.$nextTick(() => {
        this.$refs.imageDetailRef.init(id, type)
      })
    },
    // 当前菜单树选中
    zoneSelectChange (data, node) {
      // 当前节点数据，对象
      this.dataForm.zoneCode = data.id
      this.dataForm.zoneName = data.zoneName
      this.popoverVisible = false
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
          item = index + 1 + '.' + item
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
      hiddenDangerList({
        page: this.pageIndex,
        limit: this.pageSize,
        hiddenDangerName: this.dataForm.hiddenDangerName,
        zoneCode: this.dataForm.zoneCode,
        checkStatus: '1 '
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
    addOrUpdateHandle (tableInfo, type) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(tableInfo, type)
      })
    },
    // deleteHandle (id, name) {
    //   let ids = id
    //     ? [id]
    //     : this.dataListSelections.map(item => {
    //       return item.id
    //     })
    //   let nameArr = name
    //     ? [name]
    //     : this.dataListSelections.map(item => {
    //       return item.name
    //     })
    //   this.$confirm(`确定对[风险类型为=${nameArr.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   })
    //     .then(() => {
    //       factorDelete(ids)
    //         .then(({ data }) => {
    //           if (data && data.code === 0) {
    //             console.log(data)
    //             this.getDataList()
    //             this.$message({
    //               message: '操作成功',
    //               type: 'success',
    //               duration: 1500,
    //               onClose: () => { }
    //             })
    //           } else {
    //             this.$message.error(data.msg)
    //           }
    //         })
    //         .catch(err => {
    //           console.log(err)
    //           this.$message.error('未知异常！请联系管理员')
    //         })
    //     })
    //     .catch(() => { })
    // },
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
.popover-imgstyle {
  background: #000;
  color: #fff;
  line-height: 1.7;
  opacity: 0.7;
  .popper__arrow::after {
    border-bottom-color: #000 !important;
    border-top-color: #000 !important;
  }
}
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
.fileback-list-style {
  .el-table thead.is-group th {
    background: linear-gradient(0deg, #ced1d6, #e4e7ea);
  }
  .popover-style {
    .el-row {
      height: 30px;
    }
    .title {
      background-color: #eef0f7;
    }
  }
}
</style>
