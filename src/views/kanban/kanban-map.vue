<template>
  <!-- 看板 -->
  <div>
    <div class="kanban-map">
      <div class="kanban-map-title">
        安全生产信息管理化平台
      </div>
      <div class="kanban-map-title"
           style="cursor: pointer;"
           @click="clicks">
        系统切换
      </div>
      <kanbanMap />

    </div>
    <switch-system ref="switchSystem"
                   @switchNavBar='switchNavBar'></switch-system>
    <!-- <img src="~@/assets/img/map.jpg"
         alt=""> -->
  </div>
</template>
<script>
import SwitchSystem from '../main-navbar-switch-system'
import kanbanMap from './components/kanban-map-earts'
export default {
  data () {
    return {}
  },
  components: { kanbanMap, SwitchSystem },
  created () {
  },
  methods: {
    switchNavBar () {

    },
    clicks () {
      this.$nextTick(() => {
        this.$refs.switchSystem.init()
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.kanban-map {
  width: 33%;
  left: 33%;
  z-index: 100;
  height: 100vh;
  position: absolute;
  top: 0;
  // background: linear-gradient(
  //   to right,
  //   rgba(19, 58, 121, 0.8),
  //   rgba(14, 37, 87, 1)
  // );
  text-align: center;
  padding: 10px;
  .kanban-map-title {
    width: 220px;
    margin: 0 auto;
    text-align: center;
    // color: #fff;
    font-size: 20px;
    // border-top: 1px solid;
    // border-bottom: 1px solid;
    padding: 10px 0px;
    // border-image: linear-gradient(left #fff, #3a3b3b, #fff) 5 10 5;
  }
}
</style>