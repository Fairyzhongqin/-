<template>
  <!-- 人员分布上方展示人数 -->
  <div v-show="personDistributionData.show" class="personDistibution-top">
    <el-row>
      <el-col class="code">{{personDistributionData.code}}</el-col>
      <el-col class="name">{{personDistributionData.zoneName}}</el-col>
      <el-col align="right" class="persorNumber">{{personDistributionData.personNum}}人</el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'gis-person',
  props: {
    personDistributionData: {
      type: Object,
      default: '人员分布展示信息'
    }
  },
  data () {
    return {}
  }
}
</script>
<style lang="scss" scoped>
.personDistibution-top {
  width: 130px;
  height: 62px;
  background: rgba(78, 88, 120, 0.7);
  border: 1px solid #00c6ff;
  font-size: 12px;
  padding: 8px;
  background: linear-gradient(
      -145deg,
      transparent 15px,
      rgba(78, 88, 120, 0.7) 0
    )
    right;
  border: linear-gradient(-145deg, transparent 15px, red 0) right;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  .code {
    color: rgba(255, 255, 255, 0.4);
    padding-bottom: 2px;
  }
  .name {
    color: rgba(254, 254, 254, 1);
    padding-bottom: 4px;
  }
  .persor {
    font-size: 16px;
    font-weight: 800;
    color: rgba(230, 48, 49, 1);
  }
}
</style>
