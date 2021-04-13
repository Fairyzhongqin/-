<template>
  <div class='board-card-container'
       :class="{'top-border':type==='normal','click-fun':fun}"
       :style="'min-height:'+minHeight+'px'">
    <div v-if="type==='normal'">
      <div class="board-top"></div>
      <div class="board-title"
           v-if="title"
           @click="fun()">{{title}}</div>
      <div class="board-sub-title"
           v-if="subTitle">{{subTitle}}</div>
    </div>
    <div class="border-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: { // 标题
      type: String
    },
    subTitle: { // 副标题
      type: String
    },
    type: {
      type: String,
      default: 'normal'
    },
    minHeight: {
      type: [String, Number],
      default: '100'
    },
    fun: {
      type: Function
    }
  },
  components: {},
  data () {
    return {

    }
  },
  created () { },
  mounted () { },
  computed: {},
  watch: {},
  methods: {}
}
</script>

<style lang='scss' scoped>
.board-card-container {
  height: 100%;
  width: 100%;
  background: rgba(3, 9, 35, 0.14);
  position: relative;
  padding: 12px 12px 6px 12px;
  &.click-fun {
    &:hover {
      .board-title {
        // text-decoration: underline;
        cursor: pointer;
      }
    }
  }
  &.top-border {
    background-image: url("~@/assets/img/bg_little_title.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  .board-top {
    position: absolute;
    top: 0;
    width: 100%;
    height: 2px;
    background-image: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0),
      rgba(0, 198, 255, 1),
      rgba(0, 0, 0, 0)
    );
  }
  .board-title {
    width: 100%;
    text-align: center;
    font-size: 16px;
    color: #fff;
    line-height: 22px;
  }
  .board-sub-title {
    width: 100%;
    text-align: center;
    font-size: 10px;
    color: #fff;
    line-height: 15px;
  }
  .border-content {
    height: calc(100% - 42px);
    padding-top: 5px;
  }
}
</style>
