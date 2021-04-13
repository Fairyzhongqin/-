<template>
  <div class='equlpment-container'>
    <border-card title="设备看板" subTitle="equlpment" :minHeight="120">
      <div class="info-bar">
        <div class="info-item" v-for="(item, index) in infoData" :key="index">
          <div class="icon-item" @click="item.fun">
            <icon-svg class="tool-icon" :name="item.icon"></icon-svg>
          </div>
          <div class="info-text">
            <div class="info-text-num">{{item.value}}</div>
            <div class="info-text-name">{{item.name}}</div>
          </div>
        </div>
      </div>
    </border-card>
  </div>
</template>

<script>
import borderCard from './components/borderCard'
import { getdevicecount } from '@/api/kanban/per'
export default {
  components: {
    borderCard
  },
  data () {
    return {
      infoData: [{
        name: '基站数',
        value: 0,
        icon: 'jizhan',
        fun: () => { this.$router.push({ path: '/pos/device/baseStation' }) }
      }, {
        name: '信标点数',
        value: 0,
        icon: 'xinbiao',
        fun: () => { this.$router.push({ path: '/pos/device/beacon' }) }
      }, {
        name: '胸卡总数',
        value: 0,
        icon: 'bayonet',
        fun: () => { this.$router.push({ path: '/pos/device/device' }) }
      }]
    }
  },
  created () {
    this.getData()
  },
  mounted () { },
  computed: {},
  watch: {},
  methods: {
    getData () {
      getdevicecount({}).then(res => {
        if (res.data.code === 0) {
          this.infoData[0].value = res.data.deviceMap['jzCount']
          this.infoData[1].value = res.data.deviceMap['xbCount']
          this.infoData[2].value = res.data.deviceMap['xkCount']
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.equlpment-container {
  .info-bar {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    .info-item {
      display: flex;
      flex-direction: row;
      &:hover {
        cursor: pointer;
        .info-text-num {
          text-decoration: underline;
        }
      }
      .icon-item {
        width: 42px;
        height: 42px;
        border: 1px solid rgba(199, 199, 204, 1);
        border-radius: 50%;
        line-height: 48px;
        font-size: 30px;
        text-align: center;
        color: #c7c7cc;
      }
      .info-text {
        margin-left: 7px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .info-text-num {
          font-size: 18px;
        }
        .info-text-name {
          margin-top: 5px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
        }
      }
    }
  }
}
</style>
