<template>
  <!-- 点击图表展示弹框 -->
  <!--  car(车辆)，checkpoint(卡口)，camera(摄像头)，beacon(信标)，base_station(基站)，person(人员)   -->
  <div class="hazards-left">
    <el-row>
      <div class="bounced-title">
        <el-col :span="4" class="close-left" align="left">
          <div class="bounced-title-right">
            <i class="el-icon-caret-right"></i>
            <i class="el-icon-caret-right"></i>
          </div>
        </el-col>
        <el-col :span="20" align="center">{{data.type | filterType}}</el-col>
      </div>
    </el-row>
    <el-form label-width="90px">
      <div v-if="data.type === 'person'">
        <el-form-item label="人员姓名">{{data.person.name}}</el-form-item>
        <el-form-item label="人员工号">{{data.person.gh}}</el-form-item>
        <el-form-item label="人员类别">{{data.person.cgformName}}</el-form-item>
      </div>
      <div v-if="data.type === 'car'">
        <el-form-item label="车牌号">{{data.vehicle.numberPlates}}</el-form-item>
        <el-form-item label="车主">{{data.vehicle.numberPlates}}</el-form-item>
        <el-form-item label="联系电话">{{data.vehicle.numberPlates}}</el-form-item>
      </div>
      <div v-if="data.type === 'checkpoint'">
        <el-form-item label="卡口名称">{{data.checkpoint.name}}</el-form-item>
        <el-form-item label="值班人员">{{data.checkpoint.personShow}}</el-form-item>
      </div>
      <div v-if="data.type === 'camera'">
        <el-form-item label="储罐容量">{{data.tankCapacity}}</el-form-item>
        <el-form-item label="储罐形状">{{data.tankShape}}</el-form-item>
        <el-form-item label="储罐形式">{{data.tankType}}</el-form-item>
        <el-form-item label="储存物品名称">{{data.tankGood}}</el-form-item>
      </div>
      <div v-if="data.type === 'beacon'">
        <el-form-item label="储罐容量">{{data.tankCapacity}}</el-form-item>
        <el-form-item label="储罐形状">{{data.tankShape}}</el-form-item>
        <el-form-item label="储罐形式">{{data.tankType}}</el-form-item>
        <el-form-item label="储存物品名称">{{data.tankGood}}</el-form-item>
      </div>
      <div v-if="data.type === 'base_station'">
        <el-form-item label="储罐容量">{{data.tankCapacity}}</el-form-item>
        <el-form-item label="储罐形状">{{data.tankShape}}</el-form-item>
        <el-form-item label="储罐形式">{{data.tankType}}</el-form-item>
        <el-form-item label="储存物品名称">{{data.tankGood}}</el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'hazards-right',
  data () {
    return {
      data: {
        type: 'person',
        person: {cgformName: '内部员工', name: '姓名', gh: '工号'},
        vehicle: {numberPlates: '苏A-1564'},
        checkpoint: {personShow: '卡口名称', name: '张三,李四'},
        camera: {username: '用户名', code: '编号'}
      }
    }
  },
  filters: {
    // 0-库区、1-库房、2-生产场所、3-罐区、4-储罐）
    filterType (val) {
      switch (val) {
        case 'person' :
          return '人员信息'
        case 'checkpoint':
          return '卡口信息'
        case 'camera' :
          return '摄像头信息'
        case 'beacon' :
          return '信标信息'
        case 'base_station' :
          return '基站信息'
        case 'car' :
          return '车辆信息'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.hazards-left {
  width: 260px;
  // height: calc(100vh - 22px);
  margin: 8px 0 0 8px;
  background: linear-gradient(
    0deg,
    rgba(230, 224, 224, 0.8),
    rgba(0, 0, 0, 0.7)
  );
  box-shadow: 0px 0px 4px 0px rgba(37, 39, 50, 0.5);
  border-radius: 4px;
  padding: 10px;
  .bounced-title {
    width: 100%;
    height: 35px;
    line-height: 35px;
    padding: 0 15px;
    border-bottom: 1px solid #5a5a5a;
    font-size: 14px;
    font-weight: bold;
    color: rgba(254, 254, 254, 1);
    text-shadow: 0px 0px 6px rgba(0, 198, 255, 1);
    margin-bottom: 8px;
    .close-left {
      padding-top: 9px;
    }
    .bounced-title-right {
      cursor: pointer;
      width: 24px;
      padding: 0px 1px 0px 1px;
      height: 16px;
      background: rgba(199, 199, 204, 0.08);
      border-radius: 2px;
      background-image: radial-gradient(#313130 55%, #1c72c3);
      .el-icon-caret-right {
        color: #00c6ff;
        font-size: 12px;
        width: 4px;
        height: 8px;
        position: relative;
        bottom: 8px;
      }
    }
  }
  /deep/ .el-form-item__label {
    color: #fff;
    font-size: 12px;
  }
  /deep/ .el-form-item__content {
    color: #fff;
    font-size: 12px;
  }
}
</style>