<!--围栏设置-->
<template>
  <div class="mod-config">
    <el-form :inline="true"
             :model="dataForm"
             ref="dataForm"
             @submit.native.prevent
             @keyup.enter.native="getDataList()">
      <el-form-item label="围栏名称"
                    prop="fencingName">
        <el-input v-model="dataForm.fencingName"
                  placeholder="围栏名称"
                  size="mini"
                  clearable></el-input>
      </el-form-item>
      <!-- <el-form-item label="围栏类型"
                    prop="type">
        <el-select v-model="dataForm.type"
                   size="mini"
                   placeholder="请选择">
          <el-option label="楼层围栏"
                     value="0">
          </el-option>
          <el-option label="区域围栏"
                     value="1">
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary"
                   size="mini"
                   @click="getDataList()"
                   v-waves>
          <i class="el-icon-search"></i>
          查询</el-button>
        <el-button type="info"
                   size="mini"
                   icon="el-icon-refresh-right"
                   @click="
                   resetForm('dataForm')"
                   v-waves>重置</el-button>
        <el-button type="primary"
                   size="mini"
                   class="switch-sys"
                   @click="getRoutComMap()">围栏维护</el-button>
        <!-- <el-button type="warning"
                   size="mini"
                   icon="el-icon-plus"
                   @click="addOrUpdateHandle()"
                   v-waves>新增人员类型</el-button> -->
        <!--<el-button type="danger"-->
        <!--size="mini"-->
        <!--icon="el-icon-delete"-->
        <!--@click="deleteHandle()"-->
        <!--:disabled="dataListSelections.length <= 0"-->
        <!--v-waves>批量删除</el-button>-->
      </el-form-item>
      <!-- <el-form-item>
        <el-button type="primary"
                   size="mini"
                   @click="getDataList()">查询</el-button>
        <el-button type="info"
                   size="mini"
                   @click="
                   resetForm('dataForm')">重置</el-button>
        <el-button type="warning"
                   size="mini"
                   @click="addOrUpdateHandle()">新增围栏</el-button>
        <el-button type="danger"
                   size="mini"
                   @click="deleteHandle()"
                   :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item> -->
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
                       width="50">
      </el-table-column>
      <el-table-column type="selection"
                       width="40"></el-table-column>
      <el-table-column type="index"
                       label="序号"
                       width="62">
      </el-table-column>
      <el-table-column prop="fencingName"
                       label="围栏名称">

      </el-table-column>

      <el-table-column prop="floor"
                       label="围栏高度">
        <template slot-scope="scope">
          {{scope.row.minHeight}}m&nbsp;~&nbsp;{{scope.row.maxHeight}}m
        </template>
      </el-table-column>
      <el-table-column prop="remarks"
                       label="备注">
      </el-table-column>

      <el-table-column width="120"
                       label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item"
                      effect="dark"
                      content="点击查看"
                      placement="right">
            <el-button type="text"
                       size="small"
                       @click="addOrUpdateHandle(scope.row)">
              <i class="el-icon-location-outline"
                 style="cursor: pointer;color: #3E8EF7;"></i>地图查看
            </el-button>
          </el-tooltip>
          <!-- <el-button type="text"
                     size="small"
                     @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text"
                     size="small"
                     @click="deleteHandle(scope.row.id, scope.row.fencingName)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle"
                   @current-change="currentChangeHandle"
                   :current-page="pageIndex"
                   :page-sizes="[10, 20, 50, 100]"
                   :page-size="pageSize"
                   :total="totalPage"
                   background
                   layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible"
                   ref="addOrUpdate"
                   @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './fencing-add-or-update'
import { fencingList, fencingDelete } from '@/api/pos/region'
import waves from '@/utils/waves'
import eventBus from '@/bus/index'

export default {
  directives: {
    waves
  },
  data () {
    return {
      dataForm: {
        fencingName: '' // 围栏名称
        // type: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
    }
  },
  components: {
    AddOrUpdate
  },
  activated () {
    this.getDataList() // 获取数据列表
  },
  methods: {
    // 地图跳转
    getRoutComMap (val) {
      this.$router.push({
        name: 'comMap',
        params: {
          name: 'fencing',
          callBackFn: () => {
            eventBus.$emit('mainSidebarCoMap', {
              name: 'fencingFun',
              info: val
            }) // 围栏管理
          }
        }
      })
      this.$store.commit('common/updateMainTabs', [{
        iframeUrl: '',
        menuId: 'comMap',
        name: 'comMap',
        noClose: true,
        title: '视图模式',
        type: 'module'
      }])
      this.$store.commit('common/updateMainmodelFlag', 1)
      this.$cookie.set('navFlag', this.$store.state.common.navFlag)
      this.$store.commit('common/updatedNavbarFlag', '4')
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      fencingList({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'fencingName': this.dataForm.fencingName,
        'type': this.dataForm.type
      }).then(({ data }) => {
        if (data && data.code === 0) {
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
    // 点击一行选中
    cellClick (row) {
      this.$refs.multipleTable.toggleRowSelection(row)
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
    addOrUpdateHandle (val) {
      this.getRoutComMap(val)
      // this.addOrUpdateVisible = true
      // this.$nextTick(() => {
      //   this.$refs.addOrUpdate.init(id)
      // })
    },
    // 删除
    deleteHandle (id, name) {
      let ids = id ? [id] : this.dataListSelections.map(item => {
        return item.id
      })
      let nameArr = name ? [name] : this.dataListSelections.map(item => {
        return item.fencingName
      })
      this.$confirm(`确定对[围栏名称=${nameArr.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        fencingDelete(ids).then(({ data }) => {
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
