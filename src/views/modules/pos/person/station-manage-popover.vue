<!--岗位列表 - 添加班组 popover -->
<template>
  <div class="stationManage-popover">
    <el-popover
      placement="top"
      width="200"
      v-model="popoverVisible"
      trigger="click">
      <p>班次不够？点击确定，添加新的班次</p>
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="popoverVisible = false">取消</el-button>
        <el-button type="primary" size="mini" @click="addTimes()">确定</el-button>
      </div>
      <i class="el-icon-info" style="cursor:pointer;" slot="reference"></i>
    </el-popover>
  </div>
</template>
<script>
export default {
  data () {
    return {
      popoverVisible: false
    }
  },
  created () {
  },
  methods: {
    // 点击一行选中
    addTimes (row) {
      this.$emit('addTimes')
    }
  }
}
</script>
<style lang="scss">
  .stationManage-popover{
    display: inline-block;
  }
</style>
