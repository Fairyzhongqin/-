<!--报警设置 新增/修改-->
<template>
  <el-dialog :title="(!dataForm.id ? '新增' : '修改') + '报警设置'" :close-on-click-modal="false" class="person-dialog" width="650px" :visible.sync="visible">
    <div>
      <el-col :span="24">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
          <el-form-item label="报警区域名称" prop="alarmAreaName">
            <el-input v-model="dataForm.alarmAreaName" disabled placeholder="报警区域名称" size="mini" class="size-mini-pople-input" clearable></el-input>
          </el-form-item>
          <el-form-item label="报警描述" prop="name">
            <el-input v-model="dataForm.name" size="mini" class="size-mini-pople-input" placeholder="报警描述" clearable></el-input>
          </el-form-item>

          <el-form-item prop="overNum">
            <el-checkbox v-model="dataForm.overNumFlag" style="padding: 1px 0">超员报警</el-checkbox>
            <!--<el-radio v-model="item.antiInterference" label="1">是</el-radio>-->
            <div class="report-err" v-if="dataForm.overNumFlag">
              <el-input class="small-input num-input" min="0" size="mini" style="width:50px" oninput="if (value==0 && value!='') value=1;value = parseInt(value)" onkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode)))' type="number" v-model="dataForm.overNum"></el-input>
              人
            </div>
          </el-form-item>
          <el-form-item prop="lessNum">
            <el-checkbox v-model="dataForm.lessNumFlag" style="padding: 1px 0">缺员报警</el-checkbox>
            <div class="report-err" v-if="dataForm.lessNumFlag">
              <el-input class="small-input" min="0" size="mini" style="width:50px" oninput="if (value==0 && value!='') value=1;value = parseInt(value)" onkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode)))' type="number" v-model="dataForm.lessNum"></el-input>
              <span style="margin-right: 10px">人</span>
            </div>
          </el-form-item>
          <el-form-item label="关联范围" prop="areaType">
            <!-- <el-radio-group v-model="dataForm.areaType"
                            @change="rangeHandle">
              <el-radio :label="'0'">围栏</el-radio>
              <el-radio :label="'1'">区域</el-radio>
            </el-radio-group> -->
            <el-input v-model="selectListName" placeholder="关联范围" @focus="selectArea('enclosure')" size="mini" class="size-mini-pople-input" clearable>
              <el-button slot="append" @click="selectArea('enclosure')">选择</el-button>
            </el-input>
            <!-- <div style="width: 100%;margin-top:10px">
              <el-table :data="dataList"
                        style="width: 100%;"
                        row-key="id"
                        border
                        lazy
                        v-loading="dataListLoading"
                        ref="multipleTable"
                        tooltip-effect="dark"
                        height="278px"
                        @selection-change="handleSelectionChange"
                        :tree-props="{children: 'subregion', hasChildren: 'hasChildren'}">
                <el-table-column type="selection"
                                 width="55">
                </el-table-column>
                <el-table-column prop="zoneName"
                                 label="区域名称">
                </el-table-column> -->
            <!-- <el-table-column v-else
                                 prop="fencingName"
                                 label="围栏名称">
                </el-table-column> -->
            <!-- </el-table>
            </div> -->
          </el-form-item>
        </el-form>
      </el-col>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="isDisabled" @click="dataFormSubmit()">确定</el-button>
    </span>
    <!-- 弹框，选择地区 -->
    <enclosure-or-area v-if="enclosureVisible" @selectChange='selectChange' ref="enclosureOrAreas"></enclosure-or-area>
  </el-dialog>
</template>

<script>
import { alermSettingAddOrUpdate, alermSettingInfo } from '@/api/pos/security'
import enclosureOrArea from '@/components/select/select-enclosure-or-area'
// import { queryZoneInfo } from '@/api/pos/region'
// import { treeDataTranslate2 } from '@/utils'
// fencingList,
export default {
  data () {
    let validateOver = (rule, value, callback) => {
      if (value && this.dataForm.lessNum && (value <= this.dataForm.lessNum)) {
        callback(new Error('超员报警人数应该大于缺员报警人数'))
      } else {
        callback()
      }
    }
    let validateLess = (rule, value, callback) => {
      if (value && this.dataForm.overNum && (value >= this.dataForm.overNum)) {
        callback(new Error('缺员报警人数应该小于超员报警人数'))
      } else {
        callback()
      }
    }
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
      visible: false,
      isDisabled: false,
      enclosureVisible: false,
      dataForm: {
        id: '',
        name: '',           // 报警描述
        overNumFlag: false, // 超员报警
        overNum: '',        // 超员报警人数
        lessNumFlag: false, // 缺员报警
        lessNum: '',        // 缺员报警人数
        lessTime: '',       // 缺员报警时间
        areaType: '1',
        zoneIds: [],
        // zoneFencingList: [],
        // fencingIds: [],
        alarmAreaName: ''
      },
      templateSelection: {},
      srcList: [],    // 人员照片list
      otherAttr: [],  // 其他补充属性
      cgformIdList: [], // 人员类型列表
      dataList: [],
      dataListLoading: false,
      dataRule: {
        name: [
          { required: true, message: '报警描述不能为空', trigger: 'blur', pattern: '[^ \x22]+' }
        ],
        alarmAreaName: [{
          required: true, message: '报警区域名称不能为空', trigger: 'blur'
        }],
        overNum: [{ validator: validateOver, trigger: 'blur' }],
        lessNum: [{ validator: validateLess, trigger: 'blur' }]
      }
    }
  },
  components: {
    enclosureOrArea
  },
  created () {
    // this.getArealist()
  },
  watch: {
    dataForm: {
      handler (val) {
        if (!val.overNumFlag) {
          this.dataForm.overNum = ''
        }
        if (!val.lessNumFlag) {
          this.dataForm.lessNum = ''
        }
      },
      deep: true
    }
  },
  methods: {
    // 选择围栏或区域
    selectArea (name) {
      this.enclosureVisible = true
      this.$nextTick(() => {
        console.log(this.selectList, '11111111111111111111111111111')
        this.$refs.enclosureOrAreas.init(name, this.selectList)
      })
    },
    // 初始数据
    init (id) {
      this.isDisabled = false
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.otherAttr = []
        this.dataForm.overNumFlag = false // 超员报警
        this.dataForm.overNum = ''       // 超员报警人数
        this.dataForm.lessNumFlag = false // 缺员报警
        this.dataForm.lessNum = ''
        this.dataForm.areaType = '0'
        this.dataForm.otherInfo = []
        this.dataForm.zoneIds = []
        this.selectListName = ''
        if (this.dataForm.id) {
          this.isDisabled = true
          alermSettingInfo({
            id: this.dataForm.id
          }).then(({ data }) => {
            this.isDisabled = false
            if (data && data.code === 0) {
              console.log(data)
              this.dataForm = data.data
              if (data.data.zoneList.length > 0) {
                this.selectListName = data.data.zoneList[0].zoneName
              }
              this.selectList = data.data.zoneList
              if (this.dataForm.overNumFlag === '1') {
                this.dataForm.overNumFlag = false
              } else {
                this.dataForm.overNumFlag = true
              }
              if (this.dataForm.lessNumFlag === '1') {
                this.dataForm.lessNumFlag = false
              } else {
                this.dataForm.lessNumFlag = true
              }
              // this.rangeHandle()
            }
          }).catch((err) => {
            console.log(err)
            this.isDisabled = false
            this.$message.error('未知异常！请联系管理员')
          })
        } else {
          // this.rangeHandle()
        }
      })
    },
    // 区域返回值
    selectChange (val) {
      this.selectList = val
      this.dataForm.zoneIds = []
      this.enclosureVisible = false
      this.selectListName = val.zoneName
      this.dataForm.alarmAreaName = val.zoneName
      this.dataForm.zoneIds.push(val.id)
    },
    // 表单提交
    dataFormSubmit () {
      if (this.dataForm.overNumFlag === true && (this.dataForm.overNum === '' || this.dataForm.overNum === null)) {
        this.$message.error('请输入超员报警人数')
      } else if (this.dataForm.lessNumFlag === true && (this.dataForm.lessNum === '' || this.dataForm.lessNum === null)) {
        this.$message.error('请输入缺员报警人数')
      } else {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.isDisabled = true
            alermSettingAddOrUpdate({
              id: this.dataForm.id || '',
              type: '0',
              name: this.dataForm.name,               // 报警描述
              overNumFlag: this.dataForm.overNumFlag ? '0' : '1', // 超员报警
              overNum: this.dataForm.overNum,         // 超员报警人数
              lessNumFlag: this.dataForm.lessNumFlag ? '0' : '1', // 缺员报警
              lessNum: this.dataForm.lessNum,         // 缺员报警人数
              lessTime: this.dataForm.lessTime,       // 缺员报警时间
              areaType: this.dataForm.areaType,
              zoneIds: this.dataForm.zoneIds,
              // fencingIds: this.dataForm.fencingIds,
              alarmAreaName: this.dataForm.alarmAreaName
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
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    }
  }
}
</script>
<style lang="scss">
.person-dialog {
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
  .el-form-item--medium {
    margin-bottom: 12px;
  }
  .el-input--mini .el-input__inner {
    padding-right: 0;
  }
}
</style>
