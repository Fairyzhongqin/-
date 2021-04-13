<template>
  <!-- 巡检任务主页 -->
  <div class="mod-config stationWork">
    <stationWorkHome v-if="sort === '1'"
                     @stationWorInfo='stationWorInfo'
                     @stationWorkUpdate='stationWorkUpdate'
                     @enterPreview='enterPreview' />
    <template v-else>
      <!--steps-->
      <el-row class="steps">
        <el-col :span="24">
          <el-steps :active="active"
                    align-center
                    finish-status="success">
            <el-step title="任务基本信息"></el-step>
            <el-step title="巡管区域/巡检点"></el-step>
            <el-step title="预览巡检任务"></el-step>
          </el-steps>
        </el-col>
      </el-row>
      <!--steps-content-->
      <el-scrollbar class="default-scrollbar"
                    style="height: calc(100vh - 40px - 12px - 77px);margin-right: -8px;"
                    wrap-class="default-scrollbar__wrap"
                    view-class="p20-scrollbar__view">
        <!--任务基本信息-->
        <station-work-info v-if="sort === '2'"
                           :active='active'
                           :id='id'
                           ref="stationWorkInfo"
                           @goStationWork='goStationWork'
                           @stationgoArea='stationgoArea' />
        <!--巡管区域/巡检点-->
        <station-work-area v-if="sort === '3'"
                           :active='active'
                           :id='id'
                           ref='stationWorkArea'
                           @gostationInfo='gostationInfo'
                           @enterPreview='enterPreview'
                           @goStationWork='goStationWork'
                           @stationWorkUpdate='stationWorkUpdate' />
        <!--预览巡检任务-->
        <stationWorkPreview v-if="sort === '4'"
                            :active='active'
                            @goArea='goArea'
                            @goStationWork='goStationWork'
                            :id='id'
                            :flag='flag' />
      </el-scrollbar>
    </template>
  </div>
</template>
<script>
import stationWorkHome from './station-work-home'
import stationWorkInfo from './station-work-info'
import stationWorkArea from './station-work-area'
import stationWorkPreview from './station-work-preview'
export default {
  components: {
    stationWorkHome,
    stationWorkInfo,
    stationWorkArea,
    stationWorkPreview
  },
  data () {
    return {
      sort: '1',
      active: 0,
      id: '',
      flag: true
    }
  },
  methods: {
    // 点击新增，进入信息页
    stationWorInfo (active) {
      this.sort = '2'
      this.active = active
      this.id = ''
      // this.taskInfoForm = this.taskForm
      this.$nextTick(() => {
        this.$refs.stationWorkInfo.init()
      })
    },
    // 点击编辑，进入信息页
    stationWorkUpdate (active, id) {
      this.sort = '2'
      this.active = active
      this.id = id
      this.$nextTick(() => {
        this.$refs.stationWorkInfo.init(id)
      })
    },
    // 进入巡检区域页
    stationgoArea (active, id, taskInfoForm) {
      this.sort = '3'
      this.active = active
      this.id = id
      this.taskInfoForm = taskInfoForm
      this.$nextTick(() => {
        this.$refs.stationWorkArea.init()
      })
    },
    // 返回巡检信息页
    gostationInfo (active) {
      this.sort = '2'
      this.active = active
    },
    // 进入预览页
    enterPreview (active, id, flag) {
      this.sort = '4'
      this.active = active
      this.id = id
      this.flag = flag
    },
    // 返回巡检区域页
    goArea (active) {
      this.sort = '3'
      this.active = active
    },
    // 返回首页
    goStationWork (id) {
      this.sort = '1'
    }
  }
}
</script>
<style lang="scss">
.stationWork {
  .el-scrollbar__wrap {
    overflow-x: hidden;
    // border-right: 1px solid #ccc;
  }
  /*步骤条*/
  .steps {
    width: 133%;
    margin-top: 20px;
    margin-left: -17%;
    .el-steps {
      .el-step__head.is-process,
      .el-step__head.is-success {
        color: #2c78bb;
        border-color: #2c78bb;
      }
      .el-step__title.is-process {
        color: #2c78bb;
      }
      .el-step__title.is-success {
        color: #2c78bb;
      }
      .el-step__head.is-success {
        .el-step__icon.is-text {
          background-color: #2c78bb;
        }
        .el-step__icon-inner.is-status {
          color: #ffffff;
        }
      }
    }
  }
  .el-alert--info.is-dark {
    background-color: #77a2c7;
  }
}
</style>
