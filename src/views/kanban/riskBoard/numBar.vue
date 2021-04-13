<template>
  <div class='num-bar-container'>
    <NumHorn></NumHorn>
    <el-row>
      <template v-for="item in itemData">
        <el-col :span="6" class="num-bar-container-item" @click.native="item.fun()">
          <p :style="{'background':item.color}"></p>
          <p>{{item.level}}</p>
          <p><number-grow :value="Number(item.value)" :fonts="18" fontc="#fff" :lineH="20"></number-grow></p>
        </el-col>
      </template>
    </el-row>
  </div>
</template>

<script>
import eventBus from '@/bus/index'
import numCard from './components/numCard'
import NumHorn from './components/NumHorn'
import numberGrow from '@/components/NumberGrow'
import { staticData } from '@/api/kanban/souBoard'
export default {
  components: {
    numCard,
    NumHorn,
    numberGrow
  },
  data () {
    return {
      isShow: false,
      itemData: [{
        level: '重大风险',
        color: '#E63031',
        value: 20,
        fun: () => { // this.$router.push({ path: '/pos/person/stationWork' })
        }
      }, {
        level: '较大风险',
        color: '#F48400',
        value: 11,
        fun: () => { // this.$router.push({ path: '/pos/private/private' })
        }
      }, {
        level: '一般风险',
        color: '#F1DD00',
        value: 50,
        fun: () => { // this.$router.push({ path: '/pos/private/private' })
        }
      }, {
        level: '低风险',
        color: '#00B0F0',
        value: 7,
        fun: () => { // this.$router.push({ path: '/pos/private/private' })
        }
      }]
    }
  },
  created () {
    eventBus.$on('refreshWorkNum', val => {
      this.itemData[1].value = val
    })
    // this.getStaticData()
  },
  mounted () { },
  computed: {},
  watch: {},
  methods: {
    getStaticData () {
      staticData().then(({ data }) => {
        if (data && data.code === 0) {
          this.itemData[0].value = data.todayAlarm
          this.itemData[1].value = data.runProcess
          this.itemData[2].value = data.dangerSourceNum
          this.itemData[3].value = data.allProcess
        } else {
          this.$message.error('未知异常！请联系管理员')
          console.log(data.msg)
        }
      }).catch(err => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.num-bar-container {
  display: flex;
  flex-direction: row;
  text-align: center;
  position: relative;
  box-shadow: 0px 2px 4px 0px rgba(6, 12, 24, 0.4);
  .el-row {
    padding: 12px 0;
    width: 100%;
    background: rgba(3, 9, 35, 0.14);
    background-image: url("~@/assets/img/bg_little_title.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  &-item {
    p{
      margin: 0;
      font-size: 12px;
    }
    p:nth-child(1){
      display: inline-block;
      width: 26px;
      height: 4px;
    }
    p:nth-child(2){
      margin: 8px 0;
    }
    p:nth-child(3){
      font-size: 18px;
    }
  }
}
</style>
