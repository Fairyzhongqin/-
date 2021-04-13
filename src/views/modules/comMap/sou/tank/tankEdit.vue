<template>
  <div class="map-fence-edit-container">
    <el-scrollbar style="width:100%;height:100%;">
      <el-form :model="dataForm"
               :rules="dataRule"
               ref="dataForm"
               class="pr20"
               label-width="92px">
        <el-form-item label="所属区域"
                      prop="zoneName">
          <!-- <el-select @change="changeZone" size="mini" v-model="dataForm.zoneId" placeholder="请先选择所属">
            <el-option
              v-for="item in tankFieldId"
              :key="item.id"
              :label="item.zoneName"
              :value="item.id"
            ></el-option>
          </el-select>-->
          <el-popover placement="bottom"
                      width="240"
                      v-model="tankFieldPopover"
                      popper-class="tank-el-popover high"
                      trigger="click">
            <el-tree default-expand-all
                     :data="tankFieldId"
                     @node-click="changeZone"
                     :props="defaultProps"></el-tree>
            <el-input :readonly="true"
                      v-model="dataForm.zoneName"
                      size="mini"
                      slot="reference"
                      placeholder="请先选择区域"></el-input>
          </el-popover>
        </el-form-item>
        <el-form-item label="储罐编号"
                      prop="code">
          <el-input size="mini"
                    v-model="dataForm.code"
                    placeholder="储罐编号"
                    maxlength="20"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="储罐名称"
                      prop="name">
          <el-input size="mini"
                    v-model="dataForm.name"
                    placeholder="储罐名称"
                    maxlength="20"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="储罐类型"
                      prop="tankTypeId">
          <el-select size="mini"
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
                    v-model="dataForm.capacity"
                    placeholder="储罐容量"
                    maxlength="10"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="储罐材质"
                      prop="material">
          <el-input size="mini"
                    v-model="dataForm.material"
                    placeholder="储罐材质"
                    maxlength="10"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="存储物品名称"
                      prop="storageName">
          <el-input size="mini"
                    v-model="dataForm.storageName"
                    placeholder="存储物品名称"
                    maxlength="10"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="存储介质"
                      prop="tankMedium">
          <el-select size="mini"
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
                    v-model="dataForm.dangerAttr"
                    placeholder="风险属性"
                    maxlength="10"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="描述"
                      prop="describe">
          <el-input size="mini"
                    v-model="dataForm.describe"
                    placeholder="描述"
                    maxlength="10"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="位置坐标"
                      class="personArray"
                      prop="position">
          <template>
            <el-popover placement="top">
              <div>
                <el-button size="mini"
                           type="primary"
                           @click="selectPositionShow('out')">室外选点</el-button>
                <el-button type="primary"
                           size="mini"
                           @click="selectPositionShow('inside')">室内选点</el-button>
              </div>
              <el-input v-model="dataForm.position"
                        size="mini"
                        style="line-height:26px;"
                        placeholder="选择摄像头坐标"
                        :readonly="true"
                        slot="reference">
                <el-button type="warning"
                           slot="append"
                           size="mini">选取</el-button>
              </el-input>
            </el-popover>
          </template>
        </el-form-item>
      </el-form>
    </el-scrollbar>
    <div class="map-bottom-btn">
      <el-button type="warning"
                 size="mini"
                 @click="saveFence">保存</el-button>
      <!--<el-button type="primary" size="mini" v-if="dataForm.id!==''" @click="createOrUpdate">重新绘制</el-button>-->
      <el-button type="info"
                 size="mini"
                 @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import { queryZoneInfo } from '@/api/pos/region'
import { tankAdd } from '@/api/sou/equlpment'
import { storageFaciltyTypeList } from '@/api/risk/dangerStorageManage'
var typeList = []
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
      defaultProps: {
        children: 'subregion',
        label: function (data, node) {
          let zoneName = data.zoneName
          typeList.map(val => {
            if (Number(val.label) === Number(data.sourType)) {
              zoneName = data.zoneName + '  (' + val.value + ')    '
            }
          })
          return zoneName
        }
      },
      tankFieldPopover: false,
      dataForm: {
        id: '',
        code: '',  // 储罐编号
        name: '',        // 储罐名称
        capacity: '',   // 储罐容量
        shape: '',      // 储罐形状
        layout: '',  // 储罐形式
        material: '', // 储罐材质
        storageName: '', // 存储物品名称
        tankMedium: '',  // 存储物品数量
        dangerAttr: '', // 风险属性
        describe: '', // 描述
        positionX: '',
        positionY: '',
        positionZ: '',
        position: '',
        tankTypeId: '', // 储罐类型
        zoneId: '', // 区域id
        zoneName: '', // 区域名称
        floor: '', // 楼层
        buildId: '' // 建筑模型id
      },
      tankFieldId: [], // 罐区
      shapeList: [], // 储罐形状
      layoutList: [], // 储罐形式
      tankMediumList: [], // 存储介质
      tanTypeList: [], // 存储类型
      dataRule: {
        name: [
          { required: true, message: '储罐名称不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '储罐编号不能为空', trigger: 'blur' }
        ],
        capacity: [
          { required: true, message: '储罐容量不能为空', trigger: 'blur' }
        ],
        shape: [
          { required: true, message: '储罐形状不能为空', trigger: 'change' }
        ],
        layout: [
          { required: true, message: '储罐形式不能为空', trigger: 'change' }
        ],
        storageName: [
          { required: true, message: '存储物品名称不能为空', trigger: 'change' }
        ],
        tankMedium: [
          { required: true, message: '存储介质不能为空', trigger: 'change' }
        ],
        tankTypeId: [
          { required: true, message: '储罐类型不能为空', trigger: 'change' }
        ],
        zoneName: [
          { required: true, message: '所属区域不能为空', trigger: 'change' }
        ],
        position: [
          { required: true, message: '位置坐标不能为空', trigger: 'change' }
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
    init (info) {
      this.dataForm.id = info.id || 0
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.getDictList()
        this.dataForm = {
          id: info.id || '',
          code: info.code || '',  // 储罐编号
          name: info.name || '',        // 储罐名称
          capacity: info.capacity || '',   // 储罐容量
          shape: info.shape || '',      // 储罐形状
          layout: info.layout || '',  // 储罐形式
          material: info.material || '', // 储罐材质
          storageName: info.storageName || '', // 存储物品名称
          tankMedium: info.tankMedium || '',  // 存储介质
          dangerAttr: info.dangerAttr || '', // 风险属性
          describe: info.describe || '', // 描述
          positionX: info.positionX || '',
          positionY: info.positionY || '',
          positionZ: info.positionZ || '',
          zoneId: info.zoneId || '', // 区域id
          zoneName: info.zoneName || '', // 区域名称
          position: info.position || '',
          tankTypeId: info.tankTypeId || '',
          floor: info.floor || '',
          buildId: info.buildId || ''
        }
        if (info.positionX || info.positionY || info.positionZ) {
          this.dataForm.position = '(' + info.positionX + ',' + info.positionY + ',' + info.positionZ + ')'
        }
      })
    },
    // 选择所属区域
    changeZone (val) {
      this.dataForm.zoneId = val.id
      this.dataForm.zoneName = val.zoneName
      this.tankFieldPopover = false
      this.$emit('handleClick', 'view-fance', val.fencingList)
    },
    async  getDictList () { // 获取字典数据列表，系统选项
      await this.$http({
        url: this.$http.adornUrl('/spring-sysweb/sys/dict/list'),
        method: 'get',
        params: this.$http.adornParams({
          type: 'SOUR_TYPE'
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          typeList = data.page.list
          this.getDataList()
        }
      })
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
    // 获取区域
    getDataList () {
      queryZoneInfo().then(({ data }) => {
        this.tankFieldId = []
        if (data && data.code === 0) {
          this.tankFieldId = data.data.subregion
        } else {
          this.$message.error(data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
      })
    },
    selectPositionShow (type) {
      if (this.dataForm.zoneId === '') {
        this.$message.error('请先选择关联区域')
      } else {
        if (type === 'out') { // 室外
          this.$emit('handleClick', 'create-out', this.dataForm)
        } else if (type === 'inside') { // 室内
          this.$emit('handleClick', 'create-inside', this.dataForm)
        }
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
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          tankAdd(this.dataForm).then(res => {
            if (res.data && res.data.code === 0) {
              this.$message.success('操作成功')
              this.$emit('handleClick', 'clear-select')
            } else {
              this.$message.error(res.data.msg)
            }
          })
        }
      })
    }
  }
}
</script>

<style lang='scss'>
.map-fence-edit-container {
  .el-scrollbar {
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }
  .el-table .el-table__header-wrapper thead tr .is-leaf {
    background: linear-gradient(0deg, #ced1d6, #e4e7ea);
    border-bottom: 1px solid #ebeef5;
  }
}
.tank-el-popover {
  .el-tree-node__label {
    font-size: 12px;
  }
}
</style>
