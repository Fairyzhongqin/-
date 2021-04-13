<!-- 检查项弹框 -->
<template>
  <el-dialog :close-on-click-modal="true" class="check-table-add-input-dialog" width="600px" append-to-body :visible.sync="visible" @close="handleClose()">
    <el-input type="textarea" v-model="content" maxlength="500" show-word-limit>
    </el-input>
  </el-dialog>
</template>

<script>
export default {
  components: {
  },
  data () {
    return {
      content: '',
      visible: false
    }
  },
  created () {

  },
  methods: {
    // 页面初始化时加载的事件
    // 初始数据
    init () {
      this.isDisabled = false
      this.visible = true
      this.$nextTick(() => {
      })
    },
    handleClose () {
      this.$emit('selectcheckInput', this.content)
    }

  }
}
</script>
<style lang="scss">
.check-table-add-input-dialog {
  .el-select {
    width: 100%;
  }
  .el-date-editor.el-input {
    width: 100%;
  }
}
</style>


