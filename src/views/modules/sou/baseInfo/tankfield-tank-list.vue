<template>
  <el-dialog title="储罐列表"
             :close-on-click-modal="false"
             :visible.sync="visible"
             width="50%"
             v-if="dataList.length !== 0"
             class="tankList-dialog">
    <el-table :data="dataList"
              border
              max-height="500"
              v-loading="dataListLoading"
              style="width: 100%;">

      <el-table-column type="id"
                       v-if="false"
                       header-align="center"
                       align="center"
                       width="50"></el-table-column>
      <!-- <el-table-column type="selection"
                       header-align="center"
                       align="center"
                       width="50"></el-table-column> -->
      <el-table-column prop="code"
                       header-align="center"
                       align="center"
                       width="100"
                       label="储罐编号">
      </el-table-column>
      <el-table-column prop="name"
                       header-align="center"
                       align="center"
                       label="储罐名称">
      </el-table-column>
      <el-table-column prop="capacity"
                       header-align="center"
                       align="center"
                       label="储罐容量">
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
import { viewTankList } from '@/api/sou/baseInfo'
export default {
  data () {
    return {
      visible: false,
      dataListLoading: false,
      dataList: []
    }
  },
  methods: {
    // 初始化数据列表
    init (id) {
      this.visible = true
      this.dataListLoading = true
      viewTankList({ id: id }).then(({ data }) => {
        if (data && data.code === 0) {
          data.list.length > 0 ? this.dataList = data.list : this.$message.warning('没有储罐')
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
