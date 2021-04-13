<!--暂无数据-->
<template>
  <div class="no-data">
    <img class="no-data-img" src="~@/assets/img/noData.png" alt="暂无数据">
    <p class="no-data-txt">暂无记录</p>
  </div>
</template>

<script>
    export default {
      name: 'NoData',
      data () {
        return {
        }
      },
      props: {},
      methods: {},
      created () {}
    }
</script>

<style scoped lang="scss">
  .no-data{
    margin: 200px auto 0 auto;
    text-align: center;
    img{
      width: 140px;
    }
    p{
      font-size: 14px;
      color: #DCDFE6;
      text-align: center;
    }
  }
</style>
