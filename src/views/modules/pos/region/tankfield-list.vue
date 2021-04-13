<template>
  <div class="repository-container mod-config">
    <el-form :inline="true"
             :model="dataForm"
             ref="dataForm"
             @keyup.enter.native="getDataList()">
      <el-row>
        <el-col :span="16">
          <el-form-item label="罐区名称"
                        prop="zoneName">
            <el-input v-model.trim="dataForm.zoneName"
                      placeholder="罐区名称"
                      size="mini"
                      clearable></el-input>
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
          </el-form-item>
        </el-col>
        <el-col :span="8"
                align="right">
          <el-form-item label="temp">
            <span slot="label"><i class="el-icon-sort rotateIcon"></i>区域类型</span>
            <el-select class="zoneViewSelect"
                       size="mini"
                       @change="selectView"
                       v-model="viewShow"
                       placeholder="请选择">
              <el-option label="库区"
                         value="0"></el-option>
              <el-option label="库房"
                         value="1"></el-option>
              <el-option label="生产场所"
                         value="2"></el-option>
              <el-option label="罐区"
                         value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
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
      <el-table-column prop="code"
                       :show-overflow-tooltip="true"
                       width="100"
                       label="罐区编号"></el-table-column>
      <el-table-column prop="zoneName"
                       :show-overflow-tooltip="true"
                       label="罐区名称">
        <template slot-scope="scope">
          {{scope.row.zoneName || '-'}}
        </template>
      </el-table-column>
      <el-table-column prop="spacing"
                       label="储罐最小间距/m">
        <template slot-scope="scope">
          {{scope.row.spacing || '-'}}
        </template>
      </el-table-column>
      <el-table-column prop="dyke"
                       :show-overflow-tooltip="true"
                       label="防护堤数据">
        <template slot-scope="scope">
          {{scope.row.dyke || '-'}}
        </template>
      </el-table-column>
      <el-table-column prop="dangerAttr"
                       :show-overflow-tooltip="true"
                       label="风险属性">
        <template slot-scope="scope">
          {{scope.row.dangerAttr || '-'}}
        </template>
      </el-table-column>
      <el-table-column prop="describe"
                       :show-overflow-tooltip="true"
                       label="描述">
        <template slot-scope="scope">
          {{scope.row.describe || '-'}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text"
                     size="small"
                     @click.stop="addOrUpdateHandle(scope.row.code)">查看</el-button>
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
  </div>
</template>

<script>
import waves from '@/utils/waves'
import editPage from './tankfield-add-or-update'
import { tankfieldDelete, repositoryList } from '@/api/sou/baseInfo'
export default {
  directives: {
    waves
  },
  components: {
    editPage
  },
  data () {
    return {
      dataForm: {
        name: '',
        manageName: '',
        zoneName: '' // 库区名称
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      viewShow: '3',
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      tankListVisible: false// 储罐列表是否可见
    }
  },
  created () { this.getDataList() },
  mounted () { },
  activated () {
    this.getDataList()
  },
  computed: {},
  watch: {},
  methods: {
    // 切换区域类型
    selectView () {
      this.$emit('selectView', this.viewShow)
    },
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
