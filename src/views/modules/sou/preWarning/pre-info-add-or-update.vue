
 <!-- 预警信息新增和修改页-->
<template>
  <el-dialog :title="(!dataForm.id ? '新增' : '修改') + '预警信息'"
             :close-on-click-modal="false"
             class="station-area"
             width="600px"
             :visible.sync="visible">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             class="classes"
             label-width="110px">
      <el-form-item label='滞留时长(分钟)'
                    prop='minRetentionTime'
                    label-width="115px">
        <el-input-number v-model="dataForm.minRetentionTime"
                         :min="0"
                         size="mini"></el-input-number>
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary"
                 :disabled="isDisabled"
                 @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { queryZoneInfo } from '@/api/pos/region'
import { addOrUpdatepatrolzone, patrolzoneInfo } from '@/api/pos/person'
import enclosureOrArea from '@/components/select/select-enclosure-or-area'
import selectStaff from '@/components/select/select-staff'
// import addTimes from './add-times'
export default {
  data () {
    return {
      dataForm: {
        zoneId: '', // 巡检区域Id
        taskId: this.taskId, // 任务Id
        minRetentionTime: 0, // 滞留时长
        zoneShow: ''
      },
      reservorList: [], // 区域名称
      expandArray: [], // 默认展开的级数
      isDisabled: false,
      reservorTreeProps: {
        label: 'zoneName',
        children: 'subregion'
      }, // 树形结构展示
      disabled: false,
      visible: false,
      dataRule: {
        zoneId: [{ required: true, message: '请选择区域名称', trigger: 'change' }],
        minRetentionTime: [{ required: true, message: '请选择滞留时长', trigger: 'change' }]
      }

    }
  },
  components: {
    selectStaff,
    // addTimes,
    enclosureOrArea
  },
  created () {
    // console.log(this.taskId)
    this.getReservorList()
  },
  methods: {
    // 页面初始化时加载的事件
    // 初始数据
    init (id) {
      this.isDisabled = false
      this.visible = true
      this.dataForm.id = id || ''
      this.$nextTick(() => {
        // console.log(this.taskId)
        this.$refs['dataForm'].resetFields()
        this.dataForm.zoneId = ''
        this.dataForm.taskId = this.taskId
        this.dataForm.minRetentionTime = 0
        this.dataForm.zoneShow = ''
        if (id) {
          this.selectInfo(id)
        }
      })
    },
    // 查询单个班组信息
    selectInfo (id) {
      patrolzoneInfo({ 'id': id }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log(data.data)
          this.dataForm = data.data
          console.log(this.dataForm)
        }
      })
    },
    // 展示全部区域类型
    getReservorList () {
      queryZoneInfo().then(({ data }) => {
        if (data && data.code === 0) {
          // console.log(data)
          this.reservorList = data.data.subregion
          // this.reservorList = []
          // this.reservorList.push(data.data)
          console.log(this.reservorList)
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 菜单树选中
    reservorListCurrentHandle (data) {
      this.dataForm.zoneId = data.id
      this.dataForm.zoneShow = data.zoneName
    },
    handleNodeClick () { },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.dataForm.minRetentionTime = this.dataForm.minRetentionTime + ''
          addOrUpdatepatrolzone(
            this.dataForm
          ).then(({ data }) => {
            if (data && data.code === 0) {
              this.visible = false
              this.dataForm.minRetentionTime = 0
              console.log(data)
              this.$emit('refreshArea')
            } else {
              this.$message.error(data.msg)
            }
            this.dataListLoading = false
          }).catch((err) => {
            console.log(err)
            this.$message.error('未知异常！请联系管理员')
            this.dataListLoading = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.station-area {
  .time {
    margin-right: 10px;
  }
  .el-row {
    margin-left: -60.5px;
  }
}
</style>
