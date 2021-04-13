<template>
  <div class="map-check-point-list-container">
    <el-input placeholder="输入卡口名称"
              suffix-icon="el-icon-search"
              @keyup.enter.native="getDataList"
              class="map-list-search"
              v-model="name">
    </el-input>
    <el-table :data="dataList"
              class="com-map"
              style="width: 100%"
              width='338px'
              ref="singleTables"
              highlight-current-row
              height="calc(100% - 79px)"
              @cell-click="viewHandle"
              v-loading="dataListLoading"
              max-height="calc(100% - 79px)">
      <el-table-column prop="name"
                       label="卡口名称">
      </el-table-column>
      <el-table-column prop="province"
                       label="卡口类型">
        <template slot-scope="scope">
          {{scope.row.type == '0' ?'物理一道门':'物理二道门'}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="70px">
        <template slot-scope="scope">
          <template v-if="scope.row.id != '0'">
            <i class="el-icon-edit-outline" @click.stop="addOrUpdateHandle('edit', scope.row)"></i>
            <i class="el-icon-delete" @click.stop="deleteHandle(scope.row.id, scope.row.name)"></i>
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
                 @click="addOrUpdateHandle('edit')">新增卡口</el-button>
      <!--<el-popover placement="top"-->
                  <!--width="230">-->
        <!--<div>-->
          <!--<el-button size="mini"-->
                     <!--type="primary"-->
                     <!--@click="addOrUpdateHandle('out')">新增室外卡口</el-button>-->
          <!--<el-button type="primary"-->
                     <!--size="mini"-->
                     <!--@click="addOrUpdateHandle('inside')">新增室内卡口</el-button>-->
        <!--</div>-->
        <!---->
      <!--</el-popover>-->
    </div>
  </div>
</template>

<script>
import { checkpointList, checkpointDelete } from '@/api/pos/checkpoint'
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
      sexListCheckpointType: [{ value: '物理一道门', lable: '0' }, { value: '物理二道门', lable: '1' }],
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
    // 获取数据
    getDataList () {
      this.dataListLoading = true
      checkpointList({
        name: this.name,
        page: this.current,
        limit: '20'
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
    // 查看
    viewHandle (row) {
      this.$emit('handleClick', 'view-checkPoint', row)
    },
    // 新增 修改
    addOrUpdateHandle (val, row) {
      this.$emit('handleClick', val, row)
    },
    // 删除
    deleteHandle (id, name) {
      this.$confirm(`确定对[名称=${name}]进行[删除]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        checkpointDelete([id]).then(({ data }) => {
          if (data && data.code === 0) {
            this.getDataList()
            this.$emit('handleClick', 'init') // 初始化
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
    handleBuyerCurrentChange (val) {
      this.current = val
      this.getDataList()
    }
  }
}
</script>

<style lang='scss'>
.map-check-point-list-container {
}
</style>
