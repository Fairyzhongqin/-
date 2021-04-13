<!--区域设置-->
<template>
  <div class="mod-menu mod-config mod-zone">
    <el-form :inline="true"
             :model="dataForm">
      <el-form-item>
        <el-button type="primary"
                   size="mini"
                   class="switch-sys"
                   @click="addHandle">区域维护</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList"
              row-key="id"
              border
              default-expand-all
              :tree-props="{children: 'subregion'}"
              style="width: 100%; ">
      <el-table-column prop="zoneName"
                       width="280"
                       label="区域名称"></el-table-column>
      <el-table-column prop="code"
                       width="200"
                       label="区域编号"></el-table-column>
      <el-table-column prop="sourType"
                       min-width="150"
                       label="区域类型">
        <!-- <template slot-scope="scope">
          <el-tag v-if="scope.row.status == '0'" type="danger">离开</el-tag>
          <el-tag v-else type="success">未离开</el-tag>
        </template>-->
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
      <el-table-column prop="zoneName"
                       min-width="280"
                       label="关联围栏">
        <template slot-scope="scope">
          <div v-if="scope.row.fencingList.length">
            <span v-for="item in scope.row.fencingList"
                  :key="item.id">【{{item.fencingName}}】</span>
          </div>
          <div v-else>-</div>
        </template>
      </el-table-column>

      <el-table-column width="120"
                       label="操作">
        <template slot-scope="scope">
          <template v-if="scope.row.id !== '0'">
            <el-button type="text"
                       size="small"
                       @click="addOrUpdateHandle(scope.row)">设置类型</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible"
                   ref="addOrUpdate"
                   @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './zone-add-or-update'
import eventBus from '@/bus/index'
import { queryZoneInfo, zoneDelById } from '@/api/pos/region'

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
    AddOrUpdate
  },
  activated () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      queryZoneInfo().then(({ data }) => {
        if (data && data.code === 0) {
          // this.dataList = treeDataTranslate2(data.data.subregion, 'id', 'parentId')
          this.dataList = [data.data] || []
          this.dataListLoading = false
        } else {
          this.$message.error(data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
      })
    },
    // 新增区域
    addHandle (info) {
      this.$router.push({
        name: 'comMap',
        params: {
          name: 'zone',
          callBackFn: () => {
            eventBus.$emit('mainSidebarCoMap', {
              name: 'zoneFun',
              info: info
            })
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
.mod-zone {
  .shenlv {
    color: rgb(136, 221, 75);
  }
}
</style>
