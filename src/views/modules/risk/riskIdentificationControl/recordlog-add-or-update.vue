
<template>
  <el-dialog :title="(!dataForm.id ? '新增' : '修改') + '风险点'" :close-on-click-modal="false" class="station-area" width="600px" :visible.sync="visible" append-to-body @close="handleCloseDialog">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" class="classes" label-width="110px">

      <el-form-item label="风险点所在区域" prop="zoneName">
        <el-popover v-model="popoverVisible" popper-class="high" placement="bottom-start" ref="zonePopover" trigger="click">

          <el-tree :data="graphList" :props="defaultProps" node-key="id" ref="zoneTree" @current-change="zoneSelectChange" default-expand-all :highlight-current="true" :expand-on-click-node="false">

          </el-tree>

        </el-popover>
        <el-input v-model="dataForm.zoneName" v-popover:zonePopover size="mini" placeholder="请选择风险点所在区域" clearable></el-input>
      </el-form-item>

      <el-form-item label='风险点类型' prop='rangeType'>
        <el-select v-model="dataForm.rangeType" @change="()=>{dataForm.businessName='';dataForm.factorList=[];dataForm.accidentFactor=''}" placeholder="请选择风险点类型" clearable size="mini">
          <el-option v-for="item in rangeTypeList" :label="item.value" :value="item.label" :key="item.label">

          </el-option>

        </el-select>
      </el-form-item>
      <el-form-item label='风险点名称' prop='businessName'>
        <el-input v-if="dataForm.rangeType === '10' || dataForm.rangeType === '11'" v-model="dataForm.businessName" placeholder="风险点名称" @focus="selectRiskName(dataForm.rangeType,dataForm.businessId)" size="mini">
          <el-button slot="append" @click="selectRiskName(dataForm.rangeType,dataForm.businessId)">
            选择
          </el-button>
        </el-input>
        <el-input v-else v-model="dataForm.businessName" placeholder="风险点名称" size="mini" clearable>

        </el-input>
      </el-form-item>
      <el-form-item label='风险因素' prop='accidentFactor'>
        <el-input v-model="dataForm.accidentFactor" placeholder="风险因素" @focus="selectFactor" size="mini">
          <el-button slot="append" @click="selectFactor">
            选择
          </el-button>
        </el-input>
      </el-form-item>
      <!-- <p>风险评价信息：</p> -->

    </el-form>
    <!-- 添加选择事故因素弹框 -->
    <risk-factor v-if="riskVisible" ref="riskFactorRef" @selectAccidentEmit="selectAccidentEmit">

    </risk-factor>
    <!-- 反应装置弹出框 -->
    <react-facity v-if="reactFacityVisible" ref="reactFacity" @selectEmit="selectReact">

    </react-facity>
    <!-- 存储设施弹出框 -->
    <store-facity v-if="storeFacityVisible" ref="storeFacity" @selectEmit="selectReact">

    </store-facity>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="isDisabled" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { factorAll } from '@/api/risk/factor'
import { queryZoneInfo } from '@/api/pos/region'

import { facilitiesAddOrUpdate, facilitiesInfo } from '@/api/risk/analysis'
import riskFactor from './components/risk-factor'
import { getLabels } from '@/api/common/sys'
import reactFacity from './components/react-facity'
import storeFacity from './components/store-facity'
export default {
  data () {
    return {
      dataForm: {
        zoneName: '',
        zoneCode: '',
        name: '',
        businessName: '',
        businessId: '',
        factorList: [], // 风险
        accidentFactor: '', // 事故因素
        rangeType: '' // 所属类型
      },
      rangeTypeList: [], // 风险点类型
      evaluationTypeList: [], // 评价法类型
      evaluationCycleList: [], // 评价周期
      riskVisible: false, // 事故因素是否可见
      reactFacityVisible: false,
      storeFacityVisible: false,
      isDisabled: false,
      disabled: false,
      visible: false,
      popoverVisible: false, // 菜单树是否可见
      dataRule: {
        'zoneName': [{ required: true, message: '请选择风险点所在区域', trigger: 'change' }],
        'rangeType': [{ required: true, message: '请输入风险点类型', trigger: 'change' }],
        'businessName': [{ required: true, message: '请选择风险点名称', trigger: 'change' }],
        'accidentFactor': [{ required: true, message: '请选择风险点名称', trigger: 'change' }]
      },
      graphList: [], // 风险分区列表
      factorList: [], // 危险因素列表
      defaultProps: {
        label: 'zoneName',
        children: 'subregion'
      }
    }
  },

  components: {
    riskFactor,
    reactFacity,
    storeFacity
  },
  created () {
    // this.getgraphList()
    this.getDataList()
    this.getBaseData()
    this.getAllZoneList()
  },
  methods: {
    // 加载基础数据
    getBaseData () {
      // 风险点类型- 字典
      getLabels({
        'type': 'RANGE_TYPE'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.rangeTypeList = data.list
        } else {
          this.$message.error(data.msg)
        }
        this.dataListLoading = false
      }).catch(err => console.log(err))
      // 评价法类型 - 字典
      getLabels({
        'type': 'EVALUATION_TYPE'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.evaluationTypeList = data.list
        } else {
          this.$message.error(data.msg)
        }
        this.dataListLoading = false
      }).catch(err => console.log(err))
      // 评价法周期 - 字典
      getLabels({
        'type': 'EVALUATION_CYCLE'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.evaluationCycleList = data.list
        } else {
          this.$message.error(data.msg)
        }
        this.dataListLoading = false
      }).catch(err => console.log(err))
    },
    // 子组件返回
    selectAccidentEmit (val) {
      console.log('返回', val)
      if (val) {
        this.dataForm.factorList = val

        this.dataForm.accidentFactor = val.map((item, index) => {
          return (index + 1) + '.' + item.factorDanger
        }).join('；')

        let cache = this.dataForm
        this.dataForm = null
        this.dataForm = cache
      }
    },
    // 当前菜单树选中
    zoneSelectChange (data, node) {
      // 当前节点的数据，对象
      this.dataForm.zoneCode = data.code
      this.dataForm.zoneName = data.zoneName
      this.popoverVisible = false
    },
    // 页面初始化时加载的事件
    // 初始数据
    init (id) {
      // console.log(id)
      this.isDisabled = false
      this.visible = true
      this.dataForm.id = id || ''
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (id) {
          this.selectInfo(id)
        }
      })
    },
    // 获取危险因素列表
    getDataList () {
      this.dataListLoading = true
      factorAll().then(({ data }) => {
        if (data && data.code === 0) {
          console.log(data)
          this.factorList = data.list
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
    // 选择事故因素弹框
    selectFactor () {
      this.riskVisible = true
      this.$nextTick(() => {
        console.log(this.dataForm.factorList)
        this.$refs.riskFactorRef.init(this.dataForm.factorList)
      })
    },

    // 选则风险点名称
    selectRiskName (type, code) {
      if (type === '2') {
        this.regularWorkVisible = true
        this.$nextTick(() => {
          this.$refs.regularWork.init()
        })
      } else if (type === '11') {
        this.storeFacityVisible = true
        this.$nextTick(() => {
          this.$refs.storeFacity.init(code)
        })
      } else if (type === '10') {
        this.reactFacityVisible = true
        this.$nextTick(() => {
          this.$refs.reactFacity.init(code)
        })
      } else if (type === '3') {
        this.safeFacityVisible = true
        this.$nextTick(() => {
          this.$refs.safeFacity.init()
        })
      }
    },
    // 查询单个风险点
    selectInfo (id) {
      facilitiesInfo({ 'id': id }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(data)
          this.dataForm = data.data
          this.dataForm.accidentFactor = (data.data.factorList.map((item, index) => {
            return (index + 1) + '.' + item.factorDanger
          })).join('；')
          console.log(this.dataForm)
        }
      })
    },
    // 获取所有的区域
    getAllZoneList () {
      this.dataListLoading = true
      queryZoneInfo().then(({ data }) => {
        if (data && data.code === 0) {
          this.graphList = [data.data] || []
        } else {
          this.graphList = []
        }
        this.dataListLoading = false
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
        this.dataListLoading = false
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          facilitiesAddOrUpdate(
            this.dataForm
          ).then(({ data }) => {
            if (data && data.code === 0) {
              this.visible = false
              console.log(data)
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
    },
    handleCloseDialog () {
      this.dataForm = {
        zoneName: '',
        zoneCode: '',
        name: '',
        businessName: '',
        businessId: '',
        factorList: [], // 风险
        accidentFactor: '', // 事故因素
        rangeType: '' // 所属类型
      }
    },
    // 回显反应装置
    selectReact (val) {
      this.dataForm.businessId = val.code
      this.dataForm.businessName = val.name
    }
    // 回显存储设施
    // selectStore (val) {

    // }
  }
}
</script>

<style lang="scss">
.station-area {
  .time {
    margin-right: 10px;
  }
  .el-row {
    margin-left: -60.5px;
  }
}
</style>
