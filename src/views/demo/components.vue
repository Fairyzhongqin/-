<template>
  <div class="components">
    <!--日历插件-->
    <Calendar
      v-on:choseDay="clickDay"
      v-on:changeMonth="changeDate"
    ></Calendar>
    <!--打印table-->
    <el-card shadow="hover">
      <h2>打印table</h2>
      <el-button plain
                 @click="printTableHandle">点击打印table</el-button>
      <el-table :data="tableData"
                class="printTable"
                style="width: 100%">
        <el-table-column prop="date"
                         label="日期"
                         width="180"></el-table-column>
        <el-table-column prop="name"
                         label="姓名"
                         width="180"></el-table-column>
        <el-table-column prop="address"
                         label="地址"></el-table-column>
      </el-table>
    </el-card>
    <!--数字滚动效果-->
    <el-card shadow="hover">
      <h2>数字滚动效果</h2>
      <numberGrow :value="6"></numberGrow>
    </el-card>
    <!--上传图片-->
    <el-card shadow="hover">
      <h2>上传图片</h2>
      <el-image style="width: 100px; height: 100px"
                :src="url"
                :preview-src-list="srcList"></el-image>
    </el-card>
    <el-upload class="avatar-uploader"
               action="#"
               :http-request="upLoad"
               list-type="picture-card"
               :auto-upload="true"
               :show-file-list="false"
               :on-change="handlePictureCardPreview"
               :on-remove="handleRemove">
      <!--<img v-if="dialogImageUrl" :src="dialogImageUrl" class="avatar">-->
      <!--<img v-else src="~@/assets/img/staffIcon.png" class="avatar" alt="暂无图片">-->
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%"
           :src="dialogImageUrl"
           alt />
    </el-dialog>
    <el-select v-model="value"
               placeholder="请选择">
      <el-option v-for="item in options"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value"
                 class="selectOption">
        <i class="el-icon-check"></i>
        <span>{{item.label}}</span>
      </el-option>
    </el-select>
  </div>
</template>

<script>
import numberGrow from '@/components/NumberGrow'
// import printTabelCss from '@/views/demo/printTabel.css'
import Calendar from 'vue-calendar-component'
export default {
  name: 'components',
  data () {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value: '',
      dialogImageUrl: '',
      dialogVisible: false,
      url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      srcList: [
        'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
        'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'
      ],
      imgs: [
        {
          url: 'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
          title: '图片1'
        },
        {
          url: 'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg',
          title: '图片2'
        }
      ]
    }
  },
  components: {
    numberGrow, Calendar
  },
  methods: {
    clickDay (data) {
      console.log(data) // 选中某天
    },
    changeDate (data) {
      console.log(data) // 左右点击切换月份
    },
    clickToday (data) {
      console.log(data) // 跳到了本月
    },
    printTableHandle () {
      let tableToPrint = document.getElementsByClassName('printTable')[0]// 将要被打印的表格
      console.log(tableToPrint[0])

      let newWin = window.open('')// 新打开一个空窗口
      // newWin.document.write(`<html><head><title>PrintTable</title><link rel="stylesheet" type="text/css" href="${printTabelCss}"></head><body>`)
      newWin.document.write(tableToPrint.outerHTML) // 将表格添加进新的窗口
      newWin.document.write('</body></html>')

      // newWin.document.write(tableToPrint.outerHTML) // 将表格添加进新的窗口
      newWin.document.close()// 在IE浏览器中使用必须添加这一句
      newWin.focus()// 在IE浏览器中使用必须添加这一句
      newWin.print()// 打印
      newWin.close()// 关闭窗口
    },
    upLoad (file) {
      // const formData = new FormData()
      // formData.append('file', file.file)
      // console.log(file)
      // this.$http.uploadHttp('/udb/api/v1/oss/fileUpload', formData).then((res) => {
      //   console.log(res)
      //   console.log('上传成功')
      //   if (res.data.code === 0) {
      //     this.successUrl = res.data.response // 请求之后将返回的URL给修改的接口在进行一次修改请求
      //     this.headUrl = res.data.response // 请求成功之后赋给头像的URL
      //     this.$message('头像上传成功')
      //     this.$store.dispatch('person/setAvatar', this.successUrl)
      //     const obj = {
      //       headUrl: this.successUrl
      //     }
      //     this.edit(obj)
      //   // this.getAccount();
      //   } else {
      //     this.$message('头像上传失败')
      //   }
      // })
    },
    handleRemove (file, fileList) {
      // console.log(file, fileList)
    },
    handlePictureCardPreview (file) {
      if (this.beforeUpload(file)) {
        this.getBase64(file.raw).then(res => {
          this.dialogImageUrl = res
        })
      } else {
        this.dialogImageUrl = ''
      }
      this.dialogVisible = true
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
    }
  }
}
</script>

<style lang="scss" scoped>
.components {
  .el-card {
    margin-bottom: 20px;
  }
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 206px;
  display: block;
}
// 下拉框样式
.el-select-dropdown__item {
  padding: 0;
}
.el-icon-check {
  opacity: 0;
}
.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  background: -webkit-linear-gradient(
    left,
    #7fc2f3,
    #d8e8f6
  ); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(
    right,
    #7fc2f3,
    #d8e8f6
  ); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(
    right,
    #7fc2f3,
    #d8e8f6
  ); /* Firefox 3.6 - 15 */
  background: linear-gradient(to right, #7fc2f3, #d8e8f6); /* 标准的语法 */
  .el-icon-check {
    opacity: 1;
  }
}
</style>
