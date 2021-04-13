<template>
  <el-dialog
    title="设置"
    :close-on-click-modal="false"
    width="600px"
    :visible.sync="visible"
    class="safeClass"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="120px"
    >
      <el-form-item label="区域名称" prop="zoneName">
        <el-input
          size="mini"
          maxlength="30"
          class="size-mini-pople-input"
          v-model="dataForm.zoneName"
          :disabled="true"
          placeholder="区域名称"
          clearable
        ></el-input>
      </el-form-item>

      <el-form-item label="区域编号" prop="code">
        <el-input
          size="mini"
          maxlength="30"
          :disabled="true"
          class="size-mini-pople-input"
          v-model="dataForm.code"
          placeholder="区域编号"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="区域类型" prop="sourType">
        <el-select size="mini" v-model="dataForm.sourType" @change="changeSelect()">
          <el-option
            v-for="item in typeList"
            :key="item.label"
            :label="item.value"
            :value="item.label"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="存储化学物品名称" v-if="dataForm.sourType === '1'" prop="storageGood">
        <el-input
          size="mini"
          maxlength="30"
          class="size-mini-pople-input"
          v-model="dataForm.storageGood"
          placeholder="存储化学物品名称"
          clearable
        ></el-input>
      </el-form-item>

      <el-form-item label="装置数" v-if="dataForm.sourType === '2'" prop="deviceNum">
        <el-input
          size="mini"
          maxlength="30"
          type="number"
          class="size-mini-pople-input"
          v-model="dataForm.deviceNum"
          placeholder="装置数"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="目标产物" v-if="dataForm.sourType === '2'" prop="targetProduct">
        <el-input
          size="mini"
          maxlength="30"
          class="size-mini-pople-input"
          v-model="dataForm.targetProduct"
          placeholder="目标产物"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="单元内危险化学品" v-if="dataForm.sourType === '2'" prop="dangerThings">
        <el-input
          size="mini"
          maxlength="30"
          class="size-mini-pople-input"
          v-model="dataForm.dangerThings"
          placeholder="单元内危险化学品"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="固定资产总值/万元" v-if="dataForm.sourType === '2'" prop="assets">
        <el-input
          size="mini"
          type="number"
          maxlength="30"
          class="size-mini-pople-input"
          v-model="dataForm.assets"
          placeholder="固定资产总值/万元"
          clearable
        ></el-input>
      </el-form-item>

      <el-form-item label="储罐最小间距" v-if="dataForm.sourType === '3'" prop="spacing">
        <el-input
          size="mini"
          maxlength="30"
          class="size-mini-pople-input"
          v-model="dataForm.spacing"
          placeholder="储罐最小间距"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="防护堤数据" v-if="dataForm.sourType === '3'" prop="dyke">
        <el-input
          size="mini"
          maxlength="30"
          class="size-mini-pople-input"
          v-model="dataForm.dyke"
          placeholder="防护堤数据"
          clearable
        ></el-input>
      </el-form-item>

      <!-- <el-form-item label="储罐容量"
                    v-if="dataForm.sourType === '4'"
                    prop="tankCapacity">
        <el-input size="mini"
                  maxlength="30"
                  class="size-mini-pople-input"
                  v-model="dataForm.tankCapacity"
                  placeholder="储罐容量"
                  clearable></el-input>
      </el-form-item>
      <el-form-item label="储罐形状"
                    v-if="dataForm.sourType === '4'"
                    prop="tankShape">
        <el-input size="mini"
                  maxlength="30"
                  class="size-mini-pople-input"
                  v-model="dataForm.tankShape"
                  placeholder="储罐形状"
                  clearable></el-input>
      </el-form-item>
      <el-form-item label="储罐形式"
                    v-if="dataForm.sourType === '4'"
                    prop="tankType">
        <el-input size="mini"
                  maxlength="30"
                  class="size-mini-pople-input"
                  v-model="dataForm.tankType"
                  placeholder="储罐形式"
                  clearable></el-input>
      </el-form-item>
      <el-form-item label="储存物品名称"
                    v-if="dataForm.sourType === '4'"
                    prop="tankGood">
        <el-input size="mini"
                  maxlength="30"
                  class="size-mini-pople-input"
                  v-model="dataForm.tankGood"
                  placeholder="储存物品名称"
                  clearable></el-input>
      </el-form-item>-->

      <el-form-item label="风险属性" prop="dangerAttr" v-if="dataForm.sourType !== '9'">
        <el-input
          maxlength="60"
          size="mini"
          class="size-mini-pople-input"
          v-model="dataForm.dangerAttr"
          placeholder="风险属性"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="描述" v-if="dataForm.sourType !== '9'" prop="describe">
        <el-input
          maxlength="60"
          size="mini"
          class="size-mini-pople-input"
          v-model="dataForm.describe"
          placeholder="描述"
          clearable
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="isDisabled" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { setRegionInfo } from '@/api/sou/regionDangerManger'

export default {
  data () {
    // let validateNum = (rule, value, callback) => {
    //   if (!/^\+?[1-9]\d*$/.test(value)) {
    //     callback(new Error('数量格式错误'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      visible: false,

      typeList: [], // 危险源类型
      loading: false,
      isDisabled: false,
      dataForm: {
        sourType: '0', // 危险源类型（0-库区、1-库房、2-生产场所、3-罐区、4-储罐）
        zoneName: '', // 区域名称
        code: '', // 编码
        dangerAttr: '', // 风险属性
        describe: '', // 描述
        storageGood: '', // 库房存储物品名称
        storageNum: '', // 库房存储物品数量
        assets: '', // 固定资产总值
        dangerThings: '', // 单元内危险化学品
        targetProduct: '', // 目标产物
        deviceNum: '', // 装置数
        tankNum: '', // 储罐数
        spacing: '', // 储罐最小间距
        dyke: '', // 防护堤数据
        tankCapacity: '', // 储罐容量
        tankShape: '', // 储罐形状
        tankType: '', // 储罐形式
        tankGood: '' // 储存物品名称

      },
      dataRule: {
        // sourType: [{ required: true, message: '区域类型不能为空', trigger: 'change' }],
        // num: [
        //   { required: true, validator: validateNum, trigger: 'blur' }
        // ],
        // positionX: [
        //   { required: true, message: 'X轴坐标不能为空', trigger: 'blur' }
        // ],
        // positionY: [
        //   { required: true, message: 'Y轴坐标不能为空', trigger: 'blur' }
        // ],
        // positionZ: [{
        //   required: true, message: 'Z轴坐标不能为空', trigger: 'change'
        // }],
        // specifications: [{ required: true, message: '规格不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '类型不能为空', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getDictList()
  },
  activated () {
    this.getDictList()
  },
  methods: {
    // 获取字典表中区域类型
    getDictList () {
      this.$http({
        url: this.$http.adornUrl('/spring-sysweb/sys/dict/list'),
        method: 'get',
        params: this.$http.adornParams({
          type: 'SOUR_TYPE'
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log('===================', data)
          this.typeList = data.page.list
        }
      })
    },
    // 新增/修改
    init (info) {
      console.log(info)
      this.visible = true
      this.dataForm.id = info.id
      this.dataForm.zoneName = info.zoneName
      this.dataForm.code = info.code
      this.dataForm.sourType = info.sourType || ''
      this.dataForm.storageGood = info.storageGood
      this.dataForm.storageNum = info.storageNum
      this.dataForm.deviceNum = info.deviceNum
      this.dataForm.targetProduct = info.targetProduct
      this.dataForm.dangerThings = info.dangerThings
      this.dataForm.assets = info.assets
      this.dataForm.tankNum = info.tankNum
      this.dataForm.spacing = info.spacing
      this.dataForm.dyke = info.dyke
      this.dataForm.tankCapacity = info.tankCapacity
      this.dataForm.tankShape = info.tankShape
      this.dataForm.tankType = info.tankType
      this.dataForm.tankGood = info.tankGood
      this.dataForm.dangerAttr = info.dangerAttr
      this.dataForm.describe = info.describe
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          setRegionInfo(this.dataForm).then(({ data }) => {
            if (data && data.code === 0) {
              this.visible = false
              this.$emit('refreshDataList')
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          }).catch((err) => {
            console.log(err)
            this.$message.error('未知异常！请联系管理员')
          })
        }
      })
      this.$refs.dataForm.resetFields()
    },
    changeSelect () {
      // this.$refs.dataFrom.resetFields()

      this.dataForm.storageGood = ''
      this.dataForm.storageNum = ''
      this.dataForm.deviceNum = ''
      this.dataForm.targetProduct = ''
      this.dataForm.dangerThings = ''
      this.dataForm.assets = ''
      this.dataForm.tankNum = ''
      this.dataForm.spacing = ''
      this.dataForm.dyke = ''
      this.dataForm.tankCapacity = ''
      this.dataForm.tankShape = ''
      this.dataForm.tankType = ''
      this.dataForm.tankGood = ''
      this.dataForm.dangerAttr = ''
      this.dataForm.describe = ''
    }
  }
}
</script>
<style lang="scss">
.safeClass {
  .el-select {
    width: 100%;
    /deep/ .el-input--medium .el-input__inner {
      // height: 28px;
      // line-height: 28px;
    }
    /deep/ .el-input__prefix,
    .el-input__suffix {
      // top: 5px;
    }
  }
}
</style>
