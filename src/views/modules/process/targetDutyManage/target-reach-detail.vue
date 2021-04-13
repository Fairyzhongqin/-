<template>
  <el-dialog class="risk-factor" width="750px" title="达标统计详情" :visible.sync="visible" append-to-body @close="handleCloseDialog">
    <el-table :data="dataList" border ref="multipleTable" row-key="id" v-loading="dataListLoading" @selection-change="selectionChangeHandle" @expand-change="expandTableRow" style="width: 100%;height:222px">
      <el-table-column type="index" width="60" label="序号" header-align="center" align="center"></el-table-column>
      <el-table-column prop="deptName" width="120" :show-overflow-tooltip="true" label="部门名称">
      </el-table-column>
      <el-table-column prop="monthly" width="90" :show-overflow-tooltip="true" label="月度">
        <template slot-scope="scope">
          {{scope.row.monthly || '-'}}
        </template>
      </el-table-column>
      <el-table-column prop="targetName" :show-overflow-tooltip="true" label="目标名称" align="center">
      </el-table-column>
      <el-table-column prop="targetValue" :show-overflow-tooltip="true" label="目标值" align="center">
        <template slot-scope="scope">
          {{scope.row.targetValue+'(起)'}}
        </template>
      </el-table-column>
      <el-table-column prop="assessmentValue" :show-overflow-tooltip="true" label="考核指标" align="center">
        <template slot-scope="scope">
          {{scope.row.assessmentValue+'(起)'}}
        </template>
      </el-table-column>
      <el-table-column prop="completionValue" :show-overflow-tooltip="true" label="完成值" align="center">
        <template slot-scope="scope">
          {{scope.row.completionValue+'(起)'}}
        </template>
      </el-table-column>
      <el-table-column prop="isCompletion" :show-overflow-tooltip="true" label="达标情况" width="100" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.completionValue <= scope.row.assessmentValue" type="success">达标</el-tag>
          <el-tag v-if="scope.row.completionValue > scope.row.assessmentValue" type="danger">不达标</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[5]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    <div slot="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button @click="visible = false" type="primary">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { targetReachingDetail } from '@/api/process/targetDuty'
import { getLabels } from '@/api/common/sys'
export default {
  data () {
    return {
      accidentTypeList: [],
      dataListSelections: [],
      dataListSelections1: [], // 选中企业级的目标
      selectChange: {}, // 选中项的值
      dataList: [], // 数据列表
      selectedList: [],
      targetLevelList: [], // 指标级别列表
      targetStateList: [], // 企业目标状态列表
      pageIndex: 1,
      pageSize: 5,
      totalPage: 0,
      visible: true,
      dataForm: {
        factorName: ''
      },
      subAddVisible: false,
      dataListLoading: false
    }
  },
  created () {
    this.getBaseData()
  },
  methods: {
    async init (row) {
      this.visible = true
      await this.getDataList(row)
    },
    // 新增子项信息
    subAdd (info, id) {
      this.subAddVisible = true
      this.$nextTick(() => {
        this.$refs.subAddRef.init(info, id)
      })
    },
    refreshSubDataList (id) {
      // queryFactorByType({ factorMainId: id }).then(({ data }) => {
      //   if (data && data.code === 0) {
      //     this.dataList = this.dataList.map(item => {
      //       if (id === item.id) {
      //         console.log(data.list)
      //         data.list.map(subItem => {
      //           subItem.checked = false
      //           subItem.factorId = subItem.id
      //           this.dataListSelections.map(r => {
      //             if (r.id === subItem.id) {
      //               subItem.checked = true
      //             }
      //           })
      //         })
      //         item.child = data.list
      //       }
      //       return item
      //     })
      //     this.subLoading = false
      //     console.log(this.dataList)
      //   }
      // })
    },
    // 获取企业方针和目标数据列表
    async getDataList (row) {
      this.dataListLoading = true
      await targetReachingDetail({
        page: this.pageIndex,
        limit: this.pageSize,
        monthly: row.monthly || row.yearly,
        deptCode: row.deptCode
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            console.log(data)
            this.dataList = data.list
            this.totalPage = data.list.length
            this.dataList.map(item => {
              item.isCompletion = Number(item.completionValue) <= Number(item.targetValue) ? '0' : '1'
            })
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
        .catch(err => {
          console.log(err)
          this.$message.error('未知异常！请联系管理员')
          this.dataListLoading = false
        })
    },
    // 加载基础数据
    getBaseData () {
      getLabels({
        type: 'TARGET_LEVEL'
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.targetLevelList = data.list
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(err => console.log(err))
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
    // 子表
    expandTableRow (event, expanded) {
      if (expanded && expanded.length > 0) {
        expanded[0].list.map(item => {
          this.dataListSelections.map(r => {
            if (item.id === r.id) {
              item.checked = true
            }
          })
        })
        // queryFactorByType({ factorMainId: event.id }).then(({ data }) => {
        //   if (data && data.code === 0) {
        //     if (data.list.length > 0) {
        //       console.log(data.list)
        //       this.dataList = this.dataList.map(item => {
        //         if (event.id === item.id) {
        //           data.list.map(res => {
        //             res.checked = false
        //             res.factorId = res.id
        //             this.dataListSelections.map(r => {
        //               if (res.id === r.id) {
        //                 res.checked = true
        //               }
        //             })
        //           })
        //           item.child = data.list
        //         }
        //         return item
        //       })
        //       console.info('1111', this.dataList)
        //     } else {
        //       // this.$message.error('暂无数据')
        //     }
        //   }
        // })
      }
    },
    handleChildSelectionChange (checked, row) {
      // 选择子项事件
      // console.log(checked, row)
      if (checked) {
        if (!this.dataListSelections.find(item => item.id === row.id)) {
          this.dataListSelections.push(row)
        }
      } else {
        if (this.dataListSelections.find(item => item.id === row.id)) {
          this.dataListSelections.splice(
            this.dataListSelections.findIndex(item => item.id === row.id),
            1
          )
        }
      }
    },
    // 处理父级的选中事件
    selectionChangeHandle (val) {
      if (val.length > 1) {
        this.$refs.multipleTable.clearSelection()
        this.$refs.multipleTable.toggleRowSelection(val.pop())
      } else {
        this.selectChange = val.pop()
      }
    },
    // 返回
    addAccident () {
      console.log(this.selectChange, '123')
      this.$emit('selectComtargetEmit', this.selectChange)
      this.visible = false
      // this.dataListSelections = []
    },
    handleCloseDialog () {
      // 关闭弹框
      this.dataListSelections = []
      this.$refs.multipleTable.data.map(res => {
        this.$refs.multipleTable.toggleRowExpansion(res, false)
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
    }
  },
  filters: {
    formatType (value, map) {
      let optionName = ''
      map.map(val => {
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
.risk-factor {
  /deep/ .el-table__expanded-cell {
    padding: 0 !important;
  }
  .el-table tbody tr:hover > td.el-table__expanded-cell {
    background-color: transparent !important;
  }
  .table-child {
    tr {
      background-color: #eeeeee;
    }
  }
  .el-pagination {
    text-align: right;
    margin-top: 8px;
  }
}
</style>
