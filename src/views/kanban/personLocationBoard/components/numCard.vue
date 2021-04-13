<template>
  <div class='num-card-container'>

    <div class="card-title">{{dataVal.name}}</div>
    <div class="card-value"><number-grow :value="Number(dataVal.value)" :fonts="40" :lineH="40"></number-grow></div>
  </div>
</template>

<script>
import numberGrow from '@/components/NumberGrow'
export default {
  props: {
    dataVal: {
      type: Object,
      default: () => {
        return {
          name: '标题',
          value: 100
        }
      }
    }
  },
  components: { numberGrow },
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
.num-card-container {
  height: 100%;
  background: rgba(3, 9, 35, 0.14);
  background-image: url("~@/assets/img/bg_little_title.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  box-shadow: 0 2px 0px 0px #0000003b;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .card-title {
    // margin-top: 13px;
    font-size: 16px;
  }
  .card-value {
    // margin-top: 10px;
    font-size: 40px;
    color: #00c6ff;
  }
}
</style>
