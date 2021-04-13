<template>
  <div class='repository-container mod-config'>
    <el-form :inline="true"
             :model="dataForm"
             ref="dataForm"
             @keyup.enter.native="getDataList()">
      <el-form-item label="罐区名称"
                    prop="zoneName">
        <el-input v-model="dataForm.zoneName"
                  placeholder="罐区名称"
                  size="mini"
                  clearable>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   size="mini"
                   icon="el-icon-search"
                   v-waves
                   @click="getDataList()">查询</el-button>
        <el-button type="info"
                   size="mini"
                   icon="el-icon-refresh-right"
                   v-waves
                   @click="
                   resetForm('dataForm')">重置</el-button>
        <!-- <el-button type="warning"
                   size="mini"
                   icon="el-icon-plus"
                   v-waves
                   @click="addOrUpdateHandle()">新增罐区</el-button>
        <el-button type="danger"
                   size="mini"
                   icon="el-icon-delete"
                   v-waves
                   @click="deleteHandle()"
                   :disabled="dataListSelections.length <= 0">批量删除</el-button> -->
      </el-form-item>
    </el-form>
    <el-table :data="dataList"
              border
              ref="multipleTable"
              @cell-click="cellClick"
              v-loading="dataListLoading"
              @selection-change="selectionChangeHandle"
              style="width: 100%;">

      <!-- <template slot-scope="scope">{{scope.row.name || '-'}}</template> -->

      <el-table-column type="id"
                       v-if="false"
                       :show-overflow-tooltip="true"
                       width="50"></el-table-column>
      <!-- <el-table-column type="selection"
                       width="50"></el-table-column> -->
      <el-table-column prop="code"
                       :show-overflow-tooltip="true"
                       width="100"
                       label="罐区编号">
      </el-table-column>
      <el-table-column prop="zoneName"
                       :show-overflow-tooltip="true"
                       label="罐区名称">
      </el-table-column>
      <el-table-column prop="tankNum"
                       label="储罐数">
        <template slot-scope="scope">
          <span @click.stop="tankListHandle(scope.row.id)"
                class="guanquStyle">{{scope.row.tankNum || '0'}}</span></template>
      </el-table-column>
      <el-table-column prop="spacing"
                       header-align="center"
                       align="center"
                       width="150"
                       label="储罐最小间距/m">
      </el-table-column>
      <el-table-column prop="dyke"
                       :show-overflow-tooltip="true"
                       label="防护堤数据">
      </el-table-column>
      <el-table-column prop="dangerAttr"
                       :show-overflow-tooltip="true"
                       label="风险属性">
      </el-table-column>
      <el-table-column prop="describe"
                       :show-overflow-tooltip="true"
                       label="描述">
      </el-table-column>

      <!-- <el-table-column width="60"
                       label="操作">
        <template slot-scope="scope"> -->
      <!--          <el-button type="text"-->
      <!--                     size="small"-->
      <!--                     @click.stop="tankListHandle(scope.row.id)">储罐列表</el-button>-->
      <!-- <el-button type="text"
                     size="small"
                     @click.stop="addOrUpdateHandle(scope.row.id)">修改</el-button> -->
      <!--          <el-button type="text"-->
      <!--                     size="small"-->
      <!--                     @click.stop="deleteHandle(scope.row.id,scope.row.name)">删除</el-button>-->
      <!-- </template>
      </el-table-column> -->
      <el-table-column width="120"
                       label="操作">
        <template slot-scope="scope">
          <el-button type="text"
                     size="small"
                     @click.stop="addOrUpdateHandle(scope.row.id)">
            查看
          </el-button>
          <!--<el-button type="text"-->
                     <!--size="small"-->
                     <!--@click.stop="addOrUpdateHandle(scope.row,'comMap')">-->
            <!--<el-tooltip class="item"-->
                        <!--effect="dark"-->
                        <!--content="点击查看"-->
                        <!--placement="right">-->
              <!--<i class="el-icon-location-outline"-->
                 <!--style="cursor: pointer;color: #3E8EF7;"></i>-->
            <!--</el-tooltip>地图查看-->
          <!--</el-button>-->

        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle"
                   @current-change="currentChangeHandle"
                   :current-page="pageIndex"
                   :page-sizes="[10, 20, 50, 100]"
                   :page-size="pageSize"
                   :total="totalPage"
                   layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <edit-page v-if="addOrUpdateVisible"
               ref="addOrUpdate"
               @refreshDataList="getDataList"></edit-page>
    <!-- 储罐列表 -->
    <tank-list v-if="tankListVisible"
               ref="tankAreaList"></tank-list>
  </div>

</template>

<script>
import waves from '@/utils/waves'
import editPage from './tankfield-add-or-update'
import tankList from './tankfield-tank-list'
import { tankfieldDelete, repositoryList } from '@/api/sou/baseInfo'
export default {
  directives: {
    waves
  },
  components: {
    editPage,
    tankList
  },
  data () {
    return {
      dataForm: {
        name: '',
        manageName: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      tankListVisible: false// 储罐列表是否可见
    }
  },
  created () { },
  mounted () { },
  activated () {
    this.getDataList()
  },
  computed: {},
  watch: {},
  methods: {
    // 点击一行选中
    cellClick (row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    // 获取数据列表
    getDataList () {
      // this.dataList = []
      this.dataListLoading = true
      repositoryList({
        page: this.pageIndex,
        limit: this.pageSize,
        zoneName: this.dataForm.zoneName,
        sourType: '3'

        // manageName: this.dataForm.manageName
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
          this.totalPage = data.page.count
          console.log(this.dataList)
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
    },
    // 新增 / 修改
    // addOrUpdateHandle (id) {
    //   // console.log(id, '=============')
    //   this.addOrUpdateVisible = true
    //   this.$nextTick(() => {
    //     this.$refs.addOrUpdate.init(id)
    //   })
    // },
    // 新增 / 修改
    addOrUpdateHandle (id, type) {
      if (!type) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      } else {
        this.$router.push({ path: '/comMap', name: 'comMap', params: { name: 'checkpoint', val: id } })
        this.$store.commit('common/updateMainTabs', [{
          iframeUrl: '',
          menuId: 'comMap',
          name: 'comMap',
          noClose: true,
          title: '地图模式',
          type: 'module'
        }])
        this.$store.commit('common/updateMainmodelFlag', 1)
      }
    },
    // 储罐列表
    tankListHandle (id) {
      this.tankListVisible = true
      this.$nextTick(() => {
        this.$refs.tankAreaList.init(id)
      })
    },
    // 删除
    deleteHandle (id, name) {
      let ids = id ? [id] : this.dataListSelections.map(item => {
        return item.id
      })
      let nameArr = name ? [name] : this.dataListSelections.map(item => {
        return item.name
      })
      this.$confirm(`确定对[罐区=${nameArr.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        tankfieldDelete(ids).then(({ data }) => {
          if (data && data.code === 0) {
            this.getDataList()
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        }).catch((err) => {
          console.log(err)
          this.$message.error('未知异常！请联系管理员')
        })
      }).catch(() => { })
    }
  }
}
</script>

<style lang='scss' scoped>
.repository-container {
  .guanquStyle {
    color: #2c78bb;
  }
  .guanquStyle:hover {
    text-decoration: underline;
  }
}
</style>
