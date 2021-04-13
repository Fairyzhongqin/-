<template>
  <div class='num-card-container'>
    <div class="card-title">{{dataVal.name}}</div>
    <div class="card-value">
      <number-grow :value="Number(dataVal.value)"
                   :fonts="26"
                   :fontc="dataVal.name=='今日告警数'?'#FF2829':''"
                   :lineH="20"></number-grow>
    </div>
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
          value: 0
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
  watch: {
    dataVal (newValue) {
      console.log(newValue)
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.num-card-container {
  height: 58px;
  text-align: center;
  width: 100%;
  line-height: 58px;
  div {
    display: inline-block;
    vertical-align: middle;
  }
  .card-title {
    font-size: 16px;
    margin-right: 4px;
  }
  .card-value {
    font-size: 26px;
    color: #00c6ff;
    margin-top: -4px;
  }
  .card-red {
    color: #ff2829;
  }
}
</style>
