<!--岗位管理 新增/修改-->
<template>
  <el-dialog :title="(!dataForm.id ? '新增' : '修改') + '岗位'" :close-on-click-modal="false" class="private-dialog" width="600px" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-form-item label="岗位编号" prop="stationCode">
        <el-input v-model="dataForm.stationCode" size="mini" placeholder="岗位编号" clearable></el-input>
      </el-form-item>
      <el-form-item label="岗位名称" prop="stationName">
        <el-input v-model="dataForm.stationName" size="mini" placeholder="岗位名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="岗位概述" prop="summary">
        <el-input v-model="dataForm.summary" size="mini" placeholder="岗位概述" type="textarea" clearable></el-input>
      </el-form-item>
      <el-form-item label="岗位职责" prop="duty">
        <el-input v-model="dataForm.duty" size="mini" placeholder="岗位职责" clearable></el-input>
      </el-form-item>
      <el-form-item label="岗位编制" prop="organization">
        <el-input-number v-model="dataForm.organization" size="mini" placeholder="岗位编制" :min="0" clearable></el-input-number>
      </el-form-item>
      <!-- <el-form-item label="资格证书类型" prop="qualificationType">
        <el-input v-model="dataForm.qualificationType" size="mini" placeholder="资格证书类型(例本科毕业证书)" clearable></el-input>
      </el-form-item> -->
      <el-form-item label="所属部门" prop="deptName">
        <el-popover v-model="popoverVisible1" ref="departPopover1" placement="bottom-start" trigger="click" popper-class="high">
          <el-tree :data="departList" :props="defaultProps1" node-key="id" ref="departListTree1" :default-expanded-keys="[]" @current-change="departListTreeCurrentChangeHandle1" default-expand-all :highlight-current="true" :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.deptName" v-popover:departPopover1 :readonly="true" size="mini" class="size-mini-pople-input menu-list__input" placeholder="请选择所属区域" clearable></el-input>
      </el-form-item>
      <!-- <el-form-item label="所属区域" prop="zoneName">
        <el-popover v-model="popoverVisible" ref="departPopover" placement="bottom-start" trigger="click" popper-class="high">
          <el-tree :data="zoneList" :props="defaultProps" node-key="id" ref="departListTree" :default-expanded-keys="[]" @current-change="regionListTreeCurrentChangeHandle" default-expand-all :highlight-current="true" :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.zoneName" v-popover:departPopover :readonly="true" size="mini" class="size-mini-pople-input menu-list__input" placeholder="请选择所属区域" clearable></el-input>
      </el-form-item> -->
      <!-- <el-form-item label="备注" prop="remarks">
        <el-input v-model="dataForm.remarks" size="mini" placeholder="备注" clearable></el-input>
      </el-form-item> -->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="isDisabled" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { stationInfo, stationAddOrUpdate } from '@/api/sys/station'
import { queryZoneInfo } from '@/api/pos/region'
import { departList } from '@/api/sys/depart'
export default {
  data () {
    return {
      dataForm: {
        stationCode: '', // 岗位编号
        stationName: '', // 岗位名称
        summary: '', // 岗位备注
        duty: '', // 岗位职责
        organization: '', // 岗位编制
        qualificationType: '', // 资格证书类型
        deptId: '', // 所属部门Id
        deptName: '', // 所属部门名称
        zoneId: '', // 区域id
        zoneName: '', // 区域名称
        remarks: ''// 备注
      },
      zoneList: [], // 区域列表
      departList: [], // 部门列表
      popoverVisible: false,
      popoverVisible1: false,
      isDisabled: false,
      visible: false,
      defaultProps1: {
        label: 'deptName',
        children: 'child'
      },
      defaultProps: {
        label: 'zoneName',
        children: 'subregion'
      },
      dataRule: {
        stationCode: [
          { required: true, message: '岗位编号不能为空', trigger: 'blur' }
        ],
        stationName: [
          { required: true, message: '岗位名称不能为空', trigger: 'blur' }
        ],
        summary: [
          { required: true, message: '岗位概述不能为空', trigger: 'blur' }
        ],
        duty: [
          { required: true, message: '岗位职责不能为空', trigger: 'blur' }
        ],
        organization: [
          { required: true, message: '岗位编制不能为空', trigger: 'blur' }
        ],
        qualificationType: [
          { required: true, message: '资格证书类型不能为空', trigger: 'blur' }
        ],
        deptName: [
          { required: true, message: '所属部门不能为空', trigger: 'change' }
        ],
        zoneName: [
          { required: true, message: '所属区域不能为空', trigger: 'change' }
        ]
      }
    }
  },
  components: {},
  created () {
    this.getAllZoneList()
    this.getDataList()
  },
  methods: {
    // 初始数据
    init (id) {
      this.isDisabled = false
      this.dataForm.id = id || ''
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.isDisabled = true
          this.selectInfo(id)
        }
      })
    },
    // 查询岗位信息
    selectInfo (id) {
      stationInfo({
        id: id
      }).then(({ data }) => {
        this.isDisabled = false
        if (data && data.code === 0) {
          this.dataForm = data.data
        }
      }).catch((err) => {
        console.log(err)
        this.isDisabled = false
        this.$message.error('未知异常！请联系管理员')
      })
    },

    // 获取所有的区域
    getAllZoneList () {
      this.dataListLoading = true
      queryZoneInfo().then(({ data }) => {
        if (data && data.code === 0) {
          console.log('区域', data)
          this.zoneList = [data.data] || []
        } else {
          this.zoneList = []
        }
        this.dataListLoading = false
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
        this.dataListLoading = false
      })
    },
    // 部门树
    getDataList () {
      this.dataListLoading = true
      departList().then(({ data }) => {
        if (data && data.code === 0) {
          // this.dataList = treeDataTranslate2(data.data.subregion, 'id', 'parentId')
          // console.log(data)
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
    // 部门的菜单树选中
    departListTreeCurrentChangeHandle1 (data, node) {
      // 当前节点的数据，对象
      this.dataForm.deptId = data.id
      this.dataForm.deptName = data.deptName
      this.popoverVisible1 = false
    },
    // 区域的菜单树选中
    regionListTreeCurrentChangeHandle (data, node) {
      // 当前节点的数据，对象
      this.dataForm.zoneId = data.id
      this.dataForm.zoneName = data.zoneName
      this.popoverVisible = false
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.isDisabled = true
          stationAddOrUpdate(
            this.dataForm
          ).then(({ data }) => {
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
