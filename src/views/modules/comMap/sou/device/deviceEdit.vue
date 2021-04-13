<template>
  <div class="map-fence-edit-container">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" class="pr20" label-width="102px">
      <el-form-item label="所属区域" prop="zoneName">
        <!-- <el-select @change="changeZone" size="mini" v-model="dataForm.zoneId" placeholder="请先选择所属">
          <el-option
            v-for="item in tankFieldId"
            :key="item.id"
            :label="item.zoneName"
            :value="item.id"
          ></el-option>
        </el-select>-->
        <el-popover placement="bottom" width="240" v-model="tankFieldPopover" popper-class="tank-el-popover high" trigger="click">
          <el-tree default-expand-all :data="tankFieldId" @node-click="changeZone" :props="defaultProps"></el-tree>
          <el-input :readonly="true" v-model="dataForm.zoneName" size="mini" slot="reference" placeholder="请先选择区域"></el-input>
        </el-popover>
      </el-form-item>
      <el-form-item label="反应装置编号" prop="code">
        <el-input size="mini" v-model="dataForm.code" placeholder="反应装置编号" maxlength="20" clearable></el-input>
      </el-form-item>
      <el-form-item label="反应装置名称" prop="name">
        <el-input size="mini" v-model="dataForm.name" placeholder="反应装置名称" maxlength="20" clearable></el-input>
      </el-form-item>

      <!-- <el-form-item label="涉及危险化学品"
                    prop="chemical">
        <el-input size="mini"
                  v-model="dataForm.chemical"
                  placeholder="涉及危险化学品"
                  maxlength="60"
                  clearable></el-input>
      </el-form-item>
      <el-form-item label="涉及高危工艺"
                    prop="technology">
        <el-input size="mini"
                  v-model="dataForm.technology"
                  placeholder="涉及高危工艺"
                  maxlength="60"
                  clearable></el-input>
      </el-form-item> -->
      <el-form-item label="位置坐标" class="personArray" prop="position">
        <template>
          <el-popover placement="top">
            <div>
              <el-button size="mini" type="primary" @click="selectPositionShow('out')">室外选点</el-button>
              <el-button type="primary" size="mini" @click="selectPositionShow('inside')">室内选点</el-button>
            </div>
            <el-input v-model="dataForm.position" size="mini" style="line-height:26px;" placeholder="选择摄像头坐标" :readonly="true" slot="reference">
              <el-button type="warning" slot="append" size="mini">选取</el-button>
            </el-input>
          </el-popover>
        </template>
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input size="mini" v-model="dataForm.remarks" placeholder="备注" maxlength="60" clearable></el-input>
      </el-form-item>
    </el-form>

    <div class="map-bottom-btn">
      <el-button type="warning" size="mini" @click="saveFence">保存</el-button>
      <!--<el-button type="primary" size="mini" v-if="dataForm.id!==''" @click="createOrUpdate">重新绘制</el-button>-->
      <el-button type="info" size="mini" @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import { queryZoneInfo } from '@/api/pos/region'
import { reactorAdd } from '@/api/sou/equlpment'
let typeList = []
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
        code: '',  // 装置编号
        name: '',        // 装置名称
        positionX: '',
        positionY: '',
        positionZ: '',
        position: '',
        // technology: '',
        // chemical: '',
        zoneId: '', // 区域id
        zoneName: '', // 区域名称
        remarks: '',
        builId: ''
      },
      tankFieldId: [], // 罐区
      shapeList: [], // 装置形状
      layoutList: [], // 装置形式
      dataRule: {
        name: [
          { required: true, message: '装置名称不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '装置编号不能为空', trigger: 'blur' }
        ],
        // technology: [
        //   { required: true, message: '高危工艺不能为空', trigger: 'blur' }
        // ],
        // chemical: [
        //   { required: true, message: '涉及化学品不能为空', trigger: 'blur' }
        // ],
        zoneName: [
          { required: true, message: '关联区域不能为空', trigger: 'change' }
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
          code: info.code || '',  // 装置编号
          name: info.name || '',        // 装置名称
          positionX: info.positionX || 0,
          positionY: info.positionY || 0,
          positionZ: info.positionZ || 0,
          zoneId: info.zoneId || '', // 区域id
          zoneName: info.zoneName || '', // 区域名称
          builId: info.builId || ''
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
        if (type === 'out') {
          this.$emit('handleClick', 'create-out', this.dataForm)
        } else if (type === 'inside') {
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
      reactorAdd(this.dataForm).then(res => {
        if (res.data && res.data.code === 0) {
          this.$message.success('操作成功')
          this.$emit('handleClick', 'clear-select')
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
.tank-el-popover {
  .el-tree-node__label {
    font-size: 12px;
  }
}
</style>
