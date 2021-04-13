<template>
  <el-dialog :title="(!dataForm.id ? '新增' : '修改') + '巡检点信息'" :close-on-click-modal="false" class="point-dialog" width="600px" :visible.sync="visible" append-to-body :modal-append-to-body="true">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" class="classes" label-width="110px">
      <el-form-item label="巡检点标题" prop="name" class="stationName">
        <el-input v-model="dataForm.name" placeholder="请输入巡检点标题" size="mini" clearable></el-input>
      </el-form-item>
      <el-form-item label="上报方式" prop="type">
        <el-select v-model="dataForm.type" placeholder="请选择上报方式" size="mini" style="width:100%">
          <el-option v-for="item in options" :key="item.value" :label="item.value" :value="item.label">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="检查对象" prop="facilityType">
        <el-select v-model="dataForm.facilityType" placeholder="请选择检查对象" size="mini" style="width:30%" @change="()=>{dataForm.facilityName='';dataForm.facilityId=''}">
          <el-option v-for="item in facilityTypeList" :key="item.value" :label="item.value" :value="item.label">
          </el-option>
        </el-select>
        <el-input v-model="dataForm.facilityName" @focus="facilityHandle" size="mini" class="size-mini-pople-input" style="width:68%" v-if="dataForm.facilityType!=='100'">
          <el-button slot="append" @click="facilityHandle">选择</el-button>
        </el-input>
        <el-input v-model="dataForm.facilityName" style="width:68%" v-else></el-input>
      </el-form-item>
      <el-form-item label="检查项点" prop="patrolPointDataAcquisitionList">
        <el-button @click="addCheckDialog(dataForm.facilityId)" class="add" size="mini" type="primary">添加</el-button>
        <el-form class="check-point">
          <el-form-item label="" v-for="(patrolPointDataAcquisition, index) in dataForm.patrolPointDataAcquisitionList" :key="index">
            <el-tag size="mini" class="index">{{index + 1 + '.'}}</el-tag>
            <el-input type="textarea" autosize :rows="1" v-model="patrolPointDataAcquisition.description" size="mini" placeholder="检查内容描述"></el-input>
            <i class="el-icon-remove" @click="dataForm.patrolPointDataAcquisitionList.splice(index,1)"></i>
          </el-form-item>
        </el-form>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="isDisabled" @click="dataFormSubmit()">确定</el-button>
    </span>
    <!-- 添加检查项弹框 -->
    <add-check v-if="addCheckVisible" ref="addCheck" @addCheckHandle='addCheckHandle'>
    </add-check>
    <facility-add v-if="facilityVisible" ref="facilityAdd" :zoneId="zoneId" :type="dataForm.facilityType" @selectChange="addFacilityHandle"></facility-add>
  </el-dialog>
</template>

<script>
import { addOrUpdatepatrolPoint, patrolpointInfo } from '@/api/pos/person'
import addCheck from './station-work-check-add'
import facilityAdd from './station-work-add-point-facility'
import { getLabels } from '@/api/common/sys'
export default {
  props: ['areaId', 'zoneId'],
  data () {
    return {
      dataForm: {
        name: '',
        type: '0',
        facilityType: '0',
        facilityId: '',
        facilityName: '',
        patrolZoneId: this.areaId,
        patrolPointDataAcquisitionList: [],
        location: ''
      },
      // 巡检数据类型
      options: [],
      addCheckVisible: false, // 控制添加选择项的弹框
      facilityVisible: false, // 控制添加设施设备的弹框
      selectChange: {}, // 选中的对象
      facilityTypeList: [],
      facilityList: [], // 设施设备列表
      // 结束时间是否禁用
      endAbled: true,
      dialogVisible: false,
      disabled: false,
      visible: false,
      isDisabled: false,
      pageIndex: 1,
      pageSize: 10,
      dataRule: {
        name: [{ required: true, message: '巡检点标题不能为空', trigger: 'blur', pattern: '[^ \x22]+' }],
        type: [{ required: true, message: '请选择上报方式', trigger: 'blur' }],
        facilityType: [{ required: true, validator: this.validateStaffArray }]
        // patrolPointDataAcquisitionList: [{ required: true, message: '检查项不能为空', trigger: 'blur' }]
      }
    }
  },
  components: {
    addCheck,
    facilityAdd
  },
  created () {
  },
  watch: {
    areaId: {
      handler (val, oldVal) {
        this.dataForm.patrolZoneId = val
      }
    }
  },
  methods: {
    // 初始数据
    init (id) {
      this.isDisabled = false
      this.dataForm.id = id || ''
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.dataForm.facilityName = ''
        this.dataForm.patrolPointDataAcquisitionList = []
        this.getBaseData()// 获取基础数据
        if (id) {
          this.selectInfo(id)
        }
      })
    },
    // 加载基础数据
    getBaseData () {
      // 设施设备类型- 字典
      getLabels({
        'type': 'FACILITY_TYPE'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.facilityTypeList = data.list
          // 初始化单选按钮
          // this.dataForm.facilityType = this.facilityTypeList[0].label
          // console.log(this.dataForm.facilityType, '初始化1111111')
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => console.log(err))
      getLabels({
        'type': 'PATROL_POINT_TYPE'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.options = data.list
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => console.log(err))
    },
    // 添加检查项对话框
    addCheckDialog () {
      // console.log(facilityId)
      // this.addCheckVisible = true
      // this.$nextTick(() => {
      //   if (facilityId) {
      //     this.$refs.addCheck.init(facilityId)
      //   } else {
      //     this.$message('请先选择设备设施')
      //   }
      // })
      this.dataForm.patrolPointDataAcquisitionList.push({
        description: ''
      })
    },
    // 添加检查项处理函数
    addCheckHandle (obj) {
      console.log(obj)
      let obj1 = JSON.parse(JSON.stringify(obj))
      this.dataForm.patrolPointDataAcquisitionList.push(obj1)
      // this.checkType = type
      // console.log(this.checkType)
      console.log(this.dataForm.patrolPointDataAcquisitionList)
    },
    // 添加设施设备的弹框
    facilityHandle () {
      this.facilityVisible = true
      this.$nextTick(() => {
        this.$refs['facilityAdd'].init(this.selectChange)
      })
    },
    // 监听设备设施选中项的处理函数
    addFacilityHandle (val) {
      console.log(val, '1111111111111111111')
      this.selectChange = val
      this.dataForm.facilityId = val.id
      this.dataForm.facilityName = val.name
      this.facilityVisible = false
      this.dataForm.location = val.positionX + ',' + val.positionY + ',' + val.positionZ
    },
    // 查询单个巡检点文件
    selectInfo (id) {
      patrolpointInfo({ 'id': id }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataForm = data.data
          this.selectChange.id = this.dataForm.facilityId
        }
      })
    },
    // 切换选择设施设备类型的按钮
    facilityChange () {
      this.dataForm.facilityId = ''
      this.dataForm.facilityName = ''
      this.dataForm.patrolPointDataAcquisitionList = []
    },
    handleClose (index) {
      this.dataForm.patrolPointDataAcquisitionList.splice(index, 1)
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.visible = false
          addOrUpdatepatrolPoint(
            this.dataForm
          ).then(({ data }) => {
            this.visible = false
            if (data && data.code === 0) {
              console.log(data)
              this.$emit('refreshPoint')
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                }
              })
            } else {
              this.isDisabled = false
              this.$message.error(data.msg)
            }
          })
        }
      })
    },
    validateStaffArray (rule, value, callback) {
      if (this.dataForm.facilityType !== '' && (this.dataForm.facilityId !== '' || (this.dataForm.facilityType === '100' && this.dataForm.facilityName !== ''))) {
        callback()
      } else {
        callback(new Error('请选择检查对象'))
      }
    }
  },
  filters: {
    formatType (value, map) {
      let optionName = ''
      map.map((val) => {
        if (value === val.label) {
          optionName = val.value
        }
      })
      return optionName
    }
  }
}
</script>
<style lang="scss">
.point-dialog {
  .classes {
    margin-left: 0 !important;
  }
  .el-dialog {
    width: 300px;
    // height: 400px;
  }
  .text {
    font-size: 14px;
  }

  .box-card {
    width: 350px;
  }
  .el-card__body {
    // padding: 3px;
  }
  .el-input.el-input--mini.el-input-group.el-input-group--append {
    margin-top: 0;
  }
  .check-point {
    padding-right: 0;
    position: relative;
    font-size: 12px;
    .el-form-item {
      margin: 7px 0;
      .el-form-item__content {
        display: flex;
        flex-direction: row;
        .index {
          position: absolute;
          width: 25px;
          top: 5px;
          left: -35px;
        }
        .el-icon-remove {
          margin-left: 5px;
          color: #f56c6c;
          line-height: 30px;
        }
      }
    }
  }
}
</style>
