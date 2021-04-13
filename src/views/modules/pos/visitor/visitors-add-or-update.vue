<template>
  <el-dialog title="访客时间轴"
             :close-on-click-modal="false"
             class="station-dialog"
             width="400px"
             :visible.sync="visible">
    <el-scrollbar>
      <el-timeline :reverse="reverse"
                   class="timeLineStyle">

        <el-timeline-item v-for="(activity, index) in visitorTime"
                          :key="index"
                          :timestamp="activity.visitDate">
          第{{index + 1}}次来访时间

        </el-timeline-item>

      </el-timeline>
    </el-scrollbar>
    <span slot='footer'
          class="dialog-footer">
      <el-row>
        <el-button @click="visible = false">关闭</el-button>

      </el-row>
    </span>
  </el-dialog>
</template>

<script>
import { visitTimeLine } from '@/api/pos/person'

export default {
  data () {
    return {
      visible: false,
      reverse: true, // 倒叙时间线
      visitorTime: [] // 访客来访时间线
    }
  },
  created () {
  },
  methods: {
    // 初始数据
    init (id) {
      this.visitorTime = []
      this.visible = true
      if (id) {
        visitTimeLine({
          'visitorId': id
        }).then(({ data }) => {
          if (data && data.code === 0) {
            data.list.length > 0 ? this.visitorTime = data.list.reverse() : this.$message.warning('没有来访')
          } else {
            this.visitorTime = []
          }
        }).catch((err) => {
          console.log(err)
          this.$message.error('未知异常！请联系管理员')
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.station-dialog {
  /deep/ .el-dialog {
    max-height: 500px;
  }
  .timeLineStyle {
    max-height: 314px;
  }
  /deep/ .el-scrollbar__wrap {
    padding: 2px 0 0px 0;
  }
}
</style>
