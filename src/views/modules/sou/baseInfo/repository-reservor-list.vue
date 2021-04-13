<template>
  <el-dialog title="库房列表"
             :close-on-click-modal="false"
             :visible.sync="visible"
             width="50%"
             class="resoriveList-dialog"
             v-if="dataList.length !== 0">

    <el-table :data="dataList"
              border
              max-height="500"
              v-loading="dataListLoading"
              style="width: 100%;">

      <!-- <el-table-column type="index"
                       header-align="center"
                       align="center"
                       width="50"></el-table-column> -->
      <el-table-column prop="code"
                       header-align="center"
                       align="center"
                       width="100"
                       label="仓库编号">
      </el-table-column>
      <el-table-column prop="name"
                       header-align="center"
                       align="center"
                       label="仓库名称">
      </el-table-column>
      <el-table-column prop="capacity"
                       header-align="center"
                       align="center"
                       label="仓库容量/m²">
      </el-table-column>
      <el-table-column prop="positionX"
                       header-align="center"
                       align="center"
                       label="X轴坐标">
      </el-table-column>
      <el-table-column prop="positionY"
                       header-align="center"
                       align="center"
                       label="Y轴坐标">
      </el-table-column>
      <el-table-column prop="positionZ"
                       header-align="center"
                       align="center"
                       label="Z轴坐标">
      </el-table-column>
      <el-table-column prop="remarks"
                       header-align="center"
                       align="center"
                       label="备注">
      </el-table-column>

    </el-table>
    <!-- <el-pagination @size-change="sizeChangeHandle"
                   @current-change="currentChangeHandle"
                   :current-page="pageIndex"
                   :page-sizes="[10, 20, 50, 100]"
                   :page-size="pageSize"
                   :total="totalPage"
                   layout="total, sizes, prev, pager, next, jumper"></el-pagination> -->

    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
      <!-- <el-button type="primary"
                 :disabled="isDisabled"
                 @click="dataFormSubmit()">确定</el-button> -->
    </span>
  </el-dialog>
</template>

<script>
// import { repositoryList } from '@/api/sou/equlpment'
import { getReservorList } from '@/api/sou/baseInfo'
export default {
  components: {},
  data () {
    return {
      visible: false,
      isDisabled: false,
      dataList: [],

      dataListLoading: false

    }
  },
  created () { },
  mounted () { },
  computed: {},
  watch: {},
  methods: {
    init (id) {
      this.visible = true
      this.dataListLoading = true
      this.dataList = []
      getReservorList({ id: id }).then(({ data }) => {
        if (data && data.code === 0) {
          // this.dataList = data.list
          data.list.length > 0 ? this.dataList = data.list : this.$message.warning('没有库房')
        } else {
          this.dataList = []
        }
        this.dataListLoading = false
      }).catch(err => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
      })
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
