<template>
  <el-dialog :title="(!dataForm.id ? '新增' : '修改') + '车辆'" :close-on-click-modal="false" :visible.sync="visible" width="600px" class="personType-dialog">
    <div>
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
        <el-form-item label="车辆类型" prop="type">
          <el-select v-model="dataForm.type" clearable size="mini" placeholder="请选择">
            <el-option v-for="item in typeList" :key="item.label" :label="item.value" :value="item.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车牌号" prop="numberPlates">
          <el-input v-model="dataForm.numberPlates" size="mini" class="size-mini-pople-input" placeholder="车牌号" maxlength="20" clearable></el-input>
        </el-form-item>
        <el-form-item label="车辆图标" prop="iconName">
          <el-popover ref="iconListPopover" placement="bottom-start" trigger="click" popper-class="mod-menu__icon-popover">
            <el-button v-for="(item, index) in $store.state.common.vehiceIcon" :key="index" @click.stop="vehicleIcon(item)">
              <img :src="item.value" alt="#" class="mapPersonTypeimg">
            </el-button>
          </el-popover>
          <el-input v-model="dataForm.iconName" v-popover:iconListPopover :readonly="true" size="mini" class="size-mini-pople-input" placeholder="车辆图标名称"></el-input>
        </el-form-item>
        <el-form-item label="车辆车型" prop="vehicleType">
          <el-input v-model="dataForm.vehicleType" placeholder="车辆车型" size="mini" class="size-mini-pople-input" maxlength="20" clearable></el-input>
        </el-form-item>

        <template v-if="dataForm.type === '0'">
          <el-form-item label="驾驶员信息" prop="driverId">
            <el-input v-model="dataForm.driverId" placeholder="驾驶员信息" maxlength="20" size="mini" class="size-mini-pople-input" clearable></el-input>
          </el-form-item>
          <el-form-item label="押运员信息" prop="supercargoId">
            <el-input v-model="dataForm.supercargoId" placeholder="押运员信息" maxlength="20" size="mini" class="size-mini-pople-input" clearable></el-input>
          </el-form-item>
        </template>
        <el-form-item v-else label="到期时间" prop="maturityTime">
          <el-date-picker v-model="dataForm.maturityTime" :picker-options="pickerOptions" size="mini" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" type="datetime" placeholder="到期时间">
          </el-date-picker>
        </el-form-item>

      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="isDisabled" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { vehicleAddOrUpdate, vehicleInfo } from '@/api/pos/vehicle'
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
        maturityTime: '',  // 到期时间
        icon: '', // 车辆图标
        iconName: '' // 车辆图标名
      },
      // 车辆类型 0:普通车辆 1:临时车辆
      typeList: [{
        label: '0',
        value: '普通车辆'
      }, {
        label: '1',
        value: '临时车辆'
      }],
      dataRule: {
        numberPlates: [
          { required: true, message: '车牌号不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '车辆类型不能为空', trigger: 'blur' }
        ],
        maturityTime: [
          { required: true, message: '到期时间不能为空', trigger: 'blur' }
        ],
        iconName: [
          { required: true, message: '车辆图标不能为空', trigger: 'change' }
        ]
      },
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
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
          }).then(({ data }) => {
            this.isDisabled = false
            if (data && data.code === 0) {
              this.dataForm.numberPlates = data.data.numberPlates // 车牌号
              this.dataForm.vehicleType = data.data.vehicleType // 车辆车型
              this.dataForm.type = data.data.type // 车辆类型
              this.dataForm.driverId = data.data.type === '0' ? data.data.driverId : '' // 驾驶员信息
              this.dataForm.supercargoId = data.data.type === '0' ? data.data.supercargoId : '' // 押运员信息
              this.dataForm.maturityTime = data.data.type === '1' ? data.data.maturityTime : '' // 到期时间
              this.dataForm.icon = data.data.icon
              this.dataForm.iconName = this.$store.state.common.vehiceIcon[this.dataForm.icon].name
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
    // 车辆图标名称
    vehicleIcon (item) {
      this.dataForm.iconName = item.name
      this.dataForm.icon = item.icon
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
            maturityTime: this.dataForm.type === '1' ? this.dataForm.maturityTime : '', // 到期时间
            icon: this.dataForm.icon
          }).then(({ data }) => {
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
  }
}
</script>
<style lang="scss">
.personType-dialog {
  .field-item {
    .el-form-item__content {
      padding-right: 50px;
      position: relative;
    }
    &-del {
      position: absolute;
      right: 10px;
      top: 0;
      line-height: 36px;
      font-size: 26px;
      color: #f56c6c;
    }
  }
  .mapPersonTypeimg {
    width: 30px;
    height: 30px;
  }
}
</style>
