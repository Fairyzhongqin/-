<template>
  <el-dialog title="选择存储设施"
             :close-on-click-modal="false"
             class="react-facity"
             width="700px"
             :visible.sync="visible"
             append-to-body>
    <el-table :data="dataList"
              border
              ref="multipleTable"
              @cell-click="cellClick"
              v-loading="dataListLoading"
              @selection-change="selectionChangeHandle"
              style="width: 100%;"
              height="300px">

      <!-- <el-table-column type="id"
                       v-if="false"
                       :show-overflow-tooltip="true"
                       width="50"></el-table-column> -->
      <el-table-column type="selection"
                       width="50"></el-table-column>
      <el-table-column prop="code"
                       :show-overflow-tooltip="true"
                       width="80"
                       label="设施编号">
      </el-table-column>
      <el-table-column prop="name"
                       width="150"
                       :show-overflow-tooltip="true"
                       label="设施名称">
      </el-table-column>
      <el-table-column prop="tankTypeName"
                       width="100"
                       :show-overflow-tooltip="true"
                       label="设施类型">
        <template slot-scope="scope">
          <span class="typebg"
                v-if="scope.row.tankTypeName">{{scope.row.tankTypeName}}</span>
          <span v-else>暂无类型</span>
        </template>
      </el-table-column>
      <el-table-column prop="zoneName"
                       width="120"
                       :show-overflow-tooltip="true"
                       label="所属区域">
      </el-table-column>
      <el-table-column prop="storageName"
                       :show-overflow-tooltip="true"
                       width="130"
                       label="储存物品名称">
      </el-table-column>

      <el-table-column prop="dangerAttr"
                       :show-overflow-tooltip="true"
                       min-width="150"
                       label="风险属性">
      </el-table-column>
      <el-table-column prop="describe"
                       :show-overflow-tooltip="true"
                       min-width="150"
                       label="描述">
      </el-table-column>
      <el-table-column prop="metersDescribe"
                       width="100"
                       :show-overflow-tooltip="true"
                       label="已配置仪表">
        <template slot-scope="scope">
          <template v-for="(item,index) in scope.row.metersDescribe">
            <el-tag :key="index">{{item}}</el-tag>
          </template>
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
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false"
                 size="mini">取消</el-button>
      <el-button type="primary"
                 :disabled="isDisabled"
                 @click="addReact()"
                 size="mini">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { tankList } from '@/api/sou/equlpment'

export default {
  data () {
    return {
      visible: false,
      isDisabled: false,
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListSelections: {},
      dataListLoading: false
    }
  },
  created () {
    this.getDataList()
  },
  methods: {
    init (code) {
      this.visible = true
      if (code) {
        this.$nextTick(() => {
          this.$refs.multipleTable.data.map(item => {
            if (item.code === code) {
              this.$refs.multipleTable.toggleRowSelection(item, true)
            }
          })
        })
      }
      // console.log(this.$refs.multipleTable)
    },
    // 点击一行选中
    cellClick (row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    // 获取数据列表
    getDataList () {
      // this.dataList = []
      this.dataListLoading = true
      tankList({
        page: this.pageIndex,
        limit: this.pageSize,
        sourType: '4'
        // name: this.dataForm.name,
        // zoneId: this.dataForm.zoneId,
        // zoneId: this.dataForm.zoneName[this.dataForm.zoneName.length - 1],
        // tankTypeId: this.dataForm.tankTypeId
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
          this.totalPage = data.page.count
          this.dataList.map(item => {
            if (item.metersDescribe !== null) {
              item.metersDescribe = item.metersDescribe.split(',')
            }
          })
          console.log(this.dataList)
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
    // 单选
    selectionChangeHandle (val) {
      if (val.length > 1) {
        this.$refs.multipleTable.clearSelection()
        this.$refs.multipleTable.toggleRowSelection(val.pop())
      } else {
        this.dataListSelections = val.pop()
      }
      console.log(this.dataListSelections)
    },
    // 全选
    // selectAll (val) {
    //   console.log(val)
    // },
    addReact () {
      this.visible = false
      this.$emit('selectEmit', this.dataListSelections)
    }
  }
}
</script>
<style lang="scss">
.react-facity {
  .el-pagination {
    text-align: right;
    margin-top: 8px;
  }
}
</style>