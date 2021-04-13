<!--胸卡设备 - 绑定人员/车辆-->
<template>
  <el-dialog :title="'绑定人员'"
             :close-on-click-modal="false"
             width="600px"
             :visible.sync="visible">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             @keyup.enter.native="dataFormSubmit()"
             label-width="120px">
      <el-form-item label="绑定对象"
                    prop="type">
        <el-select v-model="dataForm.type"
                   clearable
                   size="mini"
                   @change="model = ''"
                   class="size-mini-pople-input"
                   placeholder="请选择">
          <el-option v-for="item in typeList"
                     :key="item.label"
                     :label="item.value"
                     :value="item.label">
            <span>{{item.value}}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item
                    label="人员工号"
                    prop="gh">
        <el-input v-model="dataForm.gh"
                  placeholder="人员工号"
                  maxlength="30"
                  clearable></el-input>
      </el-form-item > -->
      <el-row v-if="dataForm.type == '0'">
        <el-col :span="24">
          <el-form-item label="人员类型"
                        prop="">
            <el-select v-model="model"
                       @change='selectListValue'
                       size="mini"
                       placeholder="">
              <el-option v-for="item in sexListPerson.opction"
                         :key="item.cgformName"
                         :label="item.cgformName"
                         :value="item.cgformId">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <select-all :sexList='sexListPerson'
                      @selectListValue='selectListValue'></select-all> -->
        </el-col>
        <el-col :span="24">
          <el-form-item label="人员名称"
                        prop="managerId">
            <!-- <el-select v-model="dataForm.gh"
                       size="mini"
                       placeholder="人员名称">
              <el-option v-for="item in sexListPersonType"
                         :key="item.gh"
                         :label="item.name"
                         :value="item.gh"
                         class=" select-option">
                <span>{{item.name}}</span>
              </el-option>
            </el-select> -->
            <el-input v-model="dataForm.name"
                      placeholder="人员名称"
                      @focus="showPerson"
                      size="mini"
                      class="size-mini-pople-input"
                      clearable>
              <el-button slot="append"
                         @click="showPerson">选择</el-button>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-else>
        <el-col :span="24">
          <el-form-item label="车辆类型"
                        prop="">
            <el-select v-model="model"
                       size="mini"
                       @change="selectListDevice"
                       placeholder="车辆类型">
              <el-option label="全部"
                         value="">
              </el-option>
              <el-option label="车辆"
                         value="0">
              </el-option>
              <el-option label="临时车辆"
                         value="1">
              </el-option>
            </el-select>
            <!-- <select-all :sexList='sexListDevice'
                        @selectListValue='selectListDevice'></select-all> -->
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="车牌号"
                        prop="managerId">
            <el-select v-model="dataForm.vehicleId"
                       placeholder="请选择"
                       size="mini"
                       class="size-mini-pople-input">
              <el-option v-for="item in sexListPersonTypeDevice"
                         :key="item.id"
                         :label="item.numberPlates"
                         :value="item.id"
                         class=" select-option">
                <span>{{item.numberPlates}}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary"
                 @click="dataFormSubmit()">确定</el-button>
    </span>
    <staff-Info v-if="staffInfoVisible"
                ref="staffInfo"
                @selectStaffEmit="handleSelect"></staff-Info>
  </el-dialog>
</template>

<script>
import { deveuiBangding } from '@/api/pos/device'
import selectAll from '@/components/select/select'
import { personTypeList, pList } from '@/api/pos/person'
import { vehicleList } from '@/api/pos/vehicle'
import staffInfo from './device-binding-staff-info'
export default {
  data () {
    return {
      visible: false,
      model: '',
      dataForm: {
        deveui: '', // 设备编号SN
        type: '0',   // 绑定类型
        gh: '',      // 工号
        name: '', // 名称
        vehicleId: ''   // 车辆ID
      },
      selected: {}, // 选中的人员对象
      // 绑定类型 0:人员 1:车辆
      typeList: [{
        label: '0',
        value: '人员'
      }, {
        label: '1',
        value: '车辆'
      }],
      staffInfoVisible: false,
      sexListPersonTypeDevice: [],
      sexListDevice: { opction: [{ value: '全部', lable: '' }, { value: '普通车辆', lable: '0' }, { value: '临时车辆', lable: '1' }], key: { lable: 'value', value: 'lable' } },
      sexListPersonType: [],
      sexListPerson: { opction: [], key: { lable: 'cgformName', value: 'cgformId' } },
      dataRule: {
        gh: [
          { required: true, message: '人员工号不能为空', trigger: 'blur' }
        ],
        vehicleId: [
          { required: true, message: '人员工号不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    selectAll,
    staffInfo
  },
  methods: {
    init (deveui) {
      this.model = ''
      this.dataForm.deveui = deveui
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.dataForm.name = ''
        // 获取人员类型/负责人
        this.getPersonType()
        this.sexListPersonTypeSelect()
        this.sexListPersonTypeSelectDevice()
      })
    },
    // 负责人类型
    getPersonType () {
      personTypeList({
        'page': 1,
        'limit': 20
      }).then(({ data }) => {
        this.sexListPerson.opction = data.page.list
        this.sexListPerson.opction.unshift({ cgformName: '全部', cgformId: '' })
        console.log(this.sexListPerson)
      }).catch((err) => {
        console.log(err)
        this.$message.error('知异常！请联系管理员')
      })
    },
    // 人员类型返回值
    selectListValue (value) {
      this.sexListPersonTypeSelect(value)
      this.dataForm.gh = ''
    },
    // 负责人选择
    sexListPersonTypeSelect (cgformId) {
      pList({
        'page': 1,
        'limit': 20,
        'cgformId': cgformId // 人员类型
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.sexListPersonType = data.page.list
        }
      })
    },

    selectListDevice (value) {
      this.sexListPersonTypeSelectDevice(value)
      this.dataForm.vehicleId = ''
    },
    sexListPersonTypeSelectDevice (type) {
      vehicleList({
        'page': 1,
        'limit': 20,
        'type': type // 车辆类型
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.sexListPersonTypeDevice = data.page.list
        }
      })
    },
    // 显示人员
    showPerson () {
      console.log(this.model)
      this.staffInfoVisible = true
      this.$nextTick(() => {
        this.$refs.staffInfo.init(this.model, this.selected)
      })
    },
    // 显示选中的人员
    handleSelect (val) {
      this.dataForm.gh = val.gh
      this.dataForm.name = val.name
      this.selected = val
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          deveuiBangding({
            'deveui': this.dataForm.deveui,
            'type': this.dataForm.type,
            'person': {
              'gh': this.dataForm.type === '0' ? this.dataForm.gh : ''
            },
            'vehicle': {
              'id': this.dataForm.type === '1' ? this.dataForm.vehicleId : ''
            }
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.visible = false
              this.$emit('refreshDataList')
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          }).catch((err) => {
            console.log(err)
            this.$message.error('未知异常！请联系管理员')
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
