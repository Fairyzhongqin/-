<template>
  <div class='showDemo-container'>
    <video autoplay="autoplay"
           loop="loop"
           id="video"
           :muted="'muted'"
           volume="0">
      <source src="~@/assets/video/bgVideo.mp4"
              type="video/mp4">;
    </video>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {

    }
  },
  created () { },
  mounted () { },
  computed: {},
  watch: {},
  methods: {}
}
</script>

<style lang='scss' scoped>
.showDemo-container {
  video {
    position: fixed;
    right: 0px;
    bottom: 0px;
    min-width: 100%;
    min-height: 100%;
    height: auto;
    width: auto;
  }
}
</style>
