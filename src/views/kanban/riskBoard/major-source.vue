<!--重大危险源-->
<template>
  <div class="source-container">
    <el-row>
      <template v-for="item in itemData">
        <el-col :span="6" class="source-container-item" @click.native="item.fun()">
          <p :style="{'background':item.color}"></p>
          <p>{{item.level}}</p>
          <p><number-grow :value="Number(item.value)" :fonts="18" fontc="#fff" :lineH="20"></number-grow></p>
        </el-col>
      </template>
    </el-row>
  </div>
</template>

<script>
  import borderCard from './components/borderCard'
  import numberGrow from '@/components/NumberGrow'
  import { hazards } from '@/api/kanban/souBoard'
  export default {
    components: {
      borderCard,
      numberGrow
    },
    data () {
      return {
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
      this.getDataList()
    },
    mounted () { },
    computed: {},
    watch: {},
    methods: {
      getDataList () {
        hazards().then(({ data }) => {
          if (data && data.code === 0) {
            this.$nextTick(() => {
              data.list.map((val) => {
                this.itemData[Number(val.dangerLevel)]['value'] = val.num
              })
            })
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

<style lang="scss">
  .source-container {
    display: flex;
    flex-direction: row;
    text-align: center;
    position: relative;
    .el-row{
      padding: 15px 0;
      width: 100%;
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
