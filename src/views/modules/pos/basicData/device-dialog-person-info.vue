<!--胸卡设备 - 人员信息-->
<template>
  <el-dialog title="人员信息"
             :close-on-click-modal="true"
             class="person-info-dialog"
             width="400px"
             :visible.sync="visible">
    <el-form :model="dataForm"
             v-loading="dataLoading"
             ref="dataForm"
             label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="人员类型:"
                        prop="cgformId">
            <span>{{dataForm.cgformId | formatCgformId(cgformIdList)}}</span>
          </el-form-item>
          <el-form-item label="姓名:"
                        prop="name">
            <span>{{dataForm.name}}</span>
          </el-form-item>
          <el-form-item label="性别:"
                        prop="sex">
            <span>{{dataForm.sex == 0 ? '男' :'女'}}</span>
          </el-form-item>
          <el-form-item label="工号:"
                        prop="gh">
            <span>{{dataForm.gh}}</span>
          </el-form-item>
          <el-form-item v-for="(item,index) in otherAttr"
                        :key="index"
                        :label="item.attributeName+':'">
            <span>{{item['otherName']}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item class="item-img"
                        prop="photo"
                        label-width="20px">
            <el-image style="width: 110px; height: 140px;border: 1px solid #DCDFE6;background: #f7f7f7;"
                      :src="dataForm.photo"
                      fit="contain"
                      :preview-src-list="srcList">
              <div slot="error"
                   class="image-slot">
                <img src="~@/assets/img/staffIcon.png"
                     alt="暂无图片">
              </div>
            </el-image>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!--dialog - 图片查看-->
    <el-dialog :visible.sync="dialogVisible"
               width="700px"
               top="3vh"
               append-to-body>
      <img width="100%"
           :src="dataForm.photo"
           alt="上传图片">
    </el-dialog>
  </el-dialog>
</template>

<script>
import { pTypeList, pGetAttrs, pGet } from '@/api/pos/person'
export default {
  data () {
    return {
      dialogVisible: false,
      visible: false,
      dataLoading: false,
      dataForm: {
        id: '',
        cgformId: '', // 人员类型
        name: '',     // 姓名
        sex: '',      // 性别
        gh: '',       // 工号
        photo: '',     // 人员照片 base64
        otherInfo: []
      },
      srcList: [],    // 人员照片list
      otherAttr: [],  // 其他补充属性
      cgformIdList: [], // 人员类型列表
      sexList: [{
        key: '0',
        value: '男'
      }, {
        key: '1',
        value: '女'
      }]
    }
  },
  created () {
    // 查询共有哪些人员类型 - 初始数据
    pTypeList().then(({ data }) => {
      if (data && data.code === 0) {
        this.cgformIdList = data.list
      }
    }).catch((err) => {
      console.log(err)
      this.$message.error('未知异常！请联系管理员')
    })
  },
  methods: {
    // 查询人员类型特有属性
    cgformChangeHandle () {
      this.otherAttr = []
      pGetAttrs({
        cgformId: this.dataForm.cgformId // 人员类型
      }).then(({ data }) => {
        if (data && data.code === 0) {
          let otherAttr = data.list
          otherAttr.map(value => {
            this.dataForm.otherInfo.map(value1 => {
              if (value1.attributeName === value.attributeName) {
                value['otherName'] = value1.otherName
              }
            })
          })
          this.otherAttr = otherAttr
        } else {
          this.$message.error(data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
      })
    },
    // 初始数据
    init (id) {
      this.dataLoading = true
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.otherAttr = []
        this.dataForm.otherInfo = []
        if (this.dataForm.id) {
          pGet({
            gh: this.dataForm.id
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.cgformId = data.info.cgformId
              this.dataForm.name = data.info.name
              this.dataForm.sex = data.info.sex
              this.dataForm.gh = data.info.gh
              this.dataForm.photo = data.info.photo
              this.srcList.push(data.info.photo)
              for (let x in data.info.otherAttr) {
                this.dataForm.otherInfo.push({
                  attributeName: x,
                  otherName: data.info.otherAttr[x]
                })
              }
              this.cgformChangeHandle() // 查询人员类型特有属性
              this.dataLoading = false
            }
          }).catch((err) => {
            console.log(err)
            this.dataLoading = false
            this.$message.error('未知异常！请联系管理员')
          })
        }
      })
    }
  },
  filters: {
    formatCgformId (value, map) {
      let optionName = ''
      map.map((val) => {
        if (value === val.cgformId) {
          optionName = val.cgformName
        }
      })
      return optionName
    }
  }
}
</script>
<style lang="scss">
.person-info-dialog {
  .el-dialog {
    .el-select {
      width: 100%;
    }
    .el-form-item {
      margin-bottom: 0;
    }
    .item-img {
      text-align: center;
      .el-upload-list {
        display: none;
      }
      .image-slot {
        width: 100%;
        height: 100%;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
