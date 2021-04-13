<!--区域设置-->
<template>
  <div class="mod-contractStaticmain mod-config">
    <el-form :inline="true"
             :model="dataForm">
    </el-form>
    <el-table :data="dataList"
              row-key="id"
              border
              highlight-current-row
              :tree-props="{children: 'subregion'}"
              style="width: 100%; ">
      <el-table-column prop="zoneName"
                       min-width="150"
                       label="区域名称">
      </el-table-column>
      <el-table-column prop="code"
                       min-width="150"
                       label="区域编号">
        <template slot-scope="scope">
          <template v-if="scope.row.id !== '0'">
            {{scope.row.code}}
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="sourType"
                       min-width="150"
                       label="区域类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == '0'"
                  type="danger">离开</el-tag>
          <el-tag v-else
                  type="success">未离开</el-tag>
        </template>
        <template slot-scope="scope">
          <template v-if="scope.row.id !== '0'">
            <el-tag v-if="scope.row.sourType === '0'"
                    type="success">库区</el-tag>
            <el-tag v-else-if="scope.row.sourType === '1'"
                    class="shenlv"
                    type="success">库房</el-tag>
            <el-tag v-else-if="scope.row.sourType === '2'"
                    type="danger">生产场所</el-tag>
            <el-tag v-else-if="scope.row.sourType === '3'"
                    type="warning">罐区</el-tag>
            <el-tag v-else
                    type="info">其他</el-tag>
          </template>
        </template>
      </el-table-column>
      <el-table-column width="120"
                       label="操作">
        <template slot-scope="scope">
          <template v-if="scope.row.id !== '0'">
            <el-button type="text"
                       size="small"
                       @click="addOrUpdateHandle(scope.row)">设置</el-button>
            <!-- <el-button type="text"
                       size="small"
                       @click="addOrUpdateHandle()">
              <el-tooltip class="item"
                          effect="dark"
                          content="点击查看"
                          placement="right">
                <i class="el-icon-location-outline"
                   style="cursor: pointer;color: #3E8EF7;"></i>
              </el-tooltip>地图查看
            </el-button> -->
          </template>
        </template>
      </el-table-column>
    </el-table>
    <!-- 设置-->
    <region-set-update v-if="addOrUpdateVisible"
                       ref="addOrUpdate"
                       @refreshDataList="getDataList"></region-set-update>
  </div>
</template>

<script>
// import AddOrUpdate from './zone-add-or-update'
// import eventBus from '@/bus/index'
import regionSetUpdate from './region-set-add-or-update'
import { zoneDelById } from '@/api/pos/region'
import { regionSet } from '@/api/sou/regionDangerManger'
export default {
  data () {
    return {
      dataForm: {},
      dataList: [],
      dataListLoading: false,
      addOrUpdateVisible: false
    }
  },
  components: {
    regionSetUpdate
  },
  activated () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      regionSet().then(({ data }) => {
        if (data && data.code === 0) {
          // this.dataList = treeDataTranslate2(data.data.subregion, 'id', 'parentId')
          this.dataList = [data.data] || []
          this.dataListLoading = false
          // 展开二级层级
          this.$nextTick(() => {
            let els = this.$el.getElementsByClassName('el-table__expand-icon')
            els[0].click()
          })
        } else {
          this.$message.error(data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
      })
    },
    // 设置
    addOrUpdateHandle (info) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(info)
      })
    },
    // 删除
    deleteHandle (id) {
      this.$confirm(`确定对[id=${id}]进行[删除]操作?`, '提示', {
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
<style lang="scss">
.el-table::before {
  height: 0px;
}
.mod-contractStaticmain {
  .el-table {
    height: calc(100% - 20px);
  }
  .shenlv {
    color: rgb(136, 221, 75);
  }
}
</style>
