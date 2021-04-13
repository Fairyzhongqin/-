<template>
  <div class='default-select-container'>
    <el-select v-model="value"
               placeholder="请选择">
      <el-option v-for="item in options"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      value: '今日',
      options: [{
        value: '今日',
        label: '今日'
      }, {
        value: '本周',
        label: '本周'
      }, {
        value: '本月',
        label: '本月'
      }]
    }
  },
  created () { },
  mounted () { },
  computed: {},
  watch: {},
  methods: {}
}
</script>

<style lang='scss' scoped>
.default-select-container {
  /deep/ .el-select {
    width: 60px;
    .el-input {
      .el-input__inner {
        height: 24px;
        padding: 0 0 0 12px;
        font-size: 12px;
        color: #fff;
        background-color: #4e58785e;
        border-color: #4e58785e;
      }
      .el-input__suffix {
        right: 0;
        .el-select__caret {
          line-height: 24px;
        }
      }
    }
  }
}
</style>
