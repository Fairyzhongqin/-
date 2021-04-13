<template>
  <el-dialog title="隐患整改" :close-on-click-modal="false" width="600px" :visible.sync="visible" class="hiddenDnagerStyle">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="110px">
      <el-form-item label="整改方式" prop="rectificationType">
        <el-select v-model="dataForm.rectificationType" clearable disabled placeholder="请选择整改方式" size="mini">
          <el-option v-for="item in rectificationTypeList" :key="item.label" :value="item.label" :label="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="整改时间" prop="rectificationDate">
        <el-date-picker v-model="dataForm.rectificationDate" type="datetime" size="mini" disabled placeholder="请选择整改时间" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="整改期限" prop="rectificationPeriod">
        <el-date-picker v-model="dataForm.rectificationPeriod" type="datetime" size="mini" disabled placeholder="请选择整改期限" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="整改措施" prop="rectificationMeasure">
        <el-input v-model="dataForm.rectificationMeasure" placeholder="请输入整改措施" clearable disabled type="textarea" :autosize="{ minRows: 2, maxRows: 3 }" size="mini"></el-input>
      </el-form-item>
      <!-- <el-form-item label="整改预案" prop="rectificationMeasure">
        <el-input
          v-model="dataForm.rectificationMeasure"
          placeholder="请输入整改预案"
          clearable
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 3 }"
          size="mini"
        ></el-input>
      </el-form-item> -->
      <el-form-item label="整改资金/元" prop="rectificationCapital">
        <el-input v-model="dataForm.rectificationCapital" clearable size="mini" disabled type="number" placeholder="请输入整改资金"></el-input>
      </el-form-item>
      <el-form-item label="验收部门" prop="rectificationDepartment">
        <el-popover v-model="popoverdepartVisible" popper-class="high" placement="bottom-start" ref="departPopover" trigger="click">
          <el-tree :data="departList" :props="defaultProps" node-key="id" ref="deptTree" @current-change="deptSelectChange" default-expand-all :highlight-current="true" :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.checkUnit" v-popover:departPopover size="mini" placeholder="请选择验收部门" clearable disabled></el-input>
      </el-form-item>
      <el-form-item label="验收人" prop="checkPerson">
        <el-input v-model="dataForm.checkPerson" placeholder="请选择验收人" @focus="selectPerson" maxlength="150" size="mini" disabled></el-input>
        <el-button slot="append" @click="selectPerson">选择</el-button>
      </el-form-item>
    </el-form>
    <rectificate-person v-if="rectificatePersonVisible" ref="rectificatePersonRef" @selectChange="selectPersonEmit"></rectificate-person>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>
<script>
import rectificatePerson from './components/rectificate-person'
import { departList } from '@/api/sys/depart'
import { hiddenDangerInfo } from '@/api/risk/hiddenDanger'

export default {
  data () {
    return {
      dataForm: {
        id: '',
        hiddenDangerSource: '',
        rectificationPeriod: '',
        rectificationMeasure: '',
        rectificationCapital: '',
        checkPerson: '',
        checkUnit: '',
        rectificationStatus: '3'
      },
      rectificatePersonVisible: false, // 整改人弹框
      defaultProps: {
        label: 'deptName',
        children: 'child'
      },
      dataRule: {
        // factorName: [{ required: true, message: '请输入事故名称', trigger: 'blur' }],
        // factorDescribe: [{ required: true, message: '请输入事故描述', trigger: 'blur' }]
      },
      popoverdepartVisible: false, // 部门菜单树是否可见
      isDisabled: false,
      disabled: false,
      visible: false,
      departList: [],
      rectificationTypeList: [
        {
          label: '1',
          value: '立即整改'
        },
        {
          label: '2',
          value: '期限整改'
        },
        {
          label: '3',
          value: '停业停产整顿'
        }
      ]
    }
  },
  components: {
    rectificatePerson
  },
  created () {
    this.getDepartList()
  },
  methods: {
    // 初始化打开
    init (id) {
      this.isDisabled = false
      this.visible = true
      this.dataForm.id = id
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (id) {
          this.isDisabled = true
          hiddenDangerInfo({ id: id }).then(({ data }) => {
            this.isDisabled = false
            if (data && data.code === 0) {
              this.dataForm = data.data
            }
          })
        }
      })
    },
    // 当前菜单树选中
    deptSelectChange (data, node) {
      // 当前节点数据，对象
      this.dataForm.rectificationDepartmentId = data.id
      this.dataForm.checkUnit = data.deptName
      this.popoverdepartVisible = false
    },
    // 整改部门
    getDepartList () {
      departList().then(({ data }) => {
        if (data && data.code === 0) {
          // console.log(data.data)
          this.departList = data.data
        }
      })
    },
    // 选择整改人
    selectPerson () {
      this.rectificatePersonVisible = true
      this.$nextTick(() => {
        this.$refs.rectificatePersonRef.init(
          this.dataForm.rectificationDepartmentId,
          this.selectedPersonghinit
        )
      })
    },
    // 整改人回显示
    selectPersonEmit (selected) {
      // console.log(selected)
      this.dataForm.checkPerson = selected.name
      this.selectedPersongh = selected.gh
    }
  }
}
</script>
<style lang="scss">
.hiddenDnagerStyle {
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
}
</style>
