<template>
  <el-dialog :title="(!dataForm.id ? '新增' : '修改') + '应急演练'" :close-on-click-modal="false" class="emergency-planning-dialog" width="600px" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" class="classes" label-width="115px">
      <el-form-item label="演练计划名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="演练计划名称" size="mini" class="size-mini-pople-input" clearable></el-input>
      </el-form-item>
      <el-form-item label="应急预案名称" prop="contingencyPlanId">
        <el-select v-model="dataForm.contingencyPlanId" placeholder="请选择">
          <el-option v-for="item in dataList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="计划演练时间" prop="drillTime">
        <el-date-picker v-model="dataForm.drillTime" type="datetime" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="演练方式" prop="mode">
        <el-select v-model="dataForm.mode" placeholder="请选择">
          <el-option v-for="item in drillModeList" :key="item.label" :label="item.value" :value="item.label">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="演练目的" prop="aim">
        <el-input v-model="dataForm.aim" placeholder="演练目的" size="mini" class="size-mini-pople-input" clearable></el-input>
      </el-form-item>
      <el-form-item label="组织部门" prop="organzizationDeptId">
        <el-popover v-model="popoverVisible1" ref="departPopover1" placement="bottom-start" trigger="click" popper-class="high">
          <el-tree :data="departList" :props="defaultProps" node-key="id" ref="departListTree1" :default-expanded-keys="[]" @current-change="departListTreeCurrentChangeHandle1" default-expand-all :highlight-current="true" :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.organzizationDeptName" v-popover:departPopover1 :readonly="true" size="mini" class="select-depart" placeholder="请选择部门" clearable></el-input>
      </el-form-item>
      <el-form-item label="配合部门" prop="coordinationDeptId">
        <el-popover v-model="popoverVisible2" ref="departPopover2" placement="bottom-start" trigger="click" popper-class="high">
          <el-tree :data="departList" :props="defaultProps" node-key="id" ref="departListTree2" :default-expanded-keys="[]" @current-change="departListTreeCurrentChangeHandle2" default-expand-all :highlight-current="true" :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.coordinationDeptName" v-popover:departPopover2 :readonly="true" size="mini" class="select-depart" placeholder="请选择部门" clearable></el-input>
      </el-form-item>
      <el-form-item label="应急物资配备" prop="arr">
        <!-- <el-input v-model="dataForm.arrNames" placeholder="应急物资配备" @focus="selectStaffShow" size="mini" class="size-mini-pople-input" clearable>
          <el-button slot="append" @click="selectStaffShow">选择</el-button>
        </el-input> -->
        <el-button type="primary" size="mini" @click="selectStaffShow">选择物资</el-button>
        <el-row v-if="dataForm.arr.length>0" :gutter="20">
          <el-col :span="12" class="material-name">
            <!-- <el-form-item label="物资名称" label-width="80">
            </el-form-item> -->
            <el-button type="text">物资名称</el-button>
          </el-col>
          <el-col :span="12" class="material-name">
            <!-- <el-form-item label="数量" label-width="80">
            </el-form-item> -->
            <el-button type="text">数量</el-button>
          </el-col>
        </el-row>
        <div class="configStyle" v-for="(item,index) of dataForm.arr" :key="index">
          <el-tooltip class="del-child" effect="dark" content="删除" placement="right">
            <i class="el-icon-remove" @click="removeClasses(index)"></i>
          </el-tooltip>
          <el-row :gutter="10" class="item-style">
            <el-col :span="12">
              <el-form-item>
                <el-input v-model="item.suppliesName" size="mini" maxlength="10" clearable readonly>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item>
                <el-input-number v-model="item.num" controls-position="right" :max="item.maxNum" :min="0"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input v-model="dataForm.remarks" placeholder="备注" size="mini" class="size-mini-pople-input" clearable></el-input>
      </el-form-item>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="isDisabled" @click="dataFormSubmit()">确定</el-button>
    </span>
    <drill-supply v-if="selectMaterialVisible" ref="drillSupply" @selectStaffEmit="selectStaffEmit">
    </drill-supply>
  </el-dialog>
</template>

<script>
import { contingencyList, drillInfo, drillAddOrUpdate } from '@/api/process/emergencyPlan'
import { departList } from '@/api/sys/depart'
import drillSupply from './emergency-drill-supply'
import { getLabels } from '@/api/common/sys'
export default {
  components: {
    drillSupply
  },
  data () {
    return {
      dataForm: {
        id: '', // 演练计划id
        name: '', // 演练计划名称
        contingencyPlanId: '',
        contingencyPlanName: '',
        drillTime: '',
        mode: '',
        aim: '', // 负责人Id
        organzizationDeptId: '', // 负责人名称
        organzizationDeptName: '',
        coordinationDeptName: '',
        coordinationDeptId: '', // 文件列表
        remarks: '',
        arr: [],
        arrNames: '', // 应急物资名称
        state1: '2'// 审核通过
      },
      dataList: [], // 审核通过的应急预案列表
      drillModeList: [],
      departList: [],
      defaultProps: {
        label: 'deptName',
        children: 'child'
      }, // 树形结构展示
      popoverVisible1: false,
      popoverVisible2: false,
      selectMaterialVisible: false,
      isDisabled: false,
      disabled: false,
      visible: false,
      pageIndex: 1,
      pageSize: 20,
      dataRule: {
        name: [{ required: true, message: '请输入演练计划名称', trigger: 'blur' }],
        contingencyPlanId: [{ required: true, message: '请选择应急预案名称', trigger: 'change' }],
        drillTime: [{ required: true, message: '请选择计划演练时间', trigger: 'change' }],
        mode: [{ required: true, message: '请选择演练方式', trigger: 'change' }],
        aim: [{ required: true, message: '请输入演练目的', trigger: 'blur' }],
        organzizationDeptId: [{ required: true, message: '请选择组织部门', trigger: 'change' }],
        coordinationDeptId: [{ required: true, message: '请选择配合部门', trigger: 'change' }],
        arr: [{ required: true, message: '请添加应急物资', trigger: 'change' }]
      }
    }
  },
  created () {
    // this.getDate()
    this.getBaseData()
    this.getDataList()
    this.getDepartList()
  },
  methods: {
    // 页面初始化时加载的事件
    // 初始数据
    init (id) {
      this.isDisabled = false
      this.visible = true
      this.dataForm.id = id || ''
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.dataForm.arr = []
        this.dataForm.coordinationDeptName = ''
        this.dataForm.organzizationDeptName = ''
        if (id) {
          this.isDisabled = true
          drillInfo({ id: id }).then(({ data }) => {
            this.isDisabled = false
            if (data && data.code === 0) {
              this.dataForm = data.data
              this.dataForm.arr.map(item => {
                item.maxNum = parseInt(item.num)
              })
            } else {
              this.$message.error(data.msg)
            }
          }).catch(err => {
            this.isDisabled = false
            console.log(err)
          })
        }
      })
    },
    // 初始化时间
    getDate () {
      this.dataForm.drillTime = new Date().Format('yy-MM-dd hh:mm:ss')
      // console.log(Object.prototype.toString.call(this.dataForm.drillTime))
    },
    // 加载基础数据
    getBaseData () {
      // 获取演练方式列表
      getLabels({
        'type': 'DRILL_TYPE'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.drillModeList = data.list
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => console.log(err))
    },
    // 获取表格内容
    getDataList () {
      this.dataListLoading = true
      contingencyList({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'factorMainId': this.dataForm.factorMainId,
        'state': this.dataForm.state1
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
          this.totalPage = data.page.count
        } else {
          this.$message.error(data.msg)
        }
        this.dataListLoading = false
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
        this.dataListLoading = false
      })
    },
    // 获取部门树
    getDepartList () {
      this.dataListLoading = true
      departList().then(({ data }) => {
        if (data && data.code === 0) {
          this.departList = [data.data[0]] || []
          // console.log(this.departList)
          this.dataListLoading = false
        } else {
          this.$message.error(data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
      })
    },
    // 组织部门菜单树选中
    departListTreeCurrentChangeHandle1 (data, node) {
      // 当前节点的数据，对象
      this.dataForm.organzizationDeptId = data.id
      this.dataForm.organzizationDeptName = data.deptName
      this.popoverVisible1 = false
    },
    // 配合部门菜单树选中
    departListTreeCurrentChangeHandle2 (data, node) {
      // 当前节点的数据，对象
      this.dataForm.coordinationDeptId = data.id
      this.dataForm.coordinationDeptName = data.deptName
      this.popoverVisible2 = false
    },
    // 添加物资
    selectStaffShow () {
      this.selectMaterialVisible = true
      this.$nextTick(() => {
        this.$refs.drillSupply.init(this.dataForm.arr)
      })
    },
    // 物资组件返回值
    selectStaffEmit (val) {
      console.log(val)
      this.selectChange = val
      this.dataForm.arr = val
      this.selectMaterialVisible = false
      this.dataForm.arr.map(item => {
        item.suppliesId = item.id
        item.id = ''
        item.maxNum = item.num
      })
    },
    // 删除物资
    removeClasses (index) {
      this.dataForm.arr.splice(index, 1)
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          drillAddOrUpdate(
            this.dataForm
          ).then(({ data }) => {
            if (data && data.code === 0) {
              this.visible = false
              this.$message.success('操作成功!')
              this.$emit('refreshDataList')
            } else {
              this.$message.error(data.msg)
            }
          }).catch((err) => {
            console.log(err)
            this.$message.error('未知异常！请联系管理员')
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.emergency-planning-dialog {
  .el-select {
    width: 100%;
  }
  .el-date-editor.el-input {
    width: 100%;
  }
  .material-name {
    display: flex;
    justify-content: center;
    .el-button--medium {
      padding: 0;
      padding-top: 8px;
    }
  }
  .configStyle {
    position: relative;
    width: 98%;
    background: #f8fafc;
    padding-top: 20px;
    margin-right: 10px;
    cursor: pointer;
    transition: ease 10;
    .item-style .add-child,
    .del-child {
      color: #2c78bb;
      cursor: pointer;
      line-height: 28px;
      font-size: 15px;
      vertical-align: middle;
    }
    .item-style {
      height: 35px;
      line-height: 35px;
      width: 98%;
    }
    .del-child {
      position: absolute;
      top: 20px;
      right: -8px;
      color: red;
    }
    // &:hover {
    //   box-shadow: 1px 1px 10px 0px #ccc;
    // }
    .el-input-number.is-controls-right[class*='medium'] [class*='increase'] {
      line-height: 4px;
    }
    .el-input-number.is-controls-right[class*='medium'] [class*='decrease'] {
      line-height: 9px;
    }
  }
}
</style>


