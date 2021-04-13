<template >
  <div class='train-type mod-config'>
    <el-form :inline="true" :model="dataForm" ref="dataForm" @keyup.enter.native="getDataList">
      <el-form-item width="50" label="培训类别名称" prop="trainCategoryName">
        <el-input v-model="dataForm.trainCategoryName" clearable placeholder="请输入培训类别名称" size="mini"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="getDataList()" icon="el-icon-search" v-waves>
          查询</el-button>
        <el-button type="info" size="mini" icon="el-icon-refresh-right" v-waves @click="
                   resetForm('dataForm')">重置</el-button>
        <el-button type="warning" size="mini" icon="el-icon-plus" @click="addOrUpdateHandle()" v-waves>新增类别</el-button>
        <!-- <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteHandle()" v-waves :disabled="dataListSelections.length <= 0">批量删除</el-button> -->
      </el-form-item>
    </el-form>
    <el-tabs v-model="activeName" type="card" @tab-click="tabClick">
      <el-tab-pane :key="item.name" v-for="item in trainTypeTab" :label="item.title" :name="item.name">
      </el-tab-pane>
    </el-tabs>
    <el-table :data="dataList" border ref="multipleTable" row-key="id" @cell-click="cellClick" v-loading="dataListLoading" @selection-change="selectionChangeHandle" @expand-change="expandTableRow" style="width: 100%;">
      <el-table-column type="expand" width="40" class="expand-style">
        <template slot-scope="props">
          <el-table :data="dataList[props.$index].child" :show-header="false" class="subTable" style="width:100%">
            <el-table-column type="index" width="60" label="序号" header-align="center" align="center">
              <template slot-scope="propsChild">
                {{ (props.$index + 1) + '-' + (propsChild.$index + 1) }}
              </template>

            </el-table-column>
            <el-table-column label="培训类别等级" :show-overflow-tooltip="true" width="300">
              <template slot-scope="propsChild">
                培训类别等级：{{propsChild.row.trainCategoryLevel + props.row.trainCategoryName|| '暂无'}}
              </template>
            </el-table-column>
            <el-table-column label="描述" :show-overflow-tooltip="true">
              <template slot-scope="propsChild">
                描述：{{(propsChild.row.detailDescription) || '暂无'}}
              </template>
            </el-table-column>

          </el-table>
        </template>
      </el-table-column>
      <!-- <el-table-column type="selection" width="50"></el-table-column> -->
      <el-table-column type="index" width="60" label="序号" header-align="center" align="center"></el-table-column>
      <el-table-column prop="trainCategoryName" width="200" :show-overflow-tooltip="true" label="培训类别名称">
      </el-table-column>
      <el-table-column prop="trainCategoryMsg" :show-overflow-tooltip="true" label="培训类别简介">
      </el-table-column>
      <el-table-column width="200" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.stop="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" style="color:#E63031" @click.stop="deleteHandle(scope.row.id,scope.row.trainCategoryName)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <train-type-add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList2"></train-type-add-or-update>
  </div>
</template>

<script>
import { traintypeList, traintypeChildList, traintypeDelete } from '@/api/process/education'
import trainTypeAddOrUpdate from './train-type-add-or-update'
export default {
  data () {
    return {
      dataForm: {
        status: ''// 报告状态
      },
      trainTypeTab: [{ title: '从业人员', name: '1' }, { title: '管理人员', name: '2' }, { title: '其他人员', name: '3' }, { title: '日常安全', name: '4' }],
      dataList: [], // 列表数据
      typeList: [], // 模板等级
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      activeName: '1'
    }
  },
  created () {
    this.getDataList()
  },
  activated () {
  },
  mounted () { },

  components: {
    // addOrUpdate,
    // trainTypeList
    trainTypeAddOrUpdate
  },
  methods: {
    // 点击一行选中
    cellClick (row) {
      this.$refs.multipleTable.toggleRowSelection(row)
      console.log(row)
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    expandTableRow (event, expanded) {
      if (expanded && expanded.length > 0) {
        traintypeChildList({ id: event.id }).then(({ data }) => {
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
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      traintypeList({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'trainCategoryName': this.dataForm.trainCategoryName,
        'trainType': this.activeName
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
    getDataList2 (trainType) {
      this.dataListLoading = true
      traintypeList({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'trainCategoryName': this.dataForm.trainCategoryName,
        'trainType': trainType
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
    // tab栏切换
    tabClick (e, v) {
      console.log(e.name)
      this.activeName = e.name
      this.getDataList()
    },
    // 预览
    preview () {
      this.$router.push({ path: '/process/riskManage/safety-risk-assessment-detailed', query: { level: this.activeName, preview: '1' } })
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    deleteHandleVal (data) {
      this.dataListSelections = data
    },
    // 批量删除
    deleteHandle (id, name) {
      let ids = id ? [id] : this.dataListSelections.map(item => {
        return item.id
      })
      let nameArr = name
        ? [name]
        : this.dataListSelections.map(item => {
          return item.trainCategoryName
        })
      this.$confirm(`确定对[培训类别名称为=${nameArr.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          traintypeDelete(ids)
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
    },
    // 重置
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.getDataList2()
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
.train-type {
  .el-table {
    height: calc(100% - 207px) !important;
    .el-table__expanded-cell {
      padding: 0 !important;
      .el-table__body-wrapper {
        border-left: 1px solid #ebeef5;
      }
    }
    .subTable {
      padding-left: 90px;
    }
  }
}
</style>
