<!--
 * @Descripttion: 
 * @version: 
 * @Author: Mr.What
 * @Date: 2019-12-30 14:07:48
 * @LastEditors  : Mr.What
 * @LastEditTime : 2019-12-31 10:14:52
 -->
<template>
  <div class="cesium-num-input-container">
    <el-tag @click="reduce" size="mini">
      <i class="el-icon-minus"></i>
    </el-tag>
    <el-input :value="value" @input="handleChange" size="mini"></el-input>
    <el-tag @click="plus" size="mini">
      <i class="el-icon-plus"></i>
    </el-tag>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: [Number, String]
    },
    accuracy: { // 加减的精确度
      type: Number,
      default: 0.01
    }
  },
  components: {},
  data () {
    return {
      decimal: 2 // 记录小数点位数 为什么需要这么麻烦呢 看这个吧 https://www.cnblogs.com/lonelyxmas/p/9223480.html
    }
  },
  created () { },
  mounted () { },
  computed: {},
  watch: {
    value: {
      handler (val, oldVal) {
        if (this.value.toString().split('.').length > 1) {
          this.decimal = this.value.toString().split('.')[1].length
        }
      },
      immediate: true
    }
  },
  methods: {
    handleChange () {
      this.$emit('input', Number(event.target.value))
    },
    reduce () {
      this.$emit('input', (this.value * Math.pow(10, this.decimal) - this.accuracy * Math.pow(10, this.decimal)) / Math.pow(10, this.decimal))
    },
    plus () {
      this.$emit('input', (this.value * Math.pow(10, this.decimal) + this.accuracy * Math.pow(10, this.decimal)) / Math.pow(10, this.decimal))
    }
  }
}
</script>

<style lang="scss">
.cesium-num-input-container {
  .el-tag {
    cursor: pointer;
  }
  .el-input {
    width: 90px;
    .el-input__inner {
      background-color: rgba(255, 255, 255, 0);
      border-color: #5794c9cc;
      color: #fff;
      padding: 2px;
    }
  }
}
</style>
