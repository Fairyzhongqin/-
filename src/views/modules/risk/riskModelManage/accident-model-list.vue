<template>
  <div class='accident-container mod-config'>
    <el-form :inline="true" :model="dataForm" ref="dataForm">
      <el-form-item width="50" label="事故类型" prop="factorName">
        <el-input v-model="dataForm.factorName" size="mini" placeholder="风险类型" clearable>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="getDataList" icon="el-icon-search" v-waves>
          查询</el-button>
        <el-button type="info" size="mini" icon="el-icon-refresh-right" v-waves @click="
                   resetForm('dataForm')">重置</el-button>
        <el-button type="warning" size="mini" icon="el-icon-plus" @click="addOrUpdateHandle()" v-waves>新增事故类型</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="dataList" border ref="multipleTable" row-key="id" @cell-click="cellClick" v-loading="dataListLoading" @selection-change="selectionChangeHandle" @expand-change="expandTableRow" style="width: 100%;">
      <el-table-column type="expand" width="40" class="expand-style">
        <template slot-scope="props">
          <el-table :data="dataList[props.$index].child" :show-header="false" class="subTable" style="width:100%">
            <el-table-column type="index" width="60" label="序号" header-align="center" align="center">
              <template slot-scope="propsChild">
                {{ (props.$index + 1) + '-' + (propsChild.$index + 1) }}
              </template>

            </el-table-column>
            <el-table-column label="风险诱因" :show-overflow-tooltip="true" width="300">
              <template slot-scope="propsChild">
                风险诱因：{{propsChild.row.factorDanger || '暂无'}}
              </template>
            </el-table-column>
            <el-table-column label="管控措施" :show-overflow-tooltip="true">
              <template slot-scope="propsChild">
                管控措施：{{handleDanger(propsChild.row.factorControl) || '暂无'}}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="240">
              <template slot-scope="propsChild">
                <el-button type="text" size="small" @click="subAdd(props.row,propsChild.row.id)">修改</el-button>
                <el-button type="text" style="color:#E63031" size="small" @click="delAccident(props.row.id,propsChild.row.id)">删除</el-button>
              </template>
            </el-table-column>

          </el-table>
        </template>
      </el-table-column>
      <el-table-column type="index" width="60" label="序号" header-align="center" align="center"></el-table-column>
      <el-table-column prop="factorName" width="200" :show-overflow-tooltip="true" label="风险类型">
      </el-table-column>
      <el-table-column prop="factorDescribe" :show-overflow-tooltip="true" label="风险描述">
      </el-table-column>
      <el-table-column width="200" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.stop="subAdd(scope.row)" :disabled="$store.state.user.name !== 'admin'">新增风险诱因</el-button>
          <el-button type="text" size="small" @click.stop="addOrUpdateHandle(scope.row.id)" :disabled="$store.state.user.name !== 'admin'">修改</el-button>
          <el-button type="text" size="small" :style="{color: $store.state.user.name === 'admin' ? '#E63031' : ''}" @click.stop="deleteHandle(scope.row.id,scope.row.factorName)" :disabled="$store.state.user.name !== 'admin'">删除</el-button>
        </template>
      </el-table-column>

    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <!-- 弹窗 新增 -->
    <sub-add v-if="subAddVisible" ref="subAddRef" @refreshSubDataList="refreshSubDataList"></sub-add>
  </div>
</template>

<script>
import addOrUpdate from './accident-model-add-or-update'
import subAdd from './accident-sub-add'
import waves from '@/utils/waves'
import { getLabels } from '@/api/common/sys'
// eslint-disable-next-line no-unused-vars
import { factorList, factorDelete, queryFactorByType, accidentDelete } from '@/api/risk/factor'
export default {
  directives: {
    waves
  },
  data () {
    return {
      dataForm: {
        factorName: '',
        type: '', // 风险类型
        riskFactor: '' // 危险因素
      },
      subLoading: true,
      // 危险类型0:危险1 1:危险2
      typeList: [], // 风险类型
      dataList: [], // 列表数
      pageIndex: 1,
      pageSize: 20,
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
    // this.handle()
  },
  mounted () {

  },
  components: {
    addOrUpdate,
    subAdd
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
      console.log(this.$store.state.user.name)
    },
    // 加载基础数据
    getBaseData () {
      getLabels({
        'type': 'accident_type'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.typeList = data.list
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => console.log(err))
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      factorList({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'factorName': this.dataForm.factorName
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

    expandTableRow (event, expanded) {
      if (expanded && expanded.length > 0) {
        queryFactorByType({ factorMainId: event.id }).then(({ data }) => {
          if (data && data.code === 0) {
            if (data.list.length > 0) {
              this.dataList = this.dataList.map(item => {
                if (event.id === item.id) {
                  item.child = data.list
                }
                return item
              })
            } else {
              // this.$message.error('暂无数据')
            }
            console.log(this.dataList)

            this.subLoading = false
          }
        })
      }
    },
    refreshSubDataList (id) {
      queryFactorByType({ factorMainId: id }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = this.dataList.map(item => {
            if (id === item.id) {
              item.child = data.list
            }
            return item
          })
          this.subLoading = false
          console.log(this.dataList)
        }
      })
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

    subAdd (info, id) {
      this.subAddVisible = true
      this.$nextTick(() => {
        this.$refs.subAddRef.init(info, id)
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
      this.$confirm(`确定对[风险类型为=${nameArr.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          factorDelete(ids)
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
    delAccident (id, subId) {
      this.$confirm('是否确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = []
        ids.push(subId)
        accidentDelete(ids).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message.success('操作成功')
            this.refreshSubDataList(id)
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
    // 重置
    resetForm (formName) {
      this.$refs[formName].resetFields()
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
.accident-container {
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
