<template>
  <div class="num-horn-container">
    <img class="horn-top-left" src="~@/assets/img/souBoard/souBoard_horn.png" alt="horn1">
    <img class="horn-top-right" src="~@/assets/img/souBoard/souBoard_horn.png" alt="horn1">
    <img class="horn-bottom-left" src="~@/assets/img/souBoard/souBoard_horn.png" alt="horn1">
    <img class="horn-bottom-right" src="~@/assets/img/souBoard/souBoard_horn.png" alt="horn1">
  </div>
</template>

<script>
  export default {
    props: {
    },
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

<style lang="scss">
  .num-horn-container {
    img{
      width: 5px;
      height: 5px;
      position: absolute;
    }
    .horn-top-left{
      top: 0;
      left: 0;
      transform: rotateZ(180deg);
    }
    .horn-top-right{
      top: 0;
      right: 0;
      transform: rotateZ(-90deg);
    }
    .horn-bottom-left{
      bottom: 0;
      left: 0;
      transform: rotateZ(90deg);
    }
    .horn-bottom-right{
      bottom: 0;
      right: 0;
    }
  }
</style>
