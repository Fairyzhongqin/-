<template>
  <el-dialog :title="(!dataForm.id ? '新增' : '查看') + '库区'"
             :close-on-click-modal="false"
             :visible.sync="visible"
             width="50%"
             class="reservorEdit-dialog">
    <div>
      <el-row>
        <el-col :span="24">
          <!-- 添加内容位置 -->
          <el-form :model="dataForm"
                   ref="dataForm"
                   class="pr20"
                   @keyup.enter.native="dataFormSubmit()"
                   label-width="120px">

            <el-form-item label="仓库编号"
                          prop="code">
              <el-input v-model="dataForm.code"
                        :disabled="true"
                        :readonly="true"
                        placeholder="仓库编号"
                        size="mini"
                        maxlength="20"
                        clearable></el-input>
            </el-form-item>
            <el-form-item label="仓库名称"
                          prop="name">
              <el-input v-model="dataForm.zoneName"
                        :disabled="true"
                        :readonly="true"
                        placeholder="仓库名称"
                        size="mini"
                        maxlength="20"
                        clearable></el-input>
            </el-form-item>
            <!-- <el-form-item label="坐标"
                          prop="location">
              <el-input v-model="dataForm.location"
                        placeholder="坐标"
                        maxlength="20"
                        clearable></el-input>
            </el-form-item> -->

            <!-- <el-form-item label="存储化学品名称"
                          prop="dangerAttr">
              <el-input v-model="dataForm.storageGood"
                        placeholder="存储化学品名称"
                        size="mini"
                        maxlength="60"
                        disabled
                        clearable></el-input>
            </el-form-item> -->
            <el-form-item label="风险属性"
                          prop="dangerAttr">
              <el-input v-model="dataForm.dangerAttr"
                        placeholder="风险属性"
                        size="mini"
                        maxlength="60"
                        disabled
                        clearable></el-input>
            </el-form-item>

            <el-form-item label="描述"
                          prop="acreage">
              <el-input v-model="dataForm.remark"
                        placeholder="描述"
                        size="mini"
                        maxlength="10"
                        disabled
                        clearable></el-input>
            </el-form-item>
            <!-- <el-form-item label="库房个数"
                          prop="depositoryNumber">
              <el-input v-model="dataForm.depositoryNumber"
                        placeholder="库房个数"
                        maxlength="20"
                        clearable></el-input>
            </el-form-item> -->
          </el-form>
        </el-col>
      </el-row>
    </div>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false"
                 type="primary">关闭</el-button>
      <!-- <el-button type="primary"
                 :disabled="isDisabled"
                 @click="dataFormSubmit()">确定</el-button> -->
    </span>
  </el-dialog>
</template>

<script>
// import { repositoryAdd, repositoryInfo, getZoneInfo, queryRepositoryCode, queryTankFieldCode, queryProducePlaceCode } from '@/api/sou/baseInfo'
// import { treeDataTranslate2 } from '@/utils'
import { queryZoneByCode } from '@/api/pos/region'

export default {
  data () {
    let validateAcreage = (rule, value, callback) => {
      if (!/^[0-9]\d*$/.test(value)) {
        callback(new Error('面积格式错误'))
      } else {
        callback()
      }
    }
    let validateDangerAttr = (rule, value, callback) => {
      if (!/[\u4e00-\u9fa5]/.test(value)) {
        callback(new Error('风险属性格式错误'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      isDisabled: false,
      zoneIds: [],
      dataList: [],
      dataListLoading: false,
      repositoryCodeList: [],
      tankFieldCodeList: [],
      producePlaceCodeList: [],
      dataForm: {
        code: '',
        name: '',
        acreage: '',
        depositoryNumber: '',
        location: '',
        dangerAttr: ''
      },
      dataRule: {
        code: [{ required: true, message: '请输入库区编号', trigger: 'change' }],
        name: [{ required: true, message: '请输入库区名称', trigger: 'change' }],
        acreage: [{ validator: validateAcreage, trigger: 'blur' }],
        dangerAttr: [{ validator: validateDangerAttr, trigger: 'blur' }],
        location: [{ required: true, message: '请输入库区顶点坐标', trigger: 'blur' }]
      },

      reservorTreeProps: {
        label: 'zoneName',
        children: 'subregion'
      }, // 树形结构展示
      reservorList: [], // 树形展示的数据源
      expandArray: [] // 默认展开的级数
    }
  },
  methods: {
    // 新增/修改
    init (id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.isDisabled = false
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        // this.getReservorList()
        if (this.dataForm.id) {
          this.isDisabled = true
          // this.getRepositoryInfo()
        }
      })
      // 关联范围
      this.dataList = []
      this.dataListLoading = true
      // 获取区域列表
      queryZoneByCode().then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.data
        } else {
          this.dataList = []
        }
        this.dataListLoading = false
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
        this.dataListLoading = false
      })
      // 获取库区code
      // queryRepositoryCode().then(({ data }) => {
      //   if (data && data.code === 0) {
      //     this.repositoryCodeList = data.list
      //   } else {
      //     this.dataList = []
      //   }
      // }).catch((err) => {
      //   console.log(err)
      //   this.$message.error('未知异常！请联系管理员')
      // })
      // // 获取罐区code
      // queryTankFieldCode().then(({ data }) => {
      //   if (data && data.code === 0) {
      //     this.tankFieldCodeList = data.list
      //   } else {
      //     this.dataList = []
      //   }
      // }).catch((err) => {
      //   console.log(err)
      //   this.$message.error('未知异常！请联系管理员')
      // })
      // // 获取生产场所code
      // queryProducePlaceCode().then(({ data }) => {
      //   if (data && data.code === 0) {
      //     this.producePlaceCodeList = data.list
      //   } else {
      //     this.dataList = []
      //   }
      // }).catch((err) => {
      //   console.log(err)
      //   this.$message.error('未知异常！请联系管理员')
      // })
    },
    // 库区新增或修改
    // getRepositoryInfo () {
    //   console.log(this.dataForm.id)
    //   repositoryInfo({
    //     'id': this.dataForm.id || undefined
    //   }).then(({ data }) => {
    //     this.isDisabled = false
    //     if (data && data.code === 0) {
    //       this.dataForm = data.data
    //       console.log()
    //     } else {
    //       this.$message.error(data.msg)
    //     }
    //   }).catch((err) => {
    //     console.log(err)
    //     this.isDisabled = false
    //     this.$message.error('未知异常！请联系管理员')
    //   })
    // },
    showZoneName (tree) {
      let result = tree.map(data => {
        if (data.subregion.length > 0) {
          this.showZoneName(data.subregion)
        } else {
          this.repositoryCodeList.map(code => {
            if (data.code === code) {
              data.zoneName += '（库区）'
            }
          })
          this.tankFieldCodeList.map(code => {
            if (data.code === code) {
              data.zoneName += '（罐区）'
            }
          })
          this.producePlaceCodeList.map(code => {
            if (data.code === code) {
              data.zoneName += '（生产场所）'
            }
          })
        }
        return data
      })
      return result
    },
    // 展示全部区域类型
    // getReservorList () {
    //   getZoneInfo().then(({ data }) => {
    //     if (data && data.code === 0) {
    //       this.reservorList = this.showZoneName(data.data.subregion)
    //       // this.reservorList = []
    //       // this.reservorList.push(data.data)
    //     } else {
    //       this.$message.error(data.msg)
    //     }
    //   }).catch(err => {
    //     console.log(err)
    //   })
    // },
    // 表单提交
    // dataFormSubmit () {
    //   this.$refs['dataForm'].validate(valid => {
    //     if (valid) {
    //       this.visible = false
    //       repositoryAdd(this.dataForm).then(({ data }) => {
    //         if (data && data.code === 0) {
    //           this.$message.success('操作成功')
    //           this.$emit('refreshDataList')
    //         } else {
    //           this.$message.error(data.msg)
    //         }
    //       })
    //     }
    //   })
    // },
    // 菜单树选中
    reservorListCurrentHandle (data) {
      if (data.zoneName.indexOf('（') !== -1 && data.zoneName.indexOf('）') !== -1) {
        let message = '不能选择' + data.zoneName.substring(data.zoneName.indexOf('（'), data.zoneName.indexOf('）') + 1)
        this.$message.error(message)
        return
      }
      this.dataForm.code = data.code
      this.dataForm.name = data.zoneName
    }
  }

}
</script>
<style lang="scss">
.reservorEdit-dialog {
  .field-item {
    .el-form-item__content {
      padding-right: 50px;
      position: relative;
    }
    &-del {
      position: absolute;
      right: 10px;
      top: 0;
      line-height: 36px;
      font-size: 26px;
      color: #f56c6c;
    }
  }
  .pr20 {
    padding-right: 20px;
  }
}
</style>
<style lang="scss" scoped>
// 下拉框样式
.el-select-dropdown__item {
  padding: 0;
}
.select-right {
  margin-left: 6px;
  width: 24px;
  display: inline-block;
}
.right-img {
  height: 16px;
  width: 16px;
}
.el-icon-check {
  color: #4bd4fb;
}
.el-select-dropdown__item.selected {
  color: #606266;
  font-weight: normal;
}
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected {
  color: #606266;
}
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected::after {
  display: none;
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
}
</style>
