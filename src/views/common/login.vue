<template>
  <el-scrollbar>
    <div class="site-wrapper site-page--login">
      <video autoplay="autoplay" loop="loop" id="video" :muted="'muted'" volume="0">
        <source src="~@/assets/video/bgVideo.mp4" type="video/mp4">;
      </video>
      <div class="site-content__wrapper">
        <div class="site-content">
          <div class="login-icon-img">
            <img src="~@/assets/img/sinorock_logo.png" />
          </div>
          <div class="login-content">
            <transition name="el-fade-in">
              <div v-show="show" class="login-content-box transition-box">
                <div class="login-content-header">
                  <!-- <img src="~@/assets/img/sinorock_logo.png" /> -->
                  <p class="title-level__1">化工企业安全生产管理云平台</p>
                  <!-- <p class="title-level__2">化工行业安全生产解决方案专家</p> -->
                </div>
                <el-form :model="dataForm"
                         :rules="dataRule"
                         ref="dataForm"
                         @keyup.enter.native="dataFormSubmit()"
                         @submit.native.prevent
                         :show-message="false">
                  <el-form-item prop="username"
                                label="用户名"
                                :class="isFocus === 1 || dataForm.username?'input-text-focus':''">
                    <!-- <IconSvg name="user" class="site-sidebar__menu-icon"></IconSvg> -->
                    <el-input v-model="dataForm.username"
                              @focus="handleFocus(1)"
                              @blur="handleBlur"></el-input>
                  </el-form-item>
                  <el-form-item prop="password"
                                label="密码"
                                :class="isFocus === 2 || dataForm.password ?'input-text-focus':''">
                    <!-- <IconSvg name="psd" class="site-sidebar__menu-icon"></IconSvg> -->
                    <el-input v-model="dataForm.password"
                              type="password"
                              @focus="handleFocus(2)"
                              @blur="handleBlur"></el-input>
                  </el-form-item>
                  <!--<el-form-item prop="captcha">-->
                  <!--<el-row :gutter="20">-->
                  <!--<el-col :span="14">-->
                  <!--<el-input v-model="dataForm.captcha" placeholder="验证码">-->
                  <!--</el-input>-->
                  <!--</el-col>-->
                  <!--<el-col :span="10" class="login-captcha">-->
                  <!--<img :src="captchaPath" @click="getCaptcha()" alt="">-->
                  <!--</el-col>-->
                  <!--</el-row>-->
                  <!--</el-form-item>-->
                  <el-form-item>
                    <el-button class="login-btn-submit"
                               :disabled="loading"
                               type="primary"
                               @click="dataFormSubmit()">登录
                    </el-button>
                  </el-form-item>
                </el-form>
              </div>
            </transition>
          </div>
          <div class="login-footer">
            <p>中石科技 | Sinorock ©版权所有</p>
          </div>
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>

<script>
// import { getUUID } from '@/utils'
import { login } from '@/api/common/login'

export default {
  data () {
    return {
      dataForm: {
        username: '',
        password: '',
        uuid: '',
        captcha: ''
      },
      dataRule: {
        username: [
          { required: true, message: '帐号不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: '验证码不能为空', trigger: 'blur' }
        ]
      },
      captchaPath: '',
      loading: false,
      show: false,
      isFocus: 0
    }
  },
  created () {
    this.getCaptcha()
  },
  mounted () {
    // 获取报错cookie
    if (this.$cookie.get('msg')) {
      this.$message.error(this.$cookie.get('msg'))
      setTimeout(() => {
        this.$cookie.set('msg', undefined, 0) // 销毁报错销毁信息
      }, 500)
    }
    this.$nextTick(() => {
      this.show = true
      // const playPromise = media.play()
      // if (playPromise) {
      //   playPromise.catch(err => {
      //     console.log(err)
      //     media.play()
      //   })
      // }
      // window.onload = function () {
      //   var element = document.getElementById('video')
      //   element.muted = true
      // }
    })
  },
  methods: {
    // 提交表单
    dataFormSubmit () {
      this.loading = true
      this.$refs['dataForm'].validate((valid, errorObj) => {
        if (valid) {
          // this.$cookie.set('token', 'abcdefghijklmnopqrstuvwxyz0123456789')
          // this.$router.replace({ name: 'home' })
          login(this.dataForm).then(({ data }) => {
            if (data && data.code === 0) {
              this.$cookie.set('token', data.token)
              this.$router.replace({ name: 'personLocationBoard' })
            } else {
              // this.getCaptcha()
              this.$message.error(data.msg)
            }
            this.loading = false
          }).catch((err) => {
            console.log(err)
            this.$message.error('未知异常！请联系管理员')
            this.loading = false
          })
        } else {
          // 报错信息在头部展示
          let errorArr = Object.getOwnPropertyNames(errorObj)
          if (errorArr.length === 2) {
            this.$message.error('账号不能为空')
          } else {
            for (let key in errorObj) {
              switch (key) {
                case 'username':
                case 'password':
                  this.$message.error(errorObj[key][0].message)
                  break
                default:
                  break
              }
            }
          }
          this.loading = false
        }
      })
    },
    // 获取验证码
    getCaptcha () {
      // this.dataForm.uuid = getUUID()
      // this.captchaPath = this.$http.adornUrl(`/captcha.jpg?uuid=${this.dataForm.uuid}`)
    },
    handleFocus (type) {
      this.isFocus = type
    },
    handleBlur () {
      this.isFocus = 0
    }
  }
}
</script>

<style lang="scss">
.site-page--login #watermark {
  display: none;
}
.site-wrapper.site-page--login {
  min-width: 1280px;
  height: 100vh;
  /*position: absolute;*/
  /*top: 0;*/
  /*right: 0;*/
  /*bottom: 0;*/
  /*left: 0;*/
  // background-color: #1c1f3e;
  overflow: hidden;
  // background-image: url(~@/assets/img/login_bg.gif);
  // background-repeat: no-repeat;
  // background-position: right center;
  // background-size: 100%;
  video {
    position: fixed;
    right: 0px;
    bottom: 0px;
    min-width: 100%;
    min-height: 100%;
    height: auto;
    width: auto;
  }
  .site-content__wrapper {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 0;
    margin: 0;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: transparent;
  }
  .site-content {
    min-height: 100%;
    padding: 0;
    margin: 0 48px 0 0;

    .login-footer {
      width: 100%;
      position: absolute;
      bottom: 26px;
      text-align: center;
      p {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        font-weight: 400;
        font-stretch: normal;
        line-height: 20px;
        letter-spacing: 0px;
        color: rgba(255, 255, 255, 0.5);
        margin: 0;
        text-align: right;
        padding-left: 28px;
      }
    }
    // 右上角公司locon
    .login-icon-img {
      img {
        width: 11%;
        height: auto;
        margin-top: 30px;
        margin-bottom: 25px;
        margin-left: -20px;
        float: right;
      }
    }
  }
  .login-content {
    width: 341px;
    height: 100%;
    position: fixed;
    top: 0;
    margin-left: 20px;
    left: 0px;
    // background-color: rgba(8, 22, 47, 0.72);
    text-align: left;
    .login-content-box {
      width: 313px;
      position: absolute;
      top: 50%;
      left: 28px;
      border-radius: 10px;
      transform: translate(0, -50%);

      // 登录表单头部
      .login-content-header {
        margin-bottom: 60px;
        color: #fff;
        // img {
        //   width: 270px;
        //   margin-bottom: 25px;
        //   margin-left: -20px;
        // }
        p {
          margin: 0;
          line-height: 33px;
        }
        .title-level__1 {
          font-size: 24px;
          font-weight: 600;
        }
        .title-level__2 {
          color: rgba(255, 255, 255, 0.6);
          font-size: 18px;
          font-weight: 400;
        }
      }
      .el-form {
        padding: 0;
        background-color: transparent;
      }
      .el-form-item__content {
        position: relative;
        height: 100%;
        line-height: 45px;
        .icon-svg {
          position: absolute;
          top: 10px;
          left: 15px;
          z-index: 1;
          color: #999999;
        }
        .el-button {
          height: 100%;
          width: 133px;
          padding: 12px 42px;
          font-size: 21px;
          font-weight: 400;
          margin-top: 4px;
          span {
            line-height: 33px;
          }
        }
      }
      .el-form-item {
        margin-bottom: 62px;
        position: relative;
        // 去除label前的*
        .el-form-item__label {
          color: #8489a2;
          position: absolute;
          z-index: 0;
          // opacity: 0;
          font-size: 18px;
          line-height: 40px;
          top: 0;
          transition: all 0.5s;
          -moz-transition: all 0.5s;
          -webkit-transition: all 0.5s;
          &:before {
            content: "";
            margin-right: 0;
          }
        }
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
    // input聚焦label动画样式
    .input-text-focus {
      .el-form-item__label {
        font-size: 14px !important;
        top: -35px !important;
        z-index: 3 !important;
        opacity: 1 !important;
      }
    }
    .login-captcha {
      overflow: hidden;
      > img {
        width: 100%;
        height: 39px;
        cursor: pointer;
      }
    }
    .login-btn-submit {
      width: 100%;
      margin-top: -20px;
    }
    // .el-input--medium{
    //     border-bottom: 1px solid rgba(223, 225, 224,0.2);
    // }
    .el-input--medium .el-input__inner {
      height: 45px;
      line-height: 45px;
      font-size: 18px;
      // background: #efefef;
      /*box-shadow: inset 0px 1px 2px 0px rgba(0, 0, 0, 0.3);*/
      box-shadow: none;
      padding: 0;
      outline: none;
      border: 0;
      border-bottom: 1px solid rgba(223, 225, 224, 0.2);
      background: transparent;
      color: rgba(255, 255, 255, 0.8);
      border-radius: 0 !important;
      &:focus {
        border-color: #3ba1ff;
      }
      // 解决自动填充时的背景样式
      &:-webkit-autofill {
        -webkit-text-fill-color: #d1d2d8;
        box-shadow: 0 0 0px 1000px #1b1f3e inset !important;
        border-radius: 0;
        caret-color: #fff;
        border-bottom: 1px solid #333551;
        background-color: transparent;
        background-image: none;
        transition: background-color 50000s ease-in-out 0s;
      }
    }
    .el-button--primary {
      border: 0;
      background: linear-gradient(
        360deg,
        rgba(89, 149, 255, 1) 0%,
        rgba(45, 178, 255, 1) 100%
      );
      box-shadow: 0px 2px 3px 0px rgba(74, 158, 255, 0.4);
      border-radius: 34px;
      &:focus {
        background: linear-gradient(
          360deg,
          rgba(35, 115, 255, 1) 0%,
          rgba(13, 166, 255, 1) 100%
        );
      }
      &:hover {
        background: linear-gradient(
          360deg,
          rgba(35, 115, 255, 1) 0%,
          rgba(13, 166, 255, 1) 100%
        );
      }

      &:active {
        background: linear-gradient(
          180deg,
          rgba(35, 115, 255, 1) 0%,
          rgba(13, 166, 255, 1) 100%
        );
      }
    }
    input::-webkit-input-placeholder {
      color: #8489a2;
    }
  }
}

.site-wrapper.site-page--login
  .login-content
  .el-input--medium
  .el-input__inner:-webkit-autofill {
  box-shadow: none !important;
}
</style>
