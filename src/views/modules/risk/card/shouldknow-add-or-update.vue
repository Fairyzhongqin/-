<template>
  <el-dialog :title="(!dataForm.id ? '新增' : '编辑') + '应知卡内容'" :visible.sync="visible" width="600px" height="500px" class="showKnow-dialog">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm">
      <quill-editor v-model="dataForm.content" :options="custom" ref="myQuillEditor"></quill-editor>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible= false">取 消</el-button>
      <el-button type="primary" @click="dataFormSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { shouldknowInfo, shouldknowAddOrUpdate } from '@/api/risk/card'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
export default {
  components: {
    quillEditor
  },
  data () {
    return {
      dataForm: {
        content: '',
        code: ''
      },
      visible: false,
      dataRule: {
        content: [{ required: true, message: '请输入承诺卡内容', trigger: 'blur' }]
      },
      custom: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],    // 加粗，斜体，下划线，删除线
            ['blockquote', 'code-block'],     // 引用，代码块

            [{ 'header': 1 }, { 'header': 2 }],        // 标题，键值对的形式；1、2表示字体大小
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],     // 列表
            [{ 'script': 'sub' }, { 'script': 'super' }],   // 上下标
            [{ 'indent': '-1' }, { 'indent': '+1' }],     // 缩进
            [{ 'direction': 'rtl' }],             // 文本方向

            [{ 'size': ['small', false, 'large', 'huge'] }], // 字体大小
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],     // 几级标题

            [{ 'color': [] }, { 'background': [] }],     // 字体颜色，字体背景颜色
            [{ 'font': [] }],     // 字体
            [{ 'align': [] }],    // 对齐方式

            ['clean']    // 清除字体样式
            // ['image', 'video']    // 上传图片、上传视频

          ]
        },
        placeholder: '请输入承诺卡内容',
        theme: 'snow'
      }
    }
  },
  methods: {
    // 新增/修改
    init (id, code) {
      this.dataForm.id = id || ''
      this.visible = true
      this.isDisabled = false
      this.dataForm.content = ''
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.dataForm.code = code
        if (id) {
          this.selectInfo(id)
        }
      })
    },
    // 查询单个处置卡信息
    selectInfo (id) {
      shouldknowInfo({ 'id': id }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataForm = data.data
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          shouldknowAddOrUpdate(
            this.dataForm
          ).then(({ data }) => {
            if (data && data.code === 0) {
              this.visible = false
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
    }
  }
}
</script>
<style lang="scss">
.showKnow-dialog {
  .ql-editor {
    height: 150px;
  }
}
</style>