<template>
  <el-dialog :title="(!dataForm.id ? '新增' : '修改') + '班组信息'" :close-on-click-modal="false" class="station-dialog" width="700px" :visible.sync="visible" v-dialogDrag>
    <div style="height: 220px;">
      <el-scrollbar style="height:100%" class="default-scrollbar" wrap-class="default-scrollbar__wrap" view-class="p20-scrollbar__view">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" class="classes" label-width="110px">
          <el-form-item label="班组名称" prop="stationName">
            <el-input v-model="dataForm.stationName" placeholder="班组名称" size="mini" class="size-mini-pople-input" clearable></el-input>
          </el-form-item>
          <el-form-item label="班组人员" class="personArray" prop="personNames">
            <el-input v-model="dataForm.personNames" placeholder="班组人员" @focus="selectStaffShow" size="mini" class="size-mini-pople-input" clearable>
              <el-button slot="append" @click="selectStaffShow">选择</el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="班次信息">
            <el-tooltip class="add-child" effect="dark" content="新增" placement="right">
              <i class="el-icon-circle-plus-outline" @click="addClasses"></i>
            </el-tooltip>
            <!--<el-button class="addTime" size="mini" @click="addTimes">新增班次</el-button>-->
            <br />
            <el-row v-for="(item,index) of dataForm.stationShiftList" :key="index">
              <el-col :span="22">
                <div class="form-item-shifts">
                  <span :name="'bc'+index">班次</span>
                  <el-select v-model="dataForm.stationShiftList[index].periodId" placeholder="请选择时间段" size="mini" clearable>
                    <el-option v-for="item in timeSlotArray" :key="item.id" :label="item.periodName" :value="item.id">
                      <span style="float: left">{{ item.periodName }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.startTime + ' ~ ' + item.endTime }}</span>
                    </el-option>
                  </el-select>
                  <stationManage-popover @addTimes="addTimes"></stationManage-popover>

                  <span :name="'zgrs'+index" style="margin-left: 15px">最小在岗人数</span>
                  <el-input-number v-model="dataForm.stationShiftList[index].minPerson" size="mini" :min="1" :step="1" step-strictly placeholder="请设置最小在岗人数"></el-input-number>
                  <el-tooltip class="del-child" effect="dark" content="删除" placement="right">
                    <i class="el-icon-remove-outline del-child" @click="removeClasses(item)"></i>
                  </el-tooltip>
                </div>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="责任区域" prop="area">
            <el-input v-model="selectListName" placeholder="责任区域" @focus="selectArea('enclosure')" size="mini" class="size-mini-pople-input" clearable>
              <el-button slot="append" @click="selectArea('enclosure')">选择</el-button>
            </el-input>

          </el-form-item>
        </el-form>
      </el-scrollbar>
    </div>
    <!-- 添加时间段弹框 -->
    <add-times v-if="addTimeVisible" @addTimes="addTimesList" ref="addTimes"></add-times>
    <!-- 弹框，选择地区 -->
    <enclosure-or-area v-if="enclosureVisible" @selectChange="selectChange" ref="enclosureOrAreas"></enclosure-or-area>
    <!-- 向时间段添加工作人员 -->
    <select-staff v-if="selectStaffVisible" ref="selectStaff" @selectStaffEmit='selectStaffEmit'>
    </select-staff>
    <span slot="footer" class="dialog-footer">
      <!-- <el-button @click="visible = false"
                 size="mini">取消</el-button>
      <el-button type="primary"
                 :disabled="isDisabled"
                 @click="dataFormSubmit()"
                 size="mini">确定</el-button>

      <select-staff v-if="selectStaffVisible"
                    ref="selectStaff"
                    @selectStaffEmit="selectStaffEmit"></select-staff> -->
      <!-- <select-staff v-if="selectStaffVisible"
                    ref="selectStaff"
                    @selectStaffEmit="selectStaffEmit"></select-staff> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" :disabled="isDisabled" @click="dataFormSubmit()">确定</el-button>
      </span>
    </span>
  </el-dialog>
</template>

<script>
import { stationAddOrUpdate, stationInfo, stationListTime } from '@/api/pos/person'
import enclosureOrArea from '@/components/select/select-enclosure-or-area'
import selectStaff from '@/components/select/select-staff'
import addTimes from './add-times'
import stationManagePopover from './station-manage-popover.vue'

export default {
  data () {
    return {
      selectList: [], // 区域名称
      selectListName: '', // 显示数据
      // 员工信息
      dataListSelections: [],
      // 区域可选中项
      menuList: [],
      menuListTreeProps: {
        label: 'zoneName',
        children: 'subregion'
      },
      enclosureVisible: false,
      addTimeVisible: false,
      selectStaffVisible: false,
      popoverVisible: false,
      // 时间段所属员工id
      personIdList: [],
      // 可选择时间段
      timeSlotArray: [],
      // 结束时间是否禁用
      endAbled: true,
      dialogVisible: false,
      disabled: false,
      visible: false,
      isDisabled: false,
      dataForm: {
        zoneIds: [], // 区域及围栏id
        personNames: '', // 人员名称
        id: '',
        stationName: '', // 班组名称
        // 已选择班次
        stationShiftList: [
          {
            periodId: '',   // 已选择时间段
            maxPerson: 0,  // 最大人数
            minPerson: 0  // 最小人数
          }
        ]
      },
      dataRule: {
        stationName: [{ required: true, message: '班组名称不能为空', trigger: 'blur' }],
        stationShiftList: [{ required: true, message: '班次不能为空', trigger: 'blur' }],
        personName: [{ required: true, message: '请选择班组人员', trigger: 'change' }]
        // menuList: [{ required: true, message: '请选择区域', trigger: 'blur' }]
      }
    }
  },
  components: {
    selectStaff,
    addTimes,
    enclosureOrArea,
    stationManagePopover
  },
  created () {
  },
  methods: {
    // 初始数据
    init (id) {
      this.isDisabled = false
      this.dataForm.id = id || ''
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.selectListName = ''
        this.dataForm.personNames = ''
        this.dataForm.periodId = []
        this.selectList = []
        this.dataForm.personIdList = []
        this.dataForm.stationShiftList = [{
          periodId: '',
          maxPerson: 0,
          minPerson: 0
        }]
        this.dataForm.zoneFencingList = []
        this.getTimeList()
        if (id) {
          this.selectInfo(id)
        }
      })
    },
    // 查询单个班组信息
    selectInfo (id) {
      stationInfo({ 'id': id }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataForm = data.data
          this.dataForm.personNames = data.data.personNameList.join(',')
          this.selectListName = data.data.zoneFencingList[0].zoneName
          this.selectList = data.data.zoneFencingList
        }
      })
    },
    // 选择围栏或区域
    selectArea (name) {
      this.enclosureVisible = true
      this.$nextTick(() => {
        this.$refs.enclosureOrAreas.init(name, this.selectList)
      })
    },
    // 区域返回值
    selectChange (val) {
      this.selectList = val
      this.dataForm.zoneFencingList = []
      this.enclosureVisible = false
      this.selectListName = val.zoneName
      this.dataForm.zoneFencingList.push({ zoneId: val.id })
    },
    // 获取时间段
    getTimeList () {
      stationListTime({ page: 1, limit: 30, periodName: '' }).then(({ data }) => {
        if (data && data.code === 0) {
          this.timeSlotArray = data.page.list
        }
      })
    },
    // 属性构建选择时
    handleCheckChange (val) {
      let res = this.$refs.menuListTree.getCheckedNodes()
      this.dataForm.zoneFencingList = []
      res.forEach((item) => {
        this.dataForm.zoneFencingList.push({ zoneId: item.id })
      })
    },
    // 添加时间段
    addTimes (index) {
      this['popoverVisible' + index] = true
      this.addTimeVisible = true
      this.$nextTick(() => {
        this.$refs.addTimes.init()
      })
    },
    // 时间段添加成功时间段重新请求
    addTimesList () {
      this.getTimeList()
    },
    // 添加人员
    selectStaffShow () {
      this.selectStaffVisible = true
      this.$nextTick(() => {
        this.$refs.selectStaff.init(this.dataForm.personIdList)
      })
    },
    // 删除班次
    removeClasses (item) {
      let index = this.dataForm.stationShiftList.indexOf(item)
      if (index !== -1) {
        this.dataForm.stationShiftList.splice(index, 1)
      }
    },
    // 增加班次
    addClasses () {
      this.dataForm.stationShiftList.push({
        periodId: '',
        maxPerson: 0,
        minPerson: 0
      })
    },
    // 人员组件返回值
    selectStaffEmit (val, key) {
      this.dataForm.personName = ''
      if (!key) {
        this.dataForm.personIdList = []
        val.map((values, index) => {
          this.dataForm.personIdList.push(values.gh)
        })
      }
      let arrName = []
      val.map((values) => {
        arrName.push(values.name)
      })
      this.dataForm.personNames = arrName.join(',')
      this.selectStaffVisible = false
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.visible = false
          stationAddOrUpdate(this.dataForm).then(({ data }) => {
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
<style lang="scss" scoped>
/deep/.station-dialog {
  .el-input-group {
    /deep/.el-input-group__append {
      line-height: initial !important;
    }
  }
  .el-form-item--medium .el-form-item__content,
  .el-form-item--medium .el-form-item__label {
    line-height: 28px;
    height: 28px;
  }
  .add-child,
  .del-child {
    color: #2c78bb;
    cursor: pointer;
    line-height: 28px;
    font-size: 15px;
    vertical-align: middle;
  }
  .del-child {
    color: #e63031;
    margin-left: 8px;
  }
  .form-item-shifts {
    .el-select.el-select--mini {
      display: inline-block;
      width: auto;
    }
    .el-input-number.el-input-number--mini {
      .el-input {
        width: 100% !important;
      }
    }
    span {
      font-size: 12px;
    }
  }
  .classes {
    .selectStaff {
      .el-form-item:last-child {
        width: 100%;
      }
      .el-form-item {
        .el-form-item__content {
          width: 100%;
        }
      }
      .el-input {
        width: 140px;
      }
    }
    .el-row:last-child {
      margin-bottom: 0;
    }
  }
  .el-select,
  .el-date-editor.el-input {
    width: 100%;
  }
}
</style>
