<template >
  <el-dialog title="选择证书" :close-on-click-modal="false" class="private-dialog" width="600px" append-to-body :visible.sync="visible" :modal-append-to-body="true" @close="$emit('closeDialog')">
    <el-table :data="dataList" border ref="multipleTable" @cell-click="cellClick" v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column type="selection" width="40" align="center"></el-table-column>
      <el-table-column prop="id" label="ID" :show-overflow-tooltip="true" v-if="false" width="60"></el-table-column>
      <el-table-column type="index" label="序号" align="center" :show-overflow-tooltip="true" width="60"></el-table-column>
      <el-table-column prop="name" :show-overflow-tooltip="true" label="证书名称">
      </el-table-column>
      <el-table-column prop="validityTerm" :show-overflow-tooltip="true" label="有效期">
      </el-table-column>
      <el-table-column prop="accessWay" :show-overflow-tooltip="true" label="获取途径">
      </el-table-column>
      <!--<el-table-column prop="certificatesNumber"-->
      <!--:show-overflow-tooltip="true"-->
      <!--label="持证人量">-->
      <!--</el-table-column>-->
      <el-table-column prop="attachmentId" :show-overflow-tooltip="true" label="附件">
        <template slot-scope="scope">
          <a href="javascript:;">{{scope.row.attachmentId}}</a>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="isDisabled" @click="selectCertificate()">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { certificateList, certificateDelete } from '@/api/process/certificate'
export default {
  data () {
    return {
      dataForm: {
        name: '', // 证书名
        type: '' // 类型
      },
      dataList: [], // 列表数据
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      visible: false,
      dataListLoading: false,
      dataListSelections: [],
      selectChange: {},
      addOrUpdateVisible: false,
      isDisabled: false
    }
  },
  created () {

  },
  activated () {
  },
  mounted () { },
  methods: {
    // 初始数据
    async init (select) {
      this.visible = true
      await this.getDataList() // 获取数据列表
      this.$nextTick(() => {
        this.selectChange = select
        this.$refs.multipleTable.data.map(r => {
          if (r.id === select.certificateId) {
            this.$refs.multipleTable.toggleRowSelection(r, true)
          }
        })
      })
    },
    async getDataList () {
      this.dataListLoading = true
      await certificateList({
        'page': this.pageIndex,
        'limit': this.pageSize
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
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
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
      this.$confirm(`确定对[证书名称=${nameArr.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        certificateDelete(ids).then(({ data }) => {
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
    // 单选
    selectionChangeHandle (val) {
      if (val.length > 1) {
        this.$refs.multipleTable.clearSelection()
        this.$refs.multipleTable.toggleRowSelection(val.pop())
      } else {
        this.selectChange = val.pop()
      }
    },
    // 返回
    selectCertificate () {
      console.log(this.selectChange, '123')
      this.$emit('refreshment', this.selectChange)
      this.visible = false
    },
    // 重置
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.getDataList()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
