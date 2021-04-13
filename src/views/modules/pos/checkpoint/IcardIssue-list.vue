<template>
  <!-- 在岗在位卡收发 -->
  <div class="icard-issue">
    <el-row>
      <!-- 设备信息展示 -->
      <el-col :span="8">
        <!-- &nbsp; -->
        <div class="icardIssueDeveui" v-show="deveuiShow">
          <el-form ref="form" :model="formData" label-width="80px">
            <el-form-item label="设备编号">
              <span>{{formData.deveui}}</span>
            </el-form-item>
            <el-form-item label="设备状态"><span>{{formData.status === '0' ? '在线':'离线'}}</span></el-form-item>
            <el-form-item label="设备电量">
              <el-progress style="padding: 0 10px" v-if="formData.rate" :text-inside="true" :stroke-width="15" :status="formData.rate>25? 'success' : 'exception'" :percentage="formData.rate!==null?Number(formData.rate):0"></el-progress>
              <el-tag v-else type="info" effect="dark">未知</el-tag>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <!-- 右侧信息填写及展示 -->
      <el-col :span="16">
        <el-form ref="form" @submit.native.prevent :model="formData" label-width="100px" :rules='dataRule'>
          <el-form-item label="设备编号" prop="deveui" @keyup.enter.native="deveuiInfo()">
            <el-input v-model="formData.deveui" @blur="deveuiInfo()"></el-input>
          </el-form-item>
        </el-form>
        <el-row>
          <div v-if="issuingShow">
            <el-col :span="24" align='left' class="pl100">
              <el-button @click="temporaryShow(1)" :autofocus="true" :class="{selected:personCtr}">临时人员</el-button>
              <el-button @click="temporaryShow(2)" :class="{selected:carCtr}">临时车辆</el-button>
            </el-col>
          </div>
        </el-row>
        <!-- 临时人员及临时车辆信息填写 -->
        <el-form ref="form" class="pt20" label-width="100px" v-if="issuingShow" :model="formData" :rules='dataRule'>
          <div v-if="temporary">
            <el-divider content-position="center">人员信息</el-divider>
            <el-form-item label="姓名" prop="person.name">
              <el-input v-model="formData.person.name"></el-input>
            </el-form-item>
            <el-form-item label="性别">
              <el-select v-model="formData.person.sex" placeholder="请选择">
                <el-option v-for="item in sexList" :key="item.sex" :label="item.value" :value="item.sex" class=" select-option">
                  <div class="select-right">
                    <img src="~@/assets/img/select/right.png" class="right-img" v-show="formData.person.sex === item.sex" />
                  </div>
                  <span>{{item.value}}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="证件号" prop="person.gh">
              <el-input v-model="formData.person.gh"></el-input>
            </el-form-item>
            <el-form-item label="到期时间" prop="maturityTime">
              <el-date-picker v-model="formData.vehicle.maturityTime" type="datetime" placeholder="选择到期时间"></el-date-picker>
            </el-form-item>
          </div>
          <div v-else>
            <el-divider content-position="center">车辆信息</el-divider>
            <el-form-item label="车牌号" prop="vehicle.vehicleType">
              <el-input v-model="formData.vehicle.vehicleType"></el-input>
            </el-form-item>
            <el-form-item label="车辆图标" prop="vehicle.iconName">
              <el-popover ref="iconListPopover" placement="bottom-start" trigger="click" popper-class="mod-menu__icon-popover">
                <el-button v-for="(item, index) in $store.state.common.vehiceIcon" :key="index" @click.stop="vehicleIcon(item)">
                  <img :src="item.value" alt="#" class="mapPersonTypeimg">
                </el-button>
              </el-popover>
              <el-input v-model="formData.vehicle.iconName" v-popover:iconListPopover :readonly="true" size="mini" class="size-mini-pople-input" placeholder="车辆图标名称"></el-input>
            </el-form-item>
            <el-form-item label="驾驶员信息">
              <el-input v-model="formData.vehicle.remarks"></el-input>
            </el-form-item>
            <el-form-item label="证件号" prop="vehicle.numberPlates">
              <el-input v-model="formData.vehicle.numberPlates"></el-input>
            </el-form-item>
            <el-form-item label="到期时间" prop="maturityTime">
              <el-date-picker v-model="formData.vehicle.maturityTime" type="datetime" placeholder="选择到期时间"></el-date-picker>
            </el-form-item>
          </div>

          <el-row>
            <el-col :span="24" align='right'>
              <el-button @click="IcardIssueType('form')">发卡</el-button>
            </el-col>
          </el-row>

        </el-form>
        <!-- 临时人员及车辆信息展示 -->
        <el-form ref="form" class="pt20" label-width="100px" v-if="information" :model="formData">
          <div v-if="formData.type =='0'">
            <el-divider content-position="center">人员信息</el-divider>
            <el-form-item label="姓名">
              <el-input v-model="formData.person.name" :readonly='true'></el-input>
            </el-form-item>
            <el-form-item label="性别">
              <span>{{formData.person.sex === '0' ?'男' :'女'}}</span>
            </el-form-item>
            <el-form-item label="证件号">
              <el-input v-model="formData.person.gh" :readonly='true'></el-input>
            </el-form-item>
          </div>
          <div v-else>
            <el-divider content-position="center">车辆信息</el-divider>
            <el-form-item label="车牌号">
              <el-input :readonly='true' v-model="formData.vehicle.numberPlates"></el-input>
            </el-form-item>
            <el-form-item label="车型">
              <el-input :readonly='true' v-model="formData.vehicle.vehicleType"></el-input>
            </el-form-item>
          </div>
          <el-row>
            <el-col :span="24" align='right'>
              <el-button @click="bindingStaffJiebang()">收卡</el-button>
            </el-col>
          </el-row>

        </el-form>
      </el-col>
    </el-row>

  </div>
</template>
<script>
import { IcardIssueInfo, IcardIssueSendcard } from '@/api/pos/checkpoint'
import { deveuiJiebang } from '@/api/pos/device'
export default {
  data () {
    return {
      formData: {
        deveui: '',
        person: {
          gh: '',
          maturityTime: '',
          name: '',
          sex: 0,
          otherAttr: {}
        },
        type: '',
        vehicle: {
          maturityTime: '',
          numberPlates: '',
          driverId: '',
          vehicleType: '',
          iconName: '', // 车辆图标名称
          icon: ''// 车辆图标
        }
      },
      sexList: [{ value: '男', sex: 0 }, { value: '女', sex: 1 }],
      issuingShow: false, // 展示收卡发卡
      temporary: true, // 临时人员/临时车辆信息录入
      icardIssue: true,
      information: false, // 人员及车辆信息展示
      personCtr: true, // 控制选中人员
      carCtr: false, // 控制选中车辆
      deveuiShow: false, // 设备信息展示
      dataRule: {
        deveui: [{ required: true, message: '设备编号不能为空', trigger: 'blur' }],
        'person.name': [{ required: true, message: '人员名称不能为空', trigger: 'blur' }],
        'person.gh': [{ required: true, message: '人员证件号不能为空', trigger: 'blur' }],
        'vehicle.vehicleType': [{ required: true, message: '车牌号不能为空', trigger: 'blur' }],
        'vehicle.iconName': [{ required: true, message: '车辆图标不能为空', trigger: 'change' }],
        'vehicle.numberPlates': [{ required: true, message: '证件号不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    temporaryShow (number) {
      if (Number(number) === 1) {
        this.temporary = true
        this.personCtr = true
        this.carCtr = false
        this.person()
        this.vehicle()
      } else {
        this.temporary = false
        this.personCtr = false
        this.carCtr = true
        this.person()
        this.vehicle()
      }
    },
    // 设备编号查询
    deveuiInfo () {
      if (this.formData.deveui !== '') {
        IcardIssueInfo({
          deveui: this.formData.deveui
        }).then(({ data }) => {
          if (data && data.code === 0 && data.entity != null) {
            this.formData = data.entity
            // 判断是否已绑定
            if (data.entity.type === '') {
              this.issuingShow = true
              this.information = false
              this.person()
              this.vehicle()
            } else {
              // 判断绑定人员展示
              if (data.entity.type === '0') {
                if (data.entity.person === null) {
                  this.issuingShow = true
                  this.information = false
                  this.person()
                  this.vehicle()
                } else {
                  this.vehicle()
                  this.issuingShow = false
                  this.information = true
                }
              } else {
                // 判断绑定车辆
                if (data.entity.vehicle === null) {
                  this.issuingShow = true
                  this.information = false
                  this.person()
                  this.vehicle()
                } else {
                  this.person()
                  this.issuingShow = false
                  this.information = true
                }
              }
            }
            this.deveuiShow = true
          } else {
            this.issuingShow = false
            this.information = false
            this.$message.error('查无此设备')
          }
        })
      }
    },
    // 车辆数据清空
    vehicle () {
      this.formData.vehicle = {
        maturityTime: '',
        numberPlates: '',
        remarks: '',
        vehicleType: ''
      }
    },
    // 人员数量清空
    person () {
      this.formData.person = {
        gh: '',
        maturityTime: '',
        name: '',
        sex: 0,
        otherAttr: {}
      }
    },
    // 车辆图标名称
    vehicleIcon (item) {
      this.$set(this.formData.vehicle, 'iconName', item.name)
      this.$set(this.formData.vehicle, 'icon', item.icon)
    },
    // 胸卡绑定临时人员/临时车辆
    IcardIssueType (formName) {
      if (this.temporary === true) {
        this.formData.type = '0'
      } else {
        this.formData.type = '1'
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          IcardIssueSendcard(this.formData).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message.success('发卡成功')
              this.issuingShow = false
              this.information = false
              this.formData = {
                deveui: '',
                person: {
                  gh: '',
                  maturityTime: '',
                  name: '',
                  sex: 0,
                  otherAttr: {}
                },
                type: '',
                vehicle: {
                  maturityTime: '',
                  numberPlates: '',
                  remarks: '',
                  vehicleType: ''
                }
              }
              this.deveuiShow = false
            }
          })
        }
      })
    },
    // 胸卡解绑
    bindingStaffJiebang () {
      deveuiJiebang({ 'deveui': this.formData.deveui }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message.success('操作成功')
          this.issuingShow = false
          this.information = false
          this.formData = {
            deveui: '',
            person: {
              gh: '',
              maturityTime: '',
              name: '',
              sex: 0,
              otherAttr: {}
            },
            type: '',
            vehicle: {
              maturityTime: '',
              numberPlates: '',
              remarks: '',
              vehicleType: ''
            }
          }
          this.deveuiShow = false
        } else {
          this.$message.error(data.msg)
        }
      })
    }
  },
  watch: {
    'formData.deveui': {
      handler: function () {
        this.deveuiShow = false
        this.issuingShow = false
        this.information = false
      }
    }
  }
}
</script>
<style lang='scss'>
.icard-issue {
  width: 94%;
  margin: 0 auto;
  .pt20 {
    padding-top: 20px;
  }
  .pl100 {
    padding-left: 100px;
  }
  .icardIssueDeveui {
    border: 1px solid #d8d8d8;
    border-radius: 4px;
    box-shadow: 1px 2px 1px 1px #d8d8d8;
    width: 80%;
  }
  .selected {
    background-color: #2c78b8;
    color: #fff;
  }
}
</style>
<style lang="scss">
// 下拉框样式
.icard-issue {
  .el-select-dropdown__item {
    padding: 0;
  }
  .select-right {
    margin-left: 6px;
    width: 24px;
    display: inline-block;
  }
  .right-img {
    height: 16px;
    width: 16px;
  }
  .el-icon-check {
    color: #4bd4fb;
  }
  .el-select-dropdown__item.selected {
    color: #606266;
    font-weight: normal;
  }
  .el-select-dropdown__item.hover,
  .el-select-dropdown__item:hover {
    background: -webkit-linear-gradient(
      left,
      #7fc2f3,
      #d8e8f6
    ); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(
      right,
      #7fc2f3,
      #d8e8f6
    ); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(
      right,
      #7fc2f3,
      #d8e8f6
    ); /* Firefox 3.6 - 15 */
    background: linear-gradient(to right, #7fc2f3, #d8e8f6); /* 标准的语法 */
  }
  .mapPersonTypeimg {
    width: 30px;
    height: 30px;
  }
}
</style>
