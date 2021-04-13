<template>
  <el-dialog :title="(!isShow ? '新增' : '查看') + '重大危险源'"
             :close-on-click-modal="false"
             :visible.sync="visible"
             width="500px"
             class="produceEdit-dialog">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             @keyup.enter.native="dataFormSubmit()"
             label-width="120px">
      <el-form-item label="危险源类型"
                    prop="type">
        <el-select v-model="dataForm.type"
                   :disabled="isShow"
                   @change="typeChangeHandle"
                   clearable>
          <el-option v-for="item in typeList"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value"
                     placeholder="请选择">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="危险源名字"
                    prop="businessId">
        <el-select v-model="dataForm.businessId"
                   :disabled="isShow"
                   @change="businessChangeHandle()"
                   clearable>
          <el-option v-for="item in businessList"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id"
                     placeholder="请选择">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="危险源级别"
                    prop="level">
        <el-select v-model="dataForm.level"
                   :disabled="isShow"
                   clearable>
          <el-option v-for="item in levelList"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value"
                     placeholder="请选择">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="具体位置"
                    prop="address">
        <el-input type="textarea"
                  :rows="2"
                  v-model="dataForm.address"
                  :disabled="isShow"
                  placeholder="具体位置"
                  size="mini"
                  maxlength="250"
                  clearable></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button @click="dataFormSubmit()"
                 type="primary"
                 :disabled="isDisabled">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { dangerSourceAddOrUpdate, dangerSourceInfo, repositoryList } from '@/api/sou/baseInfo'
import { tankList, reactorList } from '@/api/sou/equlpment'

export default {
  data () {
    return {
      visible: false,
      isDisabled: false,
      isShow: false,
      dataForm: {
        type: '', // 危险源类型
        businessId: '', // 危险源名字
        businessName: '', // 危险源名字
        level: '', // 危险源级别
        address: '' // 具体位置
      },
      businessList: [], // 关联业务表list
      typeList: [{
        value: '0',
        label: '库区'
      }, {
        value: '1',
        label: '库房'
      }, {
        value: '2',
        label: '生产场所'
      }, {
        value: '3',
        label: '罐区'
      }, {
        value: '4',
        label: '储罐'
      }, {
        value: '5',
        label: '反应装置'
      }],
      levelList: [{
        value: '0',
        label: '一级'
      }, {
        value: '1',
        label: '二级'
      }, {
        value: '2',
        label: '三级'
      }, {
        value: '3',
        label: '四级'
      }],
      dataRule: {
        type: [{ required: true, message: '危险源类型不能为空', trigger: 'change' }],
        businessName: [{ required: true, message: '关联业务名字不能为空', trigger: 'change' }],
        level: [{ required: true, message: '危险源级别不能为空', trigger: 'change' }],
        businessId: [{ required: true, message: '关联业务表id不能为空', trigger: 'change' }]
      }
    }
  },
  methods: {
    // 关联业务名字list选择
    businessChangeHandle () {
      this.businessList.map(value => {
        if (value.id === this.dataForm.businessId) {
          this.dataForm.businessName = value.name
        }
      })
    },
    // 危险源类型list选择
    typeChangeHandle () {
      this.dataForm.businessId = ''
      this.dataForm.businessName = ''
      this.typeListInfo() // 获取危险源类型信息
    },
    // 获取危险源类型信息
    typeListInfo () {
      if (this.dataForm.type === '4') { // 储罐
        tankList({
          sourType: this.dataForm.type
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.businessList = data.page.list.map(value => {
              return {
                id: value.id,
                name: value.name
              }
            })
          } else {
            this.businessList = []
          }
        }).catch((err) => {
          console.log(err)
          this.businessList = []
          this.$message.error('未知异常！请联系管理员')
        })
      } else if (this.dataForm.type === '5') { // 反应装置
        reactorList({
          sourType: this.dataForm.type
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.businessList = data.page.list.map(value => {
              return {
                id: value.id,
                name: value.name
              }
            })
          } else {
            this.businessList = []
          }
        }).catch((err) => {
          console.log(err)
          this.businessList = []
          this.$message.error('未知异常！请联系管理员')
        })
      } else {
        repositoryList({
          sourType: this.dataForm.type
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.businessList = data.page.list.map(value => {
              return {
                id: value.code,
                name: value.zoneName
              }
            })
          } else {
            this.businessList = []
          }
        }).catch((err) => {
          console.log(err)
          this.businessList = []
          this.$message.error('未知异常！请联系管理员')
        })
      }
    },
    // 新增/修改
    init (info) {
      this.visible = true
      this.isDisabled = false
      this.isShow = false
      if (info !== undefined) {
        this.$refs['dataForm'].resetFields()
        this.dataForm.businessId = info.businessId || 0
        this.dataForm.type = info.type || ''
        this.isShow = true
        this.typeListInfo() // 获取危险源类型信息
        this.$nextTick(() => {
          if (this.dataForm.businessId) {
            this.isDisabled = true
            dangerSourceInfo({
              'businessId': this.dataForm.businessId,
              'type': this.dataForm.type
            }).then(({ data }) => {
              this.isDisabled = false
              if (data && data.code === 0) {
                this.dataForm.businessName = data.data.zoneName
                this.dataForm.level = String(data.data.level)
                this.dataForm.address = data.data.address
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
      } else {
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
      }
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          dangerSourceAddOrUpdate(this.dataForm).then(({ data }) => {
            this.visible = false
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
.produceEdit-dialog {
  .el-select {
    width: 100%;
  }
}
</style>
