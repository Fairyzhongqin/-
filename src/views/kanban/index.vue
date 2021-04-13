<template>
  <!-- 看板 -->
  <div>

    <div class="kanban">
      <div class="kanban_title"></div>
      <el-row>
        <el-col :span="8"
                class='kanban_left'>
          <div style="height:56%">
            <div class="horn">
              <div class="lt"></div>
              <div class="rt"></div>
              <div class="rb"></div>
              <div class="lb"></div>
            </div>
            <kanbanLeft />
          </div>
          <div class="horns">
            <div class="lt"></div>
            <div class="rt"></div>
            <div class="rb"></div>
            <div class="lb"></div>
          </div>
        </el-col>
        <el-col :span="8"
                class='kanban_map'>
          <!-- <kanbanMap /> -->
        </el-col>
        <el-col :span="8"
                class='kanban_right'>
          <div style="height:56%">
            <div class="horn">
              <div class="lt"></div>
              <div class="rt"></div>
              <div class="rb"></div>
              <div class="lb"></div>
            </div>
          </div>
          <div>
            <div class="horns">
              <div class="lt"></div>
              <div class="rt"></div>
              <div class="rb"></div>
              <div class="lb"></div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <selectSwitch />
  </div>
</template>
<script>
import kanbanLeft from './kanban-left'
import kanbanMap from './kanban-map'
import selectSwitch from '@/components/select/select-switch-item'
export default {
  data () {
    return {}
  },
  components: { kanbanLeft, kanbanMap, selectSwitch },
  created () {
  },
  methods: {

  }
}
</script>
<style lang='scss' scoped>
.kanban {
  height: 100%;
  width: 100%;
  .kanban_title {
    background: #152a50;
    height: 8vh;
    width: 100%;
  }
  .kanban_left {
    height: 80vh;
    position: relative;
    padding: 0 10px 10px 10px;
    background: #152a50;
    float: left;
  }
  .kanban_right {
    height: 80vh;
    position: relative;
    padding: 0 10px 10px 10px;
    background: #152a50;
    float: right;
  }
  .kanban_left,
  .kanban_right {
    .horn {
      position: absolute;
      width: 95%;
      height: 56%;
      border: 2px solid #1b67b1;
      // border-image: -webkit-linear-gradient(#1b67b1, #17457b) 10 20;
      // border-image: -moz-linear-gradient(#1b67b1, #17457b) 10 20;
      // border-image: linear-gradient(0deg, #1b67b1, #17457b) 10 20;
    }
    .horn > div {
      width: 10px;
      height: 10px;
      position: absolute;
    }
    .horn .lt {
      border-top: 4px solid #00c6ff;
      border-left: 4px solid #00c6ff;
      left: -2px;
      top: -2px;
    }
    .horn .rt {
      border-top: 4px solid #00c6ff;
      border-right: 4px solid #00c6ff;
      right: -2px;
      top: -2px;
    }
    .horn .rb {
      border-bottom: 4px solid #00c6ff;
      border-right: 4px solid #00c6ff;
      right: -2px;
      bottom: -2px;
    }
    .horn .lb {
      border-bottom: 4px solid #00c6ff;
      border-left: 4px solid #00c6ff;
      left: -2px;
      bottom: -2px;
    }
    .horns {
      position: absolute;
      width: 95%;
      height: 38%;
      margin-top: 20px;
      border: 2px solid #1b67b1;
      // border-image: -webkit-linear-gradient(#1b67b1, #17457b) 10 20;
      // border-image: -moz-linear-gradient(#1b67b1, #17457b) 10 20;
      // border-image: linear-gradient(0deg, #1b67b1, #17457b) 10 20;
    }
    .horns > div {
      width: 10px;
      height: 10px;
      position: absolute;
    }
    .horns .lt {
      border-top: 4px solid #00c6ff;
      border-left: 4px solid #00c6ff;
      left: -2px;
      top: -2px;
    }
    .horns .rt {
      border-top: 4px solid #00c6ff;
      border-right: 4px solid #00c6ff;
      right: -2px;
      top: -2px;
    }
    .horns .rb {
      border-bottom: 4px solid #00c6ff;
      border-right: 4px solid #00c6ff;
      right: -2px;
      bottom: -2px;
    }
    .horns .lb {
      border-bottom: 4px solid #00c6ff;
      border-left: 4px solid #00c6ff;
      left: -2px;
      bottom: -2px;
    }
  }
}
</style>