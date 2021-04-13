<!--
 * @Descripttion: 
 * @version: 
 * @Author: Mr.What
 * @Date: 2019-11-10 19:17:45
 * @LastEditors: Mr.What
 * @LastEditTime: 2019-11-11 22:44:39
 -->
<template>
  <div class='map-config-list-container'>
    <div class="list-item">
      <el-form ref="form" :model="formData" :rules="rules">
        <el-form-item label="相机初始参数:" class="camera-position" prop="cameraX">
          <span>(位置)x</span>
          <el-input v-model="formData.cameraX" disabled size="mini"></el-input>
          <span>y</span>
          <el-input v-model="formData.cameraY" disabled size="mini" ref="cameraY"></el-input>
          <span>z</span>
          <el-input v-model="formData.cameraZ" disabled size="mini" ref="cameraZ"></el-input>
          <br />
          <span style="margin-left:83px;">(朝向)x</span>
          <el-input v-model="formData.targetX" disabled size="mini"></el-input>
          <span>y</span>
          <el-input v-model="formData.targetY" disabled size="mini" ref="cameraY"></el-input>
          <span>z</span>
          <el-input v-model="formData.targetZ" disabled size="mini" ref="cameraZ"></el-input>
          <el-popover placement="right" trigger="manual" content="请拖动地图选取最佳视角并标记" v-model="cameraChangeStatus" style="position:absolute;right:0px;top:30%;">
            <el-button size="mini" slot="reference" @click="signCamera">{{cameraChangeStatus?'标记':'修改'}}</el-button>
          </el-popover>
        </el-form-item>
      </el-form>
    </div>
    <el-button @click="saveData" type="primary">保存修改</el-button>
  </div>
</template>

<script>
import { getMapConfig, saveMapConfig } from '@/api/sys/config'
export default {
  components: {},
  data () {
    return {
      formData: {
        cameraX: 0,
        cameraY: 0,
        cameraZ: 0,
        targetX: 0,
        targetY: 0,
        targetZ: 0
      },
      rules: {
        cameraX: [{
          trigger: 'change',
          validator: (rule, value, callback) => {
            if (this.formData.cameraX <= 0 || this.formData.cameraY <= 0 || this.formData.cameraZ <= 0) {
              callback(new Error('请标记相机位置'))
            } else {
              callback()
            }
          }
        }]
      },
      cameraChangeStatus: false // 相机位置修改状态
    }
  },
  created () {
    this.initData()
  },
  mounted () {
  },
  computed: {},
  watch: {},
  methods: {
    initData () {
      getMapConfig({
        key: 'cameraPositionThreeJs',
        params: {}
      }).then(res => {
        if (res.data && res.data.code === 0) {
          let resultArr = JSON.parse(JSON.parse(res.data.page.list[0].value)[0].value.replace(/\\/g, ''))
          if (resultArr) {
            this.formData.cameraX = resultArr.cameraPosition.x
            this.formData.cameraY = resultArr.cameraPosition.z
            this.formData.cameraZ = resultArr.cameraPosition.y
            this.formData.targetX = resultArr.cameraTarget.x
            this.formData.targetY = resultArr.cameraTarget.z
            this.formData.targetZ = resultArr.cameraTarget.y
            localStorage.setItem('cameraPosition', JSON.stringify(resultArr.cameraPosition))
            localStorage.setItem('cameraTarget', JSON.stringify(resultArr.cameraTarget))
          }
        }
      })
    },
    saveData () {
      this.$refs.form.validate((valid) => {
        saveMapConfig({
          'createBy': {
            'createBy': {
              'createBy': {},
              'createDate': '',
              'email': '',
              'id': '',
              'isNewRecord': true,
              'mobile': '',
              'page': {
                'count': 0,
                'firstResult': 0,
                'list': [
                  {}
                ],
                'maxResults': 0,
                'pageNo': 0,
                'pageSize': 0
              },
              'password': '',
              'realName': '',
              'remarks': '',
              'roleIdList': [],
              'status': 0,
              'token': '',
              'updateBy': {},
              'updateDate': '',
              'username': ''
            },
            'createDate': '',
            'email': '',
            'id': '',
            'isNewRecord': true,
            'mobile': '',
            'page': {
              'count': 0,
              'firstResult': 0,
              'list': [
                {}
              ],
              'maxResults': 0,
              'pageNo': 0,
              'pageSize': 0
            },
            'password': '',
            'realName': '',
            'remarks': '',
            'roleIdList': [],
            'status': 0,
            'token': '',
            'updateBy': {},
            'updateDate': '',
            'username': ''
          },
          'createDate': '',
          'id': '',
          'isNewRecord': true,
          'key': 'cameraPositionThreeJs',
          'param': [
            {
              'value': JSON.stringify({
                'cameraPosition': { 'x': this.formData.cameraX, 'y': this.formData.cameraZ, 'z': this.formData.cameraY },
                'cameraTarget': { 'x': this.formData.targetX, 'y': this.formData.targetZ, 'z': this.formData.targetY }
              })
            }
          ],
          'remarks': '',
          'token': '',
          'updateBy': {
            'createBy': {
              'createBy': {},
              'createDate': '',
              'email': '',
              'id': '',
              'isNewRecord': true,
              'mobile': '',
              'page': {
                'count': 0,
                'firstResult': 0,
                'list': [
                  {}
                ],
                'maxResults': 0,
                'pageNo': 0,
                'pageSize': 0
              },
              'password': '',
              'realName': '',
              'remarks': '',
              'roleIdList': [],
              'status': 0,
              'token': '',
              'updateBy': {},
              'updateDate': '',
              'username': ''
            },
            'createDate': '',
            'email': '',
            'id': '',
            'isNewRecord': true,
            'mobile': '',
            'page': {
              'count': 0,
              'firstResult': 0,
              'list': [
                {}
              ],
              'maxResults': 0,
              'pageNo': 0,
              'pageSize': 0
            },
            'password': '',
            'realName': '',
            'remarks': '',
            'roleIdList': [],
            'status': 0,
            'token': '',
            'updateBy': {},
            'updateDate': '',
            'username': ''
          },
          'updateDate': '',
          'value': ''
        }
        ).then(res => {
          if (res.data && res.data.code === 0) {
            this.$message.success('操作成功')
          } else {
            this.$message.error(res.data.msg)
          }
        })
      })
    },
    signCamera () {
      this.cameraChangeStatus = !this.cameraChangeStatus
      if (!this.cameraChangeStatus) {
        let result = this.$parent.$parent.$parent.$refs.threeMap.signCamera()
        this.formData.cameraX = result[0].x
        this.formData.cameraY = result[0].z
        this.formData.cameraZ = result[0].y
        this.formData.targetX = result[1].x
        this.formData.targetY = result[1].z
        this.formData.targetZ = 0
        this.cameraChangeStatus = false
      }
    }
  }
}
</script>

<style lang='scss'>
.map-config-list-container {
  .camera-position {
    .el-input {
      width: 37px;
      .el-input__inner {
        padding: 0 2px;
      }
    }
    .el-button {
      &.el-button--mini {
        padding: 5px 2px;
      }
    }
  }
}
</style>
