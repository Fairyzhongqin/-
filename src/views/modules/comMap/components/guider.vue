<!--
 * @Descripttion: 
 * @version: 
 * @Author: Mr.What
 * @Date: 2019-11-13 20:37:25
 * @LastEditors: Mr.What
 * @LastEditTime: 2019-11-13 21:19:28
 -->
<template>
  <div class="map-guider-container">
    <div>
      <el-popover placement="left-start"
                  title="小贴士"
                  width="200"
                  trigger="click"
                  content="我是地图向导">
        <el-button slot="reference"
                   class="guider-button">?</el-button>
      </el-popover>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {

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
.map-guider-container {
  position: absolute;
  top: 5px;
  right: 5px;
  .guider-button {
    border-radius: 50%;
    width: 28px;
    height: 28px;
    line-height: 100%;
    padding: 0;
    font-size: 16px;
  }
}
</style>
