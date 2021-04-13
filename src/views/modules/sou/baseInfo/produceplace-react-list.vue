<template>
  <el-dialog title="反应装置列表"
             :close-on-click-modal="false"
             :visible.sync="visible"
             width="50%"
             v-if="dataList.length !== 0"
             class="reactList-dialog">
    <el-table :data="dataList"
              border
              max-height="500"
              v-loading="dataListLoading"
              @selection-change="selectionChangeHandle"
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
                       label="装置编号">
      </el-table-column>
      <el-table-column prop="name"
                       header-align="center"
                       align="center"
                       label="装置名称">
      </el-table-column>
      <el-table-column prop="chemical"
                       header-align="center"
                       width="150"
                       :show-overflow-tooltip="true"
                       align="center"
                       label="涉及危险化学品">
      </el-table-column>
      <el-table-column prop="technology"
                       header-align="center"
                       align="center"
                       width="150"
                       :show-overflow-tooltip="true"
                       label="涉及高危工艺">
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
import { viewReactList } from '@/api/sou/baseInfo'
export default {
  data () {
    return {
      visible: false,
      dataListLoading: false
    }
  },
  methods: {
    init (id) {
      this.visible = true
      this.dataListLoading = true
      viewReactList({ id: id }).then(({ data }) => {
        if (data && data.code === 0) {
          data.list.length > 0 ? this.dataList = data.list : this.$message.warning('没有库房')
        } else {
          this.dataList = []
        }
        this.dataListLoading = false
      }).catch(err => {
        console.log(err)
        this.$message.err('未知异常！请联系管理员')
      })
    }
  }

}
</script>
<style lang="scss" scoped>
</style>
