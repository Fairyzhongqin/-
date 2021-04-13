<template>
  <el-dialog class="risk-factor" width="750px" title="选择企业目标" :visible.sync="visible" append-to-body @close="handleCloseDialog">
    <el-table :data="dataList" border ref="multipleTable" row-key="id" v-loading="dataListLoading" @expand-change="expandTableRow" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column type="expand" width="40" class="expand-style">
        <template slot-scope="props">
          <el-table :data="props.row.list" :show-header="false" class="subTable" style="width:100%">
            <el-table-column type="index" width="60" label="序号" header-align="center" align="center">
              <template slot-scope="propsChild">
                {{ props.$index + 1 + "-" + (propsChild.$index + 1) }}
              </template>
            </el-table-column>
            <el-table-column label="目标名称：" :show-overflow-tooltip="true" width="150">
              <template slot-scope="propsChild">
                目标名称：{{ propsChild.row.targetName || '-' }}
              </template>
            </el-table-column>
            <el-table-column label="目标值" :show-overflow-tooltip="true" width="100">
              <template slot-scope="propsChild">
                {{'目标值：'+ (propsChild.row.targetValue==='0'?'':'≤') +propsChild.row.targetValue+'(起)'|| '-'}}
              </template>
            </el-table-column>
            <el-table-column label="完成值" :show-overflow-tooltip="true">
              <template slot-scope="propsChild">
                {{'完成值：'+ propsChild.row.completionValue+'(起)'|| '-'}}
              </template>
            </el-table-column>
            <el-table-column label="状态" :show-overflow-tooltip="true">
              <template slot-scope="propsChild">
                <span> 目标状态：</span>
                <span v-if="propsChild.row.targetState===null">-</span>
                <el-tag v-if="propsChild.row.targetState==='1'" type="success">{{propsChild.row.targetState|formatType(targetStateList)}}</el-tag>
                <el-tag v-if="propsChild.row.targetState==='2'" type="danger">{{propsChild.row.targetState|formatType(targetStateList)}}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column type="index" width="60" label="序号" header-align="center" align="center"></el-table-column>
      <el-table-column prop="companyName" width="100" :show-overflow-tooltip="true" label="公司名称">
      </el-table-column>
      <el-table-column prop="year" width="100" :show-overflow-tooltip="true" label="年度">
      </el-table-column>
      <el-table-column prop="fileName" :show-overflow-tooltip="true" label="年度安全生产目标文件">
        <template slot-scope="scope">
          <a @click.stop="downHandle(scope.row.attachmentId)" title="下载">{{
            scope.row.fileName
          }}</a>
        </template>
      </el-table-column>
      <!-- <el-table-column width="200" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.stop="subAdd(scope.row.id)">新增目标</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    <div slot="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button @click="addAccident()" type="primary">确定</el-button>
    </div>
    <!-- 弹窗 新增 -->
    <sub-add v-if="subAddVisible" ref="subAddRef" @refreshSubDataList="getDataList"></sub-add>
  </el-dialog>
</template>
<script>
import { policiesList } from '@/api/process/targetDuty'
import { getLabels } from '@/api/common/sys'
import subAdd from './policy-target-sub-add-or-update'
export default {
  components: {
    subAdd
  },
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
      pageSize: 10,
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
    async init (select) {
      this.visible = true
      await this.getDataList()
      this.$nextTick(() => {
        // if (val) {
        //   val.map(r => {
        //     r.checked = true
        //     r.id = r.targetId
        //   })
        //   this.dataListSelections = val
        // }
        this.selectChange = select
        this.$refs.multipleTable.data.map(r => {
          if (r.year === select.year) {
            this.$refs.multipleTable.toggleRowSelection(r, true)
          }
        })
      })
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
    async getDataList () {
      this.dataListLoading = true
      await policiesList({
        page: this.pageIndex,
        limit: this.pageSize
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            console.log(data)
            this.dataList = data.page.list
            this.totalPage = data.page.count
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
