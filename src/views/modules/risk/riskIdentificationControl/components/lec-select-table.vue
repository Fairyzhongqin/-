<template>
  <el-dialog title="辨识" :close-on-click-modal="false" class="station-area" width="600px" :visible.sync="visible" append-to-body>
    <el-table :data="dataListLikelihood" border ref="multipleTableLikelihood" @cell-click="cellClickLikelihood" v-loading="dataListLoading" @selection-change="selectionChangeHandleLikelihood" style="width: 100%;" fit v-if="type==='likelihood'">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="score" width="80" label="分数值">

      </el-table-column>
      <el-table-column prop="standard" label="标准">

      </el-table-column>
    </el-table>
    <el-table :data="dataListExposure" border ref="multipleTableExposure" @cell-click="cellClickExposure" v-loading="dataListLoading" @selection-change="selectionChangeHandleExposure" style="width: 100%;" v-if="type==='exposure'" fit>
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="score" width="80" label="分数值">

      </el-table-column>
      <el-table-column prop="rate" label="频率">

      </el-table-column>
      <el-table-column prop="exposureTime" label="累计暴露时间t">

      </el-table-column>
    </el-table>
    <p v-if="type==='exposure'">
      注:危险性检修作业按“累计暴露时间t(一个工作日内)”标准选取对应的分数值，其它按“频率”
      标准选取对应的分数值。
    </p>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false" size="mini">取消</el-button>
      <el-button type="primary" :disabled="isDisabled" @click="selected()" size="mini">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      visible: false,
      type: '',
      dataListLoading: false,
      dataListSelectionsLike: [],
      dataListSelectionsExpose: [],
      isDisabled: false,
      dataListLikelihood: [{
        score: '0.1',
        standard: '实际不可能'
      }, {
        score: '0.2',
        standard: '极不可能[有充分、有效的防范、控制、监测、保护措施，或员工劳动安全卫生意识相当高，严格执行操作规程。极不可能发生事故或事件]'
      }, {
        score: '0.5',
        standard: '很不可能，可以设想[危险源事件一旦发生能及时发现，并定期进行监测，或现场有防范控制措施，并能有效执行，或过去还未发生危险事故或事件]'
      }, {
        score: '1',
        standard: '可能性小，完全意外[危险源事件一旦发生较能及时发现，并定期进行监测，或现场有防范控制措施，并能比较有效地执行，或过去偶尔发生危险事故或事件]'
      }, {
        score: '3',
        standard: '可能，但不经常[没有保护措施（如没有保护防装置、没有个人防护用品等），或未严格按操作程序执行，或危险源事件的发生容易被发现（现场有监测系统），或曾经作过监测，或过去曾经发生，或在异常情况下发生类似事故或事件]'
      }, {
        score: '6',
        standard: '相当可能[危险源事件的发生不容易被发现，现场没有检测系统，也未作过任何监测，或在现场有控制措施，但未有效执行或控制措施不当；危险源事件常发生或在预期情况下发生]'
      }, {
        score: '10',
        standard: '完全可以预料[在现场没有采取防范、监测、保护、控制措施，危险源事件的发生不能被发现（没有监测系统），或在正常情况下经常发生此类事故或事件]'
      }],

      dataListExposure: [{
        score: '0.5',
        rate: '非常罕见地暴露',
        exposureTime: 't≤10分钟'
      }, {
        score: '1',
        rate: '每年几次暴露',
        exposureTime: '10分钟＜t≤0.5小时'
      }, {
        score: '2',
        rate: '每月一次',
        exposureTime: '0.5小时＜t≤1小时'
      },
      {
        score: '3',
        rate: '每周一次，或偶然暴露',
        exposureTime: '1小时＜t≤2小时'
      }, {
        score: '6',
        rate: '每天工作时间内暴露',
        exposureTime: '2小时＜t≤5小时'
      },
      {
        score: '10',
        rate: '连续暴露',
        exposureTime: 't＞5小时'
      }]
    }
  },
  methods: {

    init (type, score) {
      this.visible = true
      this.type = type
      if (type === 'likelihood') {
        this.$nextTick(() => {
          this.$refs.multipleTableLikelihood.data.map(item => {
            if (item.score === score) {
              this.$refs.multipleTableLikelihood.toggleRowSelection(item, true)
            }
          })
        })
      } else if (type === 'exposure') {
        this.$nextTick(() => {
          this.$refs.multipleTableExposure.data.map(item => {
            if (item.score === score) {
              this.$refs.multipleTableExposure.toggleRowSelection(item, true)
            }
          })
        })
      }
    },
    // 点击一行选中
    cellClickLikelihood (row) {
      this.$refs.multipleTableLikelihood.toggleRowSelection(row)
    },
    // 点击一行选中
    cellClickExposure (row) {
      this.$refs.multipleTableExposure.toggleRowSelection(row)
    },
    // 单选可能性
    selectionChangeHandleLikelihood (val) {
      if (val.length > 1) {
        this.$refs.multipleTableLikelihood.clearSelection()
        this.$refs.multipleTableLikelihood.toggleRowSelection(val.pop())
      } else {
        this.dataListSelectionsLike = val.pop()
      }
    },
    // 单选暴露频率
    selectionChangeHandleExposure (val) {
      if (val.length > 1) {
        this.$refs.multipleTableExposure.clearSelection()
        this.$refs.multipleTableExposure.toggleRowSelection(val.pop())
      } else {
        this.dataListSelectionsExpose = val.pop()
      }
    },
    selected (type) {
      type = this.type
      this.visible = false
      if (type === 'likelihood') {
        this.$emit('selectEmit', this.dataListSelectionsLike, type)
      } else if (type === 'exposure') {
        this.$emit('selectEmit', this.dataListSelectionsExpose, type)
      }
    }
  }
}
</script>
<style lang="scss">
</style>
