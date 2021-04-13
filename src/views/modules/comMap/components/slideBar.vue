<template>
  <transition :name="'controls-'+position">
    <div class='slide-bar-container' :class="'display-'+position" :style="'width:' + width + 'px;'" v-if="value && position.indexOf('top') === -1">
      <!-- 标题 -->
      <div class="title">
        <icon-svg name="tupian">
        </icon-svg>
        {{name}}<i @click="handleClose" class="el-icon-close" style="float:right;padding:13px 20px 0 0;position: absolute;right: 0;"></i>
      </div>
      <slot v-if="value && position.indexOf('top') === -1"></slot>
    </div>

    <div v-if="value && position.indexOf('top') !== -1" :class="'slide-bar-container-' + position">
      <slot v-if="value && position.indexOf('top') !== -1"></slot>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: '标题'
    },
    value: {
      type: Boolean,
      default: true
    },
    position: {
      type: String,
      default: 'left'
    },
    width: {
      type: [String, Number],
      default: '340'
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
  methods: {
    handleClose () { // 关闭窗口
      this.$emit('input', false)
    }
  }
}
</script>

<style lang='scss'>
.slide-bar-container {
  position: absolute;
  overflow: hidden;
  top: 8px;
  font-size: 12px;
  z-index: 100;
  border-radius: 4px;
  height: calc(100vh - 56px);
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 4px 0px rgba(37, 39, 50, 0.5);
  .el-icon-close {
    font-weight: bold;
    font-size: 14px;
    cursor: pointer;
    &:hover {
      color: #2c78bb;
    }
  }
  > div:nth-last-child(1) {
    height: calc(100vh - 97px);
    padding: 10px 10px 51px 10px;
    &.map-zone-edit-container {
      padding: 0;
      .el-form {
        padding: 10px 20px 0 10px;
      }
    }
  }
  &.display-left {
    left: 8px;
  }
  &.display-right {
    right: 8px;
    .el-select {
      width: 100%;
    }
  }
  &.display-top {
  }
  .title {
    width: 100%;
    height: 40px;
    border-bottom: 1px solid #d7dae2;
    box-shadow: 0px 0px 1px 0px rgba(37, 39, 50, 0.5);
    text-align: center;
    line-height: 40px;
    .icon-svg {
      position: relative;
      top: 3px;
      font-size: 15px;
    }
  }
  .map-list-search.el-input--medium {
    font-size: 12px;
    padding: 0;
    margin: 0 10px;
    width: calc(100% - 20px);
    .el-input__inner {
      height: 28px;
      line-height: 28px;
      margin-bottom: 10px;
    }
    .el-input__icon {
      line-height: 28px;
      height: 28px;
    }
  }
  // form 样式修改
  .el-form {
    padding-right: 10px;
    &-item {
      margin-bottom: 16px;
      &__error {
        padding-top: 2px;
      }
    }
  }
  // table 样式修改
  .el-table {
    background: rgba($color: #fff, $alpha: 0);
    tr {
      background: transparent;
      td {
        border: none;
      }
    }
    .el-table__body tr.current-row > td {
      background: rgba(199, 223, 255, 0.7) !important;
    }
    .el-icon-edit-outline,
    .el-icon-delete {
      font-size: 14px;
      cursor: pointer;
    }
    .el-icon-edit-outline {
      color: #3691e0;
      margin-right: 5px;
      &:hover {
        color: #2c78bb;
      }
    }
    .el-icon-delete {
      color: #f39898;
      &:hover {
        color: #e63031;
      }
    }
    .gutter {
      width: 6px !important;
    }
    .el-table__header-wrapper thead tr .is-leaf {
      background: transparent;
      border: none;
    }
    /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
    & ::-webkit-scrollbar {
      width: 6px; /*滚动条宽度*/
      height: 6px; /*滚动条高度*/
      background-color: transparent;
    }
    /*定义滑块 内阴影+圆角*/
    & ::-webkit-scrollbar-thumb {
      border-radius: 6px;
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      background-color: hsla(220, 4%, 58%, 0.4); /*滚动条的背景颜色*/
    }
  }
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background: rgba(199, 223, 255, 0.7) !important;
  }
  .el-table::before {
    background: rgba($color: #fff, $alpha: 0);
  }
  // 分页 样式修改
  .el-pagination {
    margin: 0;
    .btn-next,
    .btn-prev,
    .el-pager li {
      background: transparent;
    }
  }
  .map-bottom-btn {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    text-align: center;
    padding: 11px 0;
    border-top: 1px solid #d7dae2;
    box-shadow: 1px 0px 0px 0px rgba(37, 39, 50, 0.5);
  }
}

.slide-bar-container-top {
  position: absolute;
  top: 10px;
  left: calc(50% - 100px);
}
.slide-bar-container-top-left {
  position: absolute;
  top: 10px;
  left: 10px;
}

.controls-left-enter-active,
.controls-right-enter-active,
.controls-top-enter-active,
.controls-top-left-enter-active,
.controls-left-leave-active,
.controls-right-leave-active,
.controls-top-leave-active,
.controls-top-left-leave-active {
  transition: all 0.5s ease;
}
.controls-left-enter,
.controls-left-leave-to {
  transform: translateX(-340px);
}
.controls-right-enter,
.controls-right-leave-to {
  transform: translateX(340px);
}
.controls-top-enter,
.controls-top-leave-to,
.controls-top-left-enter,
.controls-top-left-leave-to {
  transform: translateY(-340px);
}
.controls-left-all-leave-active,
.controls-right-all-leave-active,
.controls-top-all-leave-active,
.controls-top-left-all-leave-active {
  transition: all 0s ease;
}
.controls-left-all-leave-to,
.controls-right-all-leave-to,
.controls-top-all-leave-to {
  transform: translateX(-340px);
}
</style>
