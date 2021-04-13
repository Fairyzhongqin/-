<template>
  <div class="map-fence-tool-container">
    <el-button @click="topCheckpoint('start')">开始选点</el-button>
    <el-button @click="topCheckpoint('stop')">结束选点</el-button>
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
    methods: {
      topCheckpoint (val) {
        this.$emit('handleClick', val + '-select')
      }
    }
  }
</script>

<style lang='scss' scoped>
.map-fence-tool-container {
  width: 100%;
  height: 40px;
}
</style>
