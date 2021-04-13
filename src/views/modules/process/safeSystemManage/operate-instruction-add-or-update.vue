<template>
  <el-dialog title="操作规程" :close-on-click-modal="false" width="600px" :visible.sync="visible" class="operate-guicheng">

    <div>

      <div class="basic-info">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
          <el-form-item label="岗位名称" prop="sysStationName">
            <el-select v-model="dataForm.sysStationName" clearable size="mini" placeholder="请选择状态">
              <el-option v-for="item in stationList" :key="item.id" :label="item.stationName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="规程名称" prop="procedureName">
            <el-input v-model="dataForm.procedureName" placeholder="请输入规程名称" clearable size="mini"></el-input>
          </el-form-item>
          <el-form-item label="操作规程" class="item-select ueditor_content">
            <!-- <el-button @click="addUeHtml" size="mini">插入变量</el-button> -->
            <div :ref="ueId" :id="ueId" class="ueditor-box" type="text/plain" style="width: 100%; height: 200px !important;">
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="isDisabled" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { stationList } from '@/api/sys/station'
import { getLabels } from '@/api/common/sys'

import { operateInfo, operateAdd } from '@/api/process/safeSystemManage'
export default {
  data () {
    return {
      visible: false,
      ue: '',
      isDisabled: false,
      ueId: `J_ueditorBox_${new Date().getTime()}`,
      dataForm: {
        sysStationName: '',
        procedureName: '',
        submitDate: '',
        id: '',
        content: ''
      },
      stateList: [],
      dataRule: {},
      stationList: []
    }
  },
  created () {
    this.getAllstationList()
    this.getState()
  },
  methods: {
    // 从字典表获取规程状态类型
    getState () {
      getLabels({
        type: 'PROCEDURES_TYPE'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.stateList = data.list
        }
      })
    },
    init (id) {
      this.visible = true
      this.isDisabled = false
      this.dataForm.id = id
      this.$nextTick(() => {
        this.getEditor()
        if (this.ue) {
          this.ue.setContent('')
        }
        this.$refs['dataForm'].resetFields()
        if (id) {
          operateInfo({ id: id }).then(({ data }) => {
            if (data && data.code === 0) {
              console.log(data)
              this.dataForm = data.data
              this.ue.setContent(data.data.content)
            }
          })
        }
      })
    },
    dataFormSubmit () {
      console.log((this.ue.getContent().replace(/<[^>]+>/g, '')).replace(/&nbsp;/g, ' '))
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.isDisabled = true
          this.dataForm.content = (this.ue.getContent().replace(/<[^>]+>/g, '')).replace(/&nbsp;/g, ' ')
          operateAdd(this.dataForm).then(({ data }) => {
            if (data && data.code === 0) {
              this.visible = false
              this.isDisabled = false
              this.$emit('refreshDataList')
            } else {
              this.visible = false
              this.isDisabled = false
              this.$message.error(data.msg)
            }
            this.dataListLoading = false
          }).catch(err => {
            this.visible = false
            this.isDisabled = false
            console.log(err)
            this.$message.error('未知异常！请联系管理员')
            this.dataListLoading = false
          })
        }
      })
    },
    // 获取所有的岗位
    getAllstationList () {
      stationList().then(({ data }) => {
        if (data && data.code === 0) {
          if (data.page.list !== null) {
            this.stationList = data.page.list
          }
          console.log(this.stationList)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
      })
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
    // addUeHtml () {
    //   this.$nextTick(() => {
    //     let addDom = ''
    //     // let option = ''
    //     this.selectedOptions.push({
    //       label: '变量',
    //       value: 'data'
    //     })
    //     addDom = `<span class="addDom"><span class="span1"></span><span class="btn-group">` + '变量' + `</span><span>&nbsp;</span></span>`
    //     // 在当前光标位置插入html内容
    //     this.ue.execCommand('inserthtml', addDom)
    //     this.ue.focus()
    //   })
    // },
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
.operate-guicheng {
  .basic-info {
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 100% !important;
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
        overflow: auto;
        position: relative;
        width: 100% !important;
        border: 0;
        border-top: 1px solid #dcdfe6;
        box-shadow: none;
        background-color: #fff;
      }
    }
  }

  .bottom-button {
    text-align: center;
  }
}
</style>