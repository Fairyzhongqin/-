<template>
  <div class="map-fence-list-container">
    <el-input placeholder="输入储罐名称/编号"
              suffix-icon="el-icon-search"
              v-model="name"
              @keyup.enter.native="getDataList"
              class="map-list-search"></el-input>
    <el-table :data="dataList"
              class="com-map"
              style="width: 100%"
              width="338px"
              ref="singleTables"
              highlight-current-row
              height="calc(100% - 79px)"
              @cell-click="viewHandle"
              v-loading="dataListLoading">
      <el-table-column prop="name"
                       label="[编号]名称">
        <template slot-scope="scope">
          [{{scope.row.code}}]{{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       width="70px">
        <template slot-scope="scope">
          <template v-if="scope.row.id != '0'">
            <i class="el-icon-edit-outline"
               @click.stop="addOrUpdateHandle('view-tank', scope.row)"></i>
            <i class="el-icon-delete"
               @click.stop="deleteHandle(scope.row.id, scope.row.name)"></i>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :page-size="20"
                   :pager-count="5"
                   layout="prev, pager, next"
                   :total="totalPage"
                   :current-page.sync="current"
                   @current-change="handleBuyerCurrentChange"></el-pagination>
    <div class="map-bottom-btn">
      <el-button type="warning"
                 size="mini"
                 icon="el-icon-plus"
                 @click="handleAdd('edit')">新增储罐</el-button>
    </div>
  </div>
</template>

<script>
import { tankList, tankDelete } from '@/api/sou/equlpment'
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
    // 点击区域table单行
    viewHandle (row) {
      this.$emit('handleClick', 'view', row)
    },
    // 新增/修改
    addOrUpdateHandle (type, val) {
      this.$emit('handleClick', type, val)
    },
    getDataList (val, type) {
      this.dataListLoading = true
      tankList({
        name: this.name,
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
          console.log(data, '=================')
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
        tankDelete([id]).then(({ data }) => {
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
