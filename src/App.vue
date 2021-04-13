<template>
  <!-- 对使用动画的组件加上一层transition -->
  <transition name="fade">
    <router-view></router-view>
  </transition>
</template>

<script>
export default {
}
</script>

<style lang="scss">
// @import url("./assets/scss/font.scss");
</style>
