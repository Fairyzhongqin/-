<template>
  <div class="zoneView">
    <!-- 库区 -->
    <repository @selectView="selectView" v-if="viewShow === '0'"  />
    <!-- 库房 -->
    <depository @selectView="selectView" v-if="viewShow === '1'" />
    <!-- 生产场所 -->
    <produceplace @selectView="selectView" v-if="viewShow === '2'" />
    <!-- 罐区 -->
    <tankfield @selectView="selectView" v-if="viewShow === '3'" />
  </div>
</template>
<script>
import repository from './repository-list'
import produceplace from './produceplace-list'
import tankfield from './tankfield-list'
import depository from './depository-list'
export default {
  data () {
    return {
      viewShow: '2'
    }
  },
  components: {repository, produceplace, tankfield, depository},
  methods: {
    selectView (val) {
      this.viewShow = val
    }
  }
}
</script>
<style lang="scss">
.zoneView {
  height: 100%;
  /deep/ .el-table {
    height: calc(100% - 96px);
    overflow: auto;
  }
  .rotateIcon {
    display: inline-block;
    transform: rotate(90deg);
    margin-right: 3px;
  }
  /deep/ .zoneViewSelect {
    width: 120px;
  }
}
</style>
