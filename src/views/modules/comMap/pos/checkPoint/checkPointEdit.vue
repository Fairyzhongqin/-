<template>
  <div class="map-check-edit-container">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             class="pr20"
             label-width="120px">
      <el-form-item label="卡口类型"
                    prop="type">
        <el-select v-model="dataForm.type"
                   size="mini"
                   placeholder="请选择">
          <el-option v-for="item in sexListCheckpointType"
                     :key="item.value"
                     :label="item.value"
                     :value="item.lable">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="卡口名称"
                    prop="name">
        <el-input v-model="dataForm.name"
                  placeholder="卡口名称"
                  size="mini"
                  maxlength="20"
                  clearable></el-input>
      </el-form-item>
      <el-form-item label="关联围栏"
                    prop="fencingId"
                    v-if="dataForm.type==='1'">
        <el-select v-model="dataForm.fencingId"
                   size="mini"
                   placeholder="请选择关联围栏">
          <el-option v-for="item in fencIngSelectList"
                     :key="item.id"
                     :label="item.fencingName"
                     :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="卡口坐标"
                    class="personArray"
                    prop="position">
        <div @click="selectPositionShow">
          <el-input v-model="dataForm.position"
                    size="mini"
                    placeholder="选择卡口坐标"
                    :readonly="true">
            <template slot="append">
              选择
            </template></el-input>
        </div>
      </el-form-item>
      <el-form-item label="值班室人员"
                    class="personArray"
                    prop="staff">
        <div @click="selectStaffShow">
          <el-input v-model="dataForm.personName"
                    size="mini"
                    placeholder="选择人员"
                    :readonly="true">
            <template slot="append">
              选择
            </template></el-input>
        </div>
      </el-form-item>
      <el-form-item label="值班室电话"
                    prop="contact">
        <el-input v-model="dataForm.contact"
                  size="mini"
                  placeholder="值班室电话"
                  maxlength="20"
                  clearable></el-input>
      </el-form-item>
    </el-form>
    <div class="map-bottom-btn">
      <el-button type="warning"
                 size="mini"
                 @click="dataFormSubmit">保存</el-button>
      <el-button type="info"
                 size="mini"
                 @click="cancel">取消</el-button>
    </div>
    <!-- 向安保人员添加工作人员 -->
    <select-staff v-if="selectStaffVisible"
                  ref="selectStaff"
                  @selectStaffEmit='selectStaffEmit'></select-staff>
  </div>
</template>

<script>
import { checkpointAdd, checkpointInfo } from '@/api/pos/checkpoint'
import selectStaff from '@/components/select/select-staff'
import { fencingList } from '@/api/pos/region'
export default {
  props: {
    resData: {
      type: [Object, Array]
    }
  },
  data () {
    return {
      dataForm: {
        name: '',
        contact: '',
        location: '',
        cgformId: '',
        managerId: '',
        position: '',
        positionX: '',
        positionY: '',
        positionZ: '',
        type: '0',
        personIds: [],
        personName: '',
        fencingId: ''
      },
      selectStaffVisible: false,
      sexListCheckpointType: [{ value: '物理一道门', lable: '0' }, { value: '物理二道门', lable: '1' }],
      fencIngSelectList: [],
      managerId: [],
      sexListPerson: { opction: [], key: { lable: 'cgformName', value: 'cgformId' } },
      sexListPersonType: [],
      dataRule: {
        name: [{ required: true, message: '请输入卡口名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择卡口类型', trigger: 'blur' }],
        position: [{ required: true, message: '请选择卡口坐标', trigger: 'blur' }],
        fencingId: [{ required: true, message: '请选择关联围栏', trigger: 'blur' }]
      }
    }
  },
  components: { selectStaff },
  created () { },
  mounted () { },
  watch: {
    resData: {
      handler: function (val, oldval) {
        this.init(val)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 选择卡口坐标
    selectPositionShow () {
      this.$emit('handleClick', 'create', this.dataForm)
    },
    // 添加人员
    selectStaffShow () {
      this.selectStaffVisible = true
      this.$nextTick(() => {
        this.$refs.selectStaff.init(this.dataForm.personIds)
      })
    },
    // 人员组件返回值
    selectStaffEmit (val) {
      console.log(val, 'renyuan111111111')
      this.dataForm.personIds = []
      this.dataForm.personName = ''
      val.map((values, index) => {
        if (Number(index) !== Number(val.length - 1)) {
          this.dataForm.personName += values.name + ', '
          this.dataForm.personIds.push(values.gh)
        } else {
          this.dataForm.personName += values.name
          this.dataForm.personIds.push(values.gh)
        }
      })
      this.selectStaffVisible = false
    },
    init (info) {
      this.dataForm.id = info.id || 0
      this.$nextTick(() => {
        this.getFencingList()
        this.$refs['dataForm'].resetFields()
        this.dataForm.personName = ''
        this.dataForm.personIds = []
        if (this.dataForm.id && info.isGetData !== 'update') {
          checkpointInfo({
            'id': this.dataForm.id || undefined
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm = data.data
              this.dataForm.isGetData = 'update'
              if (data.data.positionX) this.dataForm.position = data.data.positionX + ',' + data.data.positionY + ',' + data.data.positionZ
              this.selectStaffEmit(this.dataForm.personList)
            } else {
              this.$message.error(data.msg)
            }
          }).catch((err) => {
            console.log(err)
            this.$message.error('未知异常！请联系管理员')
          })
        } else {
          this.dataForm = {
            id: info.id || 0,
            name: info.name || '',
            contact: info.contact || '',
            location: info.location || '',
            cgformId: info.cgformId || '',
            managerId: info.managerId || '',
            position: info.position || '',
            positionX: info.positionX || '',
            positionY: info.positionY || '',
            positionZ: info.positionZ || '',
            type: info.type || '0',
            personIds: info.personIds || [],
            personName: info.personName || ''
          }
        }
      })
    },
    async getFencingList () {
      await fencingList().then(({ data }) => {
        if (data && data.code === 0) {
          this.fencIngSelectList = data.page.list
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.visible = false
          checkpointAdd(this.dataForm).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message.success('操作成功')
              this.cancel()
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      })
    },
    cancel (val) {
      this.$emit('handleClick', 'init', val)
    }
  }
}
</script>

<style lang='scss'>
.map-check-edit-container {
}
</style>
