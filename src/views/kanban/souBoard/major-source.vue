<!--重大危险源-->
<template>
  <div class="source-container">
    <border-card title="重大危险源" subTitle="Hazards" :fun="()=>{$router.push({path:'/pos/person/stationWork'})}">
      <el-row>
        <template v-for="(item, index) in itemData">
          <el-col :span="6" class="source-container-item" @click.native="item.fun()" :key="index">
            <p :style="{'background':item.color}"></p>
            <p>{{item.level}}</p>
            <p>
              <number-grow :value="Number(item.value)" :fonts="18" fontc="#fff" :lineH="20"></number-grow>
            </p>
          </el-col>
        </template>
      </el-row>
    </border-card>
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
        level: '一级',
        color: '#C60D05',
        value: 0,
        fun: () => { // this.$router.push({ path: '/pos/person/stationWork' })
        }
      }, {
        level: '二级',
        color: '#F79908',
        value: 0,
        fun: () => { // this.$router.push({ path: '/pos/private/private' })
        }
      }, {
        level: '三级',
        color: '#FFEF36',
        value: 0,
        fun: () => { // this.$router.push({ path: '/pos/private/private' })
        }
      }, {
        level: '四级',
        color: '#76E10F',
        value: 0,
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
  .el-row {
    padding: 15px 0;
  }
  &-item {
    p {
      margin: 0;
      font-size: 12px;
    }
    p:nth-child(1) {
      display: inline-block;
      width: 26px;
      height: 4px;
    }
    p:nth-child(2) {
      margin: 8px 0;
    }
    p:nth-child(3) {
      font-size: 18px;
    }
  }
}
</style>
