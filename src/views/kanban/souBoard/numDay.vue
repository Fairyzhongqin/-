<template>
  <div class='num-day-container'>
    <NumHorn></NumHorn>
    <p class="title">我公司已安全生产<span class="title-day"><number-grow :value="Number(dayNum)" :fonts="26"></number-grow></span>天<span class="title-date">（从{{prodDate||'-'}}起）</span></p>
  </div>
</template>

<script>
  import numCard from './components/numCard'
  import NumHorn from './components/NumHorn'
  import numberGrow from '@/components/NumberGrow'
  import { getDateDiff } from '@/utils'
  import { homeInfo } from '@/api/sou/home'

  export default {
    components: {
      numCard,
      NumHorn,
      numberGrow
    },
    data () {
      return {
        dayNum: 0,
        prodDate: ''
      }
    },
    created () {
      homeInfo().then(({ data }) => {
        if (data && data.code === 0) {
          this.prodDate = data.data.productionDate.replace(/-/g, '.')
        } else {
          this.$message.error(data.msg)
        }
        this.getDateNum() // 获取生产天数
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
        this.dataListLoading = false
      })
    },
    mounted () {},
    computed: {},
    watch: {},
    methods: {
      // 获取生产天数
      getDateNum () {
        let nowDate = new Date()
        let date = {
          year: nowDate.getFullYear(),
          month: nowDate.getMonth() + 1,
          date: nowDate.getDate()
        }
        if (this.prodDate) {
          let startDateStr = this.prodDate.replace(/\./g, '-') + ' ' + '00:00:00'
          let nowDateStr = date.year + '-' + 0 + date.month + '-' + 0 + date.date + ' ' + '00:00:00'
          this.dayNum = getDateDiff(startDateStr, nowDateStr, 'day')
        }
      }
    }
  }
</script>

<style lang="scss">
  .num-day-container {
    height: 58px;
    line-height: 58px;
    margin-left: 4px;
    margin-right: 8px;
    position: relative;
    box-shadow:0px 2px 4px 0px rgba(6,12,24,0.4);
    .title{
      margin: 0;
      font-size: 12px;
      color: #fff;
      background: rgba(3, 9, 35, 0.14);
      background-image: url("~@/assets/img/bg_little_title.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
      text-align: center;
      &-day{
        text-align: center;
        display: inline-block;
        vertical-align: middle;
        line-height: 1;
        font-size: 26px;
        color: #00C6FF;
        padding: 7px 34px;
        margin: 0 7px;
        background-color: transparent;
        box-shadow: inset 0px -1px 10px 0px
        #00c6ff;
        /*border-style: solid;*/
        /*border-width: 1px;*/
        /*border-image-source: linear-gradient(0deg,*/
          /*rgba(0, 198, 255, 0.96) 0%,*/
          /*#00c6ff 52%,*/
          /*rgba(0, 198, 255, 0.96) 100%);*/
        /*border-image-slice: 1;*/
      }
      &-date{
        color: #ffffff80;
      }
    }
  }
</style>
