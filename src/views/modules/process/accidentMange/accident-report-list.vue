<!--事故报告-->
<template>
  <div class="emergency-plan-container mod-config">
    <el-form :inline="true" ref="dataForm" class="el-form-margin-bottom" :model="dataForm" @submit.native.prevent @keyup.enter.native="getDataList()">
      <el-form-item label="事故类型" prop="accidentType">
        <el-select v-model="dataForm.accidentType" placeholder="请选择事故类型" clearable size="mini">
          <el-option v-for="item in accidentTypeList" :label="item.value" :value="item.label" :key="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="事故发生单位" prop="deptName">
        <el-popover v-model="deptPopoverVisible" placement="bottom-start" popper-class="high" ref="deptPopover" trigger="click">
          <el-tree :data="deptList" :props="defaultDeptProps" node-key="id" ref="deptTree" @current-change="deptSelectChange" default-expand-all :highlight-current="true" :expand-on-click-node="false"></el-tree>
        </el-popover>
        <el-input v-model="dataForm.deptName" v-popover:deptPopover size="mini" placeholder="请选择所属部门" clearable></el-input>
      </el-form-item>
      <el-form-item label="所属区域" prop="zoneName">
        <el-popover v-model="popoverVisible" popper-class="high" placement="bottom-start" ref="zonePopover" trigger="click">

          <el-tree :data="graphList" :props="defaultProps" node-key="id" ref="zoneTree" @current-change="zoneSelectChange" default-expand-all :highlight-current="true" :expand-on-click-node="false">

          </el-tree>

        </el-popover>
        <el-input v-model="dataForm.zoneName" v-popover:zonePopover size="mini" placeholder="请选择所属区域" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="getDataList()" icon="el-icon-search" v-waves>查询</el-button>
        <el-button type="info" size="mini" @click="resetForm('dataForm')" icon="el-icon-refresh-right" v-waves>重置</el-button>
        <el-button type="warning" size="mini" @click="addOrUpdateHandle()" icon="el-icon-plus" v-waves>新增事故报告</el-button>
        <el-button type="danger" size="mini" @click="deleteHandle()" :disabled="dataListSelections.length <= 0" icon="el-icon-delete" v-waves>批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border @cell-click="cellClick" ref="multipleTable" v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="40">
      </el-table-column>
      <el-table-column type="index" label="序号" width="60" align="center">
      </el-table-column>
      <el-table-column prop="occurrenceTime" :show-overflow-tooltip="true" label="事故时间" width="135">
      </el-table-column>
      <el-table-column prop="reportingTime" :show-overflow-tooltip="true" label="报告时间" width="135">
      </el-table-column>
      <el-table-column prop="analysisMeetingTime" :show-overflow-tooltip="true" label="分析会时间" width="135">
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="事故涉及人" min-width="85">
        <template slot-scope="scope">
          {{handle(scope.row.involveEmployee)}}
        </template>
      </el-table-column>
      <el-table-column prop="jobDescription" :show-overflow-tooltip="true" label="工作描述" min-width="80">
      </el-table-column>
      <el-table-column prop="accidentType" :show-overflow-tooltip="true" label="事故类型" width="80">
        <template slot-scope="scope">{{scope.row.accidentType | matchTye(accidentTypeList)}}</template>

      </el-table-column>
      <el-table-column prop="accidentDescription" :show-overflow-tooltip="true" label="事故描述" min-width="80">
      </el-table-column>
      <el-table-column prop="accidentAnalysis" :show-overflow-tooltip="true" label="事故分析" min-width="80">
      </el-table-column>
      <el-table-column prop="accidentCause" :show-overflow-tooltip="true" label="事故原因" min-width="80">
      </el-table-column>
      <el-table-column prop="accidentHandling" :show-overflow-tooltip="true" label="事故处理" min-width="80">
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.stop="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" style="color:#E63031" @click.stop="deleteHandle(scope.row.id)">删除</el-button>
          <el-button type="text" size="small" @click.stop="returnFile(scope.row.id)">归档</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" background :total="totalPage" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList" @closeDialog="closeDialog"></add-or-update>
  </div>
</template>
<script>
import { accidentReport, accidentReportDelete, accidentReportField } from '@/api/process/accidentMange'
import waves from '@/utils/waves'

import { queryZoneInfo } from '@/api/pos/region'
import { getLabels } from '@/api/common/sys'
import addOrUpdate from './accident-report-add-or-update'
import { departList } from '@/api/sys/depart'
import { treeDataTranslate2 } from '@/utils'
export default {
  directives: {
    waves
  },
  data () {
    return {
      dataForm: {
        accidentType: '', // 事故类型，
        deptName: '', // 部门
        deptId: '',
        zoneName: '',
        zoneId: ''
      },
      // expanded: [],
      // expandedquyu: [],
      popoverVisible: false, // 菜单树是否可见
      deptPopoverVisible: false, // 部门菜单树是否可见
      defaultDeptProps: {
        label: 'deptName',
        children: 'child'
      },
      defaultProps: {
        label: 'zoneName',
        children: 'subregion'
      },
      deptList: [],
      dataList: [],
      graphList: [],
      // 弹框显示
      addOrUpdateVisible: false,
      dataListLoading: false,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListSelections: [], // 多选数据
      accidentTypeList: []
    }
  },
  components: {
    addOrUpdate
  },
  created () {
    this.getAllZoneList()
    this.getDept()
    this.getDataList()
    this.getAccidentType()
  },
  methods: {
    // 处理数据
    handle (val) {
      if (val && val.length > 0) {
        let name = ''
        name = val.map(item => {
          return item.employeeName
        }).join(',')
        return name
      }
    },
    // 回显
    closeDialog () {
      this.addOrUpdateVisible = false
    },
    // 得到事故类型
    getAccidentType () {
      getLabels({
        type: 'ACCIDENT_TYPE'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log('事故类型', data)
          this.accidentTypeList = data.list
        }
      })
    },
    // 当前菜单树选中
    zoneSelectChange (data, node) {
      // 当前节点的数据，对象
      this.dataForm.zoneId = data.id
      this.dataForm.zoneName = data.zoneName
      this.popoverVisible = false
    },
    // 部门菜单树选择
    deptSelectChange (data, node) {
      console.log(data, node)
      this.dataForm.deptName = data.deptName
      this.dataForm.deptId = data.deptCode
      this.deptPopoverVisible = false
    },
    // 查找部门
    getDept () {
      departList().then(({ data }) => {
        if (data && data.code === 0) {
          this.deptList = treeDataTranslate2(data.data[0] || [])
          console.log('xsaxsadcsadc', data.data[0], this.deptList)

          // this.expanded.push(this.deptList[0].id)
          // this.deptList[0].child.map(item => {
          //   this.expanded.push(item.id)
          // })
          // console.log(this.expanded)
        }
      })
    },
    // 获取风险分区列表
    // 获取所有的区域
    getAllZoneList () {
      this.dataListLoading = true
      queryZoneInfo().then(({ data }) => {
        if (data && data.code === 0) {
          console.log('区域', data)
          this.graphList = [data.data] || []
          // this.expandedquyu.push([data.data][0].id)
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
    // 点击一行选中
    cellClick (row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    // 获取表格内容
    getDataList () {
      this.dataListLoading = true
      accidentReport({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'accidentType': this.dataForm.accidentType,
        'deptId': this.dataForm.deptId,
        'zoneId': this.dataForm.zoneId,
        'isFiled': '0'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
          this.totalPage = data.page.count
        } else {
          this.$message.error(data.msg)
        }
        this.dataListLoading = false
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
        this.dataListLoading = false
      })
    },
    // 重置
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.dataForm.zoneId = ''
      this.dataForm.deptId = ''
      this.getDataList()
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      console.log(id)

      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    returnFile (id) {
      this.$confirm('是否确定归档', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        accidentReportField({
          'id': id,
          'isFiled': '1'
        }).then(({ data }) => {
          if (data && data.code === 0) {
            // console.log(data)
            if (data && data.code === 0) {
              this.$message.success('归档成功')
              this.getDataList()
            } else {
              this.$message.error(data.msg)
            }
          }
        })
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
    // 删除
    deleteHandle (id, name) {
      let ids = id
        ? [id]
        : this.dataListSelections.map(item => {
          return item.id
        })
      // let nameArr = name
      //   ? [name]
      //   : this.dataListSelections.map(item => {
      //     return item.name
      //   })
      this.$confirm(`确定进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          accidentReportDelete(ids)
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
    }
  },
  filters: {
    matchTye (val, map) {
      let optionName = ''
      map.map(item => {
        if (val === item.label) {
          optionName = item.value
        }
      })
      return optionName
    }
  }
}
</script>
