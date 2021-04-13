<template>
  <div class='equlpment-container'>
    <border-card title="风险类型占比"
                 subTitle="Risk Type"
                 :minHeight="120">
      <div class="info-bar">
        <div class="info-item"
             v-for="(item, index) in infoData"
             :key="index">
          <div class="icon-item"
               @click="item.fun">
            <icon-svg class="tool-icon"
                      :name="item.icon"></icon-svg>
          </div>
          <div class="info-text">
            <div class="info-text-num">
              <number-grow :value="Number(item.value)" fontc="#FFF" :lineH="20"></number-grow>
            </div>
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
import numberGrow from '@/components/NumberGrow'
export default {
  components: {
    borderCard,
    numberGrow
  },
  data () {
    return {
      infoData: [{
        name: '储罐个数',
        value: 0,
        icon: 'tank',
        fun: () => { this.$router.push({ path: '/pos/device/baseStation' }) }
      }, {
        name: '生产装置',
        value: 0,
        icon: 'device',
        fun: () => { this.$router.push({ path: '/pos/device/beacon' }) }
      }, {
        name: '摄像头数',
        value: 0,
        icon: 'camera2',
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
    padding: 15px 0;
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
        font-size: 22px;
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
