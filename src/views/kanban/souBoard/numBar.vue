<template>
  <div class='num-bar-container'>
    <NumHorn></NumHorn>
    <el-row>
      <el-col :key="index"
              :span="6"
              v-for="(item, index) in itemData">
        <num-card class="num-bar-item"
                  :key="index"
                  :dataVal="item"
                  @click.native="item.fun()"></num-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import eventBus from '@/bus/index'
import numCard from './components/numCard'
import NumHorn from './components/NumHorn'
import { staticData } from '@/api/kanban/souBoard'
export default {
  components: {
    numCard,
    NumHorn
  },
  data () {
    return {
      isShow: false,
      itemData: [{
        name: '今日告警数',
        value: 0,
        fun: () => { // this.$router.push({ path: '/pos/person/stationWork' })
        }
      }, {
        name: '生产中工艺数',
        value: 0,
        fun: () => { // this.$router.push({ path: '/pos/private/private' })
        }
      }, {
        name: '重大危险源',
        value: 0,
        fun: () => { // this.$router.push({ path: '/pos/private/private' })
        }
      }, {
        name: '高危工艺数',
        value: 0,
        fun: () => { // this.$router.push({ path: '/pos/private/private' })
        }
      }]
    }
  },
  created () {
    eventBus.$on('refreshWorkNum', val => {
      this.itemData[1].value = val
    })
    this.getStaticData()
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
  margin-right: 4px;
  margin-left: 8px;
  flex-direction: row;
  position: relative;
  box-shadow: 0px 2px 4px 0px rgba(6, 12, 24, 0.4);
  .el-row {
    width: 100%;
    background: rgba(3, 9, 35, 0.14);
    background-image: url("~@/assets/img/bg_little_title.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  .num-bar-item {
    &:hover {
      /deep/ .card-title {
        // text-decoration: underline;
        cursor: pointer;
      }
    }
  }
  .num-bar-item + .num-bar-item {
    margin-left: 8px;
  }
}
</style>
