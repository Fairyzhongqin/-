<!--
 * @Descripttion:
 * @version:
 * @Author: Mr.What
 * @Date: 2020-01-02 19:46:26
 * @LastEditors  : Mr.What
 * @LastEditTime : 2020-01-04 15:03:10
 -->
<template>
  <div class="cesium-map-dialog-container">
    <message-layout height="calc(50vh - 45px)" width="500px;" name="建筑分层" label-position="right">
      <three-map-dialog ref="mapContent" @loaded="loadSuccessHandle" :personList="dataList"></three-map-dialog>
    </message-layout>
  </div>
</template>

<script>
import messageLayout from '../components/messageLayout'
import threeMapDialog from '@/components/ThreeMapDialog'
export default {
  components: {
    messageLayout,
    threeMapDialog
  },
  data () {
    return {
      loadStatus: false,
      dataList: []
    }
  },
  created () { },
  mounted () { },
  computed: {},
  watch: {},
  methods: {
    init (buildId) {
      this.$refs.mapContent.init(buildId)
    },
    loadSuccessHandle () {
      this.loadStatus = true
    },
    initPerson (id, name, type, x, y, floor, base64) {
      if (this.loadStatus) {
        this.$refs.mapContent.loadPoints(id, name, type, x, y, floor, base64)
      }
    },
    removePoint (ids, type) {
      this.$refs.mapContent.removePoint(ids, type)
    }
  }
}
</script>

<style lang="scss">
.cesium-map-dialog-container {
  .cesium-message-layout-container {
  }
}
</style>
