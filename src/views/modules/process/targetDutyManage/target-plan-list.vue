<!-- 目标计划 -->
<template>
  <div class='target-plan-list-container mod-config'>
    <el-form :inline="true" :model="dataForm" ref="dataForm">
      <el-form-item label='月度' prop='monthly'>
        <el-date-picker v-model="dataForm.monthly" type="month" placeholder="请选择" value-format="yyyy-MM"> </el-date-picker>
      </el-form-item>
      <el-form-item label="部门名称" prop="deptCode">
        <el-popover v-model="popoverVisible" ref="departPopover" placement="bottom-start" trigger="click" popper-class="high">
          <el-tree :data="departList" :props="defaultProps" node-key="id" ref="departListTree" :default-expanded-keys="[]" @current-change="departListTreeCurrentChangeHandle" default-expand-all :highlight-current="true" :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.deptName" v-popover:departPopover :readonly="true" size="mini" class="select-depart" placeholder="请选择" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="getDataList" icon="el-icon-search" v-waves>
          查询</el-button>
        <el-button type="info" size="mini" icon="el-icon-refresh-right" v-waves @click="resetForm('dataForm')">重置</el-button>
        <el-button type="warning" size="mini" icon="el-icon-plus" @click="addOrUpdateHandle()" v-waves>新增目标计划</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="dataList" border ref="multipleTable" row-key="id" @cell-click="cellClick" v-loading="dataListLoading" @selection-change="selectionChangeHandle" @expand-change="expandTableRow" style="width: 100%;">
      <el-table-column type="expand" width="40" class="expand-style">
        <template slot-scope="props">
          <el-table :data="props.row.list" :show-header="false" class="subTable" style="width:100%">
            <el-table-column type="index" width="60" label="序号" header-align="center" align="center">
              <template slot-scope="propsChild">
                {{ (props.$index + 1) + '-' + (propsChild.$index + 1) }}
              </template>
            </el-table-column>
            <el-table-column label="目标名称：" :show-overflow-tooltip="true" width="330">
              <template slot-scope="propsChild">
                目标名称：{{propsChild.row.targetName || '-'}}
              </template>
            </el-table-column>
            <el-table-column label="目标值" :show-overflow-tooltip="true">
              <template slot-scope="propsChild">
                {{'目标值：'+ (propsChild.row.targetValue==='0'?'':'≤') +propsChild.row.targetValue+'(起)'|| '-'}}
              </template>
            </el-table-column>
            <el-table-column label="完成值" :show-overflow-tooltip="true">
              <template slot-scope="propsChild">
                完成值：{{propsChild.row.completionValue|| '-'}}(起)
              </template>
            </el-table-column>
            <el-table-column label="状态" :show-overflow-tooltip="true">
              <template slot-scope="propsChild">
                <!-- 目标状态：{{propsChild.row.targetState==null?'暂无':propsChild.row.targetState|formatType(targetStateList)}} -->
                <span> 最新考核结果：</span>
                <span v-if="propsChild.row.targetState===null">-</span>
                <el-tag v-if="propsChild.row.assessmentState==='0'" type="success">达标</el-tag>
                <el-tag v-if="propsChild.row.assessmentState==='1'" type="danger">不达标</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="最新考核时间" :show-overflow-tooltip="true">
              <template slot-scope="propsChild">
                <!-- 目标状态：{{propsChild.row.targetState==null?'暂无':propsChild.row.targetState|formatType(targetStateList)}} -->
                最新考核时间：{{propsChild.row.assessmentDate || '-'}}
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column type="index" width="60" label="序号" header-align="center" align="center"></el-table-column>
      <el-table-column prop="deptName" width="250" :show-overflow-tooltip="true" label="部门名称">
      </el-table-column>
      <el-table-column prop="monthly" width="250" :show-overflow-tooltip="true" label="月度">
      </el-table-column>
      <el-table-column prop="responsiblePerson" :show-overflow-tooltip="true" label="责任人">
      </el-table-column>
      <el-table-column prop="executionState" :show-overflow-tooltip="true" label="执行状态" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.executionState==='0'">{{scope.row.executionState|formatType(stateList)}}</el-tag>
          <el-tag v-if="scope.row.executionState==='1'" type="warning">{{scope.row.executionState|formatType(stateList)}}</el-tag>
          <el-tag v-if="scope.row.executionState==='2'" type="danger">{{scope.row.executionState|formatType(stateList)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="200" label="操作">
        <template slot-scope="scope">
          <!-- <el-button type="text" size="small" @click.stop="subAdd(scope.row.id)">新增目标</el-button> -->
          <el-button type="text" size="small" @click.stop="addOrUpdateHandle(scope.row.id)" :disabled="scope.row.executionState==='0'?false:true">修改</el-button>
          <el-button type="text" size="small" style="color:#E63031" @click.stop="deleteHandle(scope.row.id,scope.row.deptName)" :disabled="scope.row.executionState==='0'?false:true">删除</el-button>
          <el-button type="text" size="small" @click.stop="carryHandle(scope.row.id)" :disabled="scope.row.executionState==='0'?false:true">执行</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <!-- 弹窗 新增 -->
    <sub-add v-if="subAddVisible" ref="subAddRef" @refreshSubDataList="getDataList"></sub-add>
  </div>
</template>

<script>
import addOrUpdate from './target-plan-add-or-update'
import subAdd from './policy-target-sub-add-or-update'
import { getLabels } from '@/api/common/sys'
// eslint-disable-next-line no-unused-vars
import { deptMonthlyList, deptMonthlDelete, deptMonthlyexecution } from '@/api/process/targetDuty'
import { departList } from '@/api/sys/depart'
export default {
  components: {
    addOrUpdate,
    subAdd
  },
  data () {
    return {
      dataForm: {
        deptCode: '', // 部门名称
        monthly: '', // 月度
        responsiblePerson: '', // 责任人
        executionState: '' // 执行状态
      },
      subLoading: true,
      stateList: [], // 执行状态
      dataList: [], // 数据列表
      departList: [],
      targetLevelList: [], // 企业目标指标级别列表
      targetStateList: [], // 企业目标状态列表
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
      addOrUpdateVisible: false,
      subAddVisible: false
    }
  },
  created () {
    this.getDataList() // 获取数据列表
    this.getBaseData()// 获取字典表里的基础数据
    this.getDepartList()// 获取部门树
    // this.handle()
  },
  methods: {
    // 处理数据
    // handle () {
    //   var firstResult = document.getElementById('firstResult')
    //   console.log(firstResult)
    // },
    handleDanger (val) {
      if (val.length > 0) {
        let factorDangerList = []
        factorDangerList = val.map((item, index) => {
          item = (index + 1) + '.' + item
          return item
        }).join(';')
        // let reg = /[;；]/g
        // factorDangerList = factorDangerList.replace(reg, '$&\r\n')
        // console.log(factorDangerList)
        return factorDangerList
      } else {
        return '暂无'
      }
    },
    // 点击一行选中
    cellClick (row) {
      this.$refs.multipleTable.toggleRowSelection(row)
      console.log(row)
    },
    // 加载基础数据
    getBaseData () {
      getLabels({
        'type': 'EXECUTION_STATE'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.stateList = data.list
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => console.log(err))
      getLabels({
        'type': 'ASSESSMENT_STATE'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.targetStateList = data.list
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => console.log(err))
    },
    // 获取企业方针和目标数据列表
    getDataList () {
      this.dataListLoading = true
      deptMonthlyList({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'deptCode': this.dataForm.deptCode,
        'monthly': this.dataForm.monthly,
        'responsiblePerson': this.dataForm.responsiblePerson,
        'executionState': this.dataForm.executionState
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(data)
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
    // 组织部门菜单树选中
    departListTreeCurrentChangeHandle (data, node) {
      // 当前节点的数据，对象
      this.dataForm.deptCode = data.deptCode
      this.dataForm.deptName = data.deptName
      this.popoverVisible = false
    },
    // 下载处理
    downHandle (id) {
      let token = document.cookie.split('=')[1]
      this.downloadUrl = this.$http.adornUrl(`/spring-processweb/attachment/download?id=${id}&token=${token}`)
      window.location.href = this.downloadUrl
    },
    expandTableRow (event, expanded) {
      console.log(event, '111111111111')
      console.log(expanded, '2222222222')
      if (expanded && expanded.length > 0) {
        // queryFactorByType({ factorMainId: event.id }).then(({ data }) => {
        //   if (data && data.code === 0) {
        //     if (data.list.length > 0) {
        //       this.dataList = this.dataList.map(item => {
        //         if (event.id === item.id) {
        //           item.child = data.list
        //         }
        //         return item
        //       })
        //     } else {
        //       // this.$message.error('暂无数据')
        //     }
        //     console.log(this.dataList)

        //     this.subLoading = false
        //   }
        // })
      }
    },
    carryHandle (id) {
      this.$confirm(
        `此目标执行后将不可修改，确认执行吗？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        deptMonthlyexecution({ id: id })
          .then(({ data }) => {
            if (data && data.code === 0) {
              // console.log(data)
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
    // expandTableRow (row) {
    //   console.log(row, '展开行列表数据')
    // },
    refreshSubDataList (id) {
      // queryFactorByType({ factorMainId: id }).then(({ data }) => {
      //   if (data && data.code === 0) {
      //     this.dataList = this.dataList.map(item => {
      //       if (id === item.id) {
      //         item.child = data.list
      //       }
      //       return item
      //     })
      //     this.subLoading = false
      //     console.log(this.dataList)
      //   }
      // })
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        // this.from = 'person'
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 新增子项信息
    subAdd (id, subId) {
      this.subAddVisible = true
      this.$nextTick(() => {
        this.$refs.subAddRef.init(id, subId)
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
      this.$confirm(`确定对[部门名称为=${nameArr.join(',')}]的目标计划进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deptMonthlDelete(ids)
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
    // 删除子项
    delAccident (id) {
      // this.$confirm('是否确认删除', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   let ids = []
      //   ids.push(id)
      //   objectivesDelete(ids).then(({ data }) => {
      //     if (data && data.code === 0) {
      //       this.$message.success('操作成功')
      //       this.getDataList()
      //     }
      //   })
      // })
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
      this.dataForm.deptName = ''
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
.target-plan-list-container {
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
