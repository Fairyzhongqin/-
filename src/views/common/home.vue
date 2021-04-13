<template>
  <div class="common-home" v-loading="dataListLoading">
    <div class="home-content">
      <!--基本信息-->
      <div class="basic-content">
        <h2>
          <span>{{dataForm.name}}</span>
          <div class="progress-content">
            <p class="progress-lab">资料完成度 : {{percentage}}%</p>
            <el-progress :stroke-width="3" :percentage="Number(percentage)" :show-text="false" color="#2C78BB" style="width:100px"></el-progress>
          </div>
          <i class="el-icon-edit-outline" @click="homeUpdateHandle"></i>
        </h2>
        <div class="basic-content-item">
          <span>法定代表人：</span>
          <span v-if="upladeAndshow" style="font-weight: normal;">{{dataForm.representative}}</span>
          <el-input v-else v-model="dataForm.representative"></el-input>
        </div>
        <div class="basic-content-item">
          <span>联系方式：</span>
          <span v-if="upladeAndshow" type="number" style="font-weight: normal;">{{dataForm.phone}}</span>
          <el-input v-else v-model="dataForm.phone"></el-input>
        </div>
      </div>
      <!--企业信息-->
      <div class="enterprise-content">
        <h3>企业信息</h3>
        <div class="enterprise-content-info">
          <table class="common-content-table" cellspacing="0" border="1" align="left">
            <tr>
              <td>营业期限</td>
              <td>
                <span v-if="upladeAndshow">{{dataForm.endDate}}</span>
                <el-input v-else v-model="dataForm.endDate"></el-input>
              </td>
              <td>统一社会信用代码</td>
              <td>
                <span v-if="upladeAndshow">{{dataForm.code}}</span>
                <el-input v-else v-model="dataForm.code"></el-input>
              </td>
            </tr>
            <tr>
              <td>邮政编码</td>
              <td>
                <span v-if="upladeAndshow">{{dataForm.emailConde}}</span>
                <el-input v-else v-model="dataForm.emailConde"></el-input>
              </td>
              <td>成立日期</td>
              <td>
                <span v-if="upladeAndshow">{{dataForm.startDate}}</span>
                <el-input v-else v-model="dataForm.startDate"></el-input>
              </td>
            </tr>
            <tr>
              <td>营业性质</td>
              <td>
                <span v-if="upladeAndshow">{{dataForm.xingzhi}}</span>
                <el-input v-else v-model="dataForm.xingzhi"></el-input>
              </td>
              <td>注册资本/万元</td>
              <td>
                <span v-if="upladeAndshow">{{dataForm.ziben}}</span>
                <el-input v-else v-model="dataForm.ziben"></el-input>
              </td>
            </tr>
            <tr>
              <td>企业规模</td>
              <td>
                <span v-if="upladeAndshow">{{dataForm.guimo}}</span>
                <el-input v-else v-model="dataForm.guimo"></el-input>
              </td>
              <td>占地面积/m2</td>
              <td>
                <span v-if="upladeAndshow">{{dataForm.zhandi}}</span>
                <el-input v-else v-model="dataForm.zhandi"></el-input>
              </td>
            </tr>
            <tr>
              <td>所属行业</td>
              <td>
                <span v-if="upladeAndshow">{{dataForm.insdustry}}</span>
                <el-input v-else v-model="dataForm.insdustry"></el-input>
              </td>
              <td>安全生产日期</td>
              <td>
                <span v-if="upladeAndshow">{{dataForm.productionDate}}</span>
                <el-input v-else v-model="dataForm.productionDate"></el-input>
              </td>
            </tr>
            <tr>
              <td>经度</td>
              <td>
                <span v-if="upladeAndshow">{{dataForm.jingdu}}</span>
                <el-input v-else v-model="dataForm.jingdu"></el-input>
              </td>
              <td>纬度</td>
              <td>
                <span v-if="upladeAndshow">{{dataForm.weidu}}</span>
                <el-input v-else v-model="dataForm.weidu"></el-input>
              </td>
            </tr>
            <tr>
              <td>周边情况</td>
              <td colspan="3">
                <span v-if="upladeAndshow">{{dataForm.zhoubian}}</span>
                <el-input v-else v-model="dataForm.zhoubian"></el-input>
              </td>
            </tr>
            <tr>
              <td>经济类型</td>
              <td colspan="3">
                <span v-if="upladeAndshow">{{dataForm.type}}</span>
                <el-input v-else v-model="dataForm.type"></el-input>
              </td>
            </tr>
            <tr>
              <td>详细地址</td>
              <td colspan="3">
                <span v-if="upladeAndshow">{{dataForm.address}}</span>
                <el-input v-else v-model="dataForm.address"></el-input>
              </td>
            </tr>
            <tr class="td-yxzz">
              <td>营业执照</td>
              <td colspan="3">
                <div v-if="upladeAndshow">
                  <img class="yxzz-img" v-if="dataForm.yxzz && dataForm.yxzz !==''" :src="dataForm.yxzz" alt="营业执照">
                  <span v-else>暂无</span>
                </div>
                <el-upload v-else accept="image/jpeg,image/jpg,image/png" class="upload-yxzz" :class="{disabled:isDisabled}" action="https://jsonplaceholder.typicode.com/posts/" list-type="picture-card" :on-change="getFile" :file-list="fileList" :on-remove="fileRemove" :auto-upload="false" :limit="1">
                  <i class="el-icon-plus"></i>
                </el-upload>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <div class="common-content">
      <div style="text-align:center;">
        <template v-if="!upladeAndshow">
          <el-button @click="homeUpdateAll" type="primary">确定</el-button>
          <el-button @click="upladeAndshow = true">取消</el-button>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import { homeInfo, homeUpdate } from '@/api/sou/home'
export default {
  data () {
    return {
      dataListLoading: false,
      upladeAndshow: true,
      isDisabled: false,
      id: '',
      dataForm: {
        name: '',
        yxzz: '',
        representative: '',
        phone: '',
        endDate: '',
        code: '',
        emailConde: '',
        productionDate: '',
        startDate: '',
        xingzhi: '',
        ziben: '',
        guimo: '',
        zhandi: '',
        insdustry: '',
        zhoubian: '',
        jingdu: '',
        weidu: '',
        type: '',
        address: ''
      },
      imgBase64: '',
      fileList: [],
      percentage: '0'
    }
  },
  mounted () {
    this.getDataList()
  },
  methods: {
    // 获取资料完整度
    getPercentage () {
      let sum = 0
      let num = 0
      for (let keys in this.dataForm) {
        if (this.dataForm[keys]) num++
        sum++
      }
      this.percentage = (num / sum * 100).toFixed(0)
    },
    // 上传文件
    getFile (file, fileList) {
      this.isDisabled = true
      if (this.beforeUpload(file)) {
        // 图片转base64
        this.getBase64(file.raw).then(res => {
          this.imgBase64 = res
          this.isDisabled = true
        })
      } else {
        this.imgBase64 = ''
        this.fileList = []
        this.isDisabled = false
      }
    },
    // 删除文件
    fileRemove () {
      this.imgBase64 = ''
      this.fileList = []
      this.isDisabled = false
    },
    // 上传文件格式大小校验
    beforeUpload (file) {
      this.isLt5k = file.size / 1024 < 500 ? '1' : '0'
      if (this.isLt5k === '0') {
        this.$message({
          message: '上传图片大小不能超过500k!',
          type: 'error'
        })
      }
      let testmsg = /^image\/(jpeg|png|jpg)$/.test(file.raw.type)
      if (!testmsg) {
        this.$message.error('上传图片只能上传jpeg/jpg/png文件!')
        this.isLt5k = '0'
      }
      return this.isLt5k === '1' ? 1 : 0
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
    // 获取基本信息
    getDataList () {
      this.dataListLoading = true
      homeInfo().then(({ data }) => {
        if (data && data.code === 0) {
          this.dataForm = {
            name: data.data.name || '',
            yxzz: data.data.yxzz || '',
            representative: data.data.representative || '',
            productionDate: data.data.productionDate || '',
            phone: data.data.phone || '',
            endDate: data.data.endDate || '',
            code: data.data.code || '',
            emailConde: data.data.emailConde || '',
            startDate: data.data.startDate || '',
            xingzhi: data.data.xingzhi || '',
            ziben: data.data.ziben || '',
            guimo: data.data.guimo || '',
            zhandi: data.data.zhandi || '',
            insdustry: data.data.insdustry || '',
            zhoubian: data.data.zhoubian || '',
            jingdu: data.data.jingdu || '',
            weidu: data.data.weidu || '',
            type: data.data.type || '',
            address: data.data.address || ''
          }
          this.fileList = [{
            name: 'yxzz.jpeg', url: this.dataForm.yxzz
          }]
          this.imgBase64 = this.dataForm.yxzz || ''
          this.dataListLoading = false
        }
        this.getPercentage() // 获取资料完整度
        this.dataListLoading = false
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
        this.dataListLoading = false
      })
    },
    homeUpdateHandle () {
      this.upladeAndshow = false
      this.fileList = []
      this.imgBase64 = this.dataForm.yxzz || ''
      if (this.dataForm.yxzz !== '') {
        this.fileList = [{
          name: 'yxzz.jpeg', url: this.dataForm.yxzz
        }]
      }
      this.isDisabled = this.imgBase64 !== ''
    },
    // 更新企业信息
    homeUpdateAll () {
      this.dataForm.yxzz = this.imgBase64
      homeUpdate(this.dataForm).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message.success('操作成功！')
          this.upladeAndshow = true
          this.getDataList()
        } else {
          this.$message.error('未知异常,请联系管理员!')
        }
      }).catch(({ error }) => {
        console.log(error)
        this.$message('未知异常,请联系管理员!')
      })
    }
  }
}
</script>
<style lang="scss">
.common-home {
  height: 100%;
  overflow-y: auto;
  padding-bottom: 30px;
  .home-content {
    padding-bottom: 10px;
    h3 {
      margin: 10px 0;
      font-size: 14px;
      font-weight: 500;
      color: rgba(34, 34, 34, 1);
    }
    .el-input__inner {
      height: 22px;
      line-height: 22px;
      font-size: 12px;
    }
    .basic-content {
      padding: 18px;
      border: 1px solid rgba(220, 223, 230, 1);
      border-radius: 4px;
      .el-input {
        width: 180px;
      }
      h2 {
        line-height: 1;
        font-size: 20px;
        margin: 0 0 18px 0;
        font-weight: bold;
        font-family: PingFang SC;
        & > span {
          float: left;
        }
      }
      .progress-content {
        margin-left: 30px;
        margin-top: 3px;
        display: inline-block;
        overflow: hidden;
        line-height: 1;
        p {
          margin: 0 0 5px 0;
        }
        .progress-lab {
          margin: 0;
          /* float: left; */
          padding-bottom: 1px;
          color: gray;
          font-size: 12px;
          font-weight: normal;
        }
      }
      .el-progress {
        float: left;
        display: inline-block;
      }
      .el-icon-edit-outline {
        cursor: pointer;
        color: gray;
        &:hover {
          color: #2c78bb;
        }
      }
      .basic-content-item {
        font-size: 14px;
        margin-bottom: 5px;
        span {
          display: inline-block;
          min-width: 74px;
          font-size: 12px;
          font-weight: bold;
        }
      }
    }
    .enterprise-content {
      &-info {
        border: 1px solid #dcdfe6;
        overflow: hidden;
        border-radius: 4px;
        .common-content {
          margin-top: 10px;
          &-header {
            background-color: #404654;
            height: 36px;
            line-height: 36px;
            color: #fff;
            font-weight: bolder;
            padding: 0 10px 0 10px;
          }
          &-table {
            width: 100%;
            font-size: 12px;
            border-collapse: collapse;
            overflow: hidden;
            background: #fff;
            border-radius: 4px;
            border-spacing: 0px;
            border: 1px solid #dcdfe6;
            td {
              line-height: 30px;
              padding: 0 15px;
              border: 1px solid #dcdfe6;
            }
            tr td:nth-child(odd) {
              background-color: #eef0f7;
              width: 200px;
              padding: 0 15px;
            }
            .td-yxzz {
              .yxzz-img {
                overflow: hidden;
                background-color: #fff;
                border-radius: 6px;
                box-sizing: border-box;
                width: 148px;
                height: 148px;
                margin: 0 8px 0 0;
                display: inline-block;
              }
              height: 170px;
              .el-upload-list--picture-card .el-upload-list__item {
                margin: 0 8px 0 0;
              }
              .el-upload--picture-card {
                transition: opacity 0.3s;
              }
              .disabled {
                .el-upload--picture-card {
                  display: none;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
