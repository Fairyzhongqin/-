<template>
  <div class="in-dev-component">
    <img src="~@/assets/img/in_dev.png" alt="正在开发中～">
    <p>{{tips}}</p>
  </div>
</template>

<script>
  export default {
    name: 'in-dev',
    props: {
      tips: {
        type: String,
        default: '开发中，敬请期待～'
      }
    }
  }
</script>

<style lang="scss">
  .in-dev-component{
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
