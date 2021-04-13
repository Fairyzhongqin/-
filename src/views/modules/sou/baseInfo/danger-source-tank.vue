<template>
  <el-dialog title="查看储罐"
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
                   @keyup.enter.native="dataFormSubmit()"
                   label-width="120px">
            <el-form-item label="所属区域"
                          prop="zoneName">
              <el-input disabled
                        v-model="dataForm.zoneName"
                        size="mini"
                        placeholder="请先选择区域"></el-input>
            </el-form-item>
            <el-form-item label="储罐编号"
                          prop="code">
              <el-input size="mini"
                        disabled
                        v-model="dataForm.code"
                        placeholder="储罐编号"
                        maxlength="20"
                        clearable></el-input>
            </el-form-item>
            <el-form-item label="储罐名称"
                          prop="name">
              <el-input size="mini"
                        v-model="dataForm.name"
                        disabled
                        placeholder="储罐名称"
                        maxlength="20"
                        clearable></el-input>
            </el-form-item>
            <el-form-item label="储罐类型"
                          prop="tankTypeId">
              <el-select size="mini"
                         disabled
                         v-model="dataForm.tankTypeId"
                         placeholder="请选择储罐类型">
                <el-option v-for="item in tanTypeList"
                           :key="item.id"
                           :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="储罐形状"
                          prop="shape">
              <el-select size="mini"
                         disabled
                         v-model="dataForm.shape"
                         placeholder="请选择储罐形状">
                <el-option v-for="item in shapeList"
                           :key="item.id"
                           :label="item.value"
                           :value="item.sort"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="储罐形式"
                          prop="layout">
              <el-select size="mini"
                         disabled
                         v-model="dataForm.layout"
                         placeholder="请选择储罐形式">
                <el-option v-for="item in layoutList"
                           :key="item.id"
                           :label="item.value"
                           :value="item.sort"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="储罐容量"
                          prop="capacity">
              <el-input size="mini"
                        disabled
                        v-model="dataForm.capacity"
                        placeholder="储罐容量"
                        maxlength="10"
                        clearable></el-input>
            </el-form-item>
            <el-form-item label="储罐材质"
                          prop="material">
              <el-input size="mini"
                        disabled
                        v-model="dataForm.material"
                        placeholder="储罐材质"
                        maxlength="10"
                        clearable></el-input>
            </el-form-item>
            <el-form-item label="存储物品名称"
                          prop="storageName">
              <el-input size="mini"
                        disabled
                        v-model="dataForm.storageName"
                        placeholder="存储物品名称"
                        maxlength="10"
                        clearable></el-input>
            </el-form-item>
            <el-form-item label="存储介质"
                          prop="tankMedium">
              <el-select size="mini"
                         disabled
                         v-model="dataForm.tankMedium"
                         placeholder="请选择存储介质">
                <el-option v-for="item in tankMediumList"
                           :key="item.id"
                           :label="item.value"
                           :value="item.label"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="风险属性"
                          prop="dangerAttr">
              <el-input size="mini"
                        disabled
                        v-model="dataForm.dangerAttr"
                        placeholder="风险属性"
                        maxlength="10"
                        clearable></el-input>
            </el-form-item>
            <el-form-item label="描述"
                          prop="describe">
              <el-input size="mini"
                        disabled
                        v-model="dataForm.describe"
                        placeholder="描述"
                        maxlength="10"
                        clearable></el-input>
            </el-form-item>
            <el-form-item label="位置坐标"
                          prop="location">
              <el-input v-model="dataForm.location"
                        disabled
                        placeholder="地理位置坐标"
                        maxlength="1000"
                        clearable></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <span slot="footer"
          class="dialog-footer">
      <el-button type="primary"
                 @click="visible = false">关闭</el-button>
      <el-button type="primary"
                 v-if="!isDisabled"
                 :disabled="isDisabled"
                 @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { tankAdd, tankInfo, allTankId } from '@/api/sou/equlpment'
import { storageFaciltyTypeList } from '@/api/risk/dangerStorageManage'
export default {
  data () {
    return {
      visible: false,
      isDisabled: false,
      tankFieldId: '', // 罐区id列表
      dataForm: {
        id: '',
        code: '',
        name: '',
        capacity: '',
        location: '',
        remarks: '',
        tankField: {
          id: ''
        },
        tankId: ''// 所有库区id
      },
      shapeList: [], // 储罐形状
      layoutList: [], // 储罐形式
      tankMediumList: [], // 存储介质
      tanTypeList: [] // 存储类型
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
        this.getDictList()
        if (this.dataForm.id) {
          this.isDisabled = true
          tankInfo({
            'id': this.dataForm.id || undefined
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm = data.data
              if (data.data.tankField) this.dataForm.tankId = data.data.tankField.id || ''
              console.log(data.data)
            } else {
              this.$message.error(data.msg)
            }
          }).catch((err) => {
            console.log(err)
            this.$message.error('未知异常！请联系管理员')
          })
        }
      })
    },
    async  getDictList () { // 获取字典数据列表，系统选项
      await this.$http({
        url: this.$http.adornUrl('/spring-sysweb/sys/dict/getLabels'),
        method: 'get',
        params: this.$http.adornParams({
          'type': 'tank_shape_type'
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.shapeList = data.list
        }
      })
      await this.$http({
        url: this.$http.adornUrl('/spring-sysweb/sys/dict/getLabels'),
        method: 'get',
        params: this.$http.adornParams({
          'type': 'tank_layout_type'
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.layoutList = data.list
        }
      })
      await this.$http({
        url: this.$http.adornUrl('/spring-sysweb/sys/dict/getLabels'),
        method: 'get',
        params: this.$http.adornParams({
          'type': 'DANGER_MATERIAL_TYPE'
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.tankMediumList = data.list
        }
      })
      await storageFaciltyTypeList().then(({ data }) => {
        console.log(data, '================')
        if (data && data.code === 0) {
          this.tanTypeList = data.page.list
        }
      })
    },
    // 查询所有罐区Id
    getAllTankId () {
      allTankId().then(({ data }) => {
        if (data && data.code === 0) {
          this.tankFieldId = data.list
        } else {
          this.tankFieldId = []
        }
      }).catch(err => {
        console.log(err)
        this.$message.err('未知异常！请联系管理员')
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.visible = false
          this.dataForm.tankField.id = this.dataForm.tankId
          tankAdd(this.dataForm).then(({ data }) => {
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
  .el-select {
    width: 100%;
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
