<!--装置参数添加页-->
<template>
  <el-dialog title="设置反应装置及参数"
             class="facilities-params-dialog"
             :close-on-click-modal="false"
             :visible.sync="visible"
             append-to-body
             width="700px">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             class="classes"
             label-width="110px">
      <el-form-item label="反应装置"
                    prop="name"
                    class="stationName">
        <el-select v-model="dataForm.reactorId"
                   clearable
                   size="mini"
                   placeholder="请选择反应装置">
          <el-option v-for="item in options"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="监控参数"
                    prop="name"
                    class="stationName">

        <el-button type="primary"
                   plain
                   size="mini"
                   @click="paramsAdd">添加</el-button>
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false"
                 size="mini">取消</el-button>
      <el-button type="primary"
                 @click="dataFormSubmit()"
                 size="mini">确定</el-button>
    </span>
    <params-add v-if="paramsAddVisible"
                ref="paramsAdd"></params-add>
  </el-dialog>
</template>
<script>
// import { dangerChemicalsList } from '@/api/sou/highRisk'
import { reactorList } from '@/api/sou/equlpment'

import paramsAdd from './process-manage-facility-params-add'
export default {
  data () {
    return {
      dataForm: {
      },
      options: [], // 装置选项
      visible: false,
      menuList: [],
      dataListLoading: false,
      selectChange: {}, // 选中项的值
      dynamicTags: ['标签一', '标签二', '标签三'],
      inputVisible: false,
      inputValue: '',
      paramsAddVisible: false
    }
  },
  components: {
    paramsAdd
  },
  created () {
    this.getqueryList()
  },
  methods: {
    init (select) {
      this.visible = true
      this.$nextTick(() => {
        this.selectChange = select
        // this.getqueryList(select)
      })
    },
    // 获取区域列表
    getqueryList (select) {
      this.dataListLoading = true
      this.menuList = []
      reactorList().then(({ data }) => {
        if (data && data.code === 0) {
          this.menuList = data.page.list
          console.log(this.menuList)
          this.dataListLoading = false
        } else {
          this.$message.error(data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
      })
    },
    paramsAdd () {
      this.paramsAddVisible = true
      this.$nextTick(() => {
        this.$refs.paramsAdd.init()
      })
    },
    // 提交区域或围栏
    dataFormSubmit () {
      this.visible = false
      console.log(this.selectChange)
      this.$emit('selectChange', this.selectChange)
    },
    handleClose (tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },

    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm () {
      let inputValue = this.inputValue
      if (inputValue) {
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    }

  }
}
</script>
<style lang="scss" scoped>
.facilities-params-dialog {
  .el-tag {
    margin: 0 10px 10px 0;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .button-new-tag[data-v-988d2a00] {
    margin-left: 0;
  }
}
</style>
