<template>
  <div class="map-fence-list-container">
    <el-input placeholder="请输入围栏名称"
              suffix-icon="el-icon-search"
              v-model="name"
              @keyup.enter.native="getDataList"
              class="map-list-search">
    </el-input>
    <el-table :data="dataList"
              class="com-map"
              style="width: 100%"
              width='338px'
              ref="singleTables"
              highlight-current-row
              height="calc(100% - 79px)"
              @cell-click='rowClickTable'
              v-loading="dataListLoading">
      <el-table-column prop="fencingName"
                       label="围栏名称">
      </el-table-column>
      <el-table-column label="操作"
                       width="70px">
        <template slot-scope="scope">
          <template v-if="scope.row.id != '0'">
            <i class="el-icon-edit-outline"
               @click.stop="addOrUpdateHandle('edit', scope.row)"></i>
            <i class="el-icon-delete"
               @click.stop="deleteHandle(scope.row.id, scope.row.fencingName)"></i>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :page-size="20"
                   :pager-count="5"
                   layout="prev, pager, next"
                   :total="totalPage"
                   :current-page.sync="current"
                   @current-change="handleBuyerCurrentChange">
    </el-pagination>
    <div class="map-bottom-btn">
      <el-button type="warning"
                 size="mini"
                 icon="el-icon-plus"
                 @click="handleAdd('edit')">新增围栏</el-button>
    </div>
  </div>
</template>

<script>
import { fencingList, fencingDelete } from '@/api/pos/region'
export default {
  components: {},
  data () {
    return {
      name: '',
      current: 1,
      totalPage: 0,
      dataListLoading: false,
      dataList: []
    }
  },
  created () {
    this.getDataList()
  },
  mounted () { },
  computed: {},
  watch: {},
  methods: {
    viewHandle (row) {
      this.$emit('handleClick', 'view-fence', row)
    },
    // 点击区域table单行
    rowClickTable (row) {
      this.$emit('handleClick', 'view-fence', row, true) // 启用备用参数 作用是告诉上级仅查看围栏 不要弹出编辑页
    },
    // 新增/修改
    addOrUpdateHandle (type, val) {
      this.$emit('handleClick', type, val)
    },
    getDataList (val, type) {
      this.dataListLoading = true
      fencingList({
        fencingName: this.name,
        page: this.current,
        limit: '20'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          if (type && type === 'checkbox') {
            data.page.list.map(vals => {
              if (vals.id === val.id) {
                this.$refs.singleTables.setCurrentRow(vals)
              }
            })
          }
          this.dataList = data.page.list
          this.totalPage = data.page.count
        } else {
          this.dataList = []
        }
        this.dataListLoading = false
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
        this.dataListLoading = false
      })
    },
    // 删除
    deleteHandle (id, name) {
      this.$confirm(`确定对[名称=${name}]进行[删除]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        fencingDelete([id]).then(({ data }) => {
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
    },
    handleAdd (type) {
      this.$emit('handleClick', type)
    },
    handleBuyerCurrentChange (val) {
      this.current = val
      this.getDataList()
    }
  }
}
</script>

<style lang='scss' scoped>
.map-fence-list-container {
}
</style>
