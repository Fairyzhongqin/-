<template>
  <el-dialog :title="(ghs == '' ? '新增' : '修改') + '临时人员'"
             :close-on-click-modal="false"
             :visible.sync="visible"
             width="600px"
             class="personType-dialog">
    <div>
      <!-- 个人信息录入 -->
      <el-form v-if="vehicle"
               :model="dataForm"
               :rules="dataRule"
               ref="dataForm"
               @keyup.enter.native="dataFormSubmit()"
               label-width="120px">
        <el-form-item label="姓名"
                      prop="name">
          <el-input v-model="dataForm.name"
                    placeholder="姓名"
                    maxlength="20"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="性别"
                      prop="sex">
          <el-select v-model="dataForm.sex"
                     placeholder="请选择">
            <el-option v-for="item in sexList"
                       :key="item.sex"
                       :label="item.value"
                       :value="item.sex"
                       class=" select-option">
              <div class="select-right">
                <img src="~@/assets/img/select/right.png"
                     class="right-img"
                     v-show="dataForm.sex === item.sex" />
              </div>
              <span>{{item.value}}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="证件号"
                      prop="gh">
          <el-input v-model="dataForm.gh"
                    placeholder="证件号"
                    maxlength="20"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="到期时间"
                      prop="maturityTime">
          <el-date-picker v-model="dataForm.maturityTime"
                          type="datetime"
                          placeholder="选择到期时间"></el-date-picker>
        </el-form-item>
        <!-- 额外特殊属性 -->
        <el-form-item v-for="(item,index) in otherFormAttr"
                      :key="index"
                      :label="item.attributeName">
          <el-input v-model="otherAttr[item.columnName]"
                    :placeholder="item.attributeName"
                    clearable></el-input>
        </el-form-item>
      </el-form>
      <el-form v-else
               :model="dataForm"
               :rules="dataRule"
               ref="dataFormVehicle"
               @keyup.enter.native="dataFormSubmit()"
               label-width="120px">
        <el-form-item label="车牌号">
          <el-input v-model="dataForm.name"
                    placeholder="车牌号"></el-input>
        </el-form-item>
        <el-form-item label="车型">
          <el-input v-model="dataForm.name"
                    placeholder="车型"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="vehicle = false">下一步</el-button>
      <el-button @click="vehicle = true"
                 v-if="!vehicle">上一步</el-button>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary"
                 :disabled="isDisabled"
                 @click="dataFormSubmit()">完成</el-button>
    </span>
  </el-dialog>
</template>

<script>
import selectAll from '@/components/select/select'
import { temporaryPersonAdd, temporaryPersonGet } from '@/api/pos/temporaryPerson'
import { pGetAttrs } from '@/api/pos/person'
import { cardID } from '@/utils/validate'
export default {
  data () {
    var idCard = (rule, value, callback) => {
      // 如果通过该验证，说明身份证格式正确，但准确性还需计算
      if (cardID(value)) {
        if (Number(value.length) === 18) {
          var idCardWi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2] // 将前17位加权因子保存在数组里
          var idCardY = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2] // 这是除以11后，可能产生的11位余数、验证码，也保存成数组
          var idCardWiSum = 0 // 用来保存前17位各自乖以加权因子后的总和
          for (var i = 0; i < 17; i++) {
            idCardWiSum += value.substring(i, i + 1) * idCardWi[i]
          }
          var idCardMod = idCardWiSum % 11 // 计算出校验码所在数组的位置
          var idCardLast = value.substring(17) // 得到最后一位身份证号码
          // 如果等于2，则说明校验码是10，身份证号码最后一位应该是X
          if (Number(idCardMod) === 2) {
            if (String(idCardLast) === 'X' || String(idCardLast) === 'x') {
              callback()
              // alert("恭喜通过验证啦！");
            } else {
              callback(new Error('身份证号码错误！'))
            }
          } else {
            // 用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
            if (Number(idCardLast) === Number(idCardY[idCardMod])) {
              // alert("恭喜通过验证啦！");
              callback()
            } else {
              callback(new Error('身份证号码错误！'))
            }
          }
        }
        // callback(new Error('身份证号码格式不正确！11'))
      } else {
        callback(new Error('身份证号码格式不正确！'))
      }
    }
    return {
      otherAttr: {},
      visible: false,
      isDisabled: false,
      dataForm: {
        gh: '',
        sex: '',
        name: '',
        maturityTime: ''
      },
      otherFormAttr: [],
      ghs: '',
      sexList: [{
        sex: '0',
        value: '男'
      },
      {
        sex: '1',
        value: '女'
      }],
      datePick: '',
      dataRule: {
        gh: [{ required: true, validator: idCard, trigger: 'blur' }]
      },
      vehicle: true  // 车辆信息添加展示
    }
  },
  components: { selectAll },
  methods: {
    // 新增单个字段
    init (gh) {
      this.dataForm.gh = gh
      this.ghs = this.dataForm.gh
      this.visible = true
      this.isDisabled = false
      // 查询人员类型特有属性
      this.cgformChangeHandle()
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        // this.otherAttr = {}
        if (this.ghs !== '') {
          this.isDisabled = true
          // 获取详细信息
          temporaryPersonGet({
            gh: this.ghs
          }).then(({ data }) => {
            this.isDisabled = false
            if (data && data.code === 0) {
              this.dataForm = data.info
              this.otherAttr = data.info.otherAttr
              console.log(this.otherAttr)
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
    // 查询人员类型特有属性
    cgformChangeHandle () {
      this.otherFormAttr = []
      pGetAttrs({
        cgformId: '713273002' // 人员类型
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.otherFormAttr = data.list
        } else {
          this.$message.error(data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.isDisabled = true
          this.dataForm.otherAttr = this.otherAttr
          this.dataForm.ghs = this.ghs
          temporaryPersonAdd(this.dataForm).then(({ data }) => {
            if (data && data.code === 0) {
              this.visible = false
              this.$emit('refreshDataList')
            } else {
              this.$message.error(data.msg)
            }
          }).catch(({ err }) => {
            console.log(err)
            this.$message.error('未知异常，请联系管理员')
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
}
</style>
<style lang="scss" scoped>
// 下拉框样式
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
</style>
