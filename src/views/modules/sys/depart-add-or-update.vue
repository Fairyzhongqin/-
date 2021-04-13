<template>
  <el-dialog :title="(!dataForm.id ? '新增' : '修改') + '部门信息'"
             :close-on-click-modal="false"
             class="department-manage"
             width="600px"
             :visible.sync="visible">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             class="classes"
             label-width="110px">
      <el-form-item label="部门编号"
                    prop="code"
                    label-width="115px">
        <el-input v-model="dataForm.code"
                  placeholder="请输入部门编号"
                  size="mini"
                  clearable></el-input>
      </el-form-item>
      <el-form-item label="部门名称"
                    prop="name"
                    label-width="115px">
        <el-input v-model="dataForm.name"
                  placeholder="请输入部门名称"
                  size="mini"
                  clearable></el-input>
      </el-form-item>
      <el-form-item label="上级部门"
                    prop="parentId"
                    label-width="115px">
        <el-popover ref="departPopover"
                    placement="bottom-start"
                    popper-class="high"
                    v-model="popoverVisible"
                    trigger="click">
          <el-tree :data="departList"
                   :props="departListTreeProps"
                   node-key="id"
                   ref="departListTree"
                   :default-expanded-keys="[]"
                   @current-change="departListTreeCurrentChangeHandle"
                   :default-expand-all="false"
                   :highlight-current="true"
                   :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.parentName"
                  v-popover:departPopover
                  :readonly="true"
                  size="mini"
                  class="size-mini-pople-input menu-list__input"
                  placeholder="点击选择上级部门"></el-input>
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
import { departAddOrUpdate, departInfo, departList } from '@/api/sys/depart'
import enclosureOrArea from '@/components/select/select-enclosure-or-area'
import selectStaff from '@/components/select/select-staff'
export default {
  data () {
    return {
      dataForm: {
        id: '',
        name: '',
        code: '',
        deptType: '', // 部门类型 0-部门/1-车间
        parentId: 0, // 上级部门Id,一级为0
        parentName: ''
      },
      isDisabled: false,
      popoverVisible: false,
      disabled: false,
      visible: false,
      dataRule: {
        name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入部门编号', trigger: 'blur' }],
        parentId: [{ required: true, message: '请选择上级部门', trigger: 'change' }]
      },
      departList: [],
      departListTreeProps: {
        label: 'deptName',
        children: 'child'
      } // 树形结构展示
    }
  },
  components: {
    selectStaff,
    enclosureOrArea
  },
  created () {

  },
  methods: {
    // 初始数据
    init (id) {
      this.isDisabled = false
      this.visible = true
      this.dataForm.id = id || ''
      this.dataForm.parentName = ''
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.getDataList()
        // this.menuListTreeSetCurrentNode()
        if (id) {
          this.selectInfo(id)
        }
      })
    },
    // 查询单个分区
    selectInfo (id) {
      departInfo({ 'id': id }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataForm.id = data.data.id
          this.dataForm.name = data.data.deptName
          this.dataForm.code = data.data.deptCode
          this.dataForm.parentId = data.data.parentId // 上级部门Id,一级为0
          this.dataForm.parentName = data.data.parentName
          // this.menuListTreeSetCurrentNode()
        }
      })
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      departList().then(({ data }) => {
        if (data && data.code === 0) {
          // this.dataList = treeDataTranslate2(data.data.subregion, 'id', 'parentId')
          this.departList = [data.data[0]] || []
          this.dataListLoading = false
        } else {
          this.$message.error(data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
      })
    },
    // 菜单树选中
    departListTreeCurrentChangeHandle (data, node) {
      // 当前节点的数据，对象
      this.dataForm.parentId = data.id
      this.dataForm.parentName = data.deptName
      this.popoverVisible = false
    },
    // 菜单树设置当前选中节点
    menuListTreeSetCurrentNode () {
      this.$refs.departListTree.setCurrentKey(this.dataForm.parentId)
      this.dataForm.parentName = (this.$refs.departListTree.getCurrentNode() || {})['name']
    },
    handleNodeClick () { },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          let dataForm = {
            id: this.dataForm.id,
            deptName: this.dataForm.name,
            deptCode: this.dataForm.code,
            parentId: this.dataForm.parentId,
            parentName: this.dataForm.parentName
          }
          departAddOrUpdate(
            dataForm
          ).then(({ data }) => {
            if (data && data.code === 0) {
              this.visible = false
              this.$emit('refreshDataList')
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                }
              })
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
.department-manage {
  .time {
    margin-right: 10px;
  }
  .el-row {
    margin-left: -60.5px;
  }
}
</style>
