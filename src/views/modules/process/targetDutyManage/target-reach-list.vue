<!-- 目标达标统计-->
<template>
  <div class='target-reach-list-container mod-config'>
    <el-form :inline="true" :model="dataForm" ref="dataForm">
      <el-form-item label="统计单位（年/月）">
        <!-- <el-select v-model="isYearMonth" placeholder="请选择年/月" @change="handleChange">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select> -->
        <el-radio-group v-model="isYearMonth" @change="handleChange">
          <el-radio :label="'0'">年</el-radio>
          <el-radio :label="'1'" class="month">月</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label='年度' prop='year' v-if="isYearMonth==='0'">
        <el-date-picker v-model="dataForm.year" type="year" placeholder="请选择" value-format="yyyy" clearble @clear="yearClose()"> </el-date-picker>
      </el-form-item>
      <el-form-item label='月度' prop='monthly' v-if="isYearMonth==='1'">
        <el-date-picker v-model="dataForm.monthly" type="month" placeholder="请选择" value-format="yyyy-MM" clearble @clear="monthClose()"> </el-date-picker>
      </el-form-item>
      <el-form-item label="部门名称" prop="deptCode" v-if="this.isCompany==='1'">
        <el-popover v-model="popoverVisible" ref="departPopover" placement="bottom-start" trigger="click" popper-class="high">
          <el-tree :data="departList" :props="defaultProps" node-key="id" ref="departListTree" :default-expanded-keys="[]" @current-change="departListTreeCurrentChangeHandle" default-expand-all :highlight-current="true" :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.deptName" v-popover:departPopover :readonly="true" size="mini" class="select-depart" placeholder="请选择" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="getDataList" icon="el-icon-search" v-waves>查询</el-button>
        <el-button type="info" size="mini" icon="el-icon-refresh-right" v-waves @click="resetForm('dataForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <el-tabs v-model="isCompany" type="card" @tab-click="handleClick" class="tabs">
      <el-tab-pane label="企业级" name="0">
        <el-table :data="dataList" border ref="multipleTable" row-key="id" v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
          <el-table-column type="index" width="60" label="序号" header-align="center" align="center"></el-table-column>
          <el-table-column prop="deptName" width="250" :show-overflow-tooltip="true" label="企业名称">
            <template slot-scope="scope">
              {{scope.row.deptName|| '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="yearly" width="250" :show-overflow-tooltip="true" label="年度">
          </el-table-column>
          <el-table-column prop="monthly" width="250" :show-overflow-tooltip="true" label="月度">
            <template slot-scope="scope">
              {{scope.row.monthly || '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="complete" :show-overflow-tooltip="true" label="达标数" align="center">
          </el-table-column>
          <el-table-column prop="incomplete" :show-overflow-tooltip="true" label="未达标数" align="center">
          </el-table-column>
          <el-table-column prop="reachRate" :show-overflow-tooltip="true" label="达标率" align="center">
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="操作" align="center">
            <template slot-scope="scope">
              <el-button v-if="scope.row.deptCode!==null" type="text" size="small" @click.stop="showDetail(scope.row)">详情</el-button>
              <span v-if="scope.row.deptCode===null">-</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </el-tab-pane>
      <el-tab-pane label="部门级" name="1">
        <el-table :data="dataList" border ref="multipleTable" row-key="id" v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
          <el-table-column type="index" width="60" label="序号" header-align="center" align="center"></el-table-column>
          <el-table-column prop="deptName" width="250" :show-overflow-tooltip="true" label="部门名称">
            <template slot-scope="scope">
              {{scope.row.deptName|| '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="yearly" width="250" :show-overflow-tooltip="true" label="年度">
          </el-table-column>
          <el-table-column prop="monthly" width="250" :show-overflow-tooltip="true" label="月度">
            <template slot-scope="scope">
              {{scope.row.monthly || '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="complete" :show-overflow-tooltip="true" label="达标数" align="center">
          </el-table-column>
          <el-table-column prop="incomplete" :show-overflow-tooltip="true" label="未达标数" align="center">
          </el-table-column>
          <el-table-column prop="reachRate" :show-overflow-tooltip="true" label="达标率" align="center">
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="操作" align="center">
            <template slot-scope="scope">
              <el-button v-if="scope.row.deptCode!==null" type="text" size="small" @click.stop="showDetail(scope.row)">详情</el-button>
              <span v-if="scope.row.deptCode===null">-</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </el-tab-pane>
    </el-tabs>
    <!-- <el-table :data="dataList" border ref="multipleTable" row-key="id" v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column type="index" width="60" label="序号" header-align="center" align="center"></el-table-column>
      <el-table-column prop="deptName" width="250" :show-overflow-tooltip="true" :label="isCompany==='0'?'企业名称':'部门名称'">
        <template slot-scope="scope">
          {{scope.row.deptName|| '-'}}
        </template>
      </el-table-column>
      <el-table-column prop="yearly" width="250" :show-overflow-tooltip="true" label="年度">
      </el-table-column>
      <el-table-column prop="monthly" width="250" :show-overflow-tooltip="true" label="月度">
        <template slot-scope="scope">
          {{scope.row.monthly || '-'}}
        </template>
      </el-table-column>
      <el-table-column prop="complete" :show-overflow-tooltip="true" label="达标数" align="center">
      </el-table-column>
      <el-table-column prop="incomplete" :show-overflow-tooltip="true" label="未达标数" align="center">
      </el-table-column>
      <el-table-column prop="reachRate" :show-overflow-tooltip="true" label="达标率" align="center">
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="操作" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.deptCode!==null" type="text" size="small" @click.stop="showDetail(scope.row)">详情</el-button>
          <span v-if="scope.row.deptCode===null">-</span>
        </template>
      </el-table-column>
    </el-table> -->
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    <!-- 查看详情弹出框 -->
    <reach-detail v-if="reachDetailVisible" ref="reachDetail"></reach-detail>
  </div>
</template>

<script>
import reachDetail from './target-reach-detail'

// eslint-disable-next-line no-unused-vars
import { targetReaching } from '@/api/process/targetDuty'
import { departList } from '@/api/sys/depart'
export default {
  components: {
    reachDetail
  },
  data () {
    return {
      dataForm: {
        monthly: '', // 月度
        year: '',
        deptCode: null
      },
      isCompany: '0',
      isYearMonth: '0',
      options: [{
        value: '0',
        label: '年度'
      }, {
        value: '1',
        label: '月度'
      }],
      dataList: [], // 数据列表
      departList: [],
      defaultProps: {
        label: 'deptName',
        children: 'child'
      }, // 树形结构展示
      popoverVisible: false,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      reachDetailVisible: false
    }
  },
  created () {
    this.getDataList() // 获取数据列表
    this.getDepartList()// 获取部门树
  },
  methods: {
    // 获取达标统计
    getDataList () {
      this.dataListLoading = true
      targetReaching({
        'monthly': this.dataForm.monthly || this.dataForm.year,
        'deptCode': this.dataForm.deptCode
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log(data, '达标数据统计')
          this.dataList = data.list
          this.dataList.map(item => {
            item.reachRate = Math.round(item.complete / (Number(item.complete) + Number(item.incomplete)) * 10000) / 100 + '%'
          })
          this.totalPage = data.list.length
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
    // 获取部门树
    getDepartList () {
      this.dataListLoading = true
      departList()
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.departList = [data.data[0]] || []
            this.dataListLoading = false
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error('未知异常！请联系管理员')
        })
    },
    // 显示详情
    showDetail (row) {
      this.reachDetailVisible = true
      this.$nextTick(() => {
        this.$refs.reachDetail.init(row)
      })
    },
    // 切换面板
    handleClick () {
      // console.log(val, 11111)
      if (this.isCompany === '0') {
        this.dataForm.deptCode = null
      } else if (this.isCompany === '1') {
        this.dataForm.deptCode = ''
      }
      this.getDataList()
    },
    // 控制显示月份还是选择年份的框
    // handlleYearMonth () {

    // },
    // 组织部门菜单树选中
    departListTreeCurrentChangeHandle (data, node) {
      // 当前节点的数据，对象
      this.dataForm.deptCode = data.deptCode
      this.dataForm.deptName = data.deptName
      this.popoverVisible = false
    },
    // 清除年份处理函数
    yearClose () {
      this.dataForm.year = ''
      this.getDataList()
    },
    // 清除月份处理函数
    monthClose () {
      this.dataForm.monthly = ''
      this.getDataList()
    },
    // 处理月份
    handleChange () {
      if (this.isYearMonth === '1') {
        this.dataForm.year = ''
      } else {
        this.dataForm.monthly = ''
      }
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
      // this.dataForm.deptCode = null
      this.dataForm.deptName = ''
      // this.isCompany = '0'
      this.isYearMonth = '0'
      if (this.isCompany === '1') {
        this.deptCode = ''
      }
      this.getDataList()
    }
  }
}
</script>

<style lang="scss">
.target-reach-list-container {
  .tabs {
    height: calc(100% - 50px);
    .el-tabs__content {
      height: 100%;
      .el-tab-pane {
        height: 100%;
      }
    }
  }
  .el-radio {
    margin-right: 15px;
    .el-radio__label {
      padding-left: 7px;
    }
  }
  .month {
    margin-right: 0;
  }
  .el-input--medium .el-input__icon {
    line-height: 28px;
  }
  .el-table__expanded-cell {
    padding: 0 !important;
  }
  .el-table tbody tr:hover > td.el-table__expanded-cell {
    background-color: transparent !important;
  }
  .el-table {
    .el-table__expanded-cell {
      .el-table {
        .el-table__body-wrapper {
          border-left: 1px solid #ebeef5;
        }
      }
    }
  }
  .subTable {
    padding-left: 39px;
    display: flex;
    justify-content: space-between;
  }
  // .el-table__expand-icon > .el-icon {
  //   position: absolute;
  //   left: 50%;
  //   top: 50%;
  //   margin-left: -5px;
  //   margin-top: -5px;
  //   display: inline-block;
  //   width: 15px;
  //   height: 15px;
  //   /* text-align: center; */
  //   line-height: 14px;
  //   border: 1px solid #ddd;
  //   border-radius: 50%;
  // }
  .sub-content {
    display: flex;
    height: 34px;
    justify-content: space-between;
    position: relative;
    .vertical {
      position: absolute;
      top: 0;
      left: 39px;
      width: 1px;
      height: 33px;
      background: #dcdfe6;
    }
    .horizon {
      position: absolute;
      top: 16px;
      left: 39px;
      width: 13px;
      height: 1px;
      background: #dcdfe6;
    }
    &:hover {
      // background-color: red;
    }
    .index-style {
      margin: 0;
      width: 100px;
      padding-left: 60px;
      line-height: 34px;
      color: rgba(34, 34, 34, 1);
      opacity: 0.5;
      border-right: 1px solid #dcdfe6;
    }
    .danger-factor {
      width: 400px;
      // width:30%;
      margin: 0;
      height: 100%;
      line-height: 34px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      .pre-title {
        padding-left: 6px;
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(34, 34, 34, 1);
        opacity: 0.5;
      }
      .result-risk {
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(34, 34, 34, 1);
      }
    }
    .special-left {
      width: calc(100% - 200px - 100px - 400px) !important;
      margin-left: 0;
      border-left: 0;
    }
    .btn-style {
      border-left: 1px solid rgba(220, 223, 230, 1);

      padding-left: 10px;
      width: 200px;
    }
    .el-table--border td,
    .el-table--border th,
    .el-table__body-wrapper
      .el-table--border.is-scrolling-left
      ~ .el-table__fixed {
      border-left: 2px solid #ebeef5;
    }
  }
}
</style>
