<template>
  <el-dialog class="risk-factor" width="750px" title="选择事故因素" :visible.sync="visible" append-to-body @close="handleCloseDialog" >
    <el-table :data="dataList" border ref="multipleTable" row-key="id" @expand-change="expandTableRow" v-loading="dataListLoading" style="width:100%">
      <el-table-column type="expand" width="40">
        <template slot-scope="props">

          <el-table :data="dataList[props.$index].child" class="table-child" :ref="'childTable' + props.$index" :show-header="false" style="width:100%">
            <el-table-column type="selection" width="40">
              <template slot-scope="propsChild">
                <el-checkbox v-model="dataList[props.$index].child[propsChild.$index].checked" @change="handleChildSelectionChange($event, propsChild.row)"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column type="index" width="60" label="序号">
              <template slot-scope="propsChild">
                {{ (props.$index + 1) + "-" + (propsChild.$index + 1) }}
              </template>
            </el-table-column>
            <el-table-column type="index" width="304" label="风险诱因" :show-overflow-tooltip="true">
              <template slot-scope="propsChild">
                风险诱因：{{ propsChild.row.factorDanger || '暂无' }}
              </template>
            </el-table-column>
            <el-table-column type="index" width="304" label="管控措施" :show-overflow-tooltip="true">
              <template slot-scope="propsChild">
                管控措施：{{ propsChild.row.factorControl || '暂无' }}
              </template>
            </el-table-column>
          </el-table>

        </template>
      </el-table-column>
      <el-table-column type="index" width="60" label="序号"></el-table-column>
      <el-table-column prop="factorName" width="100" label="风险名称">
      </el-table-column>
      <el-table-column prop="factorDescribe" label="风险描述" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column width="100" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.stop="subAdd(scope.row)">
            新增风险诱因
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    <div slot="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button @click="addAccident()" type="primary">确定</el-button>
    </div>
    <!-- 弹窗 新增 -->
    <sub-add v-if="subAddVisible" ref="subAddRef" @refreshSubDataList="refreshSubDataList"></sub-add>
  </el-dialog>
</template>
<script>
import { factorList, queryFactorByType } from '@/api/risk/factor'
import subAdd from '../../riskModelManage/accident-sub-add'
export default {
  data () {
    return {
      accidentTypeList: [],
      dataListSelections: [],
      dataList: [], // 列表数
      selectedList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      visible: true,
      dataForm: {
        factorName: ''
      },
      subAddVisible: false
    }
  },
  created () {
    this.getDataList()
  },
  components: {
    subAdd
  },
  methods: {
    init (val) {
      console.log(val)
      this.visible = true
      if (val) {
        val.map(r => {
          r.checked = true
          r.id = r.factorId
        })
        this.dataListSelections = val
      }
    },
    // 新增子项信息

    subAdd (info, id) {
      this.subAddVisible = true
      this.$nextTick(() => {
        this.$refs.subAddRef.init(info, id)
      })
    },
    refreshSubDataList (id) {
      queryFactorByType({ factorMainId: id }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = this.dataList.map(item => {
            if (id === item.id) {
              console.log(data.list)

              data.list.map(subItem => {
                subItem.checked = false
                subItem.factorId = subItem.id
                this.dataListSelections.map(r => {
                  if (r.id === subItem.id) {
                    subItem.checked = true
                  }
                })
              })
              item.child = data.list
            }
            return item
          })
          this.subLoading = false
          console.log(this.dataList)
        }
      })
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      factorList({
        page: this.pageIndex,
        limit: this.pageSize,
        factorName: this.dataForm.factorName
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
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
    // 子表
    expandTableRow (event, expanded) {
      if (expanded && expanded.length > 0) {
        queryFactorByType({ factorMainId: event.id }).then(({ data }) => {
          if (data && data.code === 0) {
            if (data.list.length > 0) {
              console.log(data.list)

              this.dataList = this.dataList.map(item => {
                if (event.id === item.id) {
                  data.list.map(res => {
                    res.checked = false
                    res.factorId = res.id
                    this.dataListSelections.map(r => {
                      if (res.id === r.id) {
                        res.checked = true
                      }
                    })
                  })
                  item.child = data.list
                }
                return item
              })
              console.info('1111', this.dataList)
            } else {
              // this.$message.error('暂无数据')
            }
          }
        })
      }
    },
    handleChildSelectionChange (checked, row) { // 选择子项事件
      console.log(checked, row)
      if (checked) {
        if (!this.dataListSelections.find(item => item.id === row.id)) {
          this.dataListSelections.push(row)
        }
      } else {
        if (this.dataListSelections.find(item => item.id === row.id)) {
          this.dataListSelections.splice(this.dataListSelections.findIndex(item => item.id === row.id), 1)
        }
      }
    },
    // 返回
    addAccident () {
      this.$emit('selectAccidentEmit', this.dataListSelections)
      this.visible = false
      this.dataListSelections = []
    },
    handleCloseDialog () { // 关闭弹框
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
