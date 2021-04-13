<template>
  <div class="securit-inform-container">
    <border-card title="安全承诺告知"
                 subTitle="Commitment"
                 :fun="()=>{$router.push({path:'/pos/person/stationWork'})}">
      <div style="overflow: auto;height: 100%">
        <template v-for="item in dataList">
          <h2>{{item.name}}</h2>
          <pre>{{item.msg}}
</pre>
        </template>
        <!--<h2>企业状态：</h2>-->
        <!--<pre>苯乙烯生产装置两套，其中：运行0套，停产0套，检修2套-->
<!--EPS生产线六条，其中：运行4条，停0条，检修2条-->
<!--特殊5处、一级5处、二级动火作业15处-->
<!--进入受限空间作业6处-->
<!--是否处于试生产状态（否）-->
<!--是否处于开停车状态（否）-->
<!--罐区、仓库等重大危险源是否处于安全状态（是）-->
<!--</pre>-->
        <!--<h2>企业承诺：</h2>-->

        <!--<pre>今天我公司已进行安全风险研判，各项安全风险防控措施已落实到位，我承诺所有生产装置处于安全运行状态，罐区、仓库等重大危险源安全风险得到有效管控。-->
<!--主要负责人：***-->
<!--2019年11月28日-->
<!--</pre>-->
      </div>
    </border-card>
  </div>
</template>

<script>
  import borderCard from './components/borderCard'
  import { signboardReport } from '@/api/kanban/souBoard'

  export default {
    components: {
      borderCard
    },
    data () {
      return {
        dataList: []
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
        signboardReport().then(({ data }) => {
          if (data && data.code === 0) {
            this.dataList = data.list
          } else {
            this.$message.error(data.msg)
          }
        }).catch((err) => {
          console.log(err)
          this.$message.error('未知异常！请联系管理员')
        })
      }
    }
  }
</script>

<style lang="scss">
.securit-inform-container{
  font-family:PingFang SC;
  height: calc(68vh - 168px);
  h2{
    font-size:14px;
    font-weight:500;
  }
  pre{
    font-family: PingFang-SC-Medium;
    font-size:12px;
    color: #ffffff80;
    line-height: 1.4;
    white-space:pre-wrap;
  }
}
</style>
