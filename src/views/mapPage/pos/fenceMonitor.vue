<template>
  <div class="cesium-fence-monitor-container">
    <message-layout height="255px" width="250px" name="围栏监测">
      <!-- 围栏检测报警信息 -->
      <div class="fenceDetection-right">
        <transition-group name="list" mode="out-in">
          <div class="list-item flex flex-row" v-for="(data, id) in dataList" :key="id">
            <div class="icon-bar">
              <div :class="{'icon-enter': data.type==='0','icon-leave': data.type==='1'}"></div>
            </div>
            <div class="info flex flex-column">
              <div class="info-item-date">{{dateTime(data.recordTime)}}</div>
              <div class="info-item">{{data.cgformName + '&nbsp;' + data.name + '&nbsp;[工号' + data.personGh + ']'}}</div>
              <div class="info-item">{{data.infos}}</div>
            </div>
          </div>
        </transition-group>
      </div>
    </message-layout>
  </div>
</template>

<script>
import messageLayout from '../components/messageLayout'

export default {
  props: {
    dataList: {
      type: Array
    }
  },
  components: {
    messageLayout
  },
  data () {
    return {
      // dataList: []
    }
  },
  created () { },
  mounted () { },
  computed: {},
  watch: {},
  methods: {
    dateTime (val) {
      let dt = new Date(val).Format('yyyy-MM-dd hh:mm:ss')
      // window.aaa = dt
      // .Format('yyyy-MM-dd hh:mm:ss')
      return dt
    }
  }
}
</script>

<style lang='scss'>
.cesium-fence-monitor-container {
  font-size: 12px;
  .list-item {
    .icon-bar {
      width: 40px;
      .icon-enter {
        width: 30px;
        height: 30px;
        border-radius: 3px;
        background-image: url('~@/assets/img/enter.png');
        background-repeat: no-repeat;
        background-size: 24px 24px;
        background-color: red;
        background-position: center center;
      }
      .icon-leave {
        width: 30px;
        height: 30px;
        border-radius: 3px;
        background-image: url('~@/assets/img/leave.png');
        background-repeat: no-repeat;
        background-size: 24px 24px;
        background-color: green;
        background-position: center center;
      }
    }
    .info {
      .info-item-date {
        color: #ffffffcc;
        margin-bottom: 3px;
      }
      .info-item {
        color: #fff;
        margin-bottom: 3px;
      }
    }
    margin-bottom: 3px;
  }
  .content {
    padding: 10px;
  }
  /** 插入过程 **/
  .list-enter-active {
    transition: all 1s;
  }
  /** 移除过程 **/
  .list-leave-active {
    transition: all 1s;
  }
  /*** 开始插入、移除结束的位置变化 ***/
  .list-enter,
  .list-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
}
</style>
