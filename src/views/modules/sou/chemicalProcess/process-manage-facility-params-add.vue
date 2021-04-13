<!--参数添加页-->
<template>
  <el-dialog :title="(!dataForm.id ? '新增' : '修改') + '参数信息'"
             :close-on-click-modal="false"
             class="params-add-dialog"
             width="600px"
             :visible.sync="visible"
             append-to-body
             :modal-append-to-body="true">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             class="classes"
             label-width="110px">
      <el-form-item label="参数名称"
                    prop="name"
                    class="stationName">
        <el-input v-model="dataForm.name"
                  placeholder="请输入参数名称"
                  size="mini"
                  clearable></el-input>
      </el-form-item>

      <el-form-item label="参数类型"
                    prop="parameterType.id">
        <el-select v-model="dataForm.parameterType.id"
                   placeholder="请选择参数类型"
                   size="small">
          <el-option v-for="item in options"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="高限"
                    prop="facilityId">
        <el-input v-model="dataForm.facilityId"
                  placeholder="请输入高限"
                  size="mini"
                  type="number"></el-input>
      </el-form-item>
      <el-form-item label="高高限"
                    prop="patrolPointDataAcquisitionList">
        <el-input v-model="dataForm.facilityId"
                  placeholder="请输入高高限"
                  size="mini"
                  type="number"></el-input>
      </el-form-item>
      <el-form-item label="低限"
                    prop="facilityId">
        <el-input v-model="dataForm.facilityId"
                  placeholder="请输入低限"
                  size="mini"
                  type="number"></el-input>
      </el-form-item>
      <el-form-item label="低低限"
                    prop="facilityId">
        <el-input v-model="dataForm.facilityId"
                  placeholder="请输入低低限"
                  size="mini"
                  type="number"></el-input>
      </el-form-item>
      <el-form-item label="备注"
                    prop="facilityId">
        <el-input v-model="dataForm.facilityId"
                  placeholder="请输入备注"
                  size="mini"></el-input>
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
import { parameterTypeList } from '@/api/sou/equipWaring'
export default {
  props: ['areaId'],
  data () {
    return {
      // checkType: '',
      dataForm: {
        name: '',
        parameterType: { id: '' },
        highLimit: '',
        highHighLimit: '',
        lowerLimit: '',
        lowerLowerLimit: '',
        remarks: ''
      },

      options: [],
      addCheckVisible: false,
      activeName: '',
      // 结束时间是否禁用
      endAbled: true,
      dialogVisible: false,
      disabled: false,
      visible: false,
      isDisabled: false,
      dataRule: {
        name: [{ required: true, message: '巡检点名称不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '请选择巡检类型', trigger: 'blur' }],
        facilityId: [{ required: true, message: '设备不能为空', trigger: 'blur' }],
        patrolPointDataAcquisitionList: [{ required: true, message: '检查项不能为空', trigger: 'blur' }]
      }
    }
  },
  components: {

  },
  created () {
    this.getDataList()
  },
  methods: {
    // 添加检查项对话框
    addCheckDialog () {
      this.addCheckVisible = true
      this.$nextTick(() => {
        this.$refs.addCheck.init()
      })
    },
    // 初始数据
    init (id) {
      this.isDisabled = false
      this.dataForm.id = id || ''
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.getDataList()
        if (id) {
          this.selectInfo(id)
        }
      })
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      parameterTypeList().then(({ data }) => {
        if (data && data.code === 0) {
          console.log(data)
          this.options = data.page.list
          this.totalPage = data.page.count
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
        this.dataListLoading = false
      })
    },
    addCheckHandle (obj) {
      console.log(obj)
      let obj1 = JSON.parse(JSON.stringify(obj))
      this.dataForm.patrolPointDataAcquisitionList.push(obj1)
      // this.checkType = type
      // console.log(this.checkType)
      console.log(this.dataForm.patrolPointDataAcquisitionList)
    },
    // 查询单个班组信息
    selectInfo (id) {
      // patrolpointInfo({ 'id': id }).then(({ data }) => {
      //   if (data && data.code === 0) {
      //     this.dataForm = data.data
      //   }
      // })
    },
    handleClose (index) {
      this.dataForm.patrolPointDataAcquisitionList.splice(index, 1)
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.visible = false
          // addOrUpdatepatrolPoint(
          //   this.dataForm
          // ).then(({ data }) => {
          //   this.visible = false
          //   if (data && data.code === 0) {
          //     console.log(data)
          //     this.$emit('refreshPoint')
          //     this.$message({
          //       message: '操作成功',
          //       type: 'success',
          //       duration: 1500,
          //       onClose: () => {
          //       }
          //     })
          //   } else {
          //     this.isDisabled = false
          //     this.$message.error(data.msg)
          //   }
          // })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.params-add-dialog {
  .classes {
    margin-left: 0 !important;
  }
  .el-dialog {
    width: 300px;
    height: 600px;
  }
  // .add {
  //   position: absolute;
  //   right: 2px;
  //   top: 5px;
  // }
  .el-tag {
    background-color: #fff;
  }
  .text {
    font-size: 14px;
  }

  .box-card {
    width: 350px;
    padding: 5px;
    .el-tag {
      width: 350px;
    }
  }
  .el-card__body {
    // padding: 3px;
  }
}
</style>
