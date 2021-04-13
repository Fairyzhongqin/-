<template>
  <div class="map-camera-edit-container">
    <el-scrollbar style="width:100%;height:100%;">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" class="pr20" label-width="100px">
        <el-form-item label="摄像头类型" prop="type">
          <el-select v-model="dataForm.type" size="mini" placeholder="摄像头类型">
            <el-option label="海康威视" value="0"></el-option>
            <el-option label="大华" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="摄像头编号" prop="code">
          <el-input v-model="dataForm.code" size="mini" placeholder="摄像头编号" maxlength="20" clearable></el-input>
        </el-form-item>
        <el-form-item label="摄像头名称" prop="name">
          <el-input v-model="dataForm.name" size="mini" placeholder="摄像头名称" maxlength="20" clearable></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="dataForm.username" size="mini" placeholder="用户名" maxlength="20" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="dataForm.password" size="mini" placeholder="密码" type="password" maxlength="20" auto-complete="new-password" clearable></el-input>
        </el-form-item>
        <el-form-item label="摄像头IP" prop="ip">
          <el-input v-model="dataForm.ip" size="mini" placeholder="摄像头IP" maxlength="20" clearable></el-input>
        </el-form-item>
        <el-form-item label="摄像头端口" prop="port">
          <el-input v-model="dataForm.port" size="mini" placeholder="摄像头端口" maxlength="20" clearable></el-input>
        </el-form-item>
        <el-form-item label="楼层" prop="floor">
          <el-input v-model="dataForm.floor" size="mini" placeholder="楼层" maxlength="20" type="number" min='0'></el-input>
        </el-form-item>
        <!-- <el-form-item label="rtsp实时播放" prop="rtspUrl01">
          <el-input v-model="dataForm.rtspUrl01" size="mini" placeholder="rtsp实时播放" maxlength="20" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="rtsp历史播放" prop="rtspUrl01">
          <el-input v-model="dataForm.rtspUrl02" size="mini" placeholder="rtsp历史播放" maxlength="20" autocomplete="off" clearable></el-input>
        </el-form-item> -->
        <el-form-item label="摄像头坐标" class="personArray" prop="x">
          <template>
            <el-popover placement="top" width="200">
              <div>
                <el-button size="mini" type="primary" @click="selectPositionShow('out')">室外摄像头</el-button>
                <el-button type="primary" size="mini" @click="selectPositionShow('inside')">室内摄像头</el-button>
              </div>
              <el-input v-model="dataForm.position" size="mini" style="line-height:26px;" placeholder="选择摄像头坐标" :readonly="true" slot="reference">
                <el-button type="warning" slot="append" size="mini">选取</el-button>
              </el-input>
            </el-popover>
          </template>
        </el-form-item>
        <el-form-item label="监控区域" prop="zoneName">
          <el-popover placement="bottom" width="240" v-model="tankFieldPopover" popper-class="tank-el-popover high" trigger="click">
            <el-tree default-expand-all :data="tankFieldId" @node-click="changeZone" :props="defaultProps"></el-tree>
            <el-input :readonly="true" v-model="dataForm.zoneName" size="mini" slot="reference" placeholder="请先选择区域"></el-input>
          </el-popover>
        </el-form-item>
      </el-form>
    </el-scrollbar>
    <div class="map-bottom-btn">
      <el-button type="warning" size="mini" @click="dataFormSubmit">保存</el-button>
      <!--<el-button type="primary" size="mini" v-if="dataForm.id!==''" @click="createOrUpdate">重新绘制</el-button>-->
      <el-button type="info" size="mini" @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import { cameraAddOrUpdate } from '@/api/sou/cameraManagement'
import { queryZoneInfo } from '@/api/pos/region'
let typeList = []
export default {
  props: {
    resData: {
      type: [Object, Array]
    }
  },
  data () {
    return {
      dataForm: {
        code: '',
        name: '',
        floor: '',
        password: '',
        username: '',
        zoneIdList: [],
        zoneName: '',
        type: '0',
        x: '',
        y: '',
        z: '',
        ip: '',
        port: '554'
      },
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
      tankFieldId: [], // 区域list
      dataRule: {
        code: [{ required: true, message: '请输入摄像头编号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入摄像头名称', trigger: 'blur' }],
        username: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
        password: [{ required: true, message: '请输入用户密码', trigger: 'blur' }],
        x: [{ required: true, message: '请选择摄像头坐标', trigger: 'blur' }],
        type: [{ required: true, message: '请选择摄像头类型', trigger: 'change' }],
        ip: [{ required: true, message: '请输入摄像头ip地址', trigger: 'blur' }],
        port: [{ required: true, message: '请输入摄像头端口号', trigger: 'blur' }],
        floor: [{ required: true, message: '请输入楼层', trigger: 'blur' }]
        // zoneName: [{ required: true, message: '监控区域不能为空', trigger: 'change' }]
      }
    }
  },
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
    // 选择所属区域
    changeZone (val) {
      this.dataForm.zoneId = val.id
      this.dataForm.zoneName = val.zoneName
      this.tankFieldPopover = false
      this.$emit('handleClick', 'view-fance', val.fencingList)
    },
    // 选择卡口坐标
    selectPositionShow (type) {
      this.$emit('handleClick', 'create-' + type, this.dataForm)
    },
    init (info) {
      if (info) {
        this.dataForm = info
        this.dataForm.id = info.id || 0
        this.dataForm.type = '0'
        this.dataForm.port = '554'
        this.dataForm.username = 'admin'
        this.dataForm.password = 'admin12345'
        this.dataForm.floor = info.floor || Number(info.parmas ? info.parmas.floor : '1')
        if (info.parmas && !info.parmas.minH) {
          this.$message.info('当前地图楼层高度未测量，将按默认楼层高度（3.5m）计算')
          info.parmas.minH = (this.dataForm.floor - 1) * 3.5
        }
        this.dataForm.z = info.parmas ? info.parmas.minH : '0'
      }
      this.getDictList() // 获取字典数据列表，系统选项
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
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.visible = false
          cameraAddOrUpdate(this.dataForm).then(({ data }) => {
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
.map-camera-edit-container {
  .el-scrollbar {
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }
}
</style>
