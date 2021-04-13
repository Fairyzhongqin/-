<template>
  <div class="cesium-tool-bar-container">
    <div class="content">
      <div class="tool-bar">
        <div v-for="(tool, index) in toolList" :key="index" class="tool-item" :title="tool.name" :class="{'actived': openedLabel === tool.value}" @click="tool.event?tool.event():toolItemClick(tool.value)">
          <!-- <el-tooltip effect="dark"
                      :content="tool.name"
                      transition="el-zoom-in-bottom"
                      placement="top"> -->
          <!--图层选择-->
          <el-popover placement="top" title="" trigger="click" content="" v-if="tool.children" popper-class="dark" class="tooltip-layer">
            <icon-svg class="tool-icon" slot="reference" :name="tool.value" @click.native="selectTool(tool.value)"></icon-svg>

            <layer></layer>

          </el-popover>
          <!--一般图标-->
          <icon-svg v-else class="tool-icon" :name="tool.value" @click.native="selectTool(tool.value)"></icon-svg>
          <!-- </el-tooltip> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import layer from './layer'
import { handleFullScreen } from '@/utils/index.js'
import eventBus from '@/bus/index'
export default {
  props: {
    toolList: {
      type: Array,
      default: () => [
        {
          name: '图层',
          value: 'layer',
          children: [{
            name: '车辆',
            value: 'car'
          }, {
            name: '监控',
            value: 'camera'
          }, {
            name: '信标',
            value: 'beacon'
          }, {
            name: '卡口',
            value: 'bayonet'
          }]
        },
        {
          name: '重置相机',
          value: 'resetCamera'
        }, {
          name: '截图',
          value: 'screenShoot'
        }, {
          name: '测距',
          value: 'ranging'
        }, {
          name: '全屏',
          value: 'fullScreen',
          event: handleFullScreen
        }]
    }
  },
  components: {
    layer
  },
  data () {
    return {
      openedLabel: '',
      checkboxLayer: []
    }
  },
  created () { },
  mounted () { },
  computed: {},
  watch: {},
  methods: {
    selectTool (val) {
      if (this.openedLabel === val) {
        this.openedLabel = ''
      } else {
        this.openedLabel = val
      }
    },
    toolItemClick (val) {
      this.$emit('toolItemClick', val)
      eventBus.$emit('mapEvent', val)
    },
    layerChange (val1, val2) {
      console.log(val1, val2)
    }
  }
}
</script>

<style lang='scss'>
.cesium-tool-bar-container {
  position: absolute;
  bottom: 0px;
  width: 100%;
  height: 80px;
  background-image: linear-gradient(
    -180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.7) 100%
  );
  .content {
    position: absolute;
    width: 100%;
    height: 40px;
    bottom: 0px;
    .tool-bar {
      margin: 0 auto;
      height: 100%;
      text-align: center;
      .tool-item {
        display: inline-block;
        height: 40px;
        width: 40px;
        border-radius: 50%;
        margin: 0 8px;
        cursor: pointer;
        position: relative;
        &:hover {
          background-color: rgba(0, 0, 0, 0.8);
        }
        &.actived {
          background-color: rgba(0, 0, 0, 0.8);
        }
        .tool-icon {
          margin-top: calc(20px - 15px);
          height: 30px;
          width: 30px;
          color: #d9d9d9;
        }
        .tool-item-child {
          position: absolute;
          bottom: 48px;
          left: 0;
          .child-item {
            height: 40px;
            width: 40px;
            margin-top: 8px;
            border-radius: 50%;
            cursor: pointer;
            background-color: rgba(0, 0, 0, 0.8);
          }
        }
      }
    }
  }
}
.cesium-layer {
  .layer-div {
    padding: 5px 0;
    .el-checkbox + .el-checkbox {
      margin-left: 5px;
    }
    .el-checkbox {
      margin-right: 0;
    }
  }
}
.el-popover.dark {
  padding: 0;
  background-color: #0000;
  border: 0;
}
</style>
