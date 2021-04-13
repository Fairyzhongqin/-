<!-- 人员档案 -->
<template>
  <!-- v-dialogDrag -->
  <el-dialog title="员工档案" :close-on-click-modal="false" :visible.sync="visible" width="860px" class="staffFile-dialog" @close="handleClose" append-to-body v-dialogDrag>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="人员详细信息" name="first">
        <!-- class="animated  zoomIn" -->
        <person-detail :staffInfo="staffInfo" ref="personDetailRef"></person-detail>
      </el-tab-pane>
      <el-tab-pane label="日常培训记录" name="second" :staffInfo="staffInfo">
        <!--<img src="~@/assets/img/noData.png"-->
        <!--alt=""-->
        <!--class="noDataStyle">-->
        <!--<p class="noRecordStyle">暂无记录</p>-->
        <daily-train-record ref="dailyTrainRef" :staffInfo="staffInfo"></daily-train-record>
      </el-tab-pane>
      <el-tab-pane label="相关危害因素" name="third">
        <img src="~@/assets/img/noData.png" alt="" class="noDataStyle">
        <p class="noRecordStyle">暂无记录</p>
      </el-tab-pane>
      <el-tab-pane label="人员证书信息" name="fourth" :staffInfo="staffInfo">
        <person-certificate ref="certificateRef"></person-certificate>
      </el-tab-pane>
      <el-tab-pane label="相关劳防用品" name="fiveth">
        <img src="~@/assets/img/noData.png" alt="" class="noDataStyle">
        <p class="noRecordStyle">暂无记录</p>
      </el-tab-pane>
      <el-tab-pane label="体检记录" name="sixth">
        <img src="~@/assets/img/noData.png" alt="" class="noDataStyle">
        <p class="noRecordStyle">暂无记录</p>
      </el-tab-pane>
      <el-tab-pane label="考试记录" name="seventhth" :staffInfo="staffInfo">
        <test-record ref="testRecordRef"></test-record>
      </el-tab-pane>
      <el-tab-pane label="特殊作业信息" name="eighth" :staffInfo="staffInfo">
        <special-work-info ref="specialWorkRef"></special-work-info>
      </el-tab-pane>
    </el-tabs>
    <!-- <span slot="footer"
          class="dialog-footer">

      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary"
                 :disabled="isDisabled"
                 @click="dataFormSubmit()">确定</el-button>
    </span> -->
  </el-dialog>
</template>
<script>
import personDetail from './personDetail'
import dailyTrainRecord from './dailyTrainRecord'
import specialWorkInfo from './specialWorkInfo'
import personCertificate from './personCertificate'
import testRecord from './testRecord'
export default {
  data () {
    return {
      activeName: 'first',
      visible: false,
      isDisabled: false,
      staffInfo: {},
      activeIndex: ''
    }
  },
  components: {
    personDetail,
    dailyTrainRecord,
    specialWorkInfo,
    personCertificate,
    testRecord
  },
  created () {

  },

  methods: {
    init (info) {
      this.visible = true
      this.staffInfo = info
      this.activeName = 'first'
      this.$nextTick(() => {
        this.$refs.personDetailRef.init(info)
      })
    },
    handleClick (e) {
      this.activeIndex = e.index
      switch (this.activeIndex) {
        case '0':
          this.$refs.personDetailRef.init(this.staffInfo)
          break
        case '1':
          this.$refs.dailyTrainRef.init(this.staffInfo)
          break
        case '3':
          this.$refs.certificateRef.init(this.staffInfo)
          break
        case '6':
          this.$refs.testRecordRef.init(this.staffInfo)
          break
        case '7':
          this.$refs.specialWorkRef.init(this.staffInfo)
          break
      }
    },
    handleClose () {
      this.$emit('refreshList')
    }
  }
}
</script>
<style lang="scss">
.staffFile-dialog {
  .el-dialog__header {
    background-color: #ffffff;
  }
  .el-dialog__body {
    height: 600px;
    background-color: #ffffff;
    padding: 20px 20px;
  }
  .noDataStyle {
    display: block;
    margin: 0 auto;
    padding-top: 200px;
  }
  .noRecordStyle {
    padding-top: 10px;
    text-align: center;
  }
  .el-dialog {
    // background-color: #dcdfe6;
    background: -webkit-gradient(
      linear,
      0 0,
      0 100%,
      from(#f2f6fc),
      to(#dcdfe6)
    );
  }
  .el-dialog__body {
    /*min-height: 600px;*/
  }
}
</style>
