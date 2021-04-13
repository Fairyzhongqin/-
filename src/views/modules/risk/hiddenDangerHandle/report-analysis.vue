<template>
  <el-dialog title="隐患分析" :close-on-click-modal="false" class="station-area" width="600px" :visible.sync="visible" append-to-body>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" class="classes" label-width="110px">
      <el-form-item label='隐患级别' prop='hiddenDangerLevel'>
        <el-select v-model="dataForm.hiddenDangerLevel" clearable placeholder="请选择隐患级别" size="mini">
          <el-option v-for="item in hiddenDangerLevelList" :key="item.label" :value="item.label" :label="item.value">

          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='隐患类别' prop='hiddenDangerType'>
        <el-select v-model="dataForm.hiddenDangerType" clearable placeholder="请选择隐患类别" size="mini">
          <el-option v-for="item in hiddenDangerTypeList" :key="item.label" :value="item.label" :label="item.value">

          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='整改部门' prop='rectificationDepartment'>
        <el-popover v-model="popoverdepartVisible" popper-class="high" placement="bottom-start" ref="departPopover" trigger="click">
          <el-tree :data="departList" :props="defaultProps" node-key="id" ref="deptTree" @current-change="deptSelectChange" default-expand-all :highlight-current="true" :expand-on-click-node="false">

          </el-tree>

        </el-popover>
        <el-input v-model="dataForm.rectificationDepartment" v-popover:departPopover size="mini" placeholder="请选择整改部门" clearable></el-input>
      </el-form-item>
      <el-form-item label='整改责任人' prop='rectificationPerson'>
        <el-input v-model="dataForm.rectificationPerson" placeholder="请选择整改责任人" @focus="selectPerson" size="mini"></el-input>
        <el-button slot="append" @click="selectPerson">选择</el-button>
      </el-form-item>

    </el-form>
    <!-- 添加整改人选择弹框 -->
    <rectificate-person v-if="rectificatePersonVisible" ref="rectificatePersonRef" @selectChange="selectPersonEmit"></rectificate-person>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="isDisabled" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { hiddendangerOperate } from '@/api/risk/hiddenDanger'
import { queryZoneInfo } from '@/api/pos/region'
import { departList } from '@/api/sys/depart'
import rectificatePerson from './components/rectificate-person'
export default {
  data () {
    return {
      dataForm: {
        id: '',
        hiddenDangerLevel: '',
        hiddenDangerType: '',
        rectificationDepartment: '',
        rectificationDepartmentId: '',
        rectificationPerson: '',
        hiddenDangerStatus: '1',
        rectificationStatus: '1'
      },
      selectedPersongh: '',
      hiddenDangerLevelList: [{
        value: '一般隐患',
        label: '1'
      }, {
        value: '重大隐患',
        label: '2'
      }],
      hiddenDangerTypeList: [{
        value: '基础管理',
        label: 'A'
      }, {
        value: '现场管理',
        label: 'B'
      }],
      dialogVisible: false,
      dialogImageUrl: '',
      isDisabled: false,
      disabled: false,
      visible: false,
      departList: [],
      graphList: [], // 所属区域
      srcList: [], // 图片上传
      rectificatePersonVisible: false, // 整改人弹框
      defaultProps: {
        label: 'deptName',
        children: 'child'
      },
      popoverdepartVisible: false, // 部门菜单树是否可见
      dataRule: {
        hiddenDangerLevel: [{ required: true, message: '请选择隐患级别', trigger: 'change' }],
        hiddenDangerType: [{ required: true, message: '请选择隐患类别', trigger: 'change' }],
        rectificationDepartment: [{ required: true, message: '请选择整改部门', trigger: 'change' }],
        rectificationPerson: [{ required: true, message: '请选择整改人', trigger: 'change' }]

      }
    }
  },
  components: {
    rectificatePerson
  },
  created () {
    this.getAllZoneList()
    this.getDepartList()
  },
  methods: {
    // 当前菜单树选中
    deptSelectChange (data, node) {
      // 当前节点数据，对象
      this.dataForm.rectificationDepartmentId = data.id
      this.dataForm.rectificationDepartment = data.deptName
      this.popoverdepartVisible = false
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
    // 页面初始化时加载的事件
    // 初始数据
    init (id) {
      this.isDisabled = false
      this.visible = true
      this.dataForm.id = id
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        // if (id) {
        //   this.isDisabled = true
        //   factorInfo({ id: id }).then(({ data }) => {
        //     this.isDisabled = false
        //     if (data && data.code === 0) {
        //       this.dataForm = data.data
        //     } else {
        //       this.$message.error(data.msg)
        //     }
        //   }).catch(err => {
        //     this.isDisabled = false
        //     console.log(err)
        //   })
        // }
      })
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
        this.$refs.rectificatePersonRef.init(this.dataForm.rectificationDepartmentId, this.selectedPersongh)
      })
    },
    // 整改人回显示
    selectPersonEmit (selected) {
      // console.log(selected)
      this.dataForm.rectificationPerson = selected.name
      this.selectedPersongh = selected.gh
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.isDisabled = true
          hiddendangerOperate(
            this.dataForm
          ).then(({ data }) => {
            if (data && data.code === 0) {
              this.visible = false
              this.isDisabled = false
              this.$emit('refreshDataList')
            } else {
              this.visible = false
              this.isDisabled = false
              this.$message.error(data.msg)
            }
          }).catch((err) => {
            console.log(err)
            this.visible = false
            this.isDisabled = false
            this.$message.error('未知异常！请联系管理员')
          })
        }
      })
    },
    // 图片内容转为base64格式
    getBase64 (file) {
      return new Promise(function (resolve, reject) {
        let reader = new FileReader()
        let imgResult = ''
        reader.readAsDataURL(file)
        reader.onload = function () {
          imgResult = reader.result
        }
        reader.onerror = function (error) {
          reject(error)
        }
        reader.onloadend = function () {
          resolve(imgResult)
        }
      })
    },
    // 移除图片事件
    handleRemove (file) {
    },
    // 预览事件
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 文件状态改变时的钩子
    getFile (file) {
      console.log(file)
      if (this.beforeUpload(file)) {
        this.getBase64(file.raw).then(res => {
          this.imgInfo = res
          this.srcList.push(res)
          console.log(this.srcList)
        })
      }
    },
    // 上传文件之前的钩子
    beforeUpload (file) {
      const isJPG = /^image\/(jpeg|png|jpg)$/.test(file.raw.type)
      const isLt2M = Number(file.size) / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传图片只能上传jpeg/jpg/png文件!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
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


