<template>
  <div class="map-zone-list-container">
    <el-table :data="dataList" row-key="id" :expand-row-keys="expands" highlight-current-row height="100%" :tree-props="{children: 'subregion'}" @row-click="rowClickTable" style="width: 100%; ">
      <el-table-column prop="zoneName" label="[编号]名称">
        <template slot-scope="scope">
          <template v-if="scope.row.id != '0'">
            [{{scope.row.code}}]{{scope.row.zoneName}}
          </template>
          <template v-else>
            {{scope.row.zoneName}}
          </template>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="70px">
        <template slot-scope="scope">
          <template v-if="scope.row.id != '0'">
            <i class="el-icon-edit-outline" @click.stop="addOrUpdateHandle('edit', scope.row)"></i>
            <i class="el-icon-delete" @click.stop="deleteHandle(scope.row.id, scope.row.zoneName)"></i>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <div class="map-bottom-btn">
      <el-button type="warning" size="mini" icon="el-icon-plus" @click="addOrUpdateHandle('edit')" slot="reference">新增区域</el-button>
    </div>
  </div>
</template>

<script>
import { queryZoneInfo, zoneDelById } from '@/api/pos/region'
import waves from '@/utils/waves'
export default {
  directives: {
    waves
  },
  components: {},
  data () {
    return {
      name: '',
      current: 1,
      totalPage: 0,
      dataListLoading: false,
      expands: [],
      dataList: [] // 数据展示
    }
  },
  created () { },
  mounted () {
    this.getDataList()
  },
  computed: {},
  watch: {},
  methods: {
    // 点击区域table单行
    rowClickTable (row) {
      console.log(row)
      if (row.id !== '0') {
        console.log(row)
        this.$emit('handleClick', 'view-fance', row.fencingList)
      }
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      queryZoneInfo({
        name: this.name
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = [data.data] || []
          // 展开二级层级
          this.$nextTick(() => {
            let els = this.$el.getElementsByClassName('el-table__expand-icon')
            els[0].click()
          })
          this.dataListLoading = false
        } else {
          this.$message.error(data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
      })
    },
    // 查看
    viewHandle (row) {
      this.$emit('handleClick', 'edit', row)
    },
    // 新增/修改
    addOrUpdateHandle (type, val) {
      this.$emit('handleClick', type, val)
    },
    // 删除
    deleteHandle (id, name) {
      this.$confirm(`确定对[名称=${name}]进行[删除]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        zoneDelById({
          'id': id
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

<style lang='scss'>
.map-zone-list-container {
  .el-table [class*='el-table__row--level'] .el-table__expand-icon {
    margin-right: 0px;
  }
}
</style>
