<!--岗位管理-->
<template>
  <div class="station-manage-container mod-config mod-private-routine">
    <el-form :inline="true" ref="dataForm" @submit.native.prevent :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="岗位名称" prop="stationName">
        <el-input v-model="dataForm.stationName" placeholder="岗位名称" size="mini" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="getDataList()" v-waves><i class="el-icon-search"></i>查询</el-button>
        <el-button type="info" size="mini" icon="el-icon-refresh-right" @click="resetForm('dataForm')" v-waves>重置</el-button>
        <el-button type="warning" size="mini" icon="el-icon-plus" @click="addOrUpdateHandle()" v-waves>新增岗位</el-button>
        <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteHandle()" :disabled="dataListSelections.length <= 0" v-waves>批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border ref="multipleTable" @cell-click="cellClick" v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column type="id" v-if="false" header-align="center" align="center" width="50">
      </el-table-column>
      <el-table-column type="selection" width="40">
      </el-table-column>
      <el-table-column type="index" label="序号" width="62">
      </el-table-column>
      <el-table-column prop="stationCode" show-overflow-tooltip label="岗位编号" width="120">
      </el-table-column>
      <el-table-column prop="stationName" show-overflow-tooltip label="岗位名称" width="120">
      </el-table-column>
      <el-table-column prop="summary" show-overflow-tooltip label="岗位概述">
      </el-table-column>
      <el-table-column prop="duty" show-overflow-tooltip label="岗位职责">
      </el-table-column>
      <el-table-column prop="organization" show-overflow-tooltip label="岗位编制" width="80">
        <template slot-scope="scope">
          {{scope.row.organization+'人'}}
        </template>
      </el-table-column>
      <!-- <el-table-column prop="qualificationType" show-overflow-tooltip label="资格证书类型" width="120">
      </el-table-column> -->
      <el-table-column prop="deptName" show-overflow-tooltip label="所属部门" width="120">
      </el-table-column>
      <!-- <el-table-column prop="zoneName" show-overflow-tooltip label="所属区域" width="120">
      </el-table-column> -->
      <!-- <el-table-column show-overflow-tooltip label="岗位资质" width="120">
        <template slot-scope="scope">
          <el-popover placement="bottom" width="300" trigger="click" popper-class="stationCert">
            <el-table :data="certicateList" border>
              <el-table-column prop="stationName" :show-overflow-tooltip="true" label="岗位" align="center">
              </el-table-column>
              <el-table-column prop="deptName" :show-overflow-tooltip="true" label="部门" align="center">
              </el-table-column>
              <el-table-column prop="certificateName" :show-overflow-tooltip="true" label="证书名称" align="center">
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" label="操作" align="center">
                <template slot-scope="childProp">
                  <el-button type="text" @click="disposeCerHandle(null,childProp.row.id)">修改</el-button>
                  <el-button type="text" @click="deleteCert(childProp.row.id,childProp.row.certificateName)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button type="text" slot="reference" @click.stop="getCertificateList(scope.row.id)">明细</el-button>
          </el-popover>
          <el-button type="text" slot="reference" @click.stop="getCertificateList()">查看详情</el-button>
        </template>
      </el-table-column> -->
      <el-table-column width="150" label="操作">
        <template slot-scope="scope">
          <!-- <el-button type="text" size="mini" @click.stop="disposeCerHandle(scope.row)" v-waves>配置岗位证书</el-button> -->
          <el-button type="text" size="small" @click.stop="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click.stop="deleteHandle(scope.row.id, scope.row.stationName)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" background :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <dispose-cert v-if="disposeCerVisible" ref="DisposeCert" @refreshDataList="getDataList"></dispose-cert>
  </div>
</template>

<script>
import AddOrUpdate from './position-add-or-update'
import DisposeCert from './position-certificate'
import { stationList, stationDelete } from '@/api/sys/station'
import { stationCertDelete } from '@/api/process/stationCertificate'

export default {
  data () {
    return {
      dataForm: {
        stationName: ''// 岗位名称
      },
      frequencyList: [], // 活动频率list
      certicateList: [],
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      disposeCerVisible: false
    }
  },
  components: {
    AddOrUpdate,
    DisposeCert
  },
  computed: {

  },
  // activated () {
  //   this.getDataList() // 获取数据列表
  //   this.getDictList() // 获取字典数据
  // },
  created () {
    this.getDataList() // 获取数据列表
    this.getDictList() // 获取字典数据
  },
  methods: {
    // 点击一行选中
    cellClick (row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    // 获取字典数据列表，系统选项
    getDictList () {
      this.$http({
        url: this.$http.adornUrl('/spring-sysweb/sys/dict/list'),
        method: 'get',
        params: this.$http.adornParams({
          'type': 'ACTIVITY_TYPE'
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(data.page.list)
          this.frequencyList = data.page.list
        }
      })
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      stationList({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'stationName': this.dataForm.stationName // 岗位名称
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
    // 获取岗位证书列表
    getCertificateList (id) {
      this.$router.push('/process/structureResponsibility/post-qualification-prove')
      // this.dataListLoading = true
      // stationCertList({
      //   'page': this.pageIndex,
      //   'limit': this.pageSize,
      //   'stationId': id // 岗位id
      // }).then(({ data }) => {
      //   if (data && data.code === 0) {
      //     this.certicateList = data.page.list
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
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 配置岗位证书
    disposeCerHandle (row, id) {
      this.disposeCerVisible = true
      this.$nextTick(() => {
        this.$refs.DisposeCert.init(row, id)
      })
    },
    // 重置
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.getDataList()
    },
    // 删除
    deleteHandle (id, name) {
      let ids = id ? [id] : this.dataListSelections.map(item => {
        return item.id
      })
      let nameArr = name ? [name] : this.dataListSelections.map(item => {
        return item.stationName
      })
      this.$confirm(`确定对[证书名称=${nameArr.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        stationDelete(ids).then(({ data }) => {
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
    },
    deleteCert (id, name) {
      let ids = id ? [id] : this.dataListSelections.map(item => {
        return item.id
      })
      let nameArr = name ? [name] : this.dataListSelections.map(item => {
        return item.stationName
      })
      this.$confirm(`确定对[岗位名称=${nameArr.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        stationCertDelete(ids).then(({ data }) => {
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
  },
  filters: {
    formatFrequency (value, map) {
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
.station-manage-container {
}
.stationCert {
  width: 360px !important;
}
</style>
