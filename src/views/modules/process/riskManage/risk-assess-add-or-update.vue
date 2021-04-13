<!--风险评价制度管理配置-->
<template>

  <el-dialog :title="(!dataForm.level ? '':'批量配置')+(!dataForm.level ? (!dataForm.id ? '新增' : '修改'):'') + '部门'" :close-on-click-modal="false" class="point-dialog" width="600px" :visible.sync="visible" append-to-body :modal-append-to-body="true">
    <el-form :model="dataForm" :rules="!dataForm.level ? dataRule:dataRule1" ref="dataForm" class="classes" label-width="110px">
      <el-form-item label="一级管控部门" prop="deptIdControlOne" class="stationName">
        <el-popover v-model="popoverVisible1" ref="departPopover1" placement="bottom-start" trigger="click" popper-class="high">
          <el-tree :data="departList" :props="defaultProps" node-key="id" ref="departListTree1" :default-expanded-keys="[]" @current-change="departListTreeCurrentChangeHandle1" default-expand-all :highlight-current="true" :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.deptIdControlOneName" v-popover:departPopover1 :readonly="true" size="mini" class="size-mini-pople-input menu-list__input" placeholder="请选择所属区域" clearable></el-input>
      </el-form-item>
      <el-form-item label="二级管控部门" prop="deptIdControlTwo">
        <el-popover v-model="popoverVisible2" ref="departPopover2" placement="bottom-start" trigger="click" popper-class="high">
          <el-tree :data="departList" :props="defaultProps" node-key="id" ref="departListTree2" :default-expanded-keys="[]" @current-change="departListTreeCurrentChangeHandle2" default-expand-all :highlight-current="true" :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.deptIdControlTwoName" v-popover:departPopover2 :readonly="true" size="mini" class="size-mini-pople-input menu-list__input" placeholder="请选择所属区域" clearable></el-input>
      </el-form-item>
      <el-form-item label="三级管控部门" prop="deptIdControlThree">
        <el-popover v-model="popoverVisible3" ref="departPopover3" placement="bottom-start" trigger="click" popper-class="high">
          <el-tree :data="departList" :props="defaultProps" node-key="id" ref="departListTree3" :default-expanded-keys="[]" @current-change="departListTreeCurrentChangeHandle3" default-expand-all :highlight-current="true" :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.deptIdControlThreeName" v-popover:departPopover3 :readonly="true" size="mini" class="size-mini-pople-input menu-list__input" placeholder="请选择所属区域" clearable></el-input>
      </el-form-item>
      <el-form-item label="四级管控部门" prop="deptIdControlFour">
        <el-popover v-model="popoverVisible4" ref="departPopover4" placement="bottom-start" trigger="click" popper-class="high">
          <el-tree :data="departList" :props="defaultProps" node-key="id" ref="departListTree4" :default-expanded-keys="[]" @current-change="departListTreeCurrentChangeHandle4" default-expand-all :highlight-current="true" :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.deptIdControlFourName" v-popover:departPopover4 :readonly="true" size="mini" class="size-mini-pople-input menu-list__input" placeholder="请选择所属区域" clearable></el-input>
      </el-form-item>
      <el-form-item label="风评部门" prop="deptIdAssess">
        <el-popover v-model="popoverVisible5" ref="departPopover5" placement="bottom-start" trigger="click" popper-class="high">
          <el-tree :data="departList" :props="defaultProps" node-key="id" ref="departListTree5" :default-expanded-keys="[]" @current-change="departListTreeCurrentChangeHandle5" default-expand-all :highlight-current="true" :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.deptIdAssessName" v-popover:departPopover5 :readonly="true" size="mini" class="size-mini-pople-input menu-list__input" placeholder="请选择所属区域" clearable></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="isDisabled" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { departList } from '@/api/sys/depart'
import { institutionAddOrUpdate, institutionInfo, bulkOpertionAddOrUpdate } from '@/api/risk/inventory'
export default {
  data () {
    return {
      dataForm: {
        deptIdAssess: '', // 评价部门
        deptIdControlFour: '', // 四级管控部门
        deptIdControlOne: '', // 一级管控部门
        deptIdControlThree: '', // 三级管控部门
        deptIdControlTwo: '', // 二级管控部门
        deptIdControlOneName: '',
        deptIdControlTwoName: '',
        deptIdControlThreeName: '',
        deptIdControlFourName: '',
        deptIdAssessName: '',
        zoneId: '', // 区域Id
        assessmentInstitutionList: [],
        zoneParentId: ''
      },
      departList: [],
      subregion: [], // 子list
      defaultProps: {
        label: 'deptName',
        children: 'child'
      }, // 树形结构展示
      popoverVisible1: false,
      popoverVisible2: false,
      popoverVisible3: false,
      popoverVisible4: false,
      popoverVisible5: false,
      dataRule: {
        deptIdControlOne: [{ required: true, message: '请选择一级管控部门', trigger: 'change' }],
        deptIdControlTwo: [{ required: true, message: '请选择二级管控部门', trigger: 'change' }],
        deptIdControlThree: [{ required: true, message: '请选择三级管控部门', trigger: 'change' }],
        deptIdControlFour: [{ required: true, message: '请选择四级管控部门', trigger: 'change' }],
        deptIdAssess: [{ required: true, message: '请选择风评部门', trigger: 'change' }]
      },
      // 带有子级树的行的验证规则
      dataRule1: {

      },
      disabled: false,
      visible: false,
      isDisabled: false
    }
  },
  created () {
  },
  methods: {
    // 初始数据
    init (zoneId, id, level, subregion, zoneCode, formData) {
      this.isDisabled = false
      this.dataForm.zoneId = zoneId || ''
      this.dataForm.id = id
      this.dataForm.level = level || ''
      this.dataForm.zoneParentId = zoneId || ''// 区域父级id是相对子集而言的
      this.dataForm.zoneCode = zoneCode || ''
      this.subregion = subregion || []
      this.visible = true
      this.$nextTick(() => {
        this.getDataList()
        this.$refs['dataForm'].resetFields()
        this.dataForm.deptIdControlOneName = ''
        this.dataForm.deptIdControlTwoName = ''
        this.dataForm.deptIdControlThreeName = ''
        this.dataForm.deptIdControlFourName = ''
        this.dataForm.deptIdAssessName = ''
        // console.log(this.dataForm, '11111111111111')
        if (id) {
          this.selectInfo(id, this.dataForm.level)
        }
      })
    },
    // 获取部门树
    getDataList () {
      this.dataListLoading = true
      departList().then(({ data }) => {
        if (data && data.code === 0) {
          // this.dataList = treeDataTranslate2(data.data.subregion, 'id', 'parentId')
          // console.log(data)
          this.departList = [data.data[0]] || []
          console.log(this.departList)
          this.dataListLoading = false
        } else {
          this.$message.error(data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
      })
    },
    // 菜单树一选中
    departListTreeCurrentChangeHandle1 (data, node) {
      // 当前节点的数据，对象
      this.dataForm.deptIdControlOne = data.id
      this.dataForm.deptIdControlOneName = data.deptName
      this.popoverVisible1 = false
    },
    // 菜单树二选中
    departListTreeCurrentChangeHandle2 (data, node) {
      // 当前节点的数据，对象
      this.dataForm.deptIdControlTwo = data.id
      this.dataForm.deptIdControlTwoName = data.deptName
      this.popoverVisible2 = false
    },
    // 菜单树三选中
    departListTreeCurrentChangeHandle3 (data, node) {
      // 当前节点的数据，对象
      this.dataForm.deptIdControlThree = data.id
      this.dataForm.deptIdControlThreeName = data.deptName
      this.popoverVisible3 = false
    },
    // 菜单树四选中
    departListTreeCurrentChangeHandle4 (data, node) {
      // 当前节点的数据，对象
      this.dataForm.deptIdControlFour = data.id
      this.dataForm.deptIdControlFourName = data.deptName
      this.popoverVisible4 = false
    },
    // 菜单树五选中
    departListTreeCurrentChangeHandle5 (data, node) {
      // 当前节点的数据，对象
      this.dataForm.deptIdAssess = data.id
      this.dataForm.deptIdAssessName = data.deptName
      this.popoverVisible5 = false
    },
    // 查询单个部门职责和任务关联实体
    selectInfo (id, level) {
      institutionInfo({ 'id': id }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log(data)
          //     this.$refs.departListTree.setCurrentKey(this.dataForm.parentId)
          // this.dataForm.parentName = (this.$refs.departListTree.getCurrentNode() || {})['name']
          if (data.data.deptIdControlOne) {
            this.dataForm.deptIdControlOne = data.data.deptIdControlOne
            this.$refs.departListTree1.setCurrentKey(this.dataForm.deptIdControlOne)
            this.dataForm.deptIdControlOneName = (this.$refs.departListTree1.getCurrentNode() || {})['deptName']
          }
          if (data.data.deptIdControlTwo) {
            this.dataForm.deptIdControlTwo = data.data.deptIdControlTwo
            this.$refs.departListTree2.setCurrentKey(this.dataForm.deptIdControlTwo)
            this.dataForm.deptIdControlTwoName = (this.$refs.departListTree2.getCurrentNode() || {})['deptName']
          }
          if (data.data.deptIdControlThree) {
            this.dataForm.deptIdControlThree = data.data.deptIdControlThree
            this.$refs.departListTree3.setCurrentKey(this.dataForm.deptIdControlThree)
            this.dataForm.deptIdControlThreeName = (this.$refs.departListTree3.getCurrentNode() || {})['deptName']
          }
          if (data.data.deptIdControlFour) {
            this.dataForm.deptIdControlFour = data.data.deptIdControlFour
            this.$refs.departListTree4.setCurrentKey(this.dataForm.deptIdControlFour)
            this.dataForm.deptIdControlFourName = (this.$refs.departListTree4.getCurrentNode() || {})['deptName']
          }
          if (data.data.deptIdAssess) {
            this.dataForm.deptIdAssess = data.data.deptIdAssess
            this.$refs.departListTree5.setCurrentKey(this.dataForm.deptIdAssess)
            this.dataForm.deptIdAssessName = (this.$refs.departListTree5.getCurrentNode() || {})['deptName']
          }
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.visible = false
          if (!this.dataForm.level) {
            institutionAddOrUpdate(
              this.dataForm
            ).then(({ data }) => {
              this.visible = false
              if (data && data.code === 0) {
                console.log(data)
                this.$emit('refreshDataList')
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
          } else {
            this.dataForm.assessmentInstitutionList = []
            this.subregion.map(item => {
              this.dataForm.assessmentInstitutionList.push({
                'deptIdAssess': this.dataForm.deptIdAssess,
                'deptIdControlFour': this.dataForm.deptIdControlFour,
                'deptIdControlOne': this.dataForm.deptIdControlOne,
                'deptIdControlThree': this.dataForm.deptIdControlThree,
                'deptIdControlTwo': this.dataForm.deptIdControlTwo,
                'id': item.assessmentInstitutionId,
                'zoneId': item.id,
                'zoneCode': item.code
              })
            })
            bulkOpertionAddOrUpdate(
              this.dataForm
            ).then(({ data }) => {
              this.visible = false
              if (data && data.code === 0) {
                this.$emit('refreshDataList')
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
        }
      })
    }
  }
}
</script>
<style lang="scss">
.point-dialog {
  .classes {
    margin-left: 0 !important;
  }
  .el-dialog {
    width: 300px;
    // height: 400px;
  }
  .text {
    font-size: 14px;
  }

  .box-card {
    width: 350px;
  }
  .el-card__body {
    // padding: 3px;
  }
  .el-input.el-input--mini.el-input-group.el-input-group--append {
    margin-top: 0;
  }
  .check-point {
    padding-right: 0;
    position: relative;
    font-size: 12px;
    .el-form-item {
      margin: 7px 0;
      .el-form-item__content {
        display: flex;
        flex-direction: row;
        .index {
          position: absolute;
          width: 25px;
          top: 5px;
          left: -35px;
        }
        .el-icon-remove {
          margin-left: 5px;
          color: #f56c6c;
          line-height: 30px;
        }
      }
    }
  }
}
</style>
