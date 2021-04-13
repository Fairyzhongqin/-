<template>
  <el-dialog class="station-dialog"
             :title="(!dataForm.id?'新增':'修改')+'承包商信息'"
             :close-on-click-modal="false"
             append-to-body
             width="650px"
             :visible.sync="visible">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             label-width="90px">
      <el-form-item label="承包商"
                    prop="contractorName">
        <el-input size="mini"
                  class="contractorWidth"
                  v-model="dataForm.contractorName"
                  placeholder="请输入承包商"
                  clearable></el-input>
      </el-form-item>
      <el-form-item label="负责人"
                    prop="personLiable">
        <el-select v-model="dataForm.personLiable"
                   filterable
                   placeholder="请选择"
                   class="contractorWidth">
          <el-option v-for="item in liableOptions"
                     :key="item.key"
                     :label="item.label"
                     :value="item.label">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="联系方式"
                    prop="telephone">
        <el-input size="mini"
                  class="contractorWidth"
                  v-model="dataForm.telephone"
                  placeholder="请输入联系方式"
                  clearable></el-input>
      </el-form-item>

      <!-- <el-form-item label="活动区"
                    prop="area">
        <el-row>
          <el-col :span="12"
                  style="padding-right:20px">

            <div class="stationBorder">
              <el-row>
                <el-col v-for="item in selectList"
                        :key="item.id"
                        :span="24">{{item.fencingName ?item.fencingName:item.zoneName}}</el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :span="8">
            <el-button type="text"
                       @click="selectArea('enclosure')">选择区域</el-button>
          </el-col>
        </el-row>

      </el-form-item> -->
      <el-form-item label="所属人员"
                    prop="staffArray">
        <el-transfer v-model="staffArray"
                     class="item-transfer"
                     filterable
                     @change="changeRight"
                     :titles="['未选中','选中']"
                     :data="assistData">
          <el-button class="transfer-footer"
                     slot="left-footer"
                     size="small"
                     @click="addStaff()">添加承包商人员</el-button>
        </el-transfer>
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary"
                 :disabled="isDisabled"
                 @click="dataFormSubmit()">确定</el-button>
    </span>
    <!-- 弹框，选择地区 -->
    <enclosure-or-area v-if="enclosureVisible"
                       @selectChange='selectChange'
                       ref="enclosureOrAreas"></enclosure-or-area>
    <!-- 弹窗,添加外协人员 -->
    <add-staff v-if="addStaffVisible"
               @refreshDataList="getPlist"
               ref="addStaffs"></add-staff>
  </el-dialog>
</template>
<script>
import addStaff from '../basicData/person-add-or-update'
import enclosureOrArea from '@/components/select/select-enclosure-or-area'
import { pList } from '@/api/pos/person'
import { cAddOrUpdate, contractInfo } from '@/api/pos/contractManage'
export default {
  data () {
    let validatePhone = (rule, value, callback) => {
      if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(value)) {
        callback(new Error('手机号格式错误'))
      } else {
        callback()
      }
    }

    return {
      dataForm: {
        id: '',
        telephone: '', // 联系方式
        contractorName: '', // 承包商
        personLiable: '', // 负责人
        personLiableId: '', // 负责人的id
        staffArray: [], // 承包商工作人员
        zoneFencingList: [] // 活动范围, {zoneId区域ID，fencingId围栏ID}
      },
      liableOptions: [], // 负责人列表
      // 选择地区弹框是否显示
      enclosureVisible: false,
      // 添加外协人员弹框是否显示
      addStaffVisible: false,
      visible: false,
      isDisabled: false,
      // 穿梭框数据源
      assistData: [],
      // 承包商所属人员
      staffData: [],
      // 范围区域展示
      selectList: [],
      staffArray: [],
      dataRule: {
        contractorName: [{ required: true, message: '承包商名称不能为空', trigger: 'blur' }],
        staffArray: [{ validator: this.validateStaffArray, trigger: 'blur' }],
        telephone: [{ required: true, message: '请输入承包商联系方式', trigger: 'blur' },
        { validator: validatePhone, trigger: 'blur' }],
        personLiable: [{ required: true, message: '请选择负责人', trigger: 'change' }]

      }
    }
  },
  components: {
    enclosureOrArea,
    addStaff
  },
  methods: {
    validateStaffArray (rule, value, callback) {
      if (this.staffArray.length > 0) {
        callback()
      } else {
        callback(new Error('请选择承包商人员'))
      }
    },
    changeRight (val) {
      this.dataForm.staffArray = val
    },
    // 添加外协人员
    addStaff () {
      this.addStaffVisible = true
      this.$nextTick(() => {
        let id = ''
        this.$refs.addStaffs.init(id, 'contract')
      })
    },
    // 选择围栏或区域
    selectArea (name) {
      this.enclosureVisible = true
      this.$nextTick(() => {
        this.$refs.enclosureOrAreas.init(name, this.selectList)
      })
    },
    // 初始化数据
    init (id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.isDisabled = false
      this.$nextTick(() => {
        this.dataForm.contractorName = ''
        this.dataForm.staffArray = []
        this.staffArray = []
        this.dataForm.zoneFencingList = []
        this.selectList = []
        this.$refs['dataForm'].resetFields()
        this.getPlist()
        if (id) {
          this.getInfor(id)
        }
      })
    },
    // 获取单个承包商信息
    getInfor (id) {
      contractInfo({
        'id': id
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataForm = data.data
          this.dataForm.personLiable = data.data.personLiableId + '-' + data.data.personLiable
          this.staffArray = data.data.contractorPersonList.map(item => {
            return item.personId
          })
          // this.dataForm.staffArray = data.data.personIdList
          this.selectList = data.data.zoneFencingList
        }
      })
    },
    // 获取外协人员
    getPlist () {
      pList({
        'contractorId': '0' // 人员类型
      }).then(({ data }) => {
        if (data && data.code === 0) {
          let personList = []
          let liableList = []
          personList = data.page.list.map((item, index) => {
            return JSON.parse(JSON.stringify(item))
          })
          liableList = data.page.list.map((item, index) => {
            return JSON.parse(JSON.stringify(item))
          })
          personList.forEach(item => {
            item.key = item.gh
            item.label = item.name
          })
          liableList.forEach(item => {
            item.key = item.gh
            item.label = item.gh + '-' + item.name
            item.value = item.name
          })
          console.log(personList)
          this.assistData = personList
          this.liableOptions = liableList
          // console.log(this.assistData)
          // console.log(this.liableOptions)
        }
      })
    },
    // 区域围栏返回值
    selectChange (val, type) {
      this.selectList = val
      this.dataForm.zoneFencingList = []
      this.enclosureVisible = false
      val.map(val => {
        if (type === 'area') {
          this.dataForm.zoneFencingList.push({ zoneId: val.id })
        } else {
          this.dataForm.zoneFencingList.push({ fencingId: val.id })
        }
      })
    },
    // 表单验证
    dataFormSubmit () {
      this.dataForm.staffArray = this.staffArray
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.isDisabled = true
          cAddOrUpdate({
            'personLiableId': this.dataForm.personLiable.split('-')[0],
            'personLiable': this.dataForm.personLiable.split('-')[1],
            'contractorName': this.dataForm.contractorName,
            'personIdList': this.staffArray,
            'id': this.dataForm.id || '',
            'state': '0',
            'zoneFencingList': this.dataForm.zoneFencingList,
            'telephone': this.dataForm.telephone
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
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
.station-dialog {
  .el-form {
    .el-button--small {
      padding: 0;
      height: 100%;
      width: 100%;
      border: 0;
    }
    .el-form-item__label {
      padding-right: 10px;
    }
    .transfer-footer {
      background-color: #2C78BB;
      color: #ffffff;
      &:hover {
        opacity: 0.8;
      }
    }
  }
  .el-transfer-panel {
    width: 180px;
  }
  .el-transfer-panel__body {
    .el-checkbox:last-of-type {
      margin-right: 30px;
    }
  }
  .el-transfer-panel__list.is-filterable {
    padding-bottom: 30px;
  }
  .contractorWidth {
    width: 456px;
  }
}
</style>
