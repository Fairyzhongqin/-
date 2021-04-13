<!--作业管理 新增/修改-->
<template>
  <el-dialog
    :title="(!dataForm.id ? '新增' : '修改') + '作业'"
    :close-on-click-modal="false"
    class="private-dialog"
    width="50%"
    :visible.sync="visible"
  >
    <el-row>
      <el-col :span="24">
        <el-form
          :model="dataForm"
          :rules="dataRule"
          ref="dataForm"
          @keyup.enter.native="dataFormSubmit()"
          label-width="120px"
        >
          <el-form-item label="申请单位" prop="applyUnit">
            <el-input v-model="dataForm.applyUnit" size="mini" placeholder="请输入申请单位" clearable></el-input>
          </el-form-item>
          <el-form-item label="作业区域" prop="fencyId">
            <el-select v-model="dataForm.fencyId" size="mini">
              <el-option
                v-for="item in fencyData"
                :key="item.id"
                :value="item.id"
                :label="item.fencingName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="申请人" prop="applyId">
            <el-select v-model="dataForm.applyId" size="mini">
              <el-option
                v-for="item in personData"
                :key="item.gh"
                :value="item.gh"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>

          <!-- <el-form-item label="作业开始时间"
                        prop="workStartTime">
            <el-date-picker v-model="dataForm.workStartTime"
                            :picker-options="start_Date"
                            type="datetime"
                            placeholder="作业开始时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="作业结束时间"
                        prop="workEndTime">
            <el-date-picker v-model="dataForm.workEndTime"
                            :picker-options="end_Date"
                            type="datetime"
                            placeholder="作业结束时间"></el-date-picker>
          </el-form-item>-->
          <el-form-item label="作业时间" prop="dataRange">
            <el-date-picker
              v-model="dataForm.dataRange"
              type="datetimerange"
              size="mini"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 弹框，选择地区 -->
    <!-- <enclosure-or-area v-if="enclosureVisible"
                       @selectChange='selectChange'
    ref="enclosureOrAreas"></enclosure-or-area>-->
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="isDisabled" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { personInfo } from '@/api/pos/person'
import { fencingSelect } from '@/api/pos/region'
import { privateAdd, privateInfo } from '@/api/pos/security'

// eslint-disable-next-line no-unused-vars
import { Format } from '@/utils/validate'
// import enclosureOrArea from '@/components/select/select-enclosure-or-area'
export default {
  data () {
    // const timeOfDay = 1000 * 60 * 60 * 12
    return {
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      personData: [], // 申请人信息
      fencyData: [], // 围栏所有信息
      // enclosureVisible: false,
      visible: false,
      isDisabled: false,
      dataForm: {
        applyUnit: '', // 申请单位
        fencyId: '', // 围栏名称（id)
        fencing: {
          id: ''
        }, // 传给后台的实际id
        applyId: '', // 申请人名字(id)
        person: {
          id: ''
        }, // 传给后台的实际申请名Id
        workStartTime: '', // 作业开始时间
        workEndTime: '', // 作业结束时间
        dataRange: []
      },
      start_Date: {
        disabledDate: time => {
          return time.getTime() > new Date(this.dataForm.workEndTime).getTime()
        }
      },
      end_Date: {
        disabledDate: time => {
          return time.getTime() < new Date(this.dataForm.workStartTime).getTime()
        }
      },

      dataRule: {
        applyUnit: [
          { required: true, message: '申请单位不能为空', trigger: 'blur' }
        ],
        fencyId: [
          { required: true, message: '作业区域不能为空', trigger: 'change' }
        ],
        applyId: [
          { required: true, message: '申请人不能为空', trigger: 'change' }
        ],
        dataRange: [
          { required: true, message: '作业日期不能为空', trigger: 'change' }
        ]
      }
    }
  },
  components: {},
  created () {
  },
  methods: {

    // 获取字典数据列表，系统选项(作业类型，作业状态)
    getDictList () {
      this.$http({
        url: this.$http.adornUrl('/spring-sysweb/sys/dict/list'),
        method: 'get',
        params: this.$http.adornParams({
          'type': 'work_status'
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.options = data.page.list
        }
      })
      this.$http({
        url: this.$http.adornUrl('/spring-sysweb/sys/dict/list'),
        method: 'get',
        params: this.$http.adornParams({
          'type': 'work_type'
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.optionsType = data.page.list
        }
      })
    },

    // 初始数据
    init (id) {
      this.isDisabled = false
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.dataForm.dataRange = []

        this.getFencingSelect()
        this.getPersonInfo()

        // this.getDictList()
        if (this.dataForm.id) {
          this.isDisabled = true
          privateInfo({
            id: this.dataForm.id
          }).then(({ data }) => {
            this.isDisabled = false
            if (data && data.code === 0) {
              this.dataForm.applyUnit = data.data.applyUnit
              this.dataForm.id = data.data.id
              this.dataForm.fencing.id = data.data.fencing.id

              this.dataForm.fencyId = data.data.fencing.id
              this.dataForm.applyId = data.data.person.id

              this.dataForm.dataRange = []
              this.dataForm.dataRange.push(data.data.workStartTime, data.data.workEndTime)
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

          // this.dataForm.workEndTime = new Date(this.dataForm.workTime[1]).Format('yyyy-MM-dd hh:mm:ss')
          // this.dataForm.workStartTime = new Date(this.dataForm.workTime[0]).Format('yyyy-MM-dd hh:mm:ss')
          privateAdd({
            id: this.dataForm.id,
            applyUnit: this.dataForm.applyUnit, // 申请单位
            fencing: {
              id: this.dataForm.fencyId
            }, // 传给后台的实际id

            person: {
              id: this.dataForm.applyId
            }, // 传给后台的实际申请名Id
            workStatus: '0',
            workStartTime: new Date(this.dataForm.dataRange[0]).Format('yyyy-MM-dd hh:mm:ss'),
            workEndTime: new Date(this.dataForm.dataRange[1]).Format('yyyy-MM-dd hh:mm:ss')
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
    },
    // 查询围栏id
    getFencingSelect () {
      fencingSelect().then(({ data }) => {
        if (data && data.code === 0) {
          this.fencyData = data.list
        } else {
          this.fencyData = []
        }
      }).catch(err => {
        console.log(err)
        this.$message.error('未知异常，请联系管理员')
      })
    },
    // 查询申请人id
    getPersonInfo () {
      personInfo().then(({ data }) => {
        if (data && data.code === 0) {
          this.personData = data.info
        } else {
          this.personData = []
        }
      }).catch(err => {
        console.log(err)
        this.$message.error('未知异常，请联系管理员')
      })
    }
  }
}
</script>
<style lang="scss">
.private-dialog {
  .el-dialog {
    .report-err {
      display: inline-block;
      .el-input--medium {
        width: 65px;
        input {
          padding: 5px;
        }
      }
    }
  }
  .stationBorder {
    border: 1px solid #d8d8d8;
    border-radius: 4px;
    padding: 10px;
    min-height: 30px;
    max-height: 120px;
    overflow-y: auto;
    margin-top: 4px;
  }
  // .el-form-item--medium {
  //   margin-bottom: 12px;
  // }
  .el-select {
    width: 100%;
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
}
</style>
