<template>
  <div class="person-certificate">
    <el-table :data="dataList" border height="478px" v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="50">
      </el-table-column>
      <el-table-column prop="employeeName" header-align="center" align="center" :show-overflow-tooltip="true" label="姓名">
      </el-table-column>
      <el-table-column prop="sex" header-align="center" :show-overflow-tooltip="true" align="center" width="50" label="性别">
        <template slot-scope="scope">{{scope.row.sex === 0 ? '男' : '女'}}</template>
      </el-table-column>
      <el-table-column prop="employeeId" header-align="center" align="center" :show-overflow-tooltip="true" label="工号">
      </el-table-column>
      <el-table-column prop="deptName" header-align="center" align="center" :show-overflow-tooltip="true" label="岗位">
      </el-table-column>
      <el-table-column prop="fileName" header-align="center" :show-overflow-tooltip="true" align="center" label="证书名称">
        <template slot-scope="scope">
          {{scope.row.fileName.split('.')[0]}}
        </template>
      </el-table-column>
      <el-table-column prop="certificateCode" header-align="center" :show-overflow-tooltip="true" align="center" label="证书编号">
      </el-table-column>
      <el-table-column prop="obtainDate" header-align="center" :show-overflow-tooltip="true" align="center" label="取证日期">
      </el-table-column>
      <el-table-column prop="validityTerm" header-align="center" :show-overflow-tooltip="true" align="center" width="60" label="有效期">
      </el-table-column>
      <el-table-column prop="overdueDate" header-align="center" :show-overflow-tooltip="true" align="center" label="到期日期">
      </el-table-column>
      <!--<el-table-column prop="lishizhengshu" header-align="center" :show-overflow-tooltip="true" align="center" label="历史证书">-->
        <!--<template slot-scope="scope">-->
          <!--{{scope.row.lishizhengshu || '-'}}-->
        <!--</template>-->
      <!--</el-table-column>-->
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>

<script>
// import {configList} from '@/api/sys/config'
import {employeeCertificateList} from '@/api/process/certificate'
export default {
  props: {
    staffInfo: {
      type: Object
    }
  },
  data () {
    return {
      dataForm: {
        paramKey: ''
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
  components: {},
  activated () {
  },
  created () {
  },
  watch: {
    staffInfo: function (oldVal, newVal) {
      console.log(oldVal)
      console.log(newVal)
    },
    deep: true
  },
  methods: {
    init (info) {
      this.getDataList(info)
    },
    // 获取数据列表
    getDataList (info) {
      this.dataListLoading = false
      this.totalPage = this.dataList.length
      this.dataListLoading = true
      employeeCertificateList({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'employeeId': info.gh
      }).then(({data}) => {
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
    // 删除
    deleteHandle (id) {
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.id
      })
      this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/sys/config/delete'),
          method: 'post',
          data: this.$http.adornData(ids, false)
        }).then(({ data }) => {
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
        })
      }).catch(() => { })
    }
  }
}
</script>
