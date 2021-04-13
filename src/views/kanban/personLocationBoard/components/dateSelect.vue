<template>
  <div class='date-select-container'>
    <el-date-picker :value="dateVal"
                    @input="getvalue"
                    type="daterange"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    value-format="yyyy-MM-dd"
                    :clearable="false">
    </el-date-picker>
    <el-button icon="el-icon-search"
               @click="$emit('search')"></el-button>
  </div>
</template>

<script>
import { dateFormater } from '@/utils/commond'
export default {
  props: {
    value: {
      type: Array
    },
    timeSlot: { // 默认时间天数
      type: [Number],
      default: 7
    }
  },
  components: {},
  data () {
    return {
      dateVal: this.value
    }
  },
  created () {
    if (this.dateVal.length === 0) {
      this.dateVal = this.getTimeSlot()
      this.$emit('input', this.dateVal)
    }
  },
  mounted () { },
  computed: {},
  watch: {
    timeSlot (val, oldval) {
      this.dateVal = this.getTimeSlot()
      this.$emit('input', this.dateVal)
      this.$emit('search')
    }
  },
  methods: {
    getvalue (val) {
      this.dateVal = val
      this.$emit('input', val)
    },
    getTimeSlot () {
      let dateNow = new Date()
      var dateOld = new Date(dateNow.getTime() - (this.timeSlot - 1) * 24 * 60 * 60 * 1000)
      return [(dateFormater('yyyy-MM-DD', dateOld)), (dateFormater('yyyy-MM-DD', dateNow))]
    }
  }
}
</script>

<style lang='scss' scoped>
.date-select-container {
  /deep/ .el-range-editor--medium.el-input__inner {
    height: 24px;
  }
  /deep/ .el-date-editor--daterange.el-input__inner {
    width: 217px;
  }
  @media screen and (max-width: 1250px) {
    /deep/ .el-date-editor--daterange.el-input__inner {
      width: 190px;
    }
  }
  /deep/ .el-range-editor.el-input__inner {
    padding: 0;
  }
  /deep/ .el-input__icon.el-range__icon.el-icon-date {
    display: none;
  }
  /deep/ .el-input__inner {
    background-color: #4e58785e;
    border-radius: 4px 0px 0px 4px;
    border: 0;
    input {
      background-color: #fff0;
    }
    .el-range-separator {
      color: #fff;
      line-height: 24px;
    }
    .el-range-input {
      color: #fff;
      width: 42%;
    }
  }
  /deep/ .el-button--medium {
    width: 24px;
    height: 24px;
    padding: 0;
    border-color: #2c78bb;
    border-radius: 0px 4px 4px 0px;
    background-color: #2c78bb;
    margin-left: -4px;
    /deep/ .el-icon-search {
      color: #fff;
      font-size: 15px;
      font-weight: bold;
    }
  }
}
</style>
