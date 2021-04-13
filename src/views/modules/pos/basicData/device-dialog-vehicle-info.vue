<!--胸卡设备 - 车辆信息-->
<template>
  <el-dialog
    title="车辆信息"
    :close-on-click-modal="true"
    :visible.sync="visible"
    width="400px"
    class="vehicle-info-dialog">
    <el-form :model="dataForm" ref="dataForm" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="车辆类型:">
            <span>{{dataForm.type | formatType(typeList)}}</span>
          </el-form-item>
          <el-form-item label="车辆车型:">
            <span>{{dataForm.vehicleType}}</span>
          </el-form-item>
          <template v-if="dataForm.type === '0'">
            <el-form-item label="驾驶员信息:">
              <span>{{dataForm.driverId}}</span>
            </el-form-item>
            <el-form-item label="押运员信息:">
              <span>{{dataForm.supercargoId}}</span>
            </el-form-item>
          </template>
          <el-form-item v-else label="到期时间:">
            <span>{{dataForm.maturityTime}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="vehicles">
          <div class="vehicles-content">
            <p >车牌号</p>
            <span class="vehicles-info">{{dataForm.numberPlates}}</span>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script>
  import {vehicleAddOrUpdate, vehicleInfo} from '@/api/pos/vehicle'
  export default {
    data () {
      return {
        visible: false,
        isDisabled: false,
        dataForm: {
          id: '',
          numberPlates: '', // 车牌号
          vehicleType: '', // 车辆车型
          type: '0', // 车辆类型
          driverId: '', // 驾驶员信息
          supercargoId: '', // 押运员信息
          maturityTime: ''  // 到期时间
        },
        // 车辆类型 0:普通车辆 1:临时车辆
        typeList: [{
          label: '0',
          value: '普通车辆'
        }, {
          label: '1',
          value: '临时车辆'
        }]
      }
    },
    methods: {
      // 新增单个字段
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.isDisabled = false
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.isDisabled = true
            vehicleInfo({
              'id': this.dataForm.id || undefined
            }).then(({data}) => {
              this.isDisabled = false
              if (data && data.code === 0) {
                this.dataForm.numberPlates = data.data.numberPlates // 车牌号
                this.dataForm.vehicleType = data.data.vehicleType // 车辆车型
                this.dataForm.type = data.data.type // 车辆类型
                this.dataForm.driverId = data.data.type === '0' ? data.data.driverId : '' // 驾驶员信息
                this.dataForm.supercargoId = data.data.type === '0' ? data.data.supercargoId : '' // 押运员信息
                this.dataForm.maturityTime = data.data.type === '1' ? data.data.maturityTime : '' // 到期时间
              } else {
                this.$message.error(data.msg)
              }
            }).catch((err) => {
              console.log(err)
              this.isDisabled = false
              this.$message.error('未知异常！请联系管理员')
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.isDisabled = true
            vehicleAddOrUpdate({
              id: this.dataForm.id || '',
              numberPlates: this.dataForm.numberPlates, // 车牌号
              vehicleType: this.dataForm.vehicleType, // 车辆车型
              type: this.dataForm.type, // 车辆类型
              driverId: this.dataForm.type === '0' ? this.dataForm.driverId : '', // 驾驶员信息
              supercargoId: this.dataForm.type === '0' ? this.dataForm.supercargoId : '', // 押运员信息
              maturityTime: this.dataForm.type === '1' ? this.dataForm.maturityTime : '' // 到期时间
            }).then(({data}) => {
              this.visible = false
              this.$emit('refreshDataList')
              if (data && data.code === 0) {
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
            }).catch((err) => {
              console.log(err)
              this.isDisabled = false
              this.$message.error('未知异常！请联系管理员')
            })
          }
        })
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
  .vehicle-info-dialog{
    .el-dialog{
      .el-form-item{
        margin-bottom: 0;
      }
      .vehicles{
        text-align: center;
        &-content{
          overflow: hidden;
        }
        &-info{
          height: 36px;
          line-height: 36px;
          color: #fff;
          display: inline-block;
          padding: 0 5px;
          background-color: #2f75bf;
          border-radius: 3px;
          position: relative;
          &:after{
            border-radius: 2px;
            content: '';
            position: absolute;
            width: calc(100% - 4px);
            height: calc(100% - 4px);
            border: 1px solid #ffffff;
            left: 2px;
            top: 2px;
          }
        }
      }

    }
  }
</style>
