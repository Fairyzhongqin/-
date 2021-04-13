/* eslint-disable no-new */
<!--高危工艺管理添加页-->
<template>
  <el-dialog :title="(!dataForm.id ? '新增' : '修改') + '高危工艺'" :close-on-click-modal="false" class="riskmanage-area" width="900px" :visible.sync="visible" append-to-body :modal-append-to-body="true" @close="$emit('closeDialog')">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" class="classes" label-width="115px">
      <el-form-item label="工艺名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="请输入工艺名称" size="mini" clearable></el-input>
      </el-form-item>
      <el-form-item label="工艺类型" prop="typeEntity" label-width="115px">
        <el-input v-model="dataForm.typeEntity.name" placeholder="高危工艺类型" @focus="riskProcessHandle" size="mini" class="size-mini-pople-input">
          <el-button slot="append" @click="riskProcessHandle">选择</el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="所属区域" prop="zoneId" label-width="115px">
        <el-popover v-model="popoverVisible" ref="departPopover" popper-class="high" placement="bottom-start" trigger="click">
          <el-tree :data="departList" :props="departListTreeProps" node-key="id" ref="departListTree" @current-change="departListTreeCurrentChangeHandle" default-expand-all :highlight-current="true" :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.zoneName" v-popover:departPopover :readonly="true" size="mini" class="size-mini-pople-input menu-list__input" placeholder="请选择所属区域" clearable></el-input>
      </el-form-item>
      <el-form-item label="涉及危化品" prop="dangerChemicalsEntityList" label-width="115px">
        <el-input v-model="dataForm.riskChemicalNames" placeholder="涉及危化品" @focus="dangerHandle" size="mini" class="size-mini-pople-input">
          <el-button slot="append" @click="dangerHandle">选择</el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="危险特性" class="labelStyle">
        <span v-if="riskContentList.length===0" style="font-size:12px;">请选择高危工艺类型</span>
        <div v-else>
          <div style="font-size:12px;" v-for="(item1,index1) in riskContentList" :key="index1">
            <span>{{item1}}</span>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="监测预警参数" class="labelStyle">
        <span v-if="typeEntityList.length===0" style="font-size:12px;">请选择高危工艺类型</span>
        <div v-else>
          <div style="font-size:12px;" v-for="(item,index) in typeEntityList" :key="index">
            <span class="typebg">{{item}}</span>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="反应装置及参数设置" prop="step" label-width="120px">
        <el-button v-if="addReactorVisible" type="primary" size="mini" @click="handleAddStep">添加反应装置</el-button>
        <!-- <span style="font-size:12px;">{{dataForm.typeEntity.monitorParam || ''}}</span> -->
      </el-form-item>
      <!-- <el-table :data=" reactorEntityList"
                border
                style="width: 100%;"
                class="table-mix-card">
        <el-table-column type="index"
                         label="序号"
                         width="50"></el-table-column>
        <el-table-column label="反应装置"
                         width="200">
          <template slot-scope="scope">
            <el-form :model="scope.row"
                     label-width="60px"
                     style="padding:0;">
              <el-form-item label="反应装置">
                <el-select v-model="scope.row.reactorId"
                           placeholder="请选择反应装置">
                  <el-option v-for="item in options"
                             :key="item.id"
                             :label="item.name"
                             :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-button type="primary"
                         size="mini"
                         @click="handleAddParam(scope)">添加监控参数</el-button>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="监控参数">
          <template slot-scope="scope">
            <el-scrollbar>
              <div class="cards">
                <el-card class="animated fadeIn"
                         v-for="(param, index) in scope.row.paramList"
                         :key="index">
                  <div slot="header"
                       class="clearfix">
                    <el-input v-model="param.name"
                              placeholder="监控参数名"></el-input>
                    <el-button style="float: right;"
                               type="text"
                               size="mini"
                               icon="el-icon-close"
                               @click="handleDeleteParam(scope, index)"></el-button>
                  </div>
                  <el-form :model="param"
                           label-width="70px">
                    <el-form-item label="计量单位">
                      <el-input v-model="param.unit"></el-input>
                    </el-form-item>
                    <el-form-item label="传感器标识">
                      <el-input v-model="param.sensorId"></el-input>
                    </el-form-item>
                    <el-form-item label="高限阈值">
                      <el-input v-model="param.highLimit"></el-input>
                    </el-form-item>
                    <el-form-item label="高高限阈值">
                      <el-input v-model="param.highHighLimit"></el-input>
                    </el-form-item>
                    <el-form-item label="低限阈值">
                      <el-input v-model="param.lowerLimit"></el-input>
                    </el-form-item>
                    <el-form-item label="低低限阈值">
                      <el-input v-model="param.lowerLowerLimit"></el-input>
                    </el-form-item>
                  </el-form>
                </el-card>
              </div>
            </el-scrollbar>
          </template>
        </el-table-column>
      </el-table>-->
      <!-- <draggable :options="{group:'people',animation:150,ghostClass:'sortable-ghost',chosenClass:'chosenClass',scroll:true,scrollSensitivity:200}"
                 v-model=" reactorEntityList"
                 class="table-mix-card"> -->
      <el-row v-for="(step, index) in  dataForm.reactorEntityList" :key="index" class="table-mix-card">
        <el-col :span="6" class="col-left">
          <!-- <span class="step-index">第{{index + 1}}步</span> -->
          <div class="col-left-title">反应装置{{index + 1}}</div>
          <el-form-item label-width="0" :prop="'reactorEntityList.'+index+'.id'" :rules="dataRule.panelRules.reactorId">
            <el-select v-model="step.id" placeholder="请选择反应装置" @change="setParams(step.id,index)">
              <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <div class="device" v-if="step.id">
            <div>装置信息</div>
            <div class="deviceInfo">
              <span class="info">名称：</span><span>{{step.name}}</span><br>
              <span class="info">编号：</span><span>{{step.code}}</span><br>
              <span class="info">所属区域：</span><span>{{step.zoneName}}</span>
            </div>
          </div>
          <el-alert v-else title="请先选择反应装置" type="info" :closable="false" show-icon>
          </el-alert>
        </el-col>
        <el-col :span="18" class="col-right">
          <el-scrollbar style="width:100%;" :native="true" :ref="'elScroll'+index">
            <div style="width:100%;overflow-x:auto;">
              <div class="cards" ref="cards">
                <el-card v-for="(param, index2) in step.paramList" :key="index2">
                  <div slot="header" class="clearfix">
                    <el-button style="float: right;" type="text" size="mini" icon="el-icon-close" @click="handleDeleteParam(index, index2)"></el-button>
                  </div>
                  <!-- <el-form :model="param"
                           label-width="90px"> -->
                  <el-form-item label="仪表位号" :prop="'reactorEntityList.'+index+'.paramList.'+index2+'.code'" :rules="dataRule.panelRules.code" label-width="90px">
                    <el-select v-model="param.code" placeholder="请选择仪表位号" @change="selectMeter(param,index,index2)">
                      <el-option v-for="item in step.meterOptions" :key="item.id" :label="item.code" :value="item.code"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="仪表类型" :prop="'reactorEntityList.'+index+'.paramList.'+index2+'.type'" :rules="dataRule.panelRules.type" label-width="90px">
                    <el-select v-model="param.type" size="mini" disabled placeholder="仪表类型" clearable>
                      <el-option v-for="itemM in panelTypeList" :key="itemM.label" :value="itemM.label" :label="itemM.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="仪表量程" :prop="'reactorEntityList.'+index+'.paramList.'+index2+'.range'" :rules="dataRule.panelRules.range" label-width="90px">
                    <el-input v-model="param.range" placeholder="仪表量程" disabled></el-input>
                  </el-form-item>
                  <template v-if="param.type !== ''">
                    <template v-if="param.type != '0'">
                      <el-form-item :prop="'reactorEntityList.'+index+'.paramList.'+index2+'.highLimitF'" :rules="dataRule.panelRules.highLimitF" label="一级报警阈值" label-width="90px" class="first-second">
                        <el-input v-model="param.highLimitF" size="mini" type="number" maxlength="10" placeholder="请输入一级报警阈值" clearable>
                        </el-input>
                      </el-form-item>
                      <el-form-item :prop="'reactorEntityList.'+index+'.paramList.'+index2+'.highLimitS'" :rules="dataRule.panelRules.highLimitS" label="二级报警阀值" label-width="90px" class="first-second">
                        <el-input v-model="param.highLimitS" size="mini" type="number" maxlength="10" placeholder="请输入二级报警阀值" clearable>
                        </el-input>
                      </el-form-item>
                    </template>
                    <template v-else>
                      <el-form-item label="低低限阈值" :prop="'reactorEntityList.'+index+'.paramList.'+index2+'.lowerLowerLimit'" :rules="dataRule.panelRules.lowerLowerLimit" label-width="90px">
                        <el-input v-model="param.lowerLowerLimit" clearable type="number"></el-input>
                      </el-form-item>
                      <el-form-item label="低限阈值" :prop="'reactorEntityList.'+index+'.paramList.'+index2+'.lowerLimit'" :rules="dataRule.panelRules.lowerLimit" label-width="90px" clearable>
                        <el-input v-model="param.lowerLimit" type="number"></el-input>
                      </el-form-item>
                      <el-form-item label="高限阈值" :prop="'reactorEntityList.'+index+'.paramList.'+index2+'.highLimit'" :rules="dataRule.panelRules.highLimit" type="number" label-width="90px">
                        <el-input v-model="param.highLimit" type="number" clearable></el-input>
                      </el-form-item>
                      <el-form-item label="高高限阈值" :prop="'reactorEntityList.'+index+'.paramList.'+index2+'.highHighLimit'" :rules="dataRule.panelRules.highHighLimit" label-width="90px" type="number">
                        <el-input v-model="param.highHighLimit" type="number" clearable></el-input>
                      </el-form-item>
                    </template>
                    <!-- </el-form> -->
                  </template>
                </el-card>
                <el-card class="animated fadeIn card-add" @click.native="handleAddParam(index)">
                  <i class="el-icon-plus"></i>
                  <div>添加监控参数</div>
                </el-card>
              </div>
            </div>
          </el-scrollbar>
        </el-col>
        <el-button class="row-del-button" type="danger" size="mini" icon="el-icon-close" style="position: absolute;top: 0;right: 0" @click="handleDeleteStep(index)"></el-button>
      </el-row>
      <!-- </draggable> -->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false" size="mini">取消</el-button>
      <el-button type="primary" :disabled="isDisabled" @click="dataFormSubmit()" size="mini">确定</el-button>
    </span>
    <!-- 添加高危工艺类型的弹框 -->
    <high-risk-process v-if="riskProcessVisible" ref="highRiskProcess" @selectChange="highRiskProcessSelectChange"></high-risk-process>
    <danger-add v-if="dangerVisible" ref="dangerAdd" @selectChange="dangerAddSelectChange"></danger-add>
  </el-dialog>
</template>
<script>
import { dangerChemicalsList, processInfo, processAddOrUpdate, processTypeInfo } from '@/api/sou/highRisk'
import { queryZoneInfo } from '@/api/pos/region'
import { meterShow } from '@/api/sou/parameter'
// import { parameterTypeList } from '@/api/sou/equipWaring'
import { reactorList, reactorInfo } from '@/api/sou/equlpment'
// import manageParams from './managaParams'
import highRiskProcess from './process-manage-process'
import dangerAdd from './process-manage-danger-add'
import facilityParamsAdd from './process-manage-facility-add'
// import draggable from 'vuedraggable'
import { WheelDirective } from '@/utils/wheelDirective'
import { getLabels } from '@/api/common/sys'

export default {
  data () {
    // 高危工艺类型
    let validateType = (rule, value, callback) => {
      if (JSON.stringify(value) === '{}') {
        callback(new Error('请选择高危工艺类型'))
      } else {
        callback()
      }
    }
    // 涉及危化品
    let validateChemical = (rule, value, callback) => {
      if (!value || value.length === 0) {
        callback(new Error('请选择涉及危化品'))
      } else {
        callback()
      }
    }
    // 装置重复性校验
    let validateReactor = (rule, value, callback) => {
      var i = 0
      this.dataForm.reactorEntityList.forEach(item => {
        if (item.id === value) i++
      })
      console.log(i)
      if (i > 1) {
        callback(new Error('反应装置重复！请重新选择'))
      } else {
        callback()
      }
    }
    // 仪表重复性校验
    let validateCode = (rule, value, callback) => {
      let index = parseInt(rule.field.split('.')[1])
      // let index2 = parseInt(rule.field.split('.')[3])
      var num = 0
      this.dataForm.reactorEntityList[index].paramList.forEach(item => {
        if (item.code === value) num++
      })
      // console.log(num)
      if (num > 1) {
        callback(new Error('仪表位号重复！请重新选择'))
      } else {
        callback()
      }
    }
    // 低低限 与 量程最小值
    let validatelowerRangeLower = (rule, value, callback) => {
      let index = parseInt(rule.field.split('.')[1])
      let index2 = parseInt(rule.field.split('.')[3])
      if (Number(this.dataForm.reactorEntityList[index].paramList[index2].lowerLowerLimit) < Number(this.dataForm.reactorEntityList[index].paramList[index2].minRange) && this.dataForm.reactorEntityList[index].paramList[index2].lowerLowerLimit !== '') {
        callback(new Error('低低限阈值必须大于量程最小值'))
      } else {
        callback()
      }
    }
    // 低低限 与 低限
    let validatelowerRange = (rule, value, callback) => {
      let index = parseInt(rule.field.split('.')[1])
      let index2 = parseInt(rule.field.split('.')[3])
      if (Number(this.dataForm.reactorEntityList[index].paramList[index2].lowerLowerLimit) >= Number(this.dataForm.reactorEntityList[index].paramList[index2].lowerLimit) && this.dataForm.reactorEntityList[index].paramList[index2].lowerLimit !== '') {
        callback(new Error('低低限阈值必须小于低限阈值'))
      } else {
        callback()
      }
    }
    // 低限 与 高限
    let validatelowerRangeHighLimit = (rule, value, callback) => {
      let index = parseInt(rule.field.split('.')[1])
      let index2 = parseInt(rule.field.split('.')[3])
      if (Number(this.dataForm.reactorEntityList[index].paramList[index2].lowerLimit) >= Number(this.dataForm.reactorEntityList[index].paramList[index2].highLimit) && this.dataForm.reactorEntityList[index].paramList[index2].highLimit !== '') {
        callback(new Error('低限阈值必须小于高限阈值'))
      } else {
        callback()
      }
    }
    // 高限 与 高高限
    let validatehighLimitRangeHH = (rule, value, callback) => {
      let index = parseInt(rule.field.split('.')[1])
      let index2 = parseInt(rule.field.split('.')[3])
      if (Number(this.dataForm.reactorEntityList[index].paramList[index2].highLimit) >= Number(this.dataForm.reactorEntityList[index].paramList[index2].highHighLimit) && this.dataForm.reactorEntityList[index].paramList[index2].highHighLimit !== '') {
        callback(new Error('高限阈值必须小于高高限阈值'))
      } else {
        callback()
      }
    }
    // 高高限 与 量程最大值
    let validatehighLimitRangeMax = (rule, value, callback) => {
      let index = parseInt(rule.field.split('.')[1])
      let index2 = parseInt(rule.field.split('.')[3])
      if (Number(this.dataForm.reactorEntityList[index].paramList[index2].highHighLimit) > Number(this.dataForm.reactorEntityList[index].paramList[index2].maxRange) && this.dataForm.reactorEntityList[index].paramList[index2].highHighLimit !== '') {
        callback(new Error('高高限阈值必须小于量程最大值'))
      } else {
        callback()
      }
    }
    // 一级报警阈值 与 二级报警阈值
    let validatehighLimitFS = (rule, value, callback) => {
      let index = parseInt(rule.field.split('.')[1])
      let index2 = parseInt(rule.field.split('.')[3])
      if (Number(this.dataForm.reactorEntityList[index].paramList[index2].highLimitF) >= Number(this.dataForm.reactorEntityList[index].paramList[index2].highLimitS) && this.dataForm.reactorEntityList[index].paramList[index2].highLimitS !== '') {
        callback(new Error('一级报警阈值必须小于二级报警阈值'))
      } else {
        callback()
      }
    }
    // 一级报警阈值 与 minRange
    let validatehighLimitFmin = (rule, value, callback) => {
      let index = parseInt(rule.field.split('.')[1])
      let index2 = parseInt(rule.field.split('.')[3])
      if (Number(this.dataForm.reactorEntityList[index].paramList[index2].highLimitF) < Number(this.dataForm.reactorEntityList[index].paramList[index2].minRange)) {
        callback(new Error('一级报警阈值必须大于量程最小值'))
      } else {
        callback()
      }
    }
    // 二级报警阈值 与 maxRange
    let validatehighLimitSmin = (rule, value, callback) => {
      let index = parseInt(rule.field.split('.')[1])
      let index2 = parseInt(rule.field.split('.')[3])
      if (Number(this.dataForm.reactorEntityList[index].paramList[index2].highLimitS) > Number(this.dataForm.reactorEntityList[index].paramList[index2].maxRange)) {
        callback(new Error('二级报警阈值必须小于量程最大值'))
      } else {
        callback()
      }
    }
    return {
      dataForm: {
        id: '',
        name: '', // 名称
        zoneId: '', // 所属区域
        zoneName: '', // 显示选中所属区域名称
        typeEntity: {}, // 工艺类型
        riskChemicalNames: '', // 涉及的危险化学品
        dangerChemicalsEntityList: [], // 涉及的危险化学品
        reactorEntityList: [], // 反应装置选择及参数设置
        typeId: '',
        status: '0' // 状态
      },
      typeEntityList: [], // 选择高危工艺类型之后的提示列表
      riskContentList: [], // 危险特性列表
      meterOptions: [], // 某个反应装置的对应的仪表列表
      panelTypeList: [], // 仪表类型list
      riskProcessVisible: false,
      dangerVisible: false,
      reactorVisible: false,
      isDisabled: false,
      disabled: false,
      visible: false,
      addReactorVisible: true, // 控制添加反应装置的按钮显示与隐藏
      popoverVisible: false,
      dataRule: {
        zoneId: [{ required: true, message: '请选择所属区域', trigger: 'change' }],
        name: [{ required: true, message: '请输入高危工艺名称', trigger: 'blur', pattern: '[^ \x22]+' }],
        typeEntity: [{ trigger: 'change', validator: validateType, required: true }],
        dangerChemicalsEntityList: [{ trigger: 'blur', validator: validateChemical }],
        panelRules: {
          // 反应装置
          reactorId: [
            { required: true, message: '请选择反应装置' },
            { trigger: 'change', validator: validateReactor }],
          // 仪表位号
          code: [{ required: true, message: '请选择仪表位号', trigger: 'change' },
          { required: true, validator: validateCode, trigger: 'change' }
          ],
          type: [{ required: true, message: '请选择仪表类型', trigger: 'change' }],
          range: [{ required: true, message: '请选择仪表量程', trigger: 'change' }],
          // 低低限
          lowerLowerLimit: [
            { required: true, message: '请输入低低限阈值', trigger: 'blur' },
            { required: true, validator: validatelowerRangeLower, trigger: 'blur' },
            { required: true, validator: validatelowerRange, trigger: 'blur' }
          ],
          // 低限
          lowerLimit: [
            { required: true, message: '请输入低限阈值', trigger: 'blur' },
            { required: true, validator: validatelowerRange, trigger: 'blur' },
            { required: true, validator: validatelowerRangeHighLimit, trigger: 'blur' }
          ],
          // 高限
          highLimit: [
            { required: true, message: '请输入高限阈值', trigger: 'blur' },
            { required: true, validator: validatelowerRangeHighLimit, trigger: 'blur' }
          ],
          // 高高限
          highHighLimit: [
            { required: true, message: '请输入高高限阈值', trigger: 'blur' },
            { required: true, validator: validatehighLimitRangeMax, trigger: 'blur' },
            { required: true, validator: validatehighLimitRangeHH, trigger: 'blur' }
          ],
          // 一级报警阈值
          highLimitF: [
            { required: true, message: '请输入一级报警阈值', trigger: 'blur' },
            { required: true, validator: validatehighLimitFS, trigger: 'blur' },
            { required: true, validator: validatehighLimitFmin, trigger: 'blur' }
          ],
          // 二级报警阈值
          highLimitS: [
            { required: true, message: '请输入二级报警阈值', trigger: 'blur' },
            { required: true, validator: validatehighLimitFS, trigger: 'blur' },
            { required: true, validator: validatehighLimitSmin, trigger: 'blur' }
          ]

        }
      },
      dangerList: [], // 风险类型
      options: [], // 选择反应装置列表
      departList: [], // 区域列表
      departListTreeProps: {
        label: 'zoneName',
        children: 'subregion'
      } // 树形结构展示
    }
  },
  components: {
    highRiskProcess,
    dangerAdd,
    facilityParamsAdd
    // draggable
  },
  created () {
    this.getDataList()
    this.getReactorList()
    this.getAllZoneList()
    this.getPanelType()
  },
  updated () {
    this.$nextTick(() => {
      this.$refs['cards'] && this.$refs['cards'].map(r => {
        // eslint-disable-next-line no-new
        new WheelDirective(r.parentElement)
      })
    })
  },
  computed: {
    reactorEntityListTable () {
      let table = []
      if (this.dataForm.reactorEntityList.length > 0) {
        this.dataForm.reactorEntityList.map(res => {
          if (res.paramList) {
            res.paramList.map((r, index) => {
              r.reactorId = res.reactorId
              r.reactorName = res.reactorName
              if (index === 0) {
                r.nums = res.paramList.length
              }
              table.push(r)
            })
          }
        })
      }
      return table
    }
  },
  methods: {
    // 初始数据
    init (id) {
      this.isDisabled = false
      this.visible = true
      this.dataForm.id = id || ''
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (id) {
          this.selectInfo(id)
        }
        // this.menuListTreeSetCurrentNode()
      })
    },
    // 高危工艺类型弹框处理函数
    riskProcessHandle () {
      this.riskProcessVisible = true
      this.$nextTick(() => {
        this.$refs.highRiskProcess.init(this.dataForm.typeEntity)
      })
    },
    // 危险化学品的弹框的处理函数
    dangerHandle () {
      this.dangerVisible = true
      this.$nextTick(() => {
        this.$refs.dangerAdd.init(this.dataForm.dangerChemicalsEntityList)
      })
    },
    // 查询信息 主
    selectInfo (id) {
      processInfo({ 'id': id }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(data.data, '查询信息')
          this.dataForm = data.data
          this.dataForm.riskChemicalNames = data.data.dangerChemicalsEntityList.map(res => {
            return res.name
          }).toString()
          this.dataForm.reactorEntityList.map((item, index) => {
            this.getMeterAShow(item.id, index)// 回显选择仪表的列表
            item.paramList.map(item1 => {
              item1.range = item1.minRange + item1.unit + '-' + item1.maxRange + item1.unit
              item1.highLimitF = item1.highLimit
              item1.highLimitS = item1.highHighLimit
            })
          })
          this.typeEntityList = this.dataForm.typeEntity.monitorParam.split(';')
          this.riskContentList = this.dataForm.typeEntity.riskContent.split(';')
          // 菜单树设置当前选中节点
          this.$refs.departListTree.setCurrentKey(data.data.zoneId)
          this.dataForm.zoneName = data.data.zoneName
          this.getProcessTypeInfo(this.dataForm.typeEntity.id)
        }
      })
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      dangerChemicalsList().then(({ data }) => {
        if (data && data.code === 0) {
          // console.log(data)
          this.dangerList = data.page.list
          console.log(this.dangerList)
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
    // 获取数据列表
    getReactorList () {
      this.dataListLoading = true
      reactorList().then(({ data }) => {
        if (data && data.code === 0) {
          // console.log(data, '11111111111111')
          this.options = data.page.list
          this.totalPage = data.page.count
        } else {
          this.options = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
        this.dataListLoading = false
      })
    },
    async getProcessTypeInfo (id) { // 获取高危工艺类型
      if (id && id !== '') {
        await processTypeInfo({
          id
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.dataForm.typeEntity = data.data
            // console.log(data.data, '高危工艺类型')
          }
        })
      }
    },
    // 获取区域列表数据
    getAllZoneList () {
      this.dataListLoading = true
      queryZoneInfo().then(({ data }) => {
        if (data && data.code === 0) {
          this.departList = data.data.subregion
          // console.log(this.departList, '区域列表1111111111111111')
        } else {
          this.departList = []
        }
        this.dataListLoading = false
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
        this.dataListLoading = false
      })
    },
    // 菜单树选中
    departListTreeCurrentChangeHandle (data, node) {
      // 当前节点的数据，对象
      this.dataForm.zoneId = data.id
      this.dataForm.zoneName = data.zoneName
      this.popoverVisible = false
    },
    // 回显反应装置的基本信息
    setParams (id, index) {
      console.log(id, '1111111111111111111111')
      // 反应装置信息
      reactorInfo({
        'id': id
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // 将值赋给列表里的每一项
          this.$set(this.dataForm.reactorEntityList[index], 'name', data.data.name)
          this.$set(this.dataForm.reactorEntityList[index], 'code', data.data.code)
          this.$set(this.dataForm.reactorEntityList[index], 'zoneName', data.data.zoneName)
          this.$set(this.dataForm.reactorEntityList[index], 'id', data.data.id)
          this.dataListLoading = false
          this.getMeterAShow(id, index)
        } else {
          this.$message.error(data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
      })
      this.dataForm.reactorEntityList[index].paramList = []
      this.dataForm.reactorEntityList[index].meterOptions = []
    },
    // 从字典表获取仪表类型
    getPanelType () {
      getLabels({
        type: 'METER_TYPE'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.panelTypeList = data.list
        }
      })
    },
    // 选择仪表,显示仪表对应的信息
    selectMeter (val, index, index2) {
      console.log(val, '00000000')
      val.highLimit = ''
      val.highHighLimit = ''
      val.lowerLimit = ''
      val.lowerLowerLimit = ''
      this.dataForm.reactorEntityList[index].meterOptions.map(item => {
        if (item.code === val.code) {
          val.range = item.minRange + item.unit + '-' + item.maxRange + item.unit
          val.type = item.type
          val.minRange = item.minRange
          val.maxRange = item.maxRange
          val.unit = item.unit
        }
      })
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) { // 合并表格
      // console.log(row, column, rowIndex, columnIndex)
      if (columnIndex === 0) {
        if (row.nums) {
          return {
            rowspan: row.nums,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
      if (columnIndex === 1) {
        if (row.nums) {
          return {
            rowspan: row.nums,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    highRiskProcessSelectChange (val) {
      this.dataForm.typeEntity = val
      this.typeEntityList = this.dataForm.typeEntity.monitorParam.split(';')
      this.riskContentList = this.dataForm.typeEntity.riskContent.split(';')
      this.riskProcessVisible = false
    },
    dangerAddSelectChange (vals) {
      this.dataForm.riskChemicalNames = vals.map(res => {
        return res.name
      }).toString()
      this.dataForm.dangerChemicalsEntityList = vals
      this.dangerVisible = false
      // console.log(this.dataForm.dangerChemicalsEntityList, '11111111111')
    },
    handleAddStep () { // 新增步骤
      this.dataForm.reactorEntityList.push({
        'id': '',
        'page': null,
        'token': null,
        'isNewRecord': true,
        'remarks': '',
        'createDate': '',
        'updateDate': '',
        'processId': '',
        'reactorName': null,
        'sort': null,
        'content': '',
        'paramList': [],
        'meterOptions': []
      })
      if (this.dataForm.reactorEntityList.length >= this.options.length) {
        this.addReactorVisible = false
      }
    },
    handleDeleteStep (index) { // 删除步骤
      this.dataForm.reactorEntityList.splice(index, 1)
      if (this.dataForm.reactorEntityList.length < this.options.length) {
        this.addReactorVisible = true
      }
    },
    handleAddParam (index) { // 新增步骤
      if (!this.dataForm.reactorEntityList[index].id) {
        return this.$message('请先选择反应装置')
      }
      if (this.dataForm.reactorEntityList[index].paramList.length < this.dataForm.reactorEntityList[index].meterOptions.length) {
        this.dataForm.reactorEntityList[index].paramList.push({
          'id': '',
          'page': null,
          'token': null,
          'isNewRecord': false,
          'remarks': '',
          'createBy': null,
          'createDate': null,
          'updateBy': null,
          'updateDate': null,
          'businessId': '',
          'businessType': '1',
          'name': '',
          'type': '',
          'unit': null,
          'unitSymbols': null,
          'maxRange': null,
          'minRange': null,
          'highLimit': '',
          'highHighLimit': '',
          'lowerLimit': '',
          'lowerLowerLimit': '',
          'highLimitF': '',
          'highLimitS': '',
          'sensorId': null
        })
      }
      // this.getMeterAShow(this.dataForm.reactorEntityList[index].id, index)
    },
    // 反应装置对应的参数信息
    getMeterAShow (id, index) {
      meterShow({
        'id': id// 反应装置的id
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log(data, '仪表数据')
          this.dataForm.reactorEntityList[index].meterOptions = data.list
          // console.log(this.meterOptions, '222222222222222222222')
          this.dataListLoading = false
          // this.getMeterAShow(id, index)
        } else {
          this.$message.error(data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
      })
    },
    handleDeleteParam (index, index2) {
      this.dataForm.reactorEntityList[index].paramList.splice(index2, 1)
      // this.$nextTick(() => {
      //   this.$refs['elScroll' + index][0].update()
      // })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.dataForm.reactorEntityList.map(item => {
            item.paramList.map(item1 => {
              item1.highLimit = item1.type !== '0' ? item1.highLimitF : item1.highLimit
              item1.highHighLimit = item1.type !== '0' ? item1.highLimitS : item1.highHighLimit
            })
          })
          processAddOrUpdate(
            this.dataForm
          ).then(({ data }) => {
            if (data && data.code === 0) {
              this.visible = false
              // console.log(data)
              this.$message.success('操作成功!')
              this.$emit('refreshDataList')
            } else {
              this.$message.error(data.msg)
            }
            this.dataListLoading = false
          }).catch((err) => {
            console.log(err)
            this.$message.error('未知异常！请联系管理员')
            this.dataListLoading = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.riskmanage-area {
  .el-select {
    width: 100%;
  }
  .el-dialog__body {
    padding-top: 10px;
  }
  .params {
    width: 100%;
    height: 130px;
    padding: 10px 0 10px 10px;
    border: 1px solid #ccc;
    .el-scrollbar__wrap {
      overflow-x: hidden;
      .parali {
        border: 1px dotted #ccc;
        padding: 5px;
        margin-right: 8px;
        p {
          margin: 0;
          padding: 0;
          font-size: 12px;
        }
        p:nth-type-of(1) {
          color: #5fa9f5;
        }
      }
    }
  }
  .labelStyle {
    .el-form-item__label {
      color: rgba(34, 34, 34, 1);
      opacity: 0.7;
    }
  }
  .typebg {
    background-color: #2d334ed4;
    padding: 3px;
    color: #fff;
  }
  .table-mix-card {
    display: inline-block;
    width: 100%;
    height: 410px;
    border: 1px solid #ccc;
    // .el-row {
    .col-left {
      padding: 10px;
      position: relative;
      .col-left-title {
        width: 100%;
        height: 30px;
        text-align: center;
      }
      .device {
        .deviceInfo {
          padding: 10px;
          font-size: 12px;
          .info {
            color: rgba(34, 34, 34, 1);
            opacity: 0.7;
            line-height: 20px;
          }
        }
      }
    }
    .col-right {
      // padding: 10px 0;
      border-left: 1px solid #ccc;
    }
    // }
    .el-row + .el-row {
      border-top: 1px solid #ccc;
    }
    .cards {
      display: inline-flex;
      padding: 5px 2px;
      .el-card + .el-card {
        margin-left: 10px;
      }
      &:first-child {
        margin-left: 10px;
      }
      &:last-child {
        margin-right: 10px;
      }
      .el-card {
        width: 315px;
        float: left;
        &.is-always-shadow {
          border: 1px solid #ebeef5;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        }
        .el-card__header {
          padding: 5px 0 5px 10px;
          .el-input {
            width: 60%;
          }
        }
        .el-card__body {
          padding: 10px 15px;
        }
      }
      .card-add {
        height: 396px;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        text-align: center;
        justify-content: space-around;
        i {
          font-size: 65px;
          color: #cacbd0;
        }
        div {
          color: #606266;
        }
      }
    }
    &.el-table--enable-row-hover {
      .el-table__body tr:hover > td {
        background-color: #f5f7fa !important;
      }
    }
    &:hover {
      .row-del-button {
        display: block;
      }
    }
    .row-del-button {
      display: none;
      position: absolute;
      top: 0px;
      right: 0px;
      border-radius: 0 0 0 5px;
      padding: 1px 1px;
      i {
        color: #fff;
        font-weight: bold;
        font-size: 14px;
      }
    }
  }
  ::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 5px;
  }

  ::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    background: rgba(144, 147, 153, 0.5);
  }

  ::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    border-radius: 10px;
    background: rgba(144, 147, 153, 0.3);
  }
}
</style>
