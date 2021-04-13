<template >
  <div class="mod-config">
    <el-form :inline="true"
             :model="dataForm"
             ref="dataForm"
             @keyup.enter.native="getDataList()">
      <el-form-item width="50" label="证书名称" prop="name">
        <el-input v-model.trim="dataForm.name" size="mini" clearable placeholder="请输入员工姓名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   size="mini"
                   @click="getDataList"
                   icon="el-icon-search"
                   v-waves>
          查询</el-button>
        <el-button type="info"
                   size="mini"
                   icon="el-icon-refresh-right"
                   v-waves
                   @click="
                   resetForm('dataForm')">重置</el-button>
        <!--<el-button type="warning"-->
                   <!--size="mini"-->
                   <!--icon="el-icon-plus"-->
                   <!--@click="addOrUpdateHandle()"-->
                   <!--v-waves>证书配置</el-button>-->
        <el-button type="danger"
                   size="mini"
                   icon="el-icon-delete"
                   @click="deleteHandle()"
                   v-waves
                   :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList"
              border
              ref="multipleTable"
              @cell-click="cellClick"
              v-loading="dataListLoading"
              @selection-change="selectionChangeHandle"
              style="width: 100%;">
      <el-table-column type="selection"
                       width="40"
                       align="center"></el-table-column>
      <el-table-column prop="id"
                       label="ID"
                       :show-overflow-tooltip="true"
                       v-if="false"
                       width="60"></el-table-column>
      <el-table-column type="index"
                       label="序号"
                       align="center"
                       :show-overflow-tooltip="true"
                       width="60"></el-table-column>
      <el-table-column prop="ename"
                       :show-overflow-tooltip="true"
                       label="员工姓名">
      </el-table-column>
      <el-table-column prop="gender"
                       :show-overflow-tooltip="true"
                       label="性别">
      </el-table-column>
      <el-table-column prop="department"
                       :show-overflow-tooltip="true"
                       label="部门">
      </el-table-column>
      <el-table-column prop="post"
                       :show-overflow-tooltip="true"
                       label="岗位">
      </el-table-column>
      <el-table-column prop="certificateName"
                       :show-overflow-tooltip="true"
                       label="证书名称">
      </el-table-column>
      <el-table-column prop="getCertificateTime"
                       :show-overflow-tooltip="true"
                       label="取证时间">
      </el-table-column>
      <el-table-column prop="validityTerm"
                       :show-overflow-tooltip="true"
                       label="有效期">
      </el-table-column>
      <el-table-column prop="nextReviewTime"
                       width="135"
                       label="下次复审时间">
        <template slot-scope="scope">
          <template v-if="new Date (gettime).getTime() > new Date (scope.row.nextReviewTime).getTime()">
            <el-tooltip class="item" effect="dark" content="复评时间已到,请尽快前去" placement="top">
              <span style="color: #e6a23c">{{scope.row.nextReviewTime}}</span>
            </el-tooltip>
          </template>
          <span v-else>{{scope.row.nextReviewTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="expirationDate"
                       width="135"
                       label="过期时间">
        <template slot-scope="scope">
          <template v-if="new Date (gettime).getTime() > new Date (scope.row.expirationDate).getTime()">
            <el-tooltip class="item" effect="dark" content="证书已过期，请尽快前去更换" placement="top">
              <span style="color: #e6a23c">{{scope.row.expirationDate}}</span>
            </el-tooltip>
          </template>
          <span v-else>{{scope.row.expirationDate}}</span>
        </template>
      </el-table-column>
      <el-table-column width="220"
                       label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.stop="">
            <span :style="{color: scope.row.certificateName === '' ? '#e6a23c' : ''}">证书配置</span>
            <el-tooltip v-if="scope.row.certificateName === ''" class="item" effect="dark" content="未配置证书,请尽快配置" placement="top">
             <i class="el-icon-info" style="color: #e6a23c"></i>
            </el-tooltip>
          </el-button>
          <!--<el-button type="text" size="small" @click.stop="">-->
            <!--<span :style="{color: new Date (gettime).getTime() > new Date (scope.row.expirationDate).getTime()  ? '#e6a23c' : ''}">更换证书</span>-->
            <!--<el-tooltip v-if="new Date (gettime).getTime() > new Date (scope.row.expirationDate).getTime()" class="item" effect="dark" content="证书过期,请尽快更换新的证书" placement="top">-->
              <!--<i class="el-icon-info" style="color: #e6a23c"></i>-->
            <!--</el-tooltip>-->
          <!--</el-button>-->
          <el-button type="text" size="small" @click.stop="">
            <span :style="{color: new Date (gettime).getTime() > new Date (scope.row.nextReviewTime).getTime() ? '#e6a23c' : ''}">复审</span>
            <el-tooltip v-if="new Date (gettime).getTime() > new Date (scope.row.nextReviewTime).getTime()" class="item" effect="dark" content="复审时间到,请尽快前去复审" placement="top">
              <i class="el-icon-info" style="color: #e6a23c"></i>
            </el-tooltip>
          </el-button>
          <!--<el-button type="text" size="small" @click.stop="addOrUpdateHandle(scope.row.id)">修改</el-button>-->
          <!--<el-button type="text" size="small" @click.stop="deleteHandle(scope.row.id, scope.row.name)">删除</el-button>-->
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
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  // import {certificateList, certificateDelete} from '@/api/process/certificate'
  import addOrUpdate from './certificate-add-or-update'
  export default {
    data () {
      return {
        dataForm: {
          name: '', // 证书名
          type: '' // 类型
        },
        dataList: [{
          ename: '啊三',
          gender: '男',
          department: '驾驶班',
          post: '驾驶员',
          certificateName: 'C1级小汽车驾驶证',
          getCertificateTime: '2020-01-01 00:00:00',
          validityTerm: '5年',
          nextReviewTime: '2020-01-01 01:09:00',
          expirationDate: '2020-02-01 00:00:00'
        }], // 列表数据
        gettime: '', // 当前时间
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    created () {
      this.getDataList() // 获取数据列表
      this.currentTime()
    },
    activated () {
      console.log(new Date(this.expirationDate).getTime())
    },
    mounted () { },

    components: {
      addOrUpdate
    },
    methods: {
      getDataList () {
        // this.dataListLoading = true
        // certificateList({
        //   'page': this.pageIndex,
        //   'limit': this.pageSize,
        //   'name': this.dataForm.name, // 岗位名称
        //   'type': this.dataForm.type // 类型
        // }).then(({ data }) => {
        //   if (data && data.code === 0) {
        //     this.dataList = data.page.list
        //     this.totalPage = data.page.count
        //   } else {
        //     this.dataList = []
        //     this.totalPage = 0
        //   }
        //   this.dataListLoading = false
        // }).catch((err) => {
        //   console.log(err)
        //   this.$message.error('未知异常！请联系管理员')
        //   this.dataListLoading = false
        // })
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id, name) {
        // let ids = id ? [id] : this.dataListSelections.map(item => {
        //   return item.id
        // })
        // let nameArr = name ? [name] : this.dataListSelections.map(item => {
        //   return item.name
        // })
        // this.$confirm(`确定对[证书名称=${nameArr.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
        //   certificateDelete(ids).then(({ data }) => {
        //     if (data && data.code === 0) {
        //       this.getDataList()
        //       this.$message({
        //         message: '操作成功',
        //         type: 'success',
        //         duration: 1500,
        //         onClose: () => {
        //         }
        //       })
        //     } else {
        //       this.$message.error(data.msg)
        //     }
        //   }).catch((err) => {
        //     console.log(err)
        //     this.$message.error('未知异常！请联系管理员')
        //   })
        // }).catch(() => { })
      },
      getTime () {
        var _this = this
        let yy = new Date().getFullYear()
        let mm = new Date().getMonth() + 1
        let dd = new Date().getDate()
        let hh = new Date().getHours()
        let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
        let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
        _this.gettime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss
      },
      currentTime () {
        setInterval(this.getTime, 500)
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
        console.log(val)
        this.dataListSelections = val
      },
      // 重置
      resetForm (formName) {
        this.$refs[formName].resetFields()
        this.getDataList()
      }
    },
    beforeDestroy () {
      if (this.timer) {
        clearInterval(this.timer) // 在Vue实例销毁前，清除我们的定时器
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
