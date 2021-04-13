<!--
 * @Descripttion: 
 * @version: 
 * @Author: Mr.What
 * @Date: 2019-10-22 15:01:31
 * @LastEditors: Mr.What
 * @LastEditTime: 2019-11-06 21:53:33
 -->
<template>
  <div class='num-bar-container'>
    <num-card class="num-bar-item"
              v-for="(item, index) in itemData"
              :key="index"
              :dataVal="item"
              @click.native="item.fun()"></num-card>
  </div>
</template>

<script>
import eventBus from '@/bus/index'
import numCard from './components/numCard'

export default {
  components: {
    numCard
  },
  data () {
    return {
      itemData: [{
        name: '今日巡检任务数',
        value: 102,
        fun: () => { this.$router.push({ path: '/pos/person/stationWork' }) }
      }, {
        name: '今日作业数',
        value: 0,
        fun: () => { this.$router.push({ path: '/pos/private/private' }) }
      }]
    }
  },
  created () {
    eventBus.$on('refreshWorkNum', val => {
      this.itemData[1].value = val
    })
  },
  mounted () { },
  computed: {},
  watch: {},
  methods: {
  }
}
</script>

<style lang='scss' scoped>
.num-bar-container {
  display: flex;
  flex-direction: row;
  height: 12vh;
  .num-bar-item {
    width: calc(50% - 4px);
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
