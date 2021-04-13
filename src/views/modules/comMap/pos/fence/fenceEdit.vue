<template>
  <div class="map-fence-edit-container">
    <el-scrollbar class="default-scrollbar" style="height:calc(100vh - 158px)" wrap-class="default-scrollbar__wrap" view-class="p20-scrollbar__view">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" class="pr20" label-width="92px">
        <el-form-item label="围栏名称" prop="fencingName">
          <el-input v-model="dataForm.fencingName" placeholder="围栏名称" :readonly="type === 'update'&&!buttonShow?true:false" maxlength="20" size="mini" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="dataForm.remarks" placeholder="备注" maxlength="600" :readonly="type === 'update'&&!buttonShow?true:false" size="mini" clearable></el-input>
        </el-form-item>
        <el-form-item label="围栏坐标" prop="remarks">
          <el-popover placement="top" width="230">
            <div>
              <el-button size="mini" type="primary" @click="fenceTypeHandle('create-out')">室外围栏</el-button>
              <el-button type="primary" size="mini" @click="fenceTypeHandle('create-inside')">室内围栏</el-button>
            </div>
            <el-button type="warning" size="mini" icon="el-icon-plus" slot="reference">{{!dataForm.point.length ? '开始绘制' : '重新绘制'}}</el-button>
          </el-popover>
        </el-form-item>
        <el-form-item label="" prop="remarks">
          <el-table :data="dataForm.point" height="300" border style="width: 100%">
            <el-table-column prop="x" :show-overflow-tooltip="true" label="X轴坐标">
            </el-table-column>
            <el-table-column prop="y" :show-overflow-tooltip="true" label="Y轴坐标">
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="围栏楼层" prop="floor" v-if="dataForm.type==='0'">
          <el-input v-model="dataForm.floor" disabled size="mini" type="number" :readonly="type === 'update'&&!buttonShow?true:false" min="0" placeholder="围栏楼层" clearable></el-input>
        </el-form-item>
        <el-form-item label="围栏高度">
          <el-row>
            <el-col :span="10">
              <el-form-item prop="minHeight">
                <el-input type="number" min='0' size="mini" class="elInputMinNumber" v-model="dataForm.minHeight" placeholder="最小高度" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" align='center'>~</el-col>
            <el-col :span="10">
              <el-form-item prop="maxHeight">
                <el-input type="number" min='0' class="elInputMinNumber" size="mini" v-model="dataForm.maxHeight" placeholder="最大高度" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-scrollbar>
    <div class="map-bottom-btn">
      <el-button type="warning" size="mini" @click="saveFence">保存</el-button>
      <!--<el-button type="primary" size="mini" v-if="dataForm.id!==''" @click="createOrUpdate">重新绘制</el-button>-->
      <el-button type="info" size="mini" @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import { fencingAddOrUpdate } from '@/api/pos/region'
export default {
  props: {
    resData: {
      type: [Object, Array]
    }
  },
  components: {},
  data () {
    return {
      type: '',
      dataForm: {
        id: '',
        fencingName: '',  // 围栏名称
        point: [],        // 围栏坐标数组
        coordinate: '',   // 围栏坐标格式(000,000)||(111,111) 最多支持20个点选择
        floor: '',        // 楼层
        buildId: '',      // 楼层标识 如cqhgc_110A_f01 (长青化工厂_110A_1楼)
        remarks: '',      // 备注
        perpetualFlag: '',
        maxHeight: '',
        minHeight: '',
        type: ''
      },
      dataRule: {
        fencingName: [
          { required: true, message: '围栏名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
  },
  mounted () { },
  computed: {},
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
    init (val) {
      if (val.point && val.point.length) {
        // this.$nextTick(() => {
        this.dataForm = {
          id: val.id || '',
          fencingName: val.fencingName || '',     // 围栏名称
          point: val.point || [],                 // 围栏坐标数组
          coordinate: val.coordinate || '',       // 围栏坐标格式(000,000)||(111,111) 最多支持20个点选择
          floor: val.floor || (val.parmas ? val.parmas.floor.toString() : 0), // 楼层
          buildId: val.buildId || '',             // 楼层标识 如cqhgc_110A_f01 (长青化工厂_110A_1楼)
          remarks: val.remarks || '',             // 备注
          perpetualFlag: val.perpetualFlag || '',
          maxHeight: val.maxHeight || (val.parmas ? val.parmas.maxH : ''),
          minHeight: val.minHeight || (val.parmas ? val.parmas.minH : ''),
          type: val.type || ''
        }
        val.point.map((r, index) => {
          if (index === 0) {
            this.dataForm.coordinate = '(' + r.x + ',' + r.y + ')'
          } else {
            this.dataForm.coordinate += '||' + '(' + r.x + ',' + r.y + ')'
          }
        })
        // })
      }
    },
    fenceTypeHandle (type) {
      this.$emit('handleClick', type, this.dataForm)
    },
    createOrUpdate (type) {
    },
    cancel () { // 取消选择
      this.$emit('handleClick', 'clear-select')
    },
    saveFence () { // 保存围栏
      fencingAddOrUpdate(this.dataForm).then(res => {
        if (res.data && res.data.code === 0) {
          this.$message.success('操作成功')
          this.$emit('handleClick', 'clear-select')
          this.$parent.$parent.$refs.fenceList.getDataList() // 操作成功后刷新列表
          this.$emit('handleClick', 'view-fence', this.dataForm)
        } else {
          this.$message.error(res.data.msg)
        }
      })
    }
  }
}
</script>

<style lang='scss'>
.map-fence-edit-container {
  .el-table .el-table__header-wrapper thead tr .is-leaf {
    background: linear-gradient(0deg, #ced1d6, #e4e7ea);
    border-bottom: 1px solid #ebeef5;
  }
}
</style>
