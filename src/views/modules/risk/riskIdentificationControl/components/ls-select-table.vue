<template>
  <el-dialog title="辨识" :close-on-click-modal="false" class="station-area" width="600px" :visible.sync="visible" append-to-body>
    <el-table :data="dataListLikelihood" border ref="multipleTableLikelihood" @cell-click="cellClickLikelihood" v-loading="dataListLoading" @selection-change="selectionChangeHandleLikelihood" style="width: 100%;" fit v-if="type==='likelihood'">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="score" width="55" label="等级">

      </el-table-column>
      <el-table-column prop="standard" label="标准">

      </el-table-column>
    </el-table>

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
      isDisabled: false,
      dataListLikelihood: [{
        score: '1',
        standard: '有充分、有效的防范、控制、监测、保护措施，或员工安全卫生意识相当高，严格执行操作规程。极不可能发生事故或事件。'
      }, {
        score: '2',
        standard: '危害一旦发生能及时发现，并定期进行监测，或现场有防范控制措施，并能有效执行，或过去偶尔发生事故或事件。'
      }, {
        score: '3',
        standard: '没有保护措施（如没有保护装置、没有个人防护用品等），或未严格按操作程序执行，或危害的发生容易被发现（现场有监测系统），或曾经作过监测，或过去曾经发生类似事故或事件。'
      }, {
        score: '4',
        standard: '危害的发生不容易被发现，现场没有检测系统，也未发生过任何监测，或在现场有控制措施，但未有效执行或控制措施不当，或危害发生或预期情况下发生'
      }, {
        score: '5',
        standard: '在现场没有采取防范、监测、保护、控制措施，或危害的发生不能被发现（没有监测系统），或在正常情况下经常发生此类事故或事件。'
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
