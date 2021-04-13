<template>
  <videoPlayer ref="videoPlayer" :style="'width:'+width+'px;height:'+height||200+'px'" @timeupdate="onPlayerTimeupdate($event)" @play="onPlayerPlay($event)" @pause="onPlayerPause($event)" @ended="onPlayerEnded($event)" @loadeddata="onPlayerLoadeddata($event)" @canplaythrough="onPlayerCanplaythrough($event)" class="vjs-custom-skin videoPlayer" :options="playerOptions"></videoPlayer>
</template>

<script>
import 'video.js/dist/video-js.css'
import { videoPlayer } from 'vue-video-player'
import 'vue-video-player/src/custom-theme.css' // 引入样式
import 'videojs-flash'

export default {
  props: {
    width: {
      type: Number,
      default: 250
    },
    height: {
      type: Number
    }
  },
  components: {
    videoPlayer
  },
  data () {
    return {
      playerOptions: {},
      src: ''
    }
  },
  computed: {
    player () {
      return this.$refs.videoPlayer.player
    }
  },
  mounted () {
  },
  methods: {
    init (src) {  // 这里可以设置src 'rtmp://127.0.0.1:1935/live/'
      if (this.src === src) { // 如果播放地址没变 则不执行init函数
        return
      }
      this.src = src // 缓存播放地址
      this.playerOptions = {
        height: this.height || this.$refs.videoPlayer.$el.clientHeight,
        sources: [
          {
            type: 'rtmp/flv', // 直播视频流 直播只有暂停和播放事件
            src: src
          }
        ],
        techOrder: ['flash'],
        muted: true, // 默认静音
        preload: 'auto', // 视频预加载
        autoplay: false,
        controls: true,
        flash: {
          swf: require('@/assets/video/video-js.swf')
        },
        notSupportedMessage: '此视频暂无法播放，请稍后再试'
      }
      console.log('this is current player instance object', this.player)
    },
    // 视频结束的时候
    onPlayerEnded (player) {
      console.log('ended')
      console.log(player.currentTime())
    },
    // 加载数据
    onPlayerLoadeddata (player) {
      // 直播每次播放都会调用--录播只是刚开始调用一次
      console.log('loadeddata')
      console.log(player.currentTime())
    },
    onPlayerCanplaythrough (player) {
      // 在不停下来进行缓冲的情况下--每次拖拽的时候都会缓冲
      console.log('canplaythrough')
      console.log(player.currentTime())
    },
    onPlayerPlay (player) {
      console.log('播放', player.currentTime())
    },
    onPlayerTimeupdate (player) {
      // console.log("当前视频秒数", player.currentTime());
    },
    onPlayerPause (player) {
      console.log('暂停', player.currentTime())
    },
    // 时间格式 2019-04-02
    formatDate () {
      var date = new Date()
      const year = date.getFullYear()
      const month = this.timeFormat(date.getMonth() + 1)
      const day = this.timeFormat(date.getDate())
      const hour = this.timeFormat(date.getHours())
      const minute = this.timeFormat(date.getMinutes())
      const second = this.timeFormat(date.getSeconds())
      const allDate =
        year +
        '-' +
        month +
        '-' +
        day +
        ' ' +
        hour +
        ':' +
        minute +
        ':' +
        second
      return allDate
    },
    // 倒计时小于10
    timeFormat (param) {
      // 小于10的格式化函数
      return param < 10 ? '0' + param : param
    }
  }
}
</script>

<style></style>
