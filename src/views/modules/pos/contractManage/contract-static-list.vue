<template>
  <div class="contratAll mod-config">
    <div class="mainPlay">
      <el-button type="primary"
                 class="changeButton"
                 size="mini"
                 @click='handleChange'>
        <span v-if="staticOrchartShow"><i class="el-icon-sort rotateIcon"></i>列表展示</span>
        <span v-if="!staticOrchartShow"><i class="el-icon-sort rotateIcon"></i>图表展示</span>
      </el-button>
      <keep-alive>
        <contract-static-main v-if="!staticOrchartShow"></contract-static-main>
        <contrat-chart v-if="staticOrchartShow"></contrat-chart>
      </keep-alive>
    </div>
  </div>
</template>
<script>
import contractStaticMain from './contract-staticmain'
import contratChart from './contract-chart'
export default {
  data () {
    return {
      staticOrchartShow: true
    }
  },
  components: {
    contractStaticMain,
    contratChart

  },
  methods: {
    handleChange () {
      this.staticOrchartShow = !this.staticOrchartShow
    }
  }
}
</script>
<style lang="scss">
.contratAll {
  position: relative;
  .changeButton {
    position: absolute;
    top: 0;
    right: 0;
    color: #fff;
    .rotateIcon {
      display: inline-block;
      transform: rotate(90deg);
      margin-right: 5px;
    }
  }
  .simple-button {
    color: #fff;
    // border: 0;
    // font-size: 18px;
    // outline: none;
    // padding: 5px 10px;
    background: #aeaaee;
    // border-radius: 4px;

    /* 设置文字阴影 */
    text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.3);

    /* 设置盒子阴影 */
    box-shadow: 0 4px 0 #9cb8d8, 0 3px 20px rgba(0, 0, 0, 0.3);
  }
  .mainPlay {
    height: 100%;
  }
}
</style>
