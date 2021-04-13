<template class="safety">
  <el-dialog :title="(!dataForm.id ? '新增' : '修改') + '报告'" :close-on-click-modal="false" append-to-body :visible.sync="visible" width="650px" class="facilty-dialog">
    <div>
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
        <el-form-item label="报告标题" prop="reportTitle">
          <el-input v-model="dataForm.reportTitle" placeholder="报告标题" maxlength="20" clearable :disabled="flag"></el-input>
        </el-form-item>
        <el-form-item label="报告名称" prop="reportName">
          <el-input v-model="dataForm.reportName" placeholder="报告名称" maxlength="20" clearable></el-input>
        </el-form-item>

        <el-form-item label="报告顺序" prop="sort">
          <el-input-number v-model="dataForm.sort" :min="0" size="mini" label="报告顺序"></el-input-number>
        </el-form-item>

        <el-form-item label="模板等级" prop="reportLevel">
          <el-select v-model="dataForm.reportLevel" placeholder="请选择模板等级">
            <el-option v-for="item in typeList" :key="item.value" :label="item.value" :value="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模板类型" prop="reportType">
          <el-select v-model="dataForm.reportType" placeholder="请选择模板类型">
            <el-option label="状态" value="0"></el-option>
            <el-option label="承诺" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="报告状态" prop="status">
          <el-select v-model="dataForm.status" placeholder="请选择报告状态" :disabled=" !dataForm.id ? true : false ">
            <el-option label="失效" value="0"></el-option>
            <el-option label="生效" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="报告信息" class="item-select ueditor_content">
          <el-button @click="addUeHtml" size="mini">插入变量</el-button>
          <div :ref="ueId" :id="ueId" class="ueditor-box" type="text/plain" style="width: 100%; height: 200px !important;">
          </div>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="isDisabled" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>

</template>

<script>
import { reportTemplateInfo, reportTemplateAddOrUpdate } from '@/api/sou/productionSafety'
import { getLabels } from '@/api/common/sys'

export default {
  data () {
    return {
      visible: false,
      isDisabled: false,
      dataForm: {
        id: '',
        reportTitle: '',
        msg: '',
        reportName: '',
        sort: '',
        reportLevel: '',
        status: '',
        selectVariable: '',
        reportType: '' // 模板类型（0-状态，1-承诺）
      },
      flag: false, // 标题状态
      selectedOptions: [],
      dataIndex: 0,
      typeList: [],
      optionsList: [],
      variablesVisible: false,
      addOrUpdateVisible: false,
      ue: '',
      ueId: `J_ueditorBox_${new Date().getTime()}`,
      dataRule: {
        msg: [
          { required: true, message: '报告描述不能为空 ', trigger: 'blur' }
        ],
        reportTitle: [
          { required: true, message: '报告标题不能为空', trigger: 'blur' }
        ],
        reportName: [
          { required: true, message: '报告名称不能为空', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '报告顺序不能为空', trigger: 'change' }
        ],
        reportLevel: [
          { required: true, message: '模板等级不能为空', trigger: 'change' }
        ],
        reportType: [
          { required: true, message: '模板类型不能为空', trigger: 'change' }
        ]
      }
    }
  },
  components: {},
  activated () { },
  methods: {
    // 新增单个字段
    init (id) {
      this.dataForm.id = id || ''
      this.visible = true
      this.isDisabled = false
      this.addOrUpdateVisible = true
      this.selectedOptions = []
      this.flag = false
      this.dataForm.status = '1'
      this.dataForm.msg = ''
      this.$nextTick(() => {
        if (this.ue) {
          console.log(this.ue)
          this.ue.setContent('')
        }
      })
      this.$nextTick(() => {
        this.getBaseData() // 加载基础数据
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.isDisabled = true
          reportTemplateInfo({
            'id': this.dataForm.id || undefined
          }).then(({ data }) => {
            this.isDisabled = false
            if (data && data.code === 0) {
              this.flag = data.flag
              let html = data.data.msg
              let arr = html.split('$')
              let valList = []
              arr.map(item => {
                if (item.indexOf('#') !== -1) {
                  if (item.match(/#(\S*)#/)) {
                    valList.push(item.match(/#(\S*)#/)[1])
                  }
                }
              })
              valList.map(item => {
                html = html.replace('$#data#$', '<span class="addDom"><span class="span1"></span><span class="btn-group">变量</span><span>&nbsp;</span></span>')
              })
              // 设置编辑器的内容
              this.ue.setContent(html)
              console.log(data)
              this.dataForm = data.data
            } else {
              this.$message.error(data.msg)
            }
          }).catch((err) => {
            console.log(err)
            this.isDisabled = false
            this.$message.error('未知异常！请联系管理员')
          })
        }
        this.ueId = `J_ueditorBox_${new Date().getTime()}`
        this.$nextTick(() => {
          this.getEditor()
          // let edui = document.getElementsByClassName('edui-container').length
          // if (edui <= 1) {
          //   this.getEditor()
          // }
        })
      })
    },
    // 表单提交
    dataFormSubmit () {
      if (this.ue.getContentTxt().replace(/(^\s*)|(\s*$)/g, '') === '') {
        this.$message.error('请输入报告信息')
        // return
      } else {
        let html2 = this.ue.getContent()
        let nameList = [] // name值数组
        let list = document.getElementsByClassName('btn-group')
        for (var m = 0; m < list.length; m++) {
          nameList.push(list[m].innerText)
        }
        nameList.map(item => {
          html2 = html2.replace('<span class="btn-group">' + item + '</span>', '$#data#$')
        })
        let ueContent = html2.replace(/<[^>]+>/g, '') // 截取html标签
        this.dataForm.msg = ueContent.replace(/&nbsp;/g, ' ')
        console.log(this.dataForm.msg)
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.isDisabled = true
          reportTemplateAddOrUpdate(
            this.dataForm
          ).then(({ data }) => {
            this.visible = false
            this.$emit('refreshDataList')
            if (data && data.code === 0) {
              this.dataForm.id = data.id
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
    },
    // 加载基础数据
    getBaseData () {
      // 风险研判模板等级 - 字典
      getLabels({
        'type': 'REPORT_LEVEL'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.typeList = data.list
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => console.log(err))
    },
    // 富文本框初始化
    getEditor () {
      // 实例化富文本框
      this.ue = window.UM.getEditor(this.ueId, {
        toolbars: false,
        serverUrl: '', // 服务器统一请求接口路径
        enableAutoSave: false, // 启用自动保存
        maximumWords: 100,   // 允许的最大字符数
        elementPathEnabled: false // 是否启用元素路径，默认是true显示
      })
      this.ue.execCommand('cleardoc')
      let that = this
      // 对编辑器的操作最好在编辑器ready之后再做
      this.ue.ready(() => {
        // 禁止粘贴
        // this.ue.addListener('beforepaste', (o, html) => {
        //   html.html = ''
        //   this.$message.error('只能录入不能粘贴')
        // })
        // 选区发生改变
        this.ue.addListener('beforeSelectionChange', function () {
          let thisDom = this.selection.getStart() // 获取当前在的DOM
          if (thisDom.className === 'btn-group') {
            let sel = that.getSelectionRange() // 获取Selection Range
            sel.range.setStartAfter(sel.range.commonAncestorContainer.parentNode.parentNode)
          }
        })
        // 按键按下
        this.ue.addListener('keyup', (type, e) => {
          let thisDom = this.ue.selection.getStart() // 获取当前在的DOM
          let sel = that.getSelectionRange() // 获取Selection Range
          // 判断是否是插入DOM
          if (thisDom.className === 'btn-group') {
            if (e.keyCode === 8) { // 目前仅监听退格按钮，del按钮保持默认功能
              sel.range.commonAncestorContainer.parentNode.remove() // TODO: remove()方法目前无法使用撤销功能,节点
            } else if (e.keyCode === 37) { // 方向键左
              sel.selection.collapse(sel.range.commonAncestorContainer.parentNode.parentNode, 0)
            }
          }
          if (e.keyCode === 39 && thisDom.className === 'span1') { // 方向键右
            sel.range.setStartAfter(sel.range.commonAncestorContainer.parentNode.parentNode)
          }
        })
        // 编辑器内容修改时
        this.ue.addListener('selectionchange', () => {
          let html = this.ue.getContent() // 获取html内容
          if (html && html !== '') {
            // 去除插入标签内的空格
            let groupArr = document.getElementsByClassName('btn-group')
            for (let i = 0; i < groupArr.length; i++) {
              let groupHtml = document.getElementsByClassName('btn-group')[i].innerHTML
              document.getElementsByClassName('btn-group')[i].innerHTML = groupHtml.replace(/&nbsp;/ig, '').replace(/\s/g, '')
            }
          }
        })
      })
    },
    // 插入html到富文本框
    addUeHtml () {
      this.$nextTick(() => {
        let addDom = ''
        // let option = ''
        this.selectedOptions.push({
          label: '变量',
          value: 'data'
        })
        addDom = `<span class="addDom"><span class="span1"></span><span class="btn-group">` + '变量' + `</span><span>&nbsp;</span></span>`
        // 在当前光标位置插入html内容
        this.ue.execCommand('inserthtml', addDom)
        this.ue.focus()
      })
    },
    // 获取Selection 、 Range
    getSelectionRange () {
      let selection = null
      let range = null
      if (window.getSelection) {
        selection = window.getSelection()
        range = selection.getRangeAt(0)
      } else if (document.selection && document.selection.type !== 'Control') {  // ie9以下的支持，可不考虑
        range = document.selection.createRange()
      }
      return {
        selection: selection,
        range: range
      }
    }
  }
}
</script>
<style lang="scss">
.safety {
  // .field-item {
  //   .el-form-item__content {
  //     padding-right: 50px;
  //     position: relative;
  //   }
  //   &-del {
  //     position: absolute;
  //     right: 10px;
  //     top: 0;
  //     line-height: 36px;
  //     font-size: 26px;
  //     color: #f56c6c;
  //   }
  // }
}
.ueditor_content .el-form-item__content {
  width: 86%;
  /*padding: 15px 0 15px 0;*/
  border: 1px solid #dcdfe6;
  .el-cascader.el-cascader--medium {
    padding-left: 5px;
  }
  .ueditor-box {
    position: relative;
    width: 100% !important;
    max-height: 150px !important;
    border: none;
    border-radius: 4px;
    outline: none;
    > p:first-child {
      text-indent: 15px;
      min-height: 1em;
    }
  }
  .btn-group {
    text-indent: 0;
    display: inline-block;
    background-color: #05affc;
    color: #fff;
    border-radius: 3px;
    padding: 0px 6px;
    font-size: 15px;
    line-height: 25px;
    margin-left: 4px;
  }
  .edui-toolbar {
    display: none;
  }
  .edui-container {
    border-radius: 0 0 4px 4px;
    overflow: hidden;
    position: relative;
    width: 100% !important;
    border: 0;
    border-top: 1px solid #dcdfe6;
    box-shadow: none;
    background-color: #fff;
  }
}
.iconAdd {
  font-size: 18px;
  margin-left: 5px;
  cursor: pointer;
}
</style>
