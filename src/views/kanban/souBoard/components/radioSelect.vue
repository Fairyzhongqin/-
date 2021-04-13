<template>
  <div class='radio-select-container'>
    <el-radio-group v-model="radio"
                    size="small"
                    @change="handleChange()"
                    :class="{'radio-select-normal': mode==='normal','radio-select-divide': mode==='divide'}">
      <el-radio-button v-for="(item, index) in radioData"
                       :key="index"
                       :label="item"></el-radio-button>
    </el-radio-group>
  </div>
</template>

<script>
export default {
  props: {
    radioData: {
      type: Array,
      default: () => ['昨日', '周', '月']
    },
    mode: {
      type: String,
      default: 'normal'
    },
    defaultVal: { // 默认选中值
      type: String
    }
  },
  components: {},
  data () {
    return {
      radio: this.defaultVal ? this.defaultVal : this.radioData[0]
    }
  },
  created () { },
  mounted () { },
  computed: {},
  watch: {},
  methods: {
    handleChange () {
      this.$emit('change', this.radio)
    }
  }
}
</script>

<style lang='scss' scoped>
.radio-select-container {
  .radio-select-normal {
    /deep/ &.el-radio-group {
      .el-radio-button {
        .el-radio-button__inner {
          padding: 5px 15px;
          background-color: rgba(44, 120, 187, 0.4);
          color: #fff;
          border: 0;
        }
        &.is-active {
          .el-radio-button__inner {
            background-color: #2c78bb;
          }
        }
      }
    }
  }
  .radio-select-divide {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    /deep/ &.el-radio-group {
      .el-radio-button {
        .el-radio-button__inner {
          width: 120px;
          padding: 6px 15px;
          background-color: rgba(0, 198, 255, 0.08);
          box-shadow: inset 0 0 8px 0px #0075ff !important;
          color: #fff;
          border: 0;
          border-radius: 0;
        }
        &.is-active {
          .el-radio-button__inner {
            background-color: rgba(0, 198, 255, 0.08);
            box-shadow: inset 0 0 8px 5px #0075ff !important;
          }
        }
      }
    }
  }
}
</style>
