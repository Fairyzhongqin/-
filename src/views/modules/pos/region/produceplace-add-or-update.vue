<template>
  <el-dialog :title="(!dataForm.id ? '新增' : '查看') + '生产场所'" :close-on-click-modal="false" :visible.sync="visible" width="50%" class="produceEdit-dialog">
    <div>
      <el-row>
        <el-col :span="24">
          <!-- 添加内容位置 -->
          <el-form :model="dataForm" ref="dataForm" class="pr20" @keyup.enter.native="dataFormSubmit()" label-width="120px">
            <el-form-item label="场所编号" prop="code">
              <el-input v-model="dataForm.code" placeholder="场所编号" :disabled="true" maxlength="20" clearable></el-input>
            </el-form-item>
            <el-form-item label="场所名称" prop="name">
              <el-input v-model="dataForm.zoneName" placeholder="场所名称" :disabled="true" maxlength="20" clearable></el-input>
            </el-form-item>
            <el-form-item label="固定资产总值/万元" prop="assets">
              <el-input v-model="dataForm.assets" placeholder="固定资产总值" maxlength="10" disabled clearable></el-input>
            </el-form-item>
            <el-form-item label="单元内危险化学品" prop="dangerThings">
              <el-input v-model="dataForm.dangerThings" placeholder="单元内危险化学品" maxlength="30" disabled clearable></el-input>
            </el-form-item>
            <el-form-item label="目标产物" prop="targetProduct">
              <el-input v-model="dataForm.targetProduct" placeholder="目标产物" maxlength="20" disabled clearable></el-input>
            </el-form-item>
            <el-form-item label="风险属性" prop="targetProduct">
              <el-input v-model="dataForm.dangerAttr" placeholder="风险属性" maxlength="20" disabled clearable></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="targetProduct">
              <el-input v-model="dataForm.describe" placeholder="描述" maxlength="20" disabled clearable></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="visible = false">关闭</el-button>
      <!-- <el-button type="primary"
                 :disabled="isDisabled"
                 @click="dataFormSubmit()">确定</el-button> -->
    </span>
  </el-dialog>
</template>

<script>
import { queryZoneByCode } from '@/api/pos/region'
export default {
  data () {
    let validateAssets = (rule, value, callback) => {
      if (!/^[0-9]\d*$/.test(value)) {
        callback(new Error('资产格式错误'))
      } else {
        callback()
      }
    }
    let validateAcreage = (rule, value, callback) => {
      if (!/^[0-9]\d*$/.test(value)) {
        callback(new Error('面积格式错误'))
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
        assets: '',
        contact: '',
        location: '',
        dangerThings: '',
        targetProduct: '',
        reactorNumber: '',
        acreage: ''
      },
      dataRule: {
        code: [{ required: true, message: '请输入场所编号', trigger: 'change' }],
        name: [{ required: true, message: '请输入场所名称', trigger: 'change' }],
        acreage: [{ validator: validateAcreage, trigger: 'blur' }],
        assets: [{ validator: validateAssets, trigger: 'blur' }]

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
      this.dataForm.id = id || 0
      console.log(id)
      this.visible = true
      this.isDisabled = false
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.isDisabled = true
          queryZoneByCode({
            'code': this.dataForm.id || undefined
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
    },
    showZoneName (tree) {
      let result = tree.map(data => {
        if (data.subregion.length > 0) {
          this.showZoneName(data.subregion)
        } else {
          this.repositoryCodeList.map(code => {
            if (data.code === code) {
              data.zoneName += '（库区）'
              data.disabled = true
            }
          })
          this.tankFieldCodeList.map(code => {
            if (data.code === code) {
              data.zoneName += '（罐区）'
              data.disabled = true
            }
          })
          this.producePlaceCodeList.map(code => {
            if (data.code === code) {
              data.zoneName += '（生产场所）'
              data.disabled = true
            }
          })
        }
        return data
      })
      return result
    },
    // 菜单树选中
    reservorListCurrentHandle (data) {
      if (data.disabled) {
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
.produceEdit-dialog {
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
