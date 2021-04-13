<template>
  <el-dialog :title="(!dataForm.id ? '新增' : '修改') + '围栏'"
             :close-on-click-modal="false"
             :visible.sync="visible"
             width="1000px"
             class="personType-dialog">
    <el-row>
      <el-col :span="14">
        <div style="width: 100%; height: 100%;">
          <!-- <three-map :width="559"
                     :height="232"
                     cameraType="orthographic">
          </three-map> -->
        </div>
      </el-col>
      <el-col :span="10">
        <div>
          <el-form :model="dataForm"
                   :rules="dataRule"
                   ref="dataForm"
                   @keyup.enter.native="dataFormSubmit()"
                   label-width="80px">
            <el-form-item label="围栏名称"
                          prop="fencingName">
              <el-input v-model="dataForm.fencingName"
                        placeholder="围栏名称"
                        maxlength="20"
                        clearable></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="围栏类型"
                              prop="type">
                  <el-select v-model="dataForm.type"
                             placeholder="请选择">
                    <el-option label="楼层围栏"
                               value="0">
                    </el-option>
                    <el-option label="区域围栏"
                               value="1">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">

                <el-form-item label="围栏时效"
                              prop="perpetualFlag">
                  <el-select v-model="dataForm.perpetualFlag"
                             :disabled="!dataForm.id?false:true"
                             placeholder="请选择">
                    <el-option label="永久围栏"
                               value="0">
                    </el-option>
                    <el-option label="临时围栏"
                               value="1">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="围栏坐标"
                          prop="coordinate">
              <el-input v-model="dataForm.coordinate"
                        placeholder="围栏坐标"
                        clearable></el-input>
            </el-form-item>
            <el-form-item label="围栏楼层"
                          prop="floor">
              <el-input v-model="dataForm.floor"
                        placeholder="围栏楼层"
                        clearable></el-input>
            </el-form-item>
            <el-form-item label="围栏高度"
                          required>
              <el-row>
                <el-col :span="10">
                  <el-form-item prop="minHeight">

                    <el-input type="number"
                              min='0'
                              v-model="dataForm.minHeight"
                              placeholder="围栏最小高度"
                              clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2"
                        align='center'>~</el-col>
                <el-col :span="10">
                  <el-form-item prop="maxHeight">
                    <el-input type="number"
                              min='0'
                              v-model="dataForm.maxHeight"
                              placeholder="围栏最大高度"
                              clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

            </el-form-item>
            <el-form-item label="备注"
                          prop="remarks">
              <el-input v-model="dataForm.remarks"
                        placeholder="备注"
                        maxlength="600"
                        clearable></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>

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
import { numberTwo } from '@/utils/validate'
import { fencingInfo, fencingAddOrUpdate } from '@/api/pos/region'
// import ThreeMap from '@/components/ThreeMap/index'
export default {
  components: {
    // ThreeMap
  },
  data () {
    var validateNumber = (rule, value, callback) => {
      if (!numberTwo(value)) {
        callback(new Error('请输入0~2位数字'))
      } else {
        callback()
      }
    }
    var minNumber = (rule, value, callback) => {
      if (this.dataForm.maxHeight !== '') {
        if (Number(value) > Number(this.dataForm.maxHeight)) {
          callback(new Error('最小高度不能大于最大高度'))
        } else {
          callback()
        }
      }
    }
    var maxNumber = (rule, value, callback) => {
      if (this.dataForm.minHeight !== '') {
        if (Number(value) < Number(this.dataForm.minHeight)) {
          callback(new Error('最大高度不能小于最大高度'))
        } else {
          callback()
        }
      }
    }
    return {
      visible: false,
      isDisabled: false,
      dataForm: {
        id: '',
        fencingName: '',  // 围栏名称
        coordinate: '',   // 围栏坐标格式(000,000)|(111,111) 最多支持20个点选择
        floor: '',        // 楼层
        remarks: '',      // 备注
        perpetualFlag: '',
        type: '',
        maxHeight: '',
        minHeight: ''
      },
      dataRule: {
        fencingName: [
          { required: true, message: '人员类型不能为空', trigger: 'blur' }
        ],
        coordinate: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        floor: [
          { required: true, message: '围栏高度不能为空', trigger: 'blur' },
          { validator: validateNumber, trigger: 'blur' }
        ],
        type: [
          { required: true, message: '围栏类型不能为空', trigger: 'change' }
        ],
        perpetualFlag: [
          { required: true, message: '围栏时效不能为空', trigger: 'change' }
        ],
        minHeight: [
          { required: true, message: '围栏最小高度不能为空', trigger: 'blur' },
          { validator: minNumber, trigger: 'blur' }
        ],
        maxHeight: [
          { required: true, message: '围栏最大高度不能为空', trigger: 'blur' },
          { validator: maxNumber, trigger: 'blur' }
        ]
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
          fencingInfo({
            'id': this.dataForm.id || undefined
          }).then(({ data }) => {
            this.isDisabled = false
            if (data && data.code === 0) {
              this.dataForm.fencingName = data.data.fencingName // 围栏名称
              this.dataForm.coordinate = data.data.coordinate // 围栏坐标格式(000,000)|(111,111) 最多支持20个点选择
              this.dataForm.floor = data.data.floor // 楼层
              this.dataForm.remarks = data.data.remarks // 备注
              this.dataForm.minHeight = data.data.minHeight
              this.dataForm.maxHeight = data.data.maxHeight
              this.dataForm.type = data.data.type
              this.dataForm.perpetualFlag = data.data.perpetualFlag
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
          fencingAddOrUpdate({
            id: this.dataForm.id || '',
            fencingName: this.dataForm.fencingName, // 围栏名称
            coordinate: this.dataForm.coordinate, // 围栏坐标格式(000,000)|(111,111) 最多支持20个点选择
            floor: this.dataForm.floor, // 楼层
            remarks: this.dataForm.remarks, // 备注
            perpetualFlag: this.dataForm.perpetualFlag,
            type: this.dataForm.type,
            maxHeight: this.dataForm.maxHeight,
            minHeight: this.dataForm.minHeight
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
}
</style>
