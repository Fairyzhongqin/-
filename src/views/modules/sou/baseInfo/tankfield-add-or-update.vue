<template>
  <el-dialog :title="(!dataForm.id ? '新增' : '修改') + '罐区'"
             :close-on-click-modal="false"
             :visible.sync="visible"
             width="50%"
             class="tankEdit-dialog">
    <div>
      <el-row>
        <el-col :span="24">
          <!-- 添加内容位置 -->
          <el-form :model="dataForm"
                   :rules="dataRule"
                   ref="dataForm"
                   class="pr20"
                   @keyup.enter.native="dataFormSubmit()"
                   label-width="120px">

            <el-form-item label="罐区名称"
                          prop="name">
              <!-- <div style="width: 100%;margin-top:10px">
                <el-table :data="dataList"
                          style="width: 100%;"
                          row-key="id"
                          border
                          lazy
                          v-loading="dataListLoading"
                          ref="multipleTable"
                          tooltip-effect="dark"
                          height="278px"
                          highlight-current-row
                          @current-change="reservorListCurrentHandle"
                          :tree-props="{children: 'subregion', hasChildren: 'hasChildren'}"> -->
              <!--                  <el-table-column type="selection"-->
              <!--                                   width="55">-->
              <!--                  </el-table-column>-->
              <!-- <el-table-column prop="zoneName"
                                   label="区域名称">
                  </el-table-column>
                </el-table>
              </div> -->
              <el-popover ref="reservorPopovers"
                          placement="bottom-start"
                          trigger="click">
                <el-tree :data="reservorList"
                         :props="reservorTreeProps"
                         node-key="reserorId"
                         accordion
                         ref="reservorRef"
                         :highlight-current="true"
                         @current-change='reservorListCurrentHandle'>
                </el-tree>
              </el-popover>
              <el-input v-model="dataForm.name"
                        v-popover:reservorPopovers
                        :readonly="true"
                        placeholder="罐区名称"
                        maxlength="20"
                        clearable></el-input>
            </el-form-item>
            <el-form-item label="罐区编号"
                          prop="code">
              <el-input v-model="dataForm.code"
                        :disabled="true"
                        :readonly="true"
                        placeholder="罐区编号"
                        maxlength="20"
                        clearable></el-input>
            </el-form-item>
            <!-- <el-form-item label="罐区坐标"
                          prop="location">
              <el-input v-model="dataForm.location"
                        placeholder="罐区坐标"
                        maxlength="200"
                        clearable></el-input>
            </el-form-item> -->

            <el-form-item label="风险属性"
                          prop="dangerAttr">
              <el-input v-model="dataForm.dangerAttr"
                        placeholder="风险属性"
                        maxlength="60"
                        clearable></el-input>
            </el-form-item>
            <el-form-item label="防护堤数据"
                          prop="dyke">
              <el-input v-model="dataForm.dyke"
                        placeholder="防护堤数据"
                        maxlength="30"
                        clearable></el-input>
            </el-form-item>
            <el-form-item label="占地面积/m²"
                          prop="acreage">
              <el-input v-model="dataForm.acreage"
                        placeholder="占地面积/m²"
                        maxlength="10"
                        clearable></el-input>
            </el-form-item>
            <!-- <el-form-item label="储罐数"
                          prop="acreage">
              <el-input v-model="dataForm.tankNumber"
                        placeholder="储罐数"
                        maxlength="20"
                        clearable></el-input>
            </el-form-item> -->
            <el-form-item label="储罐最小间距/m"
                          prop="spacing">
              <el-input v-model="dataForm.spacing"
                        placeholder="储罐最小间距/m"
                        maxlength="10"
                        clearable></el-input>
            </el-form-item>

          </el-form>
        </el-col>
      </el-row>
    </div>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary"
                 :disabled="isDisabled"
                 @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { tankfieldAdd, tankfieldInfo, getZoneInfo, queryRepositoryCode, queryTankFieldCode, queryProducePlaceCode } from '@/api/sou/baseInfo'
import { treeDataTranslate2 } from '@/utils'

export default {
  data () {
    let validateAcreage = (rule, value, callback) => {
      if (!/^[0-9]*$/.test(value)) {
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
    let validateSpacing = (rule, value, callback) => {
      if (!/^[0-9]*$/.test(value)) {
        callback(new Error('间距格式错误'))
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
        id: '',
        code: '',
        name: '',
        acreage: '',
        dangerAttr: '',
        tankNumber: '',
        spacing: '',
        location: '',
        dyke: ''
      },
      dataRule: {
        code: [{ required: true, message: '请输入罐区编号', trigger: 'change' }],
        name: [{ required: true, message: '请输入罐区名称', trigger: 'change' }],
        acreage: [{ validator: validateAcreage, trigger: 'blur' }], // 面积格式校验
        spacing: [{ validator: validateSpacing, trigger: 'blur' }], // 间距格式校验
        dangerAttr: [{ validator: validateDangerAttr, trigger: 'blur' }]// 风险属性校验
        // location: [{ required: true, message: '请输入罐区顶点坐标', trigger: 'blur' }]
      },
      reservorTreeProps: {
        label: 'zoneName',
        children: 'subregion'
      }, // 树形结构展示
      reservorList: [] // 树形展示的数据源

    }
  },
  methods: {
    // 新增/修改
    init (id) {
      console.log(id, '================')
      this.dataForm.id = id || 0
      this.visible = true
      this.isDisabled = false
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.getReservorList()
        if (this.dataForm.id) {
          this.isDisabled = true
          tankfieldInfo({
            'id': this.dataForm.id || undefined
          }).then(({ data }) => {
            this.isDisabled = false
            if (data && data.code === 0) {
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
      })
      // 关联范围
      this.dataList = []
      this.dataListLoading = true
      // 获取区域列表
      getZoneInfo().then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = treeDataTranslate2(data.data || [], 'id', 'parentId')
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
      queryRepositoryCode().then(({ data }) => {
        if (data && data.code === 0) {
          this.repositoryCodeList = data.list
        } else {
          this.dataList = []
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
      })
      // 获取罐区code
      queryTankFieldCode().then(({ data }) => {
        if (data && data.code === 0) {
          this.tankFieldCodeList = data.list
        } else {
          this.dataList = []
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
      })
      // 获取生产场所code
      queryProducePlaceCode().then(({ data }) => {
        if (data && data.code === 0) {
          this.producePlaceCodeList = data.list
        } else {
          this.dataList = []
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
      })
    },
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
    getReservorList () {
      getZoneInfo().then(({ data }) => {
        if (data && data.code === 0) {
          this.reservorList = this.showZoneName(data.data.subregion)
        } else {

        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 表单树选中
    reservorListCurrentHandle (data) {
      if (data.zoneName.indexOf('（') !== -1 && data.zoneName.indexOf('）') !== -1) {
        let message = '不能选择' + data.zoneName.substring(data.zoneName.indexOf('（'), data.zoneName.indexOf('）') + 1)
        this.$message.error(message)
        return
      }
      this.dataForm.code = data.code
      this.dataForm.name = data.zoneName
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.visible = false
          tankfieldAdd(this.dataForm).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message.success('操作成功')
              this.$emit('refreshDataList')
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
.tankEdit-dialog {
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
