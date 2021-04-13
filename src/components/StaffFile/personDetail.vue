<!--人员详细信息-->
<template>
  <div class="personDetailStyle">
    <div class="personDetailStyle-info">
      <div class="personDetailStyle-info-avatar">
        <div v-if="!detailVisible">
          <el-upload class="avatar-uploader" action="#" :auto-upload="false" :show-file-list="false" :on-change="getFile" :before-upload="beforeUpload">
            <div v-if="dataList.photo" @click.stop class="avatar-uploader-content">
              <img :src="dataList.photo" class="avatar">
              <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-preview">
                  <i @click.stop="showImgHandle()" class="el-icon-zoom-in"></i>
                </span>
                <span v-if="dataList.photo" class="el-upload-list__item-delete">
                  <i @click.stop="delImgHandle()" class="el-icon-delete"></i>
                </span>
              </span>
            </div>
            <div v-else class="avatar-uploader-content">
              <img src="~@/assets/img/staffIcon.png" class="avatar" alt="暂无图片" />
              <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-delete">
                  <i class="el-icon-upload2"></i>
                </span>
              </span>
            </div>
          </el-upload>
        </div>
        <div v-else class="no-avator-img">
          <span>
            <img :src="dataList.photo" v-if="dataList.photo" class="avatar" />
            <img v-else src="~@/assets/img/staffIcon.png" class="avatar" alt="暂无图片" />
          </span>
        </div>
      </div>
      <div class="personDetailStyle-info-introduce">
        <div class="personDetailStyle-info-introduce-name">
          <span>{{dataList.name}}</span>
        </div>
        <div class="personDetailStyle-info-introduce-job">
          <span style="color: #2c78bb">
            <template v-if="dataList.dept">
              {{dataList.dept}}<template v-if="dataList.station">{{'-' + dataList.station}}</template>
            </template>
            <template v-else>
              -
            </template>
          </span>
        </div>
        <div class="personDetailStyle-info-introduce-state">
          <el-tag v-if="detailVisible" type="dataList.onTheJobFlag === '0' ? 'danger' : ''">{{['离职', '在职'][dataList.onTheJobFlag] || ''}}</el-tag>
          <span v-else>
            <el-radio v-model="dataList.onTheJobFlag" style="margin-right: 0" label="0">离职</el-radio>
            <el-radio v-model="dataList.onTheJobFlag" label="1">在职</el-radio>
          </span>
        </div>
      </div>
      <!-- <div class="personDetailStyle-info-line"></div> -->
      <div class="personDetailStyle-info-integrity">
        <div class="progress-content">
          <el-progress :stroke-width="6" :percentage="Number(percentage)" :show-text="false" color="#2C78BB" style="width:100px"></el-progress>
          <p class="progress-lab">资料完成度:{{percentage}}%</p>
        </div>

        <el-tooltip class="item" effect="dark" :content="percentage === 100 ?  '修改信息' : '完善信息'" placement="right-end">
          <el-button class="perfect-information" @click="updateStaffFile"><i class="el-icon-edit-outline"></i>{{percentage === 100 ? '修改信息':'完善信息'}}</el-button>
        </el-tooltip>
      </div>
      <div class="footStyles">
        <template v-if="detailVisible === false">
          <el-button @click="updateStaffInfo" type="primary" size="mini">确定</el-button>
          <el-button @click="detailVisible = true" size="mini">取消</el-button>
        </template>
      </div>
    </div>

    <div class="staff-content">
      <table class="staff-conent-table" width="100%" cellspacing="0" align="left">
        <tr>
          <td class="introduceStyle">
            性别
          </td>
          <td class="sepialWrit">
            <span v-if="detailVisible">{{['男', '女'][dataList.sex] || ''}}</span>
            <span v-else>
              <el-radio v-model="dataList.sex" label="0" disabled>男</el-radio>
              <el-radio v-model="dataList.sex" label="1" disabled>女</el-radio>
            </span>
          </td>
          <td class="introduceStyle">身份证号码</td>
          <td class="sepialWrit">
            <span v-if="detailVisible">{{dataList.idNo || '-'}}</span>
            <el-input v-else class="specialEdit" v-model="dataList.idNo"></el-input>
          </td>
        </tr>
        <tr>
          <td class="introduceStyle">年龄</td>
          <td class="sepialWrit">
            <span v-if="detailVisible">{{dataList.age || '-'}}</span>
            <el-input v-else v-model="dataList.age"></el-input>
          </td>
          <td class="introduceStyle">定位卡编号</td>
          <td class="sepialWrit">
            <span v-if="detailVisible">{{dataList.locatorCard || '-'}}</span>
            <el-input v-else class="specialEdit" v-model="dataList.locatorCard"></el-input>
          </td>
        </tr>
        <tr>
          <td class="introduceStyle">工号</td>
          <td class="sepialWrit">
            <span v-if="detailVisible" style="padding:0 1px">{{dataList.gh || '-'}}</span>
            <el-input v-else v-model="dataList.gh" disabled></el-input>
          </td>
          <td class="introduceStyle">工种</td>
          <td class="sepialWrit">
            <span v-if="detailVisible">{{dataList.workType || '-'}}</span>
            <el-input v-else class="specialEdit" v-model="dataList.workType"></el-input>
          </td>
        </tr>
        <tr>
          <td class="introduceStyle">
            部门
          </td>
          <td class="sepialWrit">
            <span v-if="detailVisible">{{dataList.dept || '-'}}</span>
            <el-input v-else class="specialEdit" v-model="dataList.dept" disabled></el-input>
          </td>

          <td class="introduceStyle">职位</td>

          <td class="sepialWrit">
            <span v-if="detailVisible">{{dataList.position || '-'}}</span>
            <el-input v-else class="specialEdit" v-model="dataList.position" disabled></el-input>
          </td>
        </tr>
        <tr>
          <td class="introduceStyle">岗位</td>
          <td class="sepialWrit">
            <span v-if="detailVisible">{{dataList.station || '-'}}</span>
            <el-input v-else class="specialEdit" v-model="dataList.station" disabled></el-input>
          </td>
          <td class="introduceStyle">
            职称
          </td>
          <td class="sepialWrit">
            <span v-if="detailVisible">{{dataList.deptType || '-'}}</span>
            <el-input v-else class="specialEdit" v-model="dataList.deptType" disabled></el-input>
          </td>
        </tr>
        <tr>
          <td class="introduceStyle">入职日期</td>
          <td class="sepialWrit">
            <span v-if="detailVisible">{{dataList.entryTime===null ? '':dataList.entryTime.split(' ')[0]}}</span>
            <el-date-picker v-else size="mini" v-model="dataList.entryTime" type="date" placeholder="选择日期" format="yyyy-MM-dd" :picker-options="pickerOptions1">
            </el-date-picker>
          </td>
          <td class="introduceStyle">
            参加工作日期
          </td>
          <td class="sepialWrit">
            <span v-if="detailVisible">{{dataList.entryTime===null ? '' :dataList.participationDate.split(' ')[0]}}</span>
            <el-date-picker v-else size="mini" v-model="dataList.participationDate" type="date" placeholder="选择日期" format="yyyy-MM-dd" :picker-options="pickerOptions1">
            </el-date-picker>
          </td>

        </tr>
        <tr>
          <td class="introduceStyle">HSE人员专业类别</td>
          <td class="sepialWrit">
            <span v-if="detailVisible">{{dataList.specialtyCategory || '-'}}</span>
            <el-input v-else class="specialEdit" v-model="dataList.specialtyCategory"></el-input>
          </td>

          <td class="introduceStyle">HSE人员专（兼）职</td>
          <td class="sepialWrit">
            <span v-if="detailVisible">{{dataList.soleDuty || '-'}}</span>
            <el-input v-else class="specialEdit" v-model="dataList.soleDuty"></el-input>
          </td>
        </tr>
        <tr>
          <td class="introduceStyle">夏季工作服尺寸</td>
          <td class="sepialWrit">
            <span v-if="detailVisible">{{dataList.summerOverallsSize || '-'}}</span>
            <el-input v-else class="specialEdit" v-model="dataList.summerOverallsSize"></el-input>
          </td>
          <td class="introduceStyle">春/秋季工作服尺寸</td>
          <td class="sepialWrit">
            <span v-if="detailVisible">{{dataList.changeOverallsSize || '-'}}</span>
            <el-input v-else class="specialEdit" v-model="dataList.changeOverallsSize"></el-input>
          </td>
        </tr>
        <tr>
          <td class="introduceStyle">冬季工作服尺寸</td>
          <td class="sepialWrit">
            <span v-if="detailVisible">{{dataList.winterOverallsSize || '-'}}</span>
            <el-input v-else class="specialEdit" v-model="dataList.winterOverallsSize"></el-input>
          </td>
          <td class="introduceStyle">工作鞋尺寸</td>
          <td class="sepialWrit">
            <span v-if="detailVisible">{{dataList.footWare || '-'}}</span>
            <el-input v-else class="specialEdit" v-model="dataList.footWare"></el-input>
          </td>
        </tr>
        <tr>
          <td class="introduceStyle">既往病史</td>
          <td colspan="3">
            <span v-if="detailVisible">{{dataList.anamnesis || '-'}}</span>
            <el-input v-else class="specialEdit" v-model="dataList.anamnesis"></el-input>
          </td>
        </tr>
        <tr>
          <td class="introduceStyle">岗位说明书</td>
          <td colspan="3">
            <span v-if="detailVisible">{{dataList.stationDescription || '-'}}</span>
            <el-input v-else type="textarea" class="specialEdit" v-model="dataList.stationDescription" disabled></el-input>
          </td>
        </tr>

        <!--<tr>-->
        <!--<td class="introduceStyle">单位类型</td>-->
        <!--<td class="sepialWrit">-->
        <!--<span v-if="detailVisible">{{dataList.deptType}}</span>-->
        <!--<el-input v-else-->
        <!--class="specialEdit"-->
        <!--v-model="dataList.deptType"></el-input>-->
        <!--</td>-->
        <!--</tr>-->
        <!--<tr>-->
        <!--<td class="introduceStyle">换季工作服尺寸</td>-->
        <!--<td class="sepialWrit">-->
        <!--<span v-if="detailVisible">{{dataList.changeOverallsSize}}</span>-->
        <!--<el-input v-else-->
        <!--class="specialEdit"-->
        <!--v-model="dataList.changeOverallsSize"></el-input>-->
        <!--</td>-->
        <!--</tr>-->
        <!--<tr>-->
        <!--<td class="introduceStyleCerificate">证书备案</td>-->
        <!--<td colspan="4"-->
        <!--class="introduceStyleCerificate">-->
        <!--<span @mouseover="() => { if(!detailVisible) iconindex = index}"-->
        <!--@mouseleave="iconindex = -1"-->
        <!--v-for="(item,index) in dataList.certList "-->
        <!--:key="index"-->
        <!--class="parent"> <img :src="item"-->
        <!--alt=""-->
        <!--class="certificateImg">-->
        <!--<i class="el-icon-zoom-in sonIconfirst"-->
        <!--v-if='iconindex === index'-->
        <!--@click="!detailVisible?showcertificateImgHandle(index):null"></i>-->
        <!--<i class="el-icon-delete sonIcon"-->
        <!--v-if='iconindex === index'-->
        <!--@click="!detailVisible?delImg(index):null"></i>-->
        <!--</span>-->

        <!--<el-upload v-if="!detailVisible"-->
        <!--action="#"-->
        <!--:auto-upload="false"-->
        <!--list-type="picture-card"-->
        <!--:on-remove="handleRemove"-->
        <!--:on-change="getFileCertificate"-->
        <!--:before-upload="beforeUpload">-->
        <!--<i class="el-icon-plus"></i>-->

        <!--</el-upload>-->
        <!--</td>-->
        <!--</tr>-->

      </table>

      <!--dialog - 图片查看用户头像 -->
      <el-dialog :visible.sync="dialogVisible" width="200px" class="imgDialogStyle" append-to-body v-dialogDrag>
        <img width="100%" :src="dataList.photo" alt="上传图片">
      </el-dialog>
      <!-- 查看证书  -->
      <el-dialog :visible.sync="certificateVisible" width="300px" class="imgDialogStyle" append-to-body v-dialogDrag>
        <img width="100%" :src="dataList.dialogImageUrl" alt="">
      </el-dialog>
    </div>

  </div>
</template>
<script>
// eslint-disable-next-line no-unused-vars
import { pTypeList, pAddOrUpdate, pGetAttrs, pGet } from '@/api/pos/person'
import { staffFileInfo, perfectStaffInfo } from '@/api/pos/staffFile'
import { cardID } from '@/utils/validate'
export default {
  props: {
    staffInfo: {
      type: [Object, String]
    }
  },
  data () {
    var idCard = (rule, value, callback) => {
      // 如果通过该验证，说明身份证格式正确，但准确性还需计算
      if (cardID(value)) {
        if (Number(value.length) === 18) {
          var idCardWi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2] // 将前17位加权因子保存在数组里
          var idCardY = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2] // 这是除以11后，可能产生的11位余数、验证码，也保存成数组
          var idCardWiSum = 0 // 用来保存前17位各自乖以加权因子后的总和
          for (var i = 0; i < 17; i++) {
            idCardWiSum += value.substring(i, i + 1) * idCardWi[i]
          }
          var idCardMod = idCardWiSum % 11 // 计算出校验码所在数组的位置
          var idCardLast = value.substring(17) // 得到最后一位身份证号码
          // 如果等于2，则说明校验码是10，身份证号码最后一位应该是X
          if (Number(idCardMod) === 2) {
            if (String(idCardLast) === 'X' || String(idCardLast) === 'x') {
              callback()
              // alert("恭喜通过验证啦！");
            } else {
              callback(new Error('身份证号码错误！'))
            }
          } else {
            // 用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
            if (Number(idCardLast) === Number(idCardY[idCardMod])) {
              // alert("恭喜通过验证啦！");
              callback()
            } else {
              callback(new Error('身份证号码错误！'))
            }
          }
        }
        // callback(new Error('身份证号码格式不正确！11'))
      } else {
        callback(new Error('身份证号码格式不正确！'))
      }
    }
    return {
      iconindex: -1,
      dialogVisible: false,
      percentage: 0,
      url: 'www.baid.com',
      detailVisible: true,
      certificateVisible: false,
      CerticificateImageUrl: '',
      dataList: {
        dialogImageUrl: '',
        age: '',
        dept: '',
        deptType: '',
        entryTime: '',
        footWare: '',
        gh: '',
        idNo: '',
        locatorCard: '',
        name: '',
        onTheJobFlag: '',
        participationDate: '',
        photo: '',
        position: '',
        sex: '',
        soleDuty: '',
        specialtyCategory: '',
        station: '',
        stationDescription: '',
        summerOverallsSize: '',
        changeOverallsSize: '', // 春秋工作服尺寸
        winterOverallsSize: '', // 冬季工作服尺寸
        anamnesis: '', // 既往病史
        workType: '',
        maintainFlag: '1'// 已维护
      },
      dataFormat: {
        dept: '', // 部门
        age: '', // 年龄
        deptType: '', // 职称
        entryTime: '', // 入职时间
        footWare: '', // 工作鞋
        gh: '', // 工号
        idNo: '', // 身份证号
        locatorCard: '', // 定位卡编号
        name: '', // 名称
        onTheJobFlag: '', // 在职情况
        participationDate: '', // 参加工作时间
        photo: '', // 照片
        position: '', // 职位
        sex: '', // 性别
        soleDuty: '', // 专职兼职
        specialtyCategory: '', // 证书类别
        station: '', // 岗位
        stationDescription: '', // 岗位说明书
        summerOverallsSize: '', // 夏季工作服尺寸
        changeOverallsSize: '', // 春秋工作服尺寸
        winterOverallsSize: '', // 冬季工作服尺寸
        anamnesis: '', // 既往病史
        workType: '' // 工种
      },
      displayCertificate: '',
      imgDisabled: false,
      pickerOptions1: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      dataRule: {
        idNo: [{ required: true, validator: idCard, trigger: 'blur' }]
      }
    }
  },
  activated () {

  },
  created () {

  },
  methods: {
    delImg (index) {
      this.dataList.certList.splice(index, 1)
    },
    showcertificateImgHandle (index) {
      this.certificateVisible = true
      this.dataList.dialogImageUrl = this.dataList.certList[index]
    },
    // 获取初始人员信息
    init (info) {
      console.log(this.staffInfo)
      this.detailVisible = true
      this.percentage = 0
      staffFileInfo({
        gh: info.gh
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.info
          this.dataList.maintainFlag = '1'
          this.getPercentage()
          // console.log(this.dataList.entryTime, '-----', this.dataList.entryTime.substring(0, 10))
          this.dataList.entryTime = this.dataList.entryTime ? this.dataList.entryTime.substring(0, 10) : ''
          this.dataList.participationDate = this.dataList.participationDate ? this.dataList.participationDate.substring(0, 10) : ''
        }
      })
    },
    // 获取资料完整度
    // getPercentage () {
    //   let sum = 0
    //   let num = 0
    //   console.info(this.dataFormat, this.dataList)
    //   for (let keys in this.dataFormat) {
    //     if (this.dataList[keys]) {
    //       num++
    //     }
    //     sum++
    //   }
    //   if (this.dataList.certList.length) {
    //     num++
    //   }
    //   // this.certList
    //   this.percentage = Number((num / sum * 100).toFixed(0))
    //   console.log(num, sum, this.percentage)
    // },
    // 获取资料完善度
    getPercentage () {
      let sum = 0
      let num = 0
      for (let key in this.dataFormat) {
        if (this.dataList[key]) {
          num++
        }
        sum++
      }
      // this.certList
      this.percentage = Number((num / sum * 100).toFixed(0))
      console.log(num, sum, this.percentage)
    },
    updateStaffFile () {
      this.detailVisible = false
      this.getPercentage()
    },
    // 查看上传图片
    showImgHandle () {
      this.dialogVisible = true
    },
    // 删除上传图片
    delImgHandle () {
      this.dataList.photo = ''
      this.srcList = []
    },
    // 文件状态改变时的钩子
    getFile (file) {
      if (this.beforeUpload(file)) {
        this.getBase64(file.raw).then(res => {
          this.$set(this.dataList, 'photo', res)
        })
      } else {
        this.dataList.photo = ''
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
    },
    // 文件列表移除文件时的钩子
    handleRemove (file, fileList) {
      // this.isDisabled = false
      console.log('移除图片', file)
    },
    // 预览图片
    // handlePictureCardPreview (file) {
    //   this.dataList.dialogImageUrl = this.dataList.imgInfo
    //   this.certificateVisible = true
    // },
    // 证书状态改变
    getFileCertificate (file) {
      if (this.beforeUpload(file)) {
        this.getBase64(file.raw).then(res => {
          this.dataList.imgInfo = res
          this.dataList.certList.push(res)
        })
      }
    },
    // 保存修改的人员信息
    updateStaffInfo () {
      this.dataList.entryTime = this.dataList.entryTime ? new Date(this.dataList.entryTime).Format('yyyy-MM-dd hh:mm:ss') : ''
      this.dataList.participationDate = this.dataList.participationDate ? new Date(this.dataList.participationDate).Format('yyyy-MM-dd hh:mm:ss') : ''
      perfectStaffInfo(this.dataList).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message.success('操作成功!')
          this.getPercentage()
          this.detailVisible = true
          this.$emit('refreshDataList')
        } else {
          this.$message.error('未知异常,请联系管理员!')
        }
      }).catch(({ error }) => {
        console.log(error)
        this.$message('未知异常,请联系管理员!')
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
    }
  },
  filters: {

  }
}
</script>
<style lang="scss">
.personDetailStyle {
  display: flex;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  /*左边信息部分*/
  .personDetailStyle-info {
    position: relative;
    /*width: 150px;*/
    justify-content: center;
    .personDetailStyle-info-avatar {
      width: 100%;
      text-align: center;
      .avatar-uploader {
        width: 88px;
        height: 88px;
        border-radius: 50%;
        border: 1px solid #dcdfe6;
        overflow: hidden;
        margin: 16px auto 0;
        .el-upload {
          /*border: 1px dashed #d9d9d9;*/
          // border-radius: 6px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .avatar {
          width: 100%;
          height: 100%;
          display: block;
        }
        &-content {
          height: 88px;
          .el-upload-list__item-actions {
            /*line-height: 206px;*/
            position: absolute;
            width: 100%;
            /*height: 100%;*/
            left: 0;
            top: 0;
            cursor: default;
            text-align: center;
            line-height: 88px;
            color: #fff;
            opacity: 0;
            font-size: 20px;
            background-color: rgba(0, 0, 0, 0.5);
            transition: opacity 0.3s;
            span {
              /*line-height: 36px;*/
              cursor: pointer;
              display: inline-block;
              & + span {
                margin-left: 15px;
              }
            }
            .el-upload-list__item-delete {
              position: static;
              font-size: inherit;
              color: inherit;
            }
            &:hover {
              opacity: 1;
            }
          }
        }
      }
      .no-avator-img {
        width: 88px;
        height: 88px;
        margin: 16px auto 0;
        /*line-height: 180px;*/
        border-radius: 50%;
        border: 1px solid #dcdfe6;
        overflow: hidden;
        span {
          display: block;
          height: 88px;
          img.avatar {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    .personDetailStyle-info-introduce {
      text-align: center;
      &-name {
        margin-top: 8px;
        margin-bottom: 8px;
        span {
          color: #222222;
          font-size: 16px;
          font-family: PingFang SC;
          font-weight: bold;
        }
      }
      &-job {
        span {
          color: #2c78bb;
          font-size: 12px;
          font-family: PingFang SC;
        }
      }
      &-state {
        margin-top: 10px;
        margin-bottom: 10px;
      }
    }
    .personDetailStyle-info-line {
      width: 110px;
      height: 1px;
      border: 1px solid #dcdfe6;
      margin: 10px auto;
    }
    .personDetailStyle-info-integrity {
      display: inline-block;
      text-align: center;
      .progress-content {
        margin-top: 5px;
        display: inline-block;
        .progress-lab {
          margin: 0;
          /* float: left; */
          padding-bottom: 1px;
          color: #222222;
          font-family: PingFang SC;
          font-size: 12px;
          font-weight: normal;
          vertical-align: bottom;
        }
      }
      /*.el-icon-edit-outline {*/
      /*font-size: 19px;*/
      /*cursor: pointer;*/
      /*color: gray;*/
      /*&:hover {*/
      /*color: #2c78bb;*/
      /*}*/
      /*}*/
      .perfect-information {
        width: 80px;
        height: 28px;
        background: #2c78bb;
        box-shadow: 0px -1px 0px 0px rgba(0, 0, 0, 0.2);
        border-radius: 4px;
        padding: 0;
        color: #ffffff;
        text-align: center;
        font-family: PingFang SC;
        font-size: 12px;
        line-height: 28px;
        margin-top: 13px;
        i {
          color: #ffffff;
        }
      }
    }
    // 确认 取消按钮
    .footStyles {
      position: absolute;
      left: 22px;
      bottom: 20px;
    }
  }
  /*表格部分样式*/
  .staff-content {
    width: 100%;
    .staff-conent-table {
      border-collapse: collapse;
      tr {
        height: 34px;
        line-height: 34px;
        .introduceStyle {
          width: 130px;
          background-color: #eef0f7;
          padding-left: 8px;
        }
        .sepialWrit {
          width: 205px;
        }
        td {
          /*width: calc((100% - 260px ) / 2);*/
          width: 205px;
          border: 1px dashed #dcdfe6;
          color: #222222;
          font-size: 12px;
          font-family: PingFang SC;
          padding-left: 16px;
          .el-input {
            width: 100%;
          }
        }
      }
    }
    /*查看大图*/
    .imgDialogStyle {
      .el-dialog {
        .el-dialog__body {
          height: 100%;
        }
      }
    }
  }
}
</style>
