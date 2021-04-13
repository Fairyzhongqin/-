<template>
  <div class='equlpment-depository-container mod-config'>
    <el-form :inline="true"
             :model="dataForm"
             ref="dataForm"
             @keyup.enter.native="getDataList()">
      <el-form-item label="仓库名称"
                    prop="zoneName">
        <el-input v-model="dataForm.zoneName"
                  placeholder="仓库名称"
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
                   @click="addOrUpdateHandle()">新增仓库</el-button>
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

      <el-table-column type="id"
                       v-if="false"
                       :show-overflow-tooltip="true"
                       width="50"></el-table-column>
      <!-- <el-table-column type="selection"
                       :show-overflow-tooltip="true"
                       width="50"></el-table-column> -->
      <el-table-column prop="code"
                       :show-overflow-tooltip="true"
                       width="100"
                       label="仓库编号">
      </el-table-column>
      <el-table-column prop="zoneName"
                       :show-overflow-tooltip="true"
                       label="仓库名称">
      </el-table-column>
      <el-table-column prop="storageGood"
                       :show-overflow-tooltip="true"
                       label="存储化学品名称">
      </el-table-column>
      <el-table-column prop="storageNum"
                       :show-overflow-tooltip="true"
                       label="存储化学品数量">
      </el-table-column>
      <el-table-column prop="dangerAttr"
                       :show-overflow-tooltip="true"
                       label="风险属性">
      </el-table-column>
      <el-table-column prop="describe"
                       :show-overflow-tooltip="true"
                       label="描述">
      </el-table-column>
      <el-table-column width="120"
                       label="操作">
        <template slot-scope="scope">
          <el-button type="text"
                     size="small"
                     @click.stop="checkHandle(scope.row)">
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
    <!-- 弹窗, 查看 -->
    <check-page v-if="checkVisible"
                ref="check"
                @refreshDataList="getDataList"></check-page>
  </div>
</template>

<script>
import waves from '@/utils/waves'
import editPage from './depositorys-add-or-update'
import { repositoryDelete } from '@/api/sou/equlpment'
import { repositoryList } from '@/api/sou/baseInfo'
import checkPage from './depositorys-check'

export default {
  directives: {
    waves
  },
  components: {
    editPage, checkPage
  },
  data () {
    return {
      dataForm: {
        zoneName: ''

      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      checkVisible: false
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
      this.dataListLoading = true
      repositoryList({
        page: this.pageIndex,
        limit: this.pageSize,
        zoneName: this.dataForm.zoneName,
        sourType: '1'

      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
          console.log('李白', this.dataList)

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
    //   this.addOrUpdateVisible = true
    //   this.$nextTick(() => {
    //     this.$refs.addOrUpdate.init(id)
    //   })
    // },
    // 查看
    checkHandle (row, type) {
      this.checkVisible = true
      this.$nextTick(() => {
        this.$refs.check.init(row)
      })
    },
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
          title: '视图模式',
          type: 'module'
        }])
        this.$store.commit('common/updateMainmodelFlag', 1)
      }
    },
    // 删除
    deleteHandle (id, name) {
      let ids = id ? [id] : this.dataListSelections.map(item => {
        return item.id
      })
      let nameArr = name ? [name] : this.dataListSelections.map(item => {
        return item.name
      })
      this.$confirm(`确定对[仓库名=${nameArr.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        repositoryDelete(ids).then(({ data }) => {
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
</style>
