<template>
  <div class="cesium-person-list-container">
    <message-layout height="calc(50vh - 45px)" name="人员列表">
      <el-table :data="dataList" class="com-map" style="width: 100%" width="338px" ref="singleTables" highlight-current-row height="100%" @current-change="handleCurrentChange" v-loading="dataListLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
        <el-table-column prop="gh" label="工号"></el-table-column>
        <el-table-column prop="name" label="人员姓名"></el-table-column>
        <el-table-column prop="cgformName" label="人员类型"></el-table-column>
      </el-table>
    </message-layout>
  </div>
</template>

<script>
import messageLayout from '../components/messageLayout'
export default {
  inject: ['cesiumMap'], // 多级祖孙传值-接受方
  components: {
    messageLayout
  },
  props: {},
  data () {
    return {
      dataList: [], // 人员列表
      dataListLoading: false,
      personCache: null
    }
  },
  methods: {
    handleCurrentChange (val) {
      if (this.personCache) {
        this.cesiumMap.$refs.mapShow.setPtAminationVisible(null, [this.personCache], false, null) // 关闭之前的闪动效果
      }
      this.cesiumMap.$refs.mapShow.flyTo(val.deveui)
      this.cesiumMap.$refs.mapShow.setPtAminationVisible(null, [val.deveui], true, { color: '#00d400', radius: 50 }) // 闪动效果
      this.personCache = val.deveui
    }
  },
  beforeDestroy () {
    this.cesiumMap.$refs.mapShow.setPtAminationVisible(null, [this.personCache], false, null) // 关闭之前的闪动效果
  }
}
</script>

<style lang="scss">
.cesium-person-list-container {
  .el-table__body-wrapper {
    overflow-x: hidden;
  }
}
</style>